import { BrowserWindow, BrowserWindowConstructorOptions, shell } from 'electron'
import { join } from 'path'
import { icon } from './resources'
import { is } from '@electron-toolkit/utils'

interface CreateWindowInterface {
  windowOptions: BrowserWindowConstructorOptions
  loadUrl: string
  loadFile: string
}
export function createWindow({
  windowOptions,
  loadUrl = `${process.env['ELECTRON_RENDERER_URL']}`,
  loadFile = '../renderer/index.html'
}: Partial<CreateWindowInterface>): BrowserWindow {
  // Create the browser appWindow.
  const appWindow = new BrowserWindow({
    ...{
      autoHideMenuBar: true,
      icon,
      webPreferences: {
        preload: join(__dirname, '../preload/index.mjs'),
        sandbox: false
      }
    },
    ...windowOptions
  })

  appWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    appWindow.loadURL(loadUrl)
  } else {
    appWindow.loadFile(join(__dirname, loadFile))
  }
  return appWindow
}
