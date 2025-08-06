import { spawn } from 'child_process'

/**
 * Simulates the 'Ctrl+V' (paste) keypress across different operating systems.
 * Requires `xdotool` on Linux, `osascript` on macOS, or PowerShell on Windows.
 */
export function simulatePasteCommand(): void {
  const platform = process.platform

  const commands: Record<string, { shell: string; args: string[] }> = {
    win32: {
      shell: 'powershell.exe',
      args: [
        '-ExecutionPolicy',
        'Bypass',
        '-Command',
        `Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.SendKeys]::SendWait('^v')`
      ]
    },
    darwin: {
      shell: 'osascript',
      args: ['-e', `tell application "System Events" to keystroke "v" using command down`]
    },
    linux: {
      shell: 'xdotool',
      args: ['key', 'ctrl+v']
    }
  }

  const config = commands[platform]
  if (!config) {
    console.error('Unsupported OS:', platform)
    return
  }

  const proc = spawn(config.shell, config.args)

  proc.on('error', (err) => {
    console.error('Paste simulation failed:', err.message)
  })

  proc.stderr.on('data', (data) => {
    console.error('stderr:', data.toString())
  })

  proc.on('exit', (code) => {
    if (code !== 0) {
      console.warn(`Paste command exited with code ${code}`)
    }
  })
}
