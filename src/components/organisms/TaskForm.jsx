import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { toast } from "react-toastify"
import Button from "@/components/atoms/Button"
import TaskFormFields from "@/components/molecules/TaskFormFields"
import ApperIcon from "@/components/ApperIcon"
import { taskService } from "@/services/api/taskService"

const TaskForm = ({ isOpen, onClose, onTaskCreated, editTask, categories }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    category: "",
    dueDate: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (editTask) {
      setFormData({
        title: editTask.title || "",
        description: editTask.description || "",
        priority: editTask.priority || "medium",
        category: editTask.category || "",
        dueDate: editTask.dueDate || ""
      })
    } else {
      setFormData({
        title: "",
        description: "",
        priority: "medium",
        category: "",
        dueDate: ""
      })
    }
  }, [editTask, isOpen])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      toast.error("Please enter a task title")
      return
    }

    setIsSubmitting(true)

    try {
      if (editTask) {
        await taskService.update(editTask.Id, formData)
        toast.success("Task updated successfully!")
      } else {
        await taskService.create(formData)
        toast.success("Task created successfully!")
      }
      
      onTaskCreated()
      onClose()
    } catch (error) {
      console.error("Error saving task:", error)
      toast.error("Failed to save task. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setFormData({
      title: "",
      description: "",
      priority: "medium",
      category: "",
      dueDate: ""
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-xl shadow-card-lifted max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-900">
              {editTask ? "Edit Task" : "Create New Task"}
            </h2>
            <button
              onClick={handleClose}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors duration-200"
            >
              <ApperIcon name="X" size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <TaskFormFields
              formData={formData}
              onChange={setFormData}
              categories={categories}
            />

            <div className="flex gap-3 mt-8 pt-6 border-t border-slate-100">
              <Button
                type="button"
                variant="secondary"
                onClick={handleClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !formData.title.trim()}
                className="flex-1"
              >
                {isSubmitting && (
                  <ApperIcon name="Loader2" size={16} className="animate-spin mr-2" />
                )}
                {editTask ? "Update Task" : "Create Task"}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

export default TaskForm