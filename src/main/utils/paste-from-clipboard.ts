// Electron App (JavaScript - Production-Ready)
import { exec } from 'child_process'
import pasteScript from '../../../resources/paste.ps1?asset&asarUnpack'

export function pasteFromClipboard(): void {
  exec(`powershell.exe -ExecutionPolicy Bypass -File "${pasteScript}"`, (error) => {
    if (error) {
      console.error('PowerShell Error:', error)
      // console.log(`Error pasting: ${error.message}`) // More informative error message
      return
    }

    // console.log('PowerShell Output:', stdout) // Keep for detailed debugging

    // Process output and provide user feedback (more robust)
    // if (stdout.includes('[Error]')) {
    //   // Check for errors logged by PowerShell
    //   const errorMessage = stdout.match(/\[Error\] (.*)/)?.[1] || 'An error occurred.'
    //   console.log(errorMessage)
    // }
    // else if (stdout.includes('Clipboard is empty')) {
    //   console.log('Nothing to paste. Clipboard is empty.')
    // } else if (stdout.includes('Pasted Text')) {
    //   console.log('Text pasted successfully!') // Or handle the text in your app
    // } else if (stdout.includes('Pasted Files')) {
    //   console.log('Files pasted successfully!') // Or handle the files in your app
    // } else if (stdout.includes('Pasted Image')) {
    //   console.log('Image pasted successfully!') // Or handle the image in your app
    // } else if (stdout.includes('Clipboard format not supported')) {
    //   console.log('Clipboard content type is not supported')
    // } else {
    //   console.log('Paste operation completed.') // Generic success message
    // }
  })
}
