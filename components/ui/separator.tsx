"use client"

import React, { forwardRef } from "react"
import {
  SeparatorProps as SeparatorPrimitiveProps,
  separatorClassName,
} from "@radix-ui/react-separator"
import { cn } from "@/lib/utils/css"

type SeparatorProps = Omit<SeparatorPrimitiveProps, "className"> & {
  className?: string
  orientation?: "horizontal" | "vertical"
  decorative?: boolean
  defaultChecked?: boolean
  disabled?: boolean
}

const Separator = forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  SeparatorProps
>((props, ref) => {
  const {
    className,
    orientation = "horizontal",
    decorative = true,
    defaultChecked,
    disabled,
    ...separatorProps
  } = props

  return (
    <SeparatorPrimitive.Root
      ref={ref}
      defaultChecked={defaultChecked}
      disabled={disabled}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        separatorClassName,
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className
      )}
      {...separatorProps}
    />
  )
})

Separator.displayName = SeparatorPrimitive.Root.displayName

export { Separator }
