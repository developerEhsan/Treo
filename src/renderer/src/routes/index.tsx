import { createFileRoute } from '@tanstack/react-router'
import * as React from 'react'
import { Search } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@renderer/components/ui/tooltip'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from '@renderer/components/ui/resizable'
import { cn } from '@renderer/utils'
import { Separator } from '@renderer/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@renderer/components/ui/tabs'
import { Input } from '@renderer/components/ui/input'

import { ComponentProps } from 'react'
import { addDays, addHours, format, formatDistanceToNow, nextSaturday } from 'date-fns'
import { ScrollArea } from '@renderer/components/ui/scroll-area'
import { Badge } from '@renderer/components/ui/badge'

import {
  Archive,
  ArchiveX,
  Clock,
  Forward,
  MoreVertical,
  Reply,
  ReplyAll,
  Trash2
} from 'lucide-react'
import { Button } from '@renderer/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@renderer/components/ui/popover'
import { Calendar } from '@renderer/components/ui/calendar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@renderer/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@renderer/components/ui/avatar'
import { Textarea } from '@renderer/components/ui/textarea'
import { Label } from '@renderer/components/ui/label'

import { atom, SetStateAction, useAtom } from 'jotai'
import { Switch } from '@renderer/components/ui/switch'
import MinimalTiptapThree from '@renderer/components/minimal-tiptap-three'
import { useQuery } from '@tanstack/react-query'

interface MailDisplayProps {
  mail: Mail | null
}

