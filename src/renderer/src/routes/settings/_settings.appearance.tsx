import { Separator } from '@renderer/components/ui/separator'
import { createFileRoute } from '@tanstack/react-router'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { cn } from '@renderer/utils'
import { Button, buttonVariants } from '@renderer/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@renderer/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@renderer/components/ui/select'
import { themes, useTheme } from '@renderer/providers/theme-provider'

const appearanceFormSchema = z.object({
  theme: z.enum(themes, {
    required_error: 'Please select a theme.'
  }),
  font: z.enum(['inter', 'manrope', 'system'], {
    invalid_type_error: 'Select a font',
    required_error: 'Please select a font.'
  })
})

type AppearanceFormValues = z.infer<typeof appearanceFormSchema>

export function AppearanceForm(): React.JSX.Element {
  const { theme, setTheme } = useTheme()
  // This can come from your database or API.
  const defaultValues: Partial<AppearanceFormValues> = {
    theme: theme,
    font: 'inter'
  }
  const form = useForm<AppearanceFormValues>({
    resolver: zodResolver(appearanceFormSchema),
    defaultValues
  })

  function onSubmit(data: AppearanceFormValues): void {
    setTheme(data.theme)
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
          name="font"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Language</FormLabel>

              <div className="relative w-max">
                <Select defaultValue={field.value} onValueChange={field.onChange} {...field}>
                  <FormControl>
                    <SelectTrigger
                      className={cn(
                        buttonVariants({ variant: 'outline', className: 'justify-between' }),
                        'w-[200px] appearance-none font-normal'
                      )}
                    >
                      <SelectValue placeholder="Select Font Style" />
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent>
                    <SelectItem value="inter">Inter</SelectItem>

                    <SelectItem value="manrope">Manrope</SelectItem>

                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <FormDescription>Set the font you want to use in the dashboard.</FormDescription>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="theme"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>Theme</FormLabel>

              <FormDescription>Select the theme for the dashboard.</FormDescription>

              <FormMessage />

              <RadioGroup
                className="grid max-w-md grid-cols-2 gap-8 pt-2"
                defaultValue={field.value}
                onValueChange={field.onChange}
              >
                <FormItem>
                  <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                    <FormControl>
                      <RadioGroupItem value="light" className="sr-only" />
                    </FormControl>

                    <div className="items-center rounded-md border-2 border-muted p-1 hover:border-accent">
                      <div className="space-y-2 rounded-sm bg-[#ecedef] p-2">
                        <div className="space-y-2 rounded-md bg-white p-2 shadow-xs">
                          <div className="h-2 w-[80px] rounded-lg bg-[#ecedef]" />

                          <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                        </div>

                        <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-xs">
                          <div className="h-4 w-4 rounded-full bg-[#ecedef]" />

                          <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                        </div>

                        <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-xs">
                          <div className="h-4 w-4 rounded-full bg-[#ecedef]" />

                          <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                        </div>
                      </div>
                    </div>

                    <span className="block w-full p-2 text-center font-normal">Light</span>
                  </FormLabel>
                </FormItem>

                <FormItem>
                  <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                    <FormControl>
                      <RadioGroupItem value="dark" className="sr-only" />
                    </FormControl>

                    <div className="items-center rounded-md border-2 border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground">
                      <div className="space-y-2 rounded-sm bg-slate-950 p-2">
                        <div className="space-y-2 rounded-md bg-slate-800 p-2 shadow-xs">
                          <div className="h-2 w-[80px] rounded-lg bg-slate-400" />

                          <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                        </div>

                        <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-xs">
                          <div className="h-4 w-4 rounded-full bg-slate-400" />

                          <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                        </div>

                        <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-xs">
                          <div className="h-4 w-4 rounded-full bg-slate-400" />

                          <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                        </div>
                      </div>
                    </div>

                    <span className="block w-full p-2 text-center font-normal">Dark</span>
                  </FormLabel>
                </FormItem>
              </RadioGroup>
            </FormItem>
          )}
        />

        <Button type="submit">Update preferences</Button>
      </form>
    </Form>
  )
}

export const Route = createFileRoute('/settings/_settings/appearance')({
  component() {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Appearance</h3>

          <p className="text-sm text-muted-foreground">
            Customize the appearance of the app. Automatically switch between day and night themes.
          </p>
        </div>

        <Separator />

        <AppearanceForm />
      </div>
    )
  }
})
