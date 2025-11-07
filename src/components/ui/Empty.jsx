import React from "react"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"

const Empty = ({ 
  title = "No tasks yet",
  description = "Get started by creating your first task",
  onAction,
  actionText = "Add your first task",
  className,
  icon = "CheckSquare"
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 px-4", className)}>
      <div className="text-center max-w-md space-y-6 empty-state">
        <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center">
          <ApperIcon 
            name={icon} 
            className="w-10 h-10 text-primary" 
          />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-semibold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            {title}
          </h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            {description}
          </p>
        </div>

        {onAction && (
          <button
            onClick={onAction}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all duration-200 fab"
          >
            <ApperIcon name="Plus" className="w-4 h-4" />
            {actionText}
          </button>
        )}
        
        <div className="mt-8 opacity-60">
          <div className="flex items-center justify-center space-x-4 text-slate-400">
            <div className="w-12 h-1 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full"></div>
            <ApperIcon name="Sparkles" className="w-4 h-4" />
            <div className="w-12 h-1 bg-gradient-to-r from-secondary/20 to-accent/20 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Empty