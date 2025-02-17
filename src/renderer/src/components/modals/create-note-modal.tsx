import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '../ui/dotted-dialog'
import { modalStore } from '@renderer/store/modal-store'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useForm } from 'react-hook-form'
import { toast } from '@renderer/hooks/use-toast'
import { Textarea } from '../ui/textarea'
import { noteTitleDescription } from '@renderer/utils'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { mutationKeys } from '@renderer/constants/mutation-keys'
import { allNoteKey } from '@renderer/constants/query-keys'
import { NoteInterface } from '@renderer/types/notes'

interface FormValues {
  title: string
  description: string
}

export function CreateNoteModal(): React.JSX.Element {
  const queryClient = useQueryClient()
  const form = useForm<FormValues>()
  const navigate = useNavigate()
  const { activeModal, closeModal } = modalStore()
  const { mutate } = useMutation({
    mutationKey: [mutationKeys['create-note']],
    mutationFn: (values: FormValues & { content: object | unknown[] }) =>
      window.api.createNote(values),
    async onSettled(data) {
      await queryClient.cancelQueries({ queryKey: allNoteKey })
      if (!data) throw Error('Returned Data is Empty')
      queryClient.setQueryData<NoteInterface[]>(allNoteKey, (previousEntities) => {
        // Ensure previousEntities is an array, defaulting to an empty array if it's undefined
        const entities = previousEntities || []
        const createdNote = data || {}
        return [...entities, createdNote]
      })
      closeModal()
      navigate({ to: `/${data.id}` })
      toast({ title: 'New Note Created 🎉' })
      form.reset()
    },
    onError(error) {
      toast({
        title: 'Failed to create note ❌ ',
        description: error.message,
        variant: 'destructive'
      })
    }
  })

  function onSubmit(data: FormValues): void {
    mutate({ ...data, content: noteTitleDescription(data) })
  }

  return (
    <Dialog open={activeModal === 'create-note-modal'} onOpenChange={() => closeModal()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create new Note 📒</DialogTitle>

          <DialogDescription>Begin creating a brand new one.</DialogDescription>
        </DialogHeader>

        <div className="w-full max-w-md mx-auto p-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>

                    <FormControl>
                      <Input placeholder="title" {...field} />
                    </FormControl>

                    <FormDescription>Title for the note.</FormDescription>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>

                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>

                    <FormDescription>Description for the note.</FormDescription>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Create
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
