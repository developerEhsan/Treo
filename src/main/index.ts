import { db, runMigrate } from './drizzle/db'
import { app, ipcMain, globalShortcut, Tray, Menu, clipboard } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { clipboardSchema } from './drizzle/schema'
import { desc, eq } from 'drizzle-orm'
import { copyFileSync, existsSync, mkdirSync, writeFileSync } from 'fs'
import { basename, join } from 'path'
import { createWindow } from './utils/create-window'
import { icon } from './utils/resources'
import { SearchClipboardParams } from 'src/types/database'
import {
  createNote,
  deleteNote,
  getAllNotes,
  getNoteById,
  toggleFavoriteNote,
  updateNote
} from './utils/notes-operations'
import {
  clearClipboard,
  deleteClipboardEntry,
  searchClipboard,
  togglePinnedClipboardEntry
} from './utils/clipboard-operations'
import { simulatePasteCommand } from './utils/simulate-paste-command'

runMigrate()

let copyWidgetWindow: Electron.BrowserWindow
let mainWindow: Electron.BrowserWindow

app.whenReady().then(() => {
  const mainWindowConfigs = {
    windowOptions: {
      show: false,
      width: 1200,
      height: 800,
      webPreferences: {
        webSecurity: import.meta.env.DEV ? false : true
      }
    },
    loadUrl: import.meta.env.DEV ? process.env['ELECTRON_RENDERER_URL'] : undefined,
    loadFile: import.meta.env.PROD ? '../renderer/index.html' : undefined
  }

  // Set app user model ID and auto-launch
  electronApp.setAppUserModelId('com.electron')
  electronApp.setAutoLaunch(import.meta.env.PROD)

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // Create main window
  mainWindow = createWindow(mainWindowConfigs)

  // Create copy widget window
  copyWidgetWindow = createWindow({
    windowOptions: {
      transparent: true,
      fullscreen: true,
      kiosk: true,
      skipTaskbar: true,
      resizable: false,
      hasShadow: false,
      closable: false,
      movable: false,
      titleBarStyle: 'hidden',
      show: false,
      alwaysOnTop: import.meta.env.PROD
    },
    loadUrl: import.meta.env.DEV
      ? `${process.env['ELECTRON_RENDERER_URL']}/copy-widget.html`
      : undefined,
    loadFile: import.meta.env.PROD ? '../renderer/copy-widget.html' : undefined
  })

  // Tray
  const tray = new Tray(icon)
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Exit', type: 'normal', click: () => app.quit() },
    { label: 'Open', type: 'normal', click: () => mainWindow.show() }
  ])
  tray.setContextMenu(contextMenu)
  tray.setToolTip('Treo running in background')
  tray.setTitle('Treo clipboard')

  // Global Shortcut
  globalShortcut.register('CommandOrControl+E', () => {
    console.log('Copy Widget')
    copyWidgetWindow.maximize()
    copyWidgetWindow.show()
  })

  // ✅ IPC Handlers with error handling
  ipcMain.handle('save-text', async (_event, text) => {
    try {
      await db.insert(clipboardSchema).values({ type: 'text', content: text })
      return { success: true }
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown Error Occured while saving Text'
      console.error('Error saving text:', e)
      return { success: false, error: msg }
    }
  })

  ipcMain.handle('fetch-texts', async () => {
    try {
      return await db
        .select()
        .from(clipboardSchema)
        .orderBy(desc(clipboardSchema.createdAt))
        .where(eq(clipboardSchema.type, 'text'))
    } catch (e) {
      console.error('Error fetching texts:', e)
      return []
    }
  })

  ipcMain.handle('close-window', () => {
    copyWidgetWindow.minimize()
    copyWidgetWindow.hide()
  })

  ipcMain.handle('save-file', async (_event, filePath) => {
    try {
      const userDataPath = app.getPath('userData')
      const fileName = basename(filePath)
      const newFilePath = join(userDataPath, 'assets', fileName)

      if (!existsSync(join(userDataPath, 'assets'))) {
        mkdirSync(join(userDataPath, 'assets'), { recursive: true })
      }

      copyFileSync(filePath, newFilePath)
      await db.insert(clipboardSchema).values({ type: 'file', content: newFilePath })

      return { success: true, path: newFilePath }
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown Error Occured while saving File'
      console.error('Error saving file:', e)
      return { success: false, error: msg }
    }
  })

  ipcMain.handle(
    'handle-selected-file',
    async (_event, fileData: { name: string; buffer: ArrayBuffer }) => {
      try {
        const buffer = Buffer.from(fileData.buffer)
        const userData = app.getPath('userData')
        const targetPath = join(userData, fileData.name) // (will sanitize later)
        writeFileSync(targetPath, buffer)
        return targetPath
      } catch (e) {
        console.error('Error handling selected file:', e)
        return ''
      }
    }
  )

  ipcMain.handle('search', async (_e, params: SearchClipboardParams) => {
    try {
      return await searchClipboard(params)
    } catch (e) {
      console.error('Error searching clipboard:', e)
      return []
    }
  })

  ipcMain.handle('paste', () => {
    copyWidgetWindow.minimize()
    copyWidgetWindow.hide()
    // pasteFromClipboard()
    simulatePasteCommand()
    return true
  })

  ipcMain.handle('create-note', (_, values) => createNote(values))
  ipcMain.handle('update-note', (_, values) => updateNote(values))
  ipcMain.handle('delete-note', (_, id) => deleteNote(id))
  ipcMain.handle('get-note', (_, id) => getNoteById(id))
  ipcMain.handle('get-all-notes', getAllNotes)
  ipcMain.handle('toggle-favorite-note', (_, values) => toggleFavoriteNote(values))
  ipcMain.handle('toggle-pinned-clipboard-entry', (_, values) => togglePinnedClipboardEntry(values))
  ipcMain.handle('delete-clipboard-entry', (_, values) => deleteClipboardEntry(values))
  ipcMain.handle('clear-clipboard', clearClipboard)

  // Clipboard monitoring (clipboard polling logic will be refactored later)
  let previousContent = clipboard.readText()
  async function checkClipboard(): Promise<void> {
    const currentContent = clipboard.readText()
    if (currentContent !== previousContent) {
      try {
        await db.insert(clipboardSchema).values({ type: 'text', content: currentContent })
        previousContent = currentContent
        copyWidgetWindow.webContents.send('refresh-data')
      } catch (e) {
        console.error('Error inserting clipboard content:', e)
      }
    }
  }

  setInterval(checkClipboard, 1000)

  // Show main window in development
  if (import.meta.env.DEV) {
    mainWindow.on('ready-to-show', () => mainWindow.show())
  }

  // ✅ macOS activate handler
  app.on('activate', () => {
    if (mainWindow === null) {
      mainWindow = createWindow(mainWindowConfigs)
    } else {
      mainWindow.show()
    }
  })
})

// ✅ window-all-closed for non-macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// ✅ Cleanup global shortcuts
app.on('will-quit', () => {
  globalShortcut.unregisterAll()
})
