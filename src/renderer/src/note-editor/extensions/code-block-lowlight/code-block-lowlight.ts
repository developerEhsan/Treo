import { CodeBlockLowlight as TiptapCodeBlockLowlight } from '@tiptap/extension-code-block-lowlight'
import { common, createLowlight } from 'lowlight'

export const CodeBlockLowlight = TiptapCodeBlockLowlight.extend({
  addAttributes: () => ({ 'spell-check': false }),
  addOptions() {
    return {
      ...this.parent?.(),
      lowlight: createLowlight(common),
      HTMLAttributes: {
        class: 'block-node',
        'spell-check': false
      }
    }
  }
})

export default CodeBlockLowlight
