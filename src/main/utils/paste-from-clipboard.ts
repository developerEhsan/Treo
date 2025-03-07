import { exec } from 'child_process'
import pasteScript from '../../../resources/paste.ps1?asset&asarUnpack'

export function pasteFromClipboard(): void {
  exec(`powershell.exe -ExecutionPolicy Bypass -File "${pasteScript}"`, (error) => {
    if (error) {
      console.error('PowerShell Error:', error)
      return
    }
  })
}
