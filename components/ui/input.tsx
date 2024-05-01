import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  name?: string
  id?: string
  required?: boolean
  disabled?: boolean
  readOnly?: boolean
  autoComplete?: string
  autoFocus?: boolean
  inputMode?: "none" | "text" | "decimal" | "numeric" | "search" | "tel" | "url" | "email" | "password"
  size?: "sm" | "md" | "lg"
  variant?: "outline" | "filled" | "ghost"
  placeholder?: string
  maxLength?: number
  minLength?: number
  step?: string | number
  pattern?: string
  multiple?: boolean
  form?: string
  formAction?: string
  formEncType?: "application/x-www-form-urlencoded" | "multipart/form-data" | "text/plain"
  formMethod?: "get" | "post"
  formNoValidate?: boolean
  formTarget?: string
  list?: string
  min?: string | number
  max?: string | number
  selectionDirection?: "forward" | "backward" | "none" | "auto"
  selectionEnd?: number
  selectionStart?: number
  spellCheck?: boolean
  type?:
    | "button"
    | "checkbox"
    | "color"
    | "date"
    | "datetime-local"
    | "email"
    | "file"
    | "hidden"
    | "image"
    | "month"
    | "number"
    | "password"
    | "radio"
    | "range"
    | "reset"
    | "search"
    | "submit"
    | "tel"
    | "text"
    | "time"
    | "url"
    | "week"
  value?: string | number | readonly string[]
  defaultValue?: string | number | readonly string[]
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  onInput?: React.FormEventHandler<HTMLInputElement>
  onFocus?: React.FocusEventHandler<HTMLInputElement>
  onBlur?: React.FocusEventHandler<HTMLInputElement>
  onSelect?: React.FormEventHandler<HTMLInputElement>
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({
    className,
    name,
    id,
    required,
    disabled,
    readOnly,
    autoComplete,
    autoFocus,
    inputMode,
    size,
    variant,
    placeholder,
    maxLength,
    minLength,
    step,
    pattern,
    multiple,
    form,
    formAction,
    formEncType,
    formMethod,
    formNoValidate,
    formTarget,
    list,
    min,
    max,
    selectionDirection,
    selectionEnd,
    selectionStart,
    spellCheck,
    type,
    value,
    defaultValue,
    onChange,
    onInput,
    onFocus,
    onBlur,
    onSelect,
    ...props
  }, ref) => {
    return (
      <input
        name={name}
        id={id}
        required={required}
        disabled={disabled}
        readOnly={readOnly}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        inputMode={inputMode}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          size && `input-${size}`,
          variant && `input-${variant}`,
          className
        )}
        ref={ref}
        list={list}
        min={min}
        max={max}
        selectionDirection={selectionDirection}
        selectionEnd={selectionEnd}
        selectionStart={selectionStart}
        spellCheck={spellCheck}
        type={type}
        value={value}
        defaultValue={defaultValue}
        maxLength={maxLength}
        minLength={minLength}
        pattern={pattern}
        multiple={multiple}
        form={form}
        formAction={formAction}
        formEncType={formEncType}
        formMethod={formMethod}
        formNoValidate={formNoValidate}
        formTarget={formTarget}
        step={step}
        onBlur={onBlur}
        onChange={onChange}
        onFocus={onFocus}
        onInput={onInput}
        onSelect={onSelect}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
