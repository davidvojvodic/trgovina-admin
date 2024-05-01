"use client"

import * as React from "react"
import { DialogProps } from "@radix-ui/react-dialog"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "cmdk"
import { Search } from "lucide-react"

import { cn } from "@/lib/utils"
import { Dialog, DialogContent } from "@/components/ui/dialog"

// Added type imports
import type { ComponentPropsWithoutRef, ElementRef } from "react"

interface CustomCommandDialogProps extends DialogProps {}

const CustomCommandDialog = ({
  children,
  ...dialogProps
}: CustomCommandDialogProps) => {
  return (
    <Dialog {...dialogProps}>
      <DialogContent className="overflow-hidden p-0 shadow-lg">
        <Command className="h-full w-full overflow-hidden rounded-md bg-popover text-popover-foreground">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  )
}

// Removed unnecessary forwardRef and displayName
const CustomCommandInput = ({ className, ...inputProps }: ComponentPropsWithoutRef<typeof CommandInput>) => (
  <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
    <CommandInput
      className={cn(
        "flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...inputProps}
    />
  </div>
)

// Removed unnecessary forwardRef and displayName
const CustomCommandList = ({ className, ...listProps }: ComponentPropsWithoutRef<typeof CommandList>) => (
  <CommandList
    className={cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className)}
    {...listProps}
  />
)

// Removed unnecessary forwardRef and displayName
const CustomCommandEmpty = ({ className, ...emptyProps }: ComponentPropsWithoutRef<typeof CommandEmpty>) => (
  <CommandEmpty
    className="py-6 text-center text-sm"
    {...emptyProps}
  />
)

// Removed unnecessary forwardRef and displayName
const CustomCommandGroup = ({ className, ...groupProps }: ComponentPropsWithoutRef<typeof CommandGroup>) => (
  <CommandGroup
    className={cn(
      "overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
      className
    )}
    {...groupProps}
  />
)

// Removed unnecessary forwardRef and displayName
const CustomCommandSeparator = ({ className, ...separatorProps }: ComponentPropsWithoutRef<typeof CommandSeparator>) => (
  <CommandSeparator
    className={cn("-mx-1 h-px bg-border", className)}
    {...separatorProps}
  />
)

// Removed unnecessary forwardRef and displayName
const CustomCommandItem = ({ className, ...itemProps }: ComponentPropsWithoutRef<typeof CommandItem>) => (
  <CommandItem
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...itemProps}
  />
)

const CommandShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}
CommandShortcut.displayName = "CommandShortcut"

export {
  CustomCommand,
  CustomCommandDialog,
  CustomCommandInput,
  CustomCommandList,
  CustomCommandEmpty,
  CustomCommandGroup,
  CustomCommandItem,
  CommandShortcut,
  CustomCommandSeparator,
}

