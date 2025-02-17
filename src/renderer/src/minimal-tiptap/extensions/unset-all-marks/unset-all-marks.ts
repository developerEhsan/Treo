import { Extension } from '@tiptap/react'

export const UnsetAllMarks = Extension.create({
  addKeyboardShortcuts(): {
    'Mod-\\': () => boolean
  } {
    return {
      'Mod-\\': () => this.editor.commands.unsetAllMarks()
    }
  }
})
