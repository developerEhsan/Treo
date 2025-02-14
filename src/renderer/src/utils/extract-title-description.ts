export interface ContentNode {
  type: string
  attrs?: Record<string, string | object>
  content?: ContentNode[]
  text?: string
  marks?: Array<{
    type: string
    attrs?: Record<string, string | object>
  }>
}

interface ExtractedData {
  title: string | null
  description: string | null
}

/**
 * Extracts the title and description from TipTap editor content.
 * - Title is extracted from the first `heading` node.
 * - Description is extracted from the first `paragraph` node.
 *
 * @param content - The TipTap content array.
 * @returns An object containing the title and description.
 */
export function extractTitleAndDescription(content: ContentNode[]): ExtractedData {
  let title: string | null = null
  let description: string | null = null

  /**
   * Recursively extracts text from a node and its children.
   *
   * @param node - The content node to extract text from.
   * @returns The concatenated text content.
   */
  const extractText = (node: ContentNode): string => {
    if (node.text) return node.text // Base case: return text if present
    if (node.content) return node.content.map(extractText).join('') // Recursively extract text from children
    return '' // Fallback for nodes without text or content
  }

  /**
   * Finds the first node of a specific type and extracts its text content.
   *
   * @param nodes - The array of content nodes to search.
   * @param type - The type of node to search for (e.g., "heading", "paragraph").
   * @returns The extracted text content or null if not found.
   */
  const findFirstNodeContent = (nodes: ContentNode[], type: string): string | null => {
    for (const node of nodes) {
      if (node.type === type && node.content) {
        return node.content.map(extractText).join('')
      }
    }
    return null
  }

  // Extract title from the first heading node
  title = findFirstNodeContent(content, 'heading')

  // Extract description from the first paragraph node
  description = findFirstNodeContent(content, 'paragraph')

  return { title, description }
}
