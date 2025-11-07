import React, { forwardRef } from "react"
import { cn } from "@/utils/cn"

const Button = forwardRef(({ 
  children, 
  variant = "primary", 
  size = "md", 
  className,
  disabled = false,
  ...props 
}, ref) => {
  const variants = {
    primary: "bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg",
    secondary: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50",
    danger: "bg-gradient-to-r from-error to-red-600 text-white hover:shadow-lg",
    ghost: "text-slate-600 hover:bg-slate-100",
    accent: "bg-gradient-to-r from-accent to-pink-600 text-white hover:shadow-lg"
  }

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  }

  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200",
        "hover:scale-105 active:scale-98 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100",
        "focus:outline-none focus:ring-2 focus:ring-primary/20",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
})

Button.displayName = "Button"

export default Button