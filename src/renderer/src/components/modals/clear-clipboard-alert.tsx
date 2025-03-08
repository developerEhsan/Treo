import { mutationKeys } from '@renderer/constants/mutation-keys'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '../ui/alert-dialog'
import { modalStore } from '@renderer/store/modal-store'
import { queryKeys } from '@renderer/constants/query-keys'
import { toast } from '@renderer/hooks/use-toast'
import { copyWidgetStore } from '@renderer/store/copy-widget-store'

export function ClearClipboardAlert(): React.JSX.Element {
  const { activeModal, closeModal } = modalStore()
  const { searchQuery } = copyWidgetStore()
  const queryClient = useQueryClient()
  const { mutate } = useMutation({
    mutationKey: [mutationKeys['clear-clipboard']],
    mutationFn: () => window.api.clearClipboard(),
    onError(error) {
      toast({
        title: 'Failed to Clear Clipboard ❌ ',
        description: error.message,
        variant: 'destructive'
      })
    },
    onSettled() {
      queryClient.invalidateQueries({ queryKey: [queryKeys['clipboard-data'], searchQuery] })
      toast({
        title: 'Clipboard successfully Cleared'
      })
    }
  })

  return (
    <AlertDialog open={activeModal === 'clear-clipboard-dialog'} onOpenChange={() => closeModal()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
           <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
           <AlertDialogDescription>
             This action cannot be undone. This will permanently delete all items
             from your clipboard history.
           </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => mutate()}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
