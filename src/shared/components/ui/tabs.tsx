"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  )
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]",
        className
      )}
      {...props}
    />
  )
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "data-[state=active]:relative data-[state=active]:overflow-hidden data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#2a2f3a] data-[state=active]:via-[#3a3f4a] data-[state=active]:to-[#2a2f3a] data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-[#2a2f3a]/30 data-[state=active]:border data-[state=active]:border-[#3a3f4a]/40 data-[state=active]:[&>*]:relative data-[state=active]:[&>*]:z-10 data-[state=active]:before:absolute data-[state=active]:before:inset-0 data-[state=active]:before:bg-gradient-to-r data-[state=active]:before:from-transparent data-[state=active]:before:via-white/15 data-[state=active]:before:to-transparent data-[state=active]:before:-skew-x-12 data-[state=active]:before:animate-shimmer data-[state=active]:before:pointer-events-none data-[state=active]:before:z-[1] focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
