import React, { useMemo } from 'react'
import { NodeViewWrapper, NodeViewProps, NodeViewContent } from '@tiptap/react'

export const DBlockNodeView: React.FC<NodeViewProps> = ({ node, getPos, editor }) => {
  const isTable = useMemo(() => {
    const { content } = node.content

    return content[0].type.name === 'table'
  }, [node.content])

  const createNodeAfter = (): void => {
    const pos = getPos() + node.nodeSize

    editor.commands.insertContentAt(pos, {
      type: 'dBlock',
      content: [
        {
          type: 'paragraph'
        }
      ]
    })
  }

  return (
    <NodeViewWrapper as="div" className="flex gap-2 group w-full relative">
      <section className="flex mt-2 pt-[2px] gap-1" aria-label="left-menu" contentEditable="false">
        <button
          className="d-block-button group-hover:opacity-100"
          onClick={createNodeAfter}
          type="button"
        >
          <i className="i-mdi-plus" />
        </button>

        <div
          className="d-block-button group-hover:opacity-100"
          contentEditable={false}
          data-drag-handle
          draggable
        >
          <i className="i-ic-baseline-drag-indicator" />
        </div>
      </section>

      <NodeViewContent className={`node-view-content w-full ${isTable ? 'ml-6' : ''}`} />
    </NodeViewWrapper>
  )
}
