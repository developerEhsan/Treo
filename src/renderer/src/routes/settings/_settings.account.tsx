import { Separator } from '@renderer/components/ui/separator'
import { createFileRoute } from '@tanstack/react-router'

import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { CalendarIcon, Check, ChevronsUpDown } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import React from 'react'
import { toast } from '@renderer/hooks/use-toast'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@renderer/components/ui/form'
import { Input } from '@renderer/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@renderer/components/ui/popover'
import { Button } from '@renderer/components/ui/button'
import { cn } from '@renderer/utils'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@renderer/components/ui/command'
import { Calendar } from '@renderer/components/ui/calendar'

const languages = [
  { label: 'English', value: 'en' },
  { label: 'French', value: 'fr' },
  { label: 'German', value: 'de' },
  { label: 'Spanish', value: 'es' },
  { label: 'Portuguese', value: 'pt' },
  { label: 'Russian', value: 'ru' },
  { label: 'Japanese', value: 'ja' },
  { label: 'Korean', value: 'ko' },
  { label: 'Chinese', value: 'zh' }
] as const

const accountFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: 'Name must be at least 2 characters.'
    })
    .max(30, {
      message: 'Name must not be longer than 30 characters.'
    }),
  dob: z.date({
    required_error: 'A date of birth is required.'
  }),
  language: z.string({
    required_error: 'Please select a language.'
  })
})

type AccountFormValues = z.infer<typeof accountFormSchema>

// This can come from your database or API.
const defaultValues: Partial<AccountFormValues> = {
  // name: "Your name",
  // dob: new Date("2023-01-23"),
}

export function AccountForm(): React.JSX.Element {
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues
  })

  function onSubmit(data: AccountFormValues): void {
    toast({
      title: 'You submitted the following values:',
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      )
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>

              <FormControl>
                <Input placeholder="Your name" {...field} />
              </FormControl>

              <FormDescription>
                This is the name that will be displayed on your profile and in emails.
              </FormDescription>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dob"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date of birth</FormLabel>

              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      className={cn(
                        'w-[240px] pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                      variant="outline"
                    >
                      {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}

                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>

                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                    initialFocus
                    mode="single"
                    onSelect={field.onChange}
                    selected={field.value}
                  />
                </PopoverContent>
              </Popover>

              <FormDescription>Your date of birth is used to calculate your age.</FormDescription>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Language</FormLabel>

              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      className={cn(
                        'w-[200px] justify-between',
                        !field.value && 'text-muted-foreground'
                      )}
                      role="combobox"
                      variant="outline"
                    >
                      {field.value
                        ? languages.find((language) => language.value === field.value)?.label
                        : 'Select language'}

                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>

                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Search language..." />

                    <CommandList>
                      <CommandEmpty>No language found.</CommandEmpty>

                      <CommandGroup>
                        {languages.map((language) => (
                          <CommandItem
                            key={language.value}
                            onSelect={() => {
                              form.setValue('language', language.value)
                            }}
                            value={language.label}
                          >
                            <Check
                              className={cn(
                                'mr-2',
                                language.value === field.value ? 'opacity-100' : 'opacity-0'
                              )}
                            />

                            {language.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              <FormDescription>
                This is the language that will be used in the dashboard.
              </FormDescription>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Update account</Button>
      </form>
    </Form>
  )
}

export const Route = createFileRoute('/settings/_settings/account')({
  component() {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Account</h3>

          <p className="text-sm text-muted-foreground">
            Update your account settings. Set your preferred language and timezone.
          </p>
        </div>

        <Separator />

        <AccountForm />
      </div>
    )
  }
})
