import React, { useState } from "react"
import { motion } from "framer-motion"
import { format, parseISO, isPast, isToday } from "date-fns"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"
import PriorityBadge from "@/components/molecules/PriorityBadge"
import CategoryPill from "@/components/molecules/CategoryPill"
import Checkbox from "@/components/atoms/Checkbox"

const TaskCard = ({ 
  task, 
  onToggleComplete, 
  onEdit, 
  onDelete,
  categories = []
}) => {
  const [showConfetti, setShowConfetti] = useState(false)
  
  const handleToggleComplete = async () => {
    if (!task.completed) {
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 500)
    }
    onToggleComplete(task.Id, !task.completed)
  }

  const getDueDateDisplay = () => {
    if (!task.dueDate) return null
    
    const dueDate = parseISO(task.dueDate)
    const isOverdue = isPast(dueDate) && !task.completed
    const isDueToday = isToday(dueDate)
    
    return {
      text: format(dueDate, "MMM d"),
      isOverdue,
      isDueToday
    }
  }

  const dueDateInfo = getDueDateDisplay()
  const categoryInfo = categories.find(cat => cat.name === task.category)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "task-card bg-white rounded-lg shadow-card hover:shadow-card-hover p-6 space-y-4",
        "border border-transparent hover:border-primary/20",
        "transition-all duration-200",
        task.completed && "opacity-75"
      )}
    >
      {showConfetti && (
        <div className="completion-confetti"></div>
      )}
      
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <Checkbox
            checked={task.completed}
            onChange={handleToggleComplete}
          />
          
          <div className="flex-1 min-w-0">
            <h3 className={cn(
              "font-semibold text-slate-900 leading-tight",
              task.completed && "line-through text-slate-500"
            )}>
              {task.title}
            </h3>
            {task.description && (
              <p className={cn(
                "text-sm text-slate-600 mt-1 line-clamp-2",
                task.completed && "text-slate-400"
              )}>
                {task.description}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 ml-4">
          <PriorityBadge priority={task.priority} />
          
          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(task)}
              className="p-1.5 rounded-md text-slate-400 hover:text-primary hover:bg-primary/5 transition-colors duration-200"
            >
              <ApperIcon name="Edit2" size={14} />
            </button>
            <button
              onClick={() => onDelete(task.Id)}
              className="p-1.5 rounded-md text-slate-400 hover:text-error hover:bg-error/5 transition-colors duration-200"
            >
              <ApperIcon name="Trash2" size={14} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <div className="flex items-center gap-3">
          {categoryInfo && (
            <CategoryPill
              category={task.category}
              color={categoryInfo.color}
              active={false}
            />
          )}
          
          {dueDateInfo && (
            <div className={cn(
              "flex items-center gap-1 text-xs",
              dueDateInfo.isOverdue && !task.completed && "text-error",
              dueDateInfo.isDueToday && !task.completed && "text-warning",
              !dueDateInfo.isOverdue && !dueDateInfo.isDueToday && "text-slate-500"
            )}>
              <ApperIcon name="Calendar" size={12} />
              <span>{dueDateInfo.text}</span>
            </div>
          )}
        </div>

        {task.completed && task.completedAt && (
          <div className="flex items-center gap-1 text-xs text-success">
            <ApperIcon name="CheckCircle" size={12} />
            <span>Completed</span>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default TaskCard