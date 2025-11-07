import React from "react"
import { motion } from "framer-motion"
import CategoryPill from "@/components/molecules/CategoryPill"
import SearchBar from "@/components/molecules/SearchBar"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const FilterBar = ({
  categories,
  activeCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  showCompleted,
  onToggleCompleted
}) => {
  const sortOptions = [
    { value: "dueDate", label: "Due Date", icon: "Calendar" },
    { value: "priority", label: "Priority", icon: "AlertCircle" },
    { value: "created", label: "Created", icon: "Clock" },
    { value: "alphabetical", label: "A-Z", icon: "SortAsc" }
  ]

  return (
    <div className="space-y-4">
      <SearchBar
        value={searchQuery}
        onChange={onSearchChange}
        placeholder="Search tasks..."
        className="max-w-md"
      />

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <CategoryPill
            category="All"
            color="#6366f1"
            active={activeCategory === "all"}
            onClick={() => onCategoryChange("all")}
          />
          {categories.map(category => (
            <CategoryPill
              key={category.Id}
              category={category.name}
              color={category.color}
              active={activeCategory === category.name}
              onClick={() => onCategoryChange(category.name)}
            />
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onToggleCompleted}
            className={cn(
              "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200",
              showCompleted
                ? "bg-success text-white shadow-sm"
                : "text-slate-600 bg-slate-100 hover:bg-slate-200"
            )}
          >
            <ApperIcon 
              name={showCompleted ? "EyeOff" : "Eye"} 
              size={14} 
            />
            {showCompleted ? "Hide" : "Show"} Completed
          </button>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="appearance-none bg-white border border-slate-200 rounded-lg px-3 py-1.5 pr-8 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  Sort by {option.label}
                </option>
              ))}
            </select>
            <ApperIcon 
              name="ChevronDown" 
              size={16} 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default FilterBar