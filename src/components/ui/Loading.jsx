import React from "react"
import { cn } from "@/utils/cn"

const Loading = ({ className, variant = "default" }) => {
  if (variant === "skeleton") {
    return (
      <div className={cn("space-y-4", className)}>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-white rounded-lg shadow-card p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="h-5 bg-gradient-to-r from-slate-200 to-slate-100 rounded w-3/4"></div>
                  <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-100 rounded w-1/2"></div>
                </div>
                <div className="h-6 w-16 bg-gradient-to-r from-slate-200 to-slate-100 rounded-full"></div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gradient-to-r from-slate-200 to-slate-100 rounded w-full"></div>
                <div className="h-3 bg-gradient-to-r from-slate-200 to-slate-100 rounded w-5/6"></div>
              </div>
              <div className="flex items-center justify-between pt-2">
                <div className="h-4 w-20 bg-gradient-to-r from-slate-200 to-slate-100 rounded"></div>
                <div className="h-5 w-5 bg-gradient-to-r from-slate-200 to-slate-100 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={cn("min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100", className)}>
      <div className="text-center space-y-4">
        <div className="relative">
          <svg 
            className="animate-spin h-12 w-12 text-primary mx-auto" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4" 
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" 
            />
          </svg>
        </div>
        <p className="text-slate-600 font-medium">Loading your tasks...</p>
      </div>
    </div>
  )
}

export default Loading