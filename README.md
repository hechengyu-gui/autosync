# Auto SCP Uploader - VSCode Extension

## Features

- 🚀 **Automatic file synchronization** on save using rsync
- ⚙️ **Configurable remote host** with customizable paths
- 🔔 **Visual notifications** with detailed status updates
- 🔌 **SSH integration** with rsync for secure transfers
- 🎚️ **Toggle functionality** for enabling/disabling auto-sync

## Requirements

- Visual Studio Code 1.75.0 or higher
- SSH access to target remote server
- Rsync installed on both local and remote systems
- Copy the local user's SSH public key (default: `~/.ssh/id_rsa.pub`) to the remote host (`192.168.1.10`) under the `root` account to enable password-less SSH login.
```bash
#1. Generate an SSH key (if not already generated)
ssh-keygen -t rsa -b 4096
#2. Copy the public key to the remote host (enter the root password when prompted)
ssh-copy-id root@192.168.1.10
#3. Test password-less login
ssh root@192.168.1.10  # No password required no
```
## Commands
The extension provides these VSCode commands:
1. `autosync`
   - **Activation command**: Enables the auto-sync feature
   - Once activated, changed files will be automatically synchronized to the configured remote server when saved
2. `autosync.toggle`
   - **Toggle command**: Switches the active state of auto-syncing
   - Allows temporarily disabling sync without changing the configuration
   - Running when active will pause synchronization

## Extension Settings

Available configurations (accessible via `settings.json`):

| Setting | Description | Default |
|---------|-------------|---------|
| `autoSyncUploader.enabled` | Enable/disable auto-sync | `true` |
| `autoSyncUploader.localPath` | Local directory to watch | `""` |
| `autoSyncUploader.excludePatterns` | Path to exclude | `[]` |
| `autoSyncUploader.remoteHost` | Remote server (user@host) | `""` |
| `autoSyncUploader.remotePath` | Remote directory path | `""` |
| `autoSyncUploader.rsyncFlags` | Custom rsync flags | `"-avz"` |
| `autoSyncUploader.identityFile` | SSH key's path | `"~/.ssh/id_rsa"` |
| `autoSyncUploader.enableDelete` | If `true`, removes files on remote that no longer exist locally (`--delete`) | `false`       |
| `autoSyncUploader.port` | port | `"22"` |

## Known Issues

1. **Symbolic links** may not transfer correctly in all cases
2. **Large files** (>500MB) might timeout on slow connections
3. **Permission issues** when syncing system files
4. **Network interruptions** may cause partial transfers
5. **Windows paths** with spaces require manual escaping

Workarounds available in our [Troubleshooting Guide](#known-issues).

## Release Notes

### 1.0.0

Initial release with core functionality:

- Basic rsync file synchronization
- Configurable remote host settings
- Toggle command for enabling/disabling
- Status bar notifications
- Error handling and logging

## Working with Markdown

This extension recognizes Markdown files. When working with `.md` files:

1. **Live preview** available via VS Code's built-in viewer
2. **Syntax highlighting** for all markdown elements
3. **Table formatting** support for documentation
4. **Emoji shortcodes** rendered in preview

Example markdown table:

```markdown
| Feature | Status |
|---------|--------|
| Sync on Save | ✅ Working |
| Large Files | ⚠️ Limited |
| Permission Handling | 🛠️ In Progress |
