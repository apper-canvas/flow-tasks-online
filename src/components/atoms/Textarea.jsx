import React, { forwardRef } from "react"
import { cn } from "@/utils/cn"

const Textarea = forwardRef(({ 
  className, 
  label,
  error,
  rows = 3,
  ...props 
}, ref) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        rows={rows}
        className={cn(
          "w-full px-3 py-2 border border-slate-300 rounded-md resize-none",
          "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
          "placeholder:text-slate-400",
          "transition-all duration-200",
          error && "border-error focus:ring-error/20 focus:border-error",
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-error mt-1">{error}</p>
      )}
    </div>
  )
})

Textarea.displayName = "Textarea"

export default Textarea