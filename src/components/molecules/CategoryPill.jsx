import React from "react"
import { cn } from "@/utils/cn"

const CategoryPill = ({ category, color, active = false, onClick, className }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "category-pill inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium",
        "transition-all duration-150 border-2",
        active 
          ? "text-white shadow-md" 
          : "text-slate-600 bg-white hover:shadow-sm border-slate-200",
        className
      )}
      style={{
        backgroundColor: active ? color : undefined,
        borderColor: active ? color : undefined,
      }}
    >
      <div 
        className="w-2 h-2 rounded-full mr-2"
        style={{ backgroundColor: active ? "rgba(255, 255, 255, 0.8)" : color }}
      />
      {category}
    </button>
  )
}

export default CategoryPill