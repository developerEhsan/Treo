import { exec } from 'child_process'

/**
 * @deprecated This Method is now deprecated cuz it is only workable for the windows
 * @todo Remove that method after make sure, that is not used anywhere else
 */
export function pasteFromClipboard(): void {
  exec(
    `powershell.exe -ExecutionPolicy Bypass -File "Add-Type -AssemblyName System.Windows.Forms
[System.Windows.Forms.SendKeys]::SendWait("^v")
exit"`,
    (error) => {
      if (error) {
        console.error('PowerShell Error:', error)
        return
      }
    }
  )
}
