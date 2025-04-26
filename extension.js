// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const { exec } = require('child_process');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

// 插件配置项
const config = vscode.workspace.getConfiguration('autoSyncUploader');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "heyi-tool" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('heyi-tool.autosync', function () {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Enable AutoSync Success!');
	});
	context.subscriptions.push(disposable);

	let disposableOnSave = vscode.workspace.onDidSaveTextDocument(async (document) => {
        if (!config.enabled) {
            return;
        }

        const localPath = config.localPath ;

        // 获取配置
        const remoteHost = config.remoteHost ;
        const remotePath = config.remotePath ;
		const port = config.port || 22;
        const excludePatterns = Array.isArray(config.exclude) ? config.exclude : []; // 确保是数组
		const identityFile = config.identityFile || '~/.ssh/id_rsa';
		const enableDelete = config.enableDelete || false; // 新增配置项

        try {
            // 显示上传状态通知
            const statusMsg = vscode.window.setStatusBarMessage(`Sync: 开始上传 ${localPath}...`);
            // 执行rsync命令
			const rsyncCommand = [
                'rsync',
                '-avz',  // -a: 归档模式, -v: 详细输出, -z: 压缩传输
                `-e "ssh -i ${identityFile} -p ${port}"`,  // 指定SSH连接方式
				...(enableDelete ? ['--delete'] : []), // 条件添加--delete
				...(excludePatterns.length > 0
					? excludePatterns.map(p => `--exclude='${p}'`)
					: []), // 条件添加排除项
                `"${localPath}"`,  // 源文件
                `${remoteHost}:${remotePath}`  // 目标位置
            ].join(' ');

            console.log(`执行命令: ${rsyncCommand}`);

            exec(rsyncCommand, (error, stdout, stderr) => {
                statusMsg.dispose(); // 清除状态消息

                if (error) {
                    console.error('上传失败:', error);
                    vscode.window.showErrorMessage(`Sync Failed: 上传 ${localPath} → ${remoteHost}:${remotePath} [${error.message}]`);
                    return;
                }

                if (stderr) {
                    console.warn('上传警告:', stderr);
                }

                console.log('上传成功:', stdout);
                vscode.window.setStatusBarMessage(`✔ Sync OK: ${localPath} → ${remoteHost}:${remotePath}`, 5000);
            });

			// vscode.window.showInformationMessage(`Sync [${localPath} -> ${remoteHost}:${remotePath}] ok!`);

        } catch (error) {
			vscode.window.showErrorMessage(`Sync Failed: 上传 ${localPath} → ${remoteHost}:${remotePath} [${error.message}]`);
        }
    });
    context.subscriptions.push(disposableOnSave);


	let toggleCommand = vscode.commands.registerCommand('autoSyncUploader.toggle', function () {
        const newState = !config.enabled;
        config.update('enabled', newState, vscode.ConfigurationTarget.Global)
            .then(() => {
                const message = `自动SCP上传 ${newState ? '已启用' : '已禁用'}`;
                vscode.window.showInformationMessage(message);
                console.log(message);
            });
    });
	context.subscriptions.push(toggleCommand);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
