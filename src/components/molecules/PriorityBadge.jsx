import React from "react"
import { cn } from "@/utils/cn"

const PriorityBadge = ({ priority, className }) => {
  const priorityConfig = {
    high: {
      label: "High",
      className: "priority-high text-white"
    },
    medium: {
      label: "Medium", 
      className: "priority-medium text-white"
    },
    low: {
      label: "Low",
      className: "priority-low text-white"
    }
  }

  const config = priorityConfig[priority] || priorityConfig.low

  return (
    <span className={cn(
      "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
      "transition-all duration-200 shadow-sm",
      config.className,
      className
    )}>
      {config.label}
    </span>
  )
}

export default PriorityBadge