import * as React from "react"
import { cn } from "@/lib/utils"

type CardProps = React.HTMLAttributes<HTMLDivElement>
const Card = React.forwardRef<HTMLDivElement, CardProps>((props, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      props.className
    )}
    {...props}
  />
))
Card.displayName = "Card"

type CardHeaderProps = React.HTMLAttributes<HTMLDivElement>
const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>((props, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", props.className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

type CardTitleProps = React.HTMLAttributes<HTMLHeadingElement>
const CardTitle = React.forwardRef<HTMLParagraphElement, CardTitleProps>((props, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      props.className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

type CardDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>
const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>((props, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", props.className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

type CardContentProps = React.HTMLAttributes<HTMLDivElement>
const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>((props, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", props.className)} {...props} />
))
CardContent.displayName = "CardContent"

type CardFooterProps = React.HTMLAttributes<HTMLDivElement>
const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>((props, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", props.className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