export function MailDisplay({ mail }: MailDisplayProps): React.JSX.Element {
  const today = new Date()

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center p-2">
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" disabled={!mail}>
                <Archive className="h-4 w-4" />
                <span className="sr-only">Archive</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Archive</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" disabled={!mail}>
                <ArchiveX className="h-4 w-4" />
                <span className="sr-only">Move to junk</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Move to junk</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" disabled={!mail}>
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Move to trash</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Move to trash</TooltipContent>
          </Tooltip>
          <Separator orientation="vertical" className="mx-1 h-6" />
          <Tooltip>
            <Popover>
              <PopoverTrigger asChild>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" disabled={!mail}>
                    <Clock className="h-4 w-4" />
                    <span className="sr-only">Snooze</span>
                  </Button>
                </TooltipTrigger>
              </PopoverTrigger>
              <PopoverContent className="flex w-[535px] p-0">
                <div className="flex flex-col gap-2 border-r px-2 py-4">
                  <div className="px-4 text-sm font-medium">Snooze until</div>
                  <div className="grid min-w-[250px] gap-1">
                    <Button variant="ghost" className="justify-start font-normal">
                      Later today{' '}
                      <span className="ml-auto text-muted-foreground">
                        {format(addHours(today, 4), 'E, h:m b')}
                      </span>
                    </Button>
                    <Button variant="ghost" className="justify-start font-normal">
                      Tomorrow
                      <span className="ml-auto text-muted-foreground">
                        {format(addDays(today, 1), 'E, h:m b')}
                      </span>
                    </Button>
                    <Button variant="ghost" className="justify-start font-normal">
                      This weekend
                      <span className="ml-auto text-muted-foreground">
                        {format(nextSaturday(today), 'E, h:m b')}
                      </span>
                    </Button>
                    <Button variant="ghost" className="justify-start font-normal">
                      Next week
                      <span className="ml-auto text-muted-foreground">
                        {format(addDays(today, 7), 'E, h:m b')}
                      </span>
                    </Button>
                  </div>
                </div>
                <div className="p-2">
                  <Calendar />
                </div>
              </PopoverContent>
            </Popover>
            <TooltipContent>Snooze</TooltipContent>
          </Tooltip>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" disabled={!mail}>
                <Reply className="h-4 w-4" />
                <span className="sr-only">Reply</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Reply</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" disabled={!mail}>
                <ReplyAll className="h-4 w-4" />
                <span className="sr-only">Reply all</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Reply all</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" disabled={!mail}>
                <Forward className="h-4 w-4" />
                <span className="sr-only">Forward</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Forward</TooltipContent>
          </Tooltip>
        </div>
        <Separator orientation="vertical" className="mx-2 h-6" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" disabled={!mail}>
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">More</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Mark as unread</DropdownMenuItem>
            <DropdownMenuItem>Star thread</DropdownMenuItem>
            <DropdownMenuItem>Add label</DropdownMenuItem>
            <DropdownMenuItem>Mute thread</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Separator />
      {mail ? (
        <div className="flex flex-1 flex-col">
          <div className="flex items-start p-4">
            <div className="flex items-start gap-4 text-sm">
              <Avatar>
                <AvatarImage alt={mail.name} />
                <AvatarFallback>
                  {mail.name
                    .split(' ')
                    .map((chunk) => chunk[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <div className="font-semibold">{mail.name}</div>
                <div className="line-clamp-1 text-xs">{mail.subject}</div>
                <div className="line-clamp-1 text-xs">
                  <span className="font-medium">Reply-To:</span> {mail.email}
                </div>
              </div>
            </div>
            {mail.date && (
              <div className="ml-auto text-xs text-muted-foreground">
                {format(new Date(mail.date), 'PPpp')}
              </div>
            )}
          </div>
          <Separator />
          <div className="flex-1 whitespace-pre-wrap p-4 text-sm">{mail.text}</div>
          <Separator className="mt-auto" />
          <div className="p-4">
            <form>
              <div className="grid gap-4">
                <Textarea className="p-4" placeholder={`Reply ${mail.name}...`} />
                <div className="flex items-center">
                  <Label htmlFor="mute" className="flex items-center gap-2 text-xs font-normal">
                    <Switch id="mute" aria-label="Mute thread" /> Mute this thread
                  </Label>
                  <Button onClick={(e) => e.preventDefault()} size="sm" className="ml-auto">
                    Send
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center text-muted-foreground">No message selected</div>
      )}
    </div>
  )
}

export const mails = [
  {
    id: '6c84fb90-12c4-11e1-840d-7b25c5ee775a',
    name: 'William Smith',
    email: 'williamsmith@example.com',
    subject: 'Meeting Tomorrow',
    text: "Hi, let's have a meeting tomorrow to discuss the project. I've been reviewing the project details and have some ideas I'd like to share. It's crucial that we align on our next steps to ensure the project's success.\n\nPlease come prepared with any questions or insights you may have. Looking forward to our meeting!\n\nBest regards, William",
    date: '2023-10-22T09:00:00',
    read: true,
    labels: ['meeting', 'work', 'important']
  },
  {
    id: '110e8400-e29b-11d4-a716-446655440000',
    name: 'Alice Smith',
    email: 'alicesmith@example.com',
    subject: 'Re: Project Update',
    text: "Thank you for the project update. It looks great! I've gone through the report, and the progress is impressive. The team has done a fantastic job, and I appreciate the hard work everyone has put in.\n\nI have a few minor suggestions that I'll include in the attached document.\n\nLet's discuss these during our next meeting. Keep up the excellent work!\n\nBest regards, Alice",
    date: '2023-10-22T10:30:00',
    read: true,
    labels: ['work', 'important']
  },
  {
    id: '3e7c3f6d-bdf5-46ae-8d90-171300f27ae2',
    name: 'Bob Johnson',
    email: 'bobjohnson@example.com',
    subject: 'Weekend Plans',
    text: "Any plans for the weekend? I was thinking of going hiking in the nearby mountains. It's been a while since we had some outdoor fun.\n\nIf you're interested, let me know, and we can plan the details. It'll be a great way to unwind and enjoy nature.\n\nLooking forward to your response!\n\nBest, Bob",
    date: '2023-04-10T11:45:00',
    read: true,
    labels: ['personal']
  },
  {
    id: '61c35085-72d7-42b4-8d62-738f700d4b92',
    name: 'Emily Davis',
    email: 'emilydavis@example.com',
    subject: 'Re: Question about Budget',
    text: "I have a question about the budget for the upcoming project. It seems like there's a discrepancy in the allocation of resources.\n\nI've reviewed the budget report and identified a few areas where we might be able to optimize our spending without compromising the project's quality.\n\nI've attached a detailed analysis for your reference. Let's discuss this further in our next meeting.\n\nThanks, Emily",
    date: '2023-03-25T13:15:00',
    read: false,
    labels: ['work', 'budget']
  },
  {
    id: '8f7b5db9-d935-4e42-8e05-1f1d0a3dfb97',
    name: 'Michael Wilson',
    email: 'michaelwilson@example.com',
    subject: 'Important Announcement',
    text: "I have an important announcement to make during our team meeting. It pertains to a strategic shift in our approach to the upcoming product launch. We've received valuable feedback from our beta testers, and I believe it's time to make some adjustments to better meet our customers' needs.\n\nThis change is crucial to our success, and I look forward to discussing it with the team. Please be prepared to share your insights during the meeting.\n\nRegards, Michael",
    date: '2023-03-10T15:00:00',
    read: false,
    labels: ['meeting', 'work', 'important']
  },
  {
    id: '1f0f2c02-e299-40de-9b1d-86ef9e42126b',
    name: 'Sarah Brown',
    email: 'sarahbrown@example.com',
    subject: 'Re: Feedback on Proposal',
    text: "Thank you for your feedback on the proposal. It looks great! I'm pleased to hear that you found it promising. The team worked diligently to address all the key points you raised, and I believe we now have a strong foundation for the project.\n\nI've attached the revised proposal for your review.\n\nPlease let me know if you have any further comments or suggestions. Looking forward to your response.\n\nBest regards, Sarah",
    date: '2023-02-15T16:30:00',
    read: true,
    labels: ['work']
  },
  {
    id: '17c0a96d-4415-42b1-8b4f-764efab57f66',
    name: 'David Lee',
    email: 'davidlee@example.com',
    subject: 'New Project Idea',
    text: "I have an exciting new project idea to discuss with you. It involves expanding our services to target a niche market that has shown considerable growth in recent months.\n\nI've prepared a detailed proposal outlining the potential benefits and the strategy for execution.\n\nThis project has the potential to significantly impact our business positively. Let's set up a meeting to dive into the details and determine if it aligns with our current goals.\n\nBest regards, David",
    date: '2023-01-28T17:45:00',
    read: false,
    labels: ['meeting', 'work', 'important']
  },
  {
    id: '2f0130cb-39fc-44c4-bb3c-0a4337edaaab',
    name: 'Olivia Wilson',
    email: 'oliviawilson@example.com',
    subject: 'Vacation Plans',
    text: "Let's plan our vacation for next month. What do you think? I've been thinking of visiting a tropical paradise, and I've put together some destination options.\n\nI believe it's time for us to unwind and recharge. Please take a look at the options and let me know your preferences.\n\nWe can start making arrangements to ensure a smooth and enjoyable trip.\n\nExcited to hear your thoughts! Olivia",
    date: '2022-12-20T18:30:00',
    read: true,
    labels: ['personal']
  },
  {
    id: 'de305d54-75b4-431b-adb2-eb6b9e546014',
    name: 'James Martin',
    email: 'jamesmartin@example.com',
    subject: 'Re: Conference Registration',
    text: "I've completed the registration for the conference next month. The event promises to be a great networking opportunity, and I'm looking forward to attending the various sessions and connecting with industry experts.\n\nI've also attached the conference schedule for your reference.\n\nIf there are any specific topics or sessions you'd like me to explore, please let me know. It's an exciting event, and I'll make the most of it.\n\nBest regards, James",
    date: '2022-11-30T19:15:00',
    read: true,
    labels: ['work', 'conference']
  },
  {
    id: '7dd90c63-00f6-40f3-bd87-5060a24e8ee7',
    name: 'Sophia White',
    email: 'sophiawhite@example.com',
    subject: 'Team Dinner',
    text: "Let's have a team dinner next week to celebrate our success. We've achieved some significant milestones, and it's time to acknowledge our hard work and dedication.\n\nI've made reservations at a lovely restaurant, and I'm sure it'll be an enjoyable evening.\n\nPlease confirm your availability and any dietary preferences. Looking forward to a fun and memorable dinner with the team!\n\nBest, Sophia",
    date: '2022-11-05T20:30:00',
    read: false,
    labels: ['meeting', 'work']
  },
  {
    id: '99a88f78-3eb4-4d87-87b7-7b15a49a0a05',
    name: 'Daniel Johnson',
    email: 'danieljohnson@example.com',
    subject: 'Feedback Request',
    text: "I'd like your feedback on the latest project deliverables. We've made significant progress, and I value your input to ensure we're on the right track.\n\nI've attached the deliverables for your review, and I'm particularly interested in any areas where you think we can further enhance the quality or efficiency.\n\nYour feedback is invaluable, and I appreciate your time and expertise. Let's work together to make this project a success.\n\nRegards, Daniel",
    date: '2022-10-22T09:30:00',
    read: false,
    labels: ['work']
  },
  {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    name: 'Ava Taylor',
    email: 'avataylor@example.com',
    subject: 'Re: Meeting Agenda',
    text: "Here's the agenda for our meeting next week. I've included all the topics we need to cover, as well as time allocations for each.\n\nIf you have any additional items to discuss or any specific points to address, please let me know, and we can integrate them into the agenda.\n\nIt's essential that our meeting is productive and addresses all relevant matters.\n\nLooking forward to our meeting! Ava",
    date: '2022-10-10T10:45:00',
    read: true,
    labels: ['meeting', 'work']
  },
  {
    id: 'c1a0ecb4-2540-49c5-86f8-21e5ce79e4e6',
    name: 'William Anderson',
    email: 'williamanderson@example.com',
    subject: 'Product Launch Update',
    text: "The product launch is on track. I'll provide an update during our call. We've made substantial progress in the development and marketing of our new product.\n\nI'm excited to share the latest updates with you during our upcoming call. It's crucial that we coordinate our efforts to ensure a successful launch. Please come prepared with any questions or insights you may have.\n\nLet's make this product launch a resounding success!\n\nBest regards, William",
    date: '2022-09-20T12:00:00',
    read: false,
    labels: ['meeting', 'work', 'important']
  },
  {
    id: 'ba54eefd-4097-4949-99f2-2a9ae4d1a836',
    name: 'Mia Harris',
    email: 'miaharris@example.com',
    subject: 'Re: Travel Itinerary',
    text: "I've received the travel itinerary. It looks great! Thank you for your prompt assistance in arranging the details. I've reviewed the schedule and the accommodations, and everything seems to be in order. I'm looking forward to the trip, and I'm confident it'll be a smooth and enjoyable experience.\n\nIf there are any specific activities or attractions you recommend at our destination, please feel free to share your suggestions.\n\nExcited for the trip! Mia",
    date: '2022-09-10T13:15:00',
    read: true,
    labels: ['personal', 'travel']
  },
  {
    id: 'df09b6ed-28bd-4e0c-85a9-9320ec5179aa',
    name: 'Ethan Clark',
    email: 'ethanclark@example.com',
    subject: 'Team Building Event',
    text: "Let's plan a team-building event for our department. Team cohesion and morale are vital to our success, and I believe a well-organized team-building event can be incredibly beneficial. I've done some research and have a few ideas for fun and engaging activities.\n\nPlease let me know your thoughts and availability. We want this event to be both enjoyable and productive.\n\nTogether, we'll strengthen our team and boost our performance.\n\nRegards, Ethan",
    date: '2022-08-25T15:30:00',
    read: false,
    labels: ['meeting', 'work']
  },
  {
    id: 'd67c1842-7f8b-4b4b-9be1-1b3b1ab4611d',
    name: 'Chloe Hall',
    email: 'chloehall@example.com',
    subject: 'Re: Budget Approval',
    text: "The budget has been approved. We can proceed with the project. I'm delighted to inform you that our budget proposal has received the green light from the finance department. This is a significant milestone, and it means we can move forward with the project as planned.\n\nI've attached the finalized budget for your reference. Let's ensure that we stay on track and deliver the project on time and within budget.\n\nIt's an exciting time for us! Chloe",
    date: '2022-08-10T16:45:00',
    read: true,
    labels: ['work', 'budget']
  },
  {
    id: '6c9a7f94-8329-4d70-95d3-51f68c186ae1',
    name: 'Samuel Turner',
    email: 'samuelturner@example.com',
    subject: 'Weekend Hike',
    text: "Who's up for a weekend hike in the mountains? I've been craving some outdoor adventure, and a hike in the mountains sounds like the perfect escape. If you're up for the challenge, we can explore some scenic trails and enjoy the beauty of nature.\n\nI've done some research and have a few routes in mind.\n\nLet me know if you're interested, and we can plan the details.\n\nIt's sure to be a memorable experience! Samuel",
    date: '2022-07-28T17:30:00',
    read: false,
    labels: ['personal']
  }
]

export type Mail = (typeof mails)[number]

export const accounts = [
  {
    label: 'Alicia Koch',
    email: 'alicia@example.com',
    icon: (
      <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <title>Vercel</title>
        <path d="M24 22.525H0l12-21.05 12 21.05z" fill="currentColor" />
      </svg>
    )
  },
  {
    label: 'Alicia Koch',
    email: 'alicia@gmail.com',
    icon: (
      <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <title>Gmail</title>
        <path
          d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"
          fill="currentColor"
        />
      </svg>
    )
  },
  {
    label: 'Alicia Koch',
    email: 'alicia@me.com',
    icon: (
      <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <title>iCloud</title>
        <path
          d="M13.762 4.29a6.51 6.51 0 0 0-5.669 3.332 3.571 3.571 0 0 0-1.558-.36 3.571 3.571 0 0 0-3.516 3A4.918 4.918 0 0 0 0 14.796a4.918 4.918 0 0 0 4.92 4.914 4.93 4.93 0 0 0 .617-.045h14.42c2.305-.272 4.041-2.258 4.043-4.589v-.009a4.594 4.594 0 0 0-3.727-4.508 6.51 6.51 0 0 0-6.511-6.27z"
          fill="currentColor"
        />
      </svg>
    )
  }
]

export type Account = (typeof accounts)[number]

export const contacts = [
  {
    name: 'Emma Johnson',
    email: 'emma.johnson@example.com'
  },
  {
    name: 'Liam Wilson',
    email: 'liam.wilson@example.com'
  },
  {
    name: 'Olivia Davis',
    email: 'olivia.davis@example.com'
  },
  {
    name: 'Noah Martinez',
    email: 'noah.martinez@example.com'
  },
  {
    name: 'Ava Taylor',
    email: 'ava.taylor@example.com'
  },
  {
    name: 'Lucas Brown',
    email: 'lucas.brown@example.com'
  },
  {
    name: 'Sophia Smith',
    email: 'sophia.smith@example.com'
  },
  {
    name: 'Ethan Wilson',
    email: 'ethan.wilson@example.com'
  },
  {
    name: 'Isabella Jackson',
    email: 'isabella.jackson@example.com'
  },
  {
    name: 'Mia Clark',
    email: 'mia.clark@example.com'
  },
  {
    name: 'Mason Lee',
    email: 'mason.lee@example.com'
  },
  {
    name: 'Layla Harris',
    email: 'layla.harris@example.com'
  },
  {
    name: 'William Anderson',
    email: 'william.anderson@example.com'
  },
  {
    name: 'Ella White',
    email: 'ella.white@example.com'
  },
  {
    name: 'James Thomas',
    email: 'james.thomas@example.com'
  },
  {
    name: 'Harper Lewis',
    email: 'harper.lewis@example.com'
  },
  {
    name: 'Benjamin Moore',
    email: 'benjamin.moore@example.com'
  },
  {
    name: 'Aria Hall',
    email: 'aria.hall@example.com'
  },
  {
    name: 'Henry Turner',
    email: 'henry.turner@example.com'
  },
  {
    name: 'Scarlett Adams',
    email: 'scarlett.adams@example.com'
  }
]

export type Contact = (typeof contacts)[number]

interface MailListProps {
  items: Mail[]
}

type Config = {
  selected: Mail['id'] | null
}

const configAtom = atom<Config>({
  selected: mails[0].id
})
type SetAtom<Args extends unknown[], Result> = (...args: Args) => Result
type UseMailReturnType = [Config, SetAtom<[SetStateAction<Config>], void>]

export function useMail(): UseMailReturnType {
  return useAtom(configAtom)
}

export function MailList({ items }: MailListProps): React.JSX.Element {
  const [mail, setMail] = useMail()

  return (
    <ScrollArea className="h-screen">
      <div className="flex flex-col gap-2 p-4 pt-0">
        {items.map((item) => (
          <button
            key={item.id}
            className={cn(
              'flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent',
              mail.selected === item.id && 'bg-muted'
            )}
            onClick={() =>
              setMail({
                ...mail,
                selected: item.id
              })
            }
          >
            <div className="flex w-full flex-col gap-1">
              <div className="flex items-center">
                <div className="flex items-center gap-2">
                  <div className="font-semibold">{item.name}</div>
                  {!item.read && <span className="flex h-2 w-2 rounded-full bg-blue-600" />}
                </div>
                <div
                  className={cn(
                    'ml-auto text-xs',
                    mail.selected === item.id ? 'text-foreground' : 'text-muted-foreground'
                  )}
                >
                  {formatDistanceToNow(new Date(item.date), {
                    addSuffix: true
                  })}
                </div>
              </div>
              <div className="text-xs font-medium">{item.subject}</div>
            </div>
            <div className="line-clamp-2 text-xs text-muted-foreground">
              {item.text.substring(0, 300)}
            </div>
            {item.labels.length ? (
              <div className="flex items-center gap-2">
                {item.labels.map((label) => (
                  <Badge key={label} variant={getBadgeVariantFromLabel(label)}>
                    {label}
                  </Badge>
                ))}
              </div>
            ) : null}
          </button>
        ))}
      </div>
    </ScrollArea>
  )
}

function getBadgeVariantFromLabel(label: string): ComponentProps<typeof Badge>['variant'] {
  if (['work'].includes(label.toLowerCase())) {
    return 'default'
  }

  if (['personal'].includes(label.toLowerCase())) {
    return 'outline'
  }

  return 'secondary'
}

interface MailProps {
  accounts: {
    label: string
    email: string
    icon: React.ReactNode
  }[]
  mails: Mail[]
  defaultLayout: number[] | undefined
  defaultCollapsed?: boolean
  navCollapsedSize: number
}

export function Mail({ mails, defaultLayout = [12, 32, 48] }: MailProps): React.JSX.Element {
  const { data, isLoading } = useQuery({
    queryKey: ['all-notes'],
    queryFn: () => window.api.getAllNotes()
  })
  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes: number[]) => {
          document.cookie = `react-resizable-panels:layout:mail=${JSON.stringify(sizes)}`
        }}
        className="h-full max-h-[800px] items-stretch"
      >
        <ResizablePanel defaultSize={defaultLayout[0]} minSize={30}>
          <Tabs defaultValue="all">
            <div className="flex items-center px-4 py-2">
              <h1 className="text-xl font-bold">Inbox</h1>
              <TabsList className="ml-auto">
                <TabsTrigger value="all" className="text-zinc-600 dark:text-zinc-200">
                  All mail
                </TabsTrigger>
                <TabsTrigger value="unread" className="text-zinc-600 dark:text-zinc-200">
                  Unread
                </TabsTrigger>
              </TabsList>
            </div>
            <Separator />
            <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <form>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search" className="pl-8" />
                </div>
              </form>
            </div>
            <TabsContent value="all" className="m-0">
              <MailList items={mails} />
            </TabsContent>
            <TabsContent value="unread" className="m-0">
              <MailList items={mails.filter((item) => !item.read)} />
            </TabsContent>
          </Tabs>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[3]} minSize={30}>
          <MinimalTiptapThree
            // value={content}
            throttleDelay={3000}
            className={cn('h-full min-h-56 w-full rounded-xl')}
            editorContentClassName="overflow-auto h-full"
            output="json"
            onChange={(content) => {
              window.api.updateNote({ id: 1, content })
            }}
            placeholder="This is your placeholder..."
            editable={true}
            editorClassName="focus:outline-none px-5 py-4 h-full"
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  )
}

export const Route = createFileRoute('/')({
  component() {
    return (
      <Mail
        accounts={accounts}
        mails={mails}
        defaultLayout={undefined}
        defaultCollapsed={undefined}
        navCollapsedSize={4}
      />
    )
  }
})
