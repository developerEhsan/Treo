import { db, runMigrate } from './drizzle/db'
import { app, ipcMain, globalShortcut, Tray, Menu, clipboard } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { clipboardSchema } from './drizzle/schema'
import { desc, eq } from 'drizzle-orm'
import { copyFileSync, existsSync, mkdirSync } from 'fs'
import { basename, join } from 'path'
import { createWindow } from './utils/create-window'
import { icon } from './utils/resources'
import { SearchClipboardParams } from 'src/types/database'
import { pasteFromClipboard } from './utils/paste-from-clipboard'
import {
  createNote,
  deleteNote,
  getAllNotes,
  getNoteById,
  toggleFavoriteNote,
  updateNote
} from './utils/notes-operations'
import {
  deleteClipboardEntry,
  searchClipboard,
  togglePinnedClipboardEntry
} from './utils/clipboard-operations'

runMigrate()

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')
  electronApp.setAutoLaunch(import.meta.env.PROD)
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })
  const mainWindow = createWindow({
    windowOptions: {
      show: false,
      width: 1200,
      height: 800
    },
    loadUrl: process.env['ELECTRON_RENDERER_URL'],
    loadFile: '../renderer/index.html'
  })
  const copyWidgetWindow = createWindow({
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
    loadUrl: `${process.env['ELECTRON_RENDERER_URL']}/copy-widget.html`,
    loadFile: '../renderer/copy-widget.html'
  })

  const tray = new Tray(icon)
  // IPC test
  const contextMenu = Menu.buildFromTemplate([
    { label: 'exit', type: 'normal', click: (): void => app.exit() },
    { label: 'open', type: 'normal', click: (): void => mainWindow.show() }
  ])

  tray.setContextMenu(contextMenu)
  tray.setToolTip('Application running in background')
  tray.setTitle('This is my title')

  // Register a 'CommandOrControl+X' shortcut listener.
  globalShortcut.register('CommandOrControl+E', () => {
    // if (!copyWidgetWindow.isVisible()) {
    copyWidgetWindow.maximize()
    copyWidgetWindow.show()
    // }
  })

  // 🔹 Handle IPC Calls
  ipcMain.handle('save-text', async (_event, text) => {
    await db.insert(clipboardSchema).values({ type: 'text', content: text })
    console.log('Text saved')
    return { success: true }
  })

  ipcMain.handle('fetch-texts', async () => {
    return await db
      .select()
      .from(clipboardSchema)
      .orderBy(desc(clipboardSchema.createdAt))
      .where(eq(clipboardSchema.type, 'text'))
  })

  ipcMain.handle('close-window', () => {
    copyWidgetWindow.minimize()
    copyWidgetWindow.close()
    // copyWidgetWindow.hide()
  })
  // TODO - make this workable. Right Now it is not being used
  ipcMain.handle('save-file', async (_event, filePath) => {
    const userDataPath = app.getPath('userData')
    const fileName = basename(filePath)
    const newFilePath = join(userDataPath, 'assets', fileName)

    // Ensure assets directory exists
    if (!existsSync(join(userDataPath, 'assets'))) {
      mkdirSync(join(userDataPath, 'assets'), { recursive: true })
    }

    copyFileSync(filePath, newFilePath)
    await db.insert(clipboardSchema).values({ type: 'file', content: newFilePath })

    return { success: true, path: newFilePath }
  })
  ipcMain.handle('search', async (_e, params: SearchClipboardParams) => {
    return await searchClipboard(params)
  })
  ipcMain.handle('handle-window', async () => {
    return true
  })
  ipcMain.handle('paste', () => {
    copyWidgetWindow.minimize()
    copyWidgetWindow.hide()
    pasteFromClipboard()
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

  let previousContent = clipboard.readText()
  async function checkClipboard(): Promise<void> {
    const currentContent = clipboard.readText()
    if (currentContent !== previousContent) {
      console.log('Clipboard content has changed')
      await db.insert(clipboardSchema).values({ type: 'text', content: currentContent })
      previousContent = currentContent
      copyWidgetWindow.webContents.send('refresh-data')
    }
  }

  // Check the clipboard every second
  setInterval(checkClipboard, 1000)
  if (import.meta.env.DEV) mainWindow.on('ready-to-show', () => mainWindow.show())

  // TODO --- This Logic needs to done
  // app.on('activate', function () {
  //   // On macOS it's common to re-create a window in the app when the
  //   // dock icon is clicked and there are no other windows open.
  //   if (BrowserWindow.getAllWindows().length === 0) createWindow()
  // })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
// app.on('window-all-closed', () => {
//   if (process.platform !== 'darwin') {
//     copyWidgetWindow.hide()
//   }
// })

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
