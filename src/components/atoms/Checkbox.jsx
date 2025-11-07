import React, { forwardRef } from "react"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"

const Checkbox = forwardRef(({ 
  className, 
  checked = false,
  onChange,
  label,
  ...props 
}, ref) => {
  return (
    <label className="inline-flex items-center gap-2 cursor-pointer group">
      <div className="relative">
        <input
          ref={ref}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="sr-only"
          {...props}
        />
        <div className={cn(
          "w-5 h-5 rounded border-2 transition-all duration-200",
          "group-hover:scale-110",
          checked 
            ? "bg-gradient-to-br from-success to-green-600 border-success" 
            : "border-slate-300 bg-white hover:border-primary",
          className
        )}>
          {checked && (
            <ApperIcon 
              name="Check" 
              className="w-3 h-3 text-white absolute top-0.5 left-0.5" 
            />
          )}
        </div>
      </div>
      {label && (
        <span className="text-sm text-slate-700 select-none">
          {label}
        </span>
      )}
    </label>
  )
})

Checkbox.displayName = "Checkbox"

export default Checkbox