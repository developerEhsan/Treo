import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { ClipboardDataType, SearchClipboardParams } from 'src/types/database'

// Custom APIs for renderer
const api = {
  saveText: (text: string): Promise<void> => ipcRenderer.invoke('save-text', text),
  fetchTexts: (): Promise<ClipboardDataType> => ipcRenderer.invoke('fetch-texts'),
  saveFile: (filePath: string): Promise<void> => ipcRenderer.invoke('save-file', filePath),
  closeWindow: (): Promise<void> => ipcRenderer.invoke('close-window'),
  pasteCopied: (): Promise<void> => ipcRenderer.invoke('paste'),
  handleWindow: (e?: boolean): Promise<boolean> => ipcRenderer.invoke('handle-window', e),
  search: (searchValues: SearchClipboardParams): Promise<unknown[]> =>
    ipcRenderer.invoke('search', searchValues)
}
// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
