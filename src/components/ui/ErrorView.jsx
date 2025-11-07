import React from "react"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"

const ErrorView = ({ 
  error = "Something went wrong", 
  onRetry, 
  className,
  title = "Oops! Something went wrong",
  description
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 px-4", className)}>
      <div className="text-center max-w-md space-y-6">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-red-100 to-red-50 rounded-full flex items-center justify-center">
          <ApperIcon 
            name="AlertTriangle" 
            className="w-8 h-8 text-error" 
          />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-slate-900">
            {title}
          </h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            {description || error}
          </p>
        </div>

        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all duration-200"
          >
            <ApperIcon name="RefreshCw" className="w-4 h-4" />
            Try again
          </button>
        )}
      </div>
    </div>
  )
}

export default ErrorView