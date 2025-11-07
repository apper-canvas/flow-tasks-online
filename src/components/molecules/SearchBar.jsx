import React from "react"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"

const SearchBar = ({ value, onChange, placeholder = "Search tasks...", className }) => {
  return (
    <div className={cn("relative", className)}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <ApperIcon name="Search" className="w-4 h-4 text-slate-400" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg",
          "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
          "placeholder:text-slate-400 text-slate-900",
          "transition-all duration-200"
        )}
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
        >
          <ApperIcon name="X" className="w-4 h-4 text-slate-400 hover:text-slate-600" />
        </button>
      )}
    </div>
  )
}

export default SearchBar