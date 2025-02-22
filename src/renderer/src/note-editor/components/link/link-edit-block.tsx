import * as React from 'react'
import { Button } from '@renderer/components/ui/button'
import { Label } from '@renderer/components/ui/label'
import { Switch } from '@renderer/components/ui/switch'
import { Input } from '@renderer/components/ui/input'
import { cn } from '@renderer/utils'

export interface LinkEditorProps extends React.HTMLAttributes<HTMLDivElement> {
  readonly defaultUrl?: string
  readonly defaultText?: string
  readonly defaultIsNewTab?: boolean
  readonly onSave: (url: string, text?: string, isNewTab?: boolean) => void
}

export const LinkEditBlock = React.forwardRef<HTMLDivElement, LinkEditorProps>(
  ({ onSave, defaultIsNewTab, defaultUrl, defaultText, className }, ref) => {
    const formRef = React.useRef<HTMLDivElement>(null)
    const [url, setUrl] = React.useState(defaultUrl || '')
    const [text, setText] = React.useState(defaultText || '')
    const [isNewTab, setIsNewTab] = React.useState(defaultIsNewTab || false)

    const handleSave = React.useCallback(
      (e: React.FormEvent) => {
        e.preventDefault()
        if (formRef.current) {
          const isValid = Array.from(formRef.current.querySelectorAll('input')).every((input) =>
            input.checkValidity()
          )

          if (isValid) {
            onSave(url, text, isNewTab)
          } else {
            formRef.current.querySelectorAll('input').forEach((input) => {
              if (!input.checkValidity()) {
                input.reportValidity()
              }
            })
          }
        }
      },
      [onSave, url, text, isNewTab]
    )

    React.useImperativeHandle(ref, () => formRef.current as HTMLDivElement)

    return (
      <div ref={formRef}>
        <div className={cn('space-y-4', className)}>
          <div className="space-y-1">
            <Label>URL</Label>

            <Input
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter URL"
              required
              type="url"
              value={url}
            />
          </div>

          <div className="space-y-1">
            <Label>Display Text (optional)</Label>

            <Input
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter display text"
              type="text"
              value={text}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Label>Open in New Tab</Label>

            <Switch checked={isNewTab} onCheckedChange={setIsNewTab} />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" onClick={handleSave}>
              Save
            </Button>
          </div>
        </div>
      </div>
    )
  }
)

LinkEditBlock.displayName = 'LinkEditBlock'

export default LinkEditBlock
