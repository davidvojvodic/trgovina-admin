"use client"

import { forwardRef } from "react"
import { cva, VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

import { LabelProps, LabelPrimitiveProps } from "@radix-ui/react-label"

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
)

interface LabelPropsWithVariants
  extends LabelProps,
    VariantProps<typeof labelVariants> {}

const Label = forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelPropsWithVariants
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
))

Label.displayName = "Label"

export { Label }

