import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "react-toastify"
import TaskCard from "@/components/organisms/TaskCard"
import FilterBar from "@/components/organisms/FilterBar"
import TaskForm from "@/components/organisms/TaskForm"
import Loading from "@/components/ui/Loading"
import ErrorView from "@/components/ui/ErrorView"
import Empty from "@/components/ui/Empty"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"
import { taskService } from "@/services/api/taskService"
import { categoryService } from "@/services/api/categoryService"

const TaskList = () => {
  const [tasks, setTasks] = useState([])
  const [categories, setCategories] = useState([])
  const [filteredTasks, setFilteredTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [sortBy, setSortBy] = useState("dueDate")
  const [showCompleted, setShowCompleted] = useState(true)
  
  // Form states
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editTask, setEditTask] = useState(null)
  const [taskToDelete, setTaskToDelete] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    filterAndSortTasks()
  }, [tasks, searchQuery, activeCategory, sortBy, showCompleted])

  const loadData = async () => {
    try {
      setLoading(true)
      setError("")
      
      const [tasksData, categoriesData] = await Promise.all([
        taskService.getAll(),
        categoryService.getAll()
      ])
      
      setTasks(tasksData)
      setCategories(categoriesData)
    } catch (err) {
      console.error("Error loading data:", err)
      setError("Failed to load tasks. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortTasks = () => {
    let filtered = [...tasks]

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query)
      )
    }

    // Filter by category
    if (activeCategory !== "all") {
      filtered = filtered.filter(task => task.category === activeCategory)
    }

    // Filter by completion status
    if (!showCompleted) {
      filtered = filtered.filter(task => !task.completed)
    }

    // Sort tasks
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "priority": {
          const priorityOrder = { high: 3, medium: 2, low: 1 }
          return priorityOrder[b.priority] - priorityOrder[a.priority]
        }
        case "created":
          return new Date(b.createdAt) - new Date(a.createdAt)
        case "alphabetical":
          return a.title.localeCompare(b.title)
        case "dueDate":
        default: {
          if (!a.dueDate && !b.dueDate) return 0
          if (!a.dueDate) return 1
          if (!b.dueDate) return -1
          return new Date(a.dueDate) - new Date(b.dueDate)
        }
      }
    })

    setFilteredTasks(filtered)
  }

  const handleTaskCreated = () => {
    loadData()
    setEditTask(null)
  }

  const handleToggleComplete = async (taskId, completed) => {
    try {
      await taskService.update(taskId, { completed })
      
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.Id === taskId ? { ...task, completed } : task
        )
      )
      
      if (completed) {
        toast.success("Task completed! 🎉")
      }
    } catch (error) {
      console.error("Error updating task:", error)
      toast.error("Failed to update task")
    }
  }

  const handleEditTask = (task) => {
    setEditTask(task)
    setIsFormOpen(true)
  }

  const handleDeleteTask = (taskId) => {
    setTaskToDelete(taskId)
  }

  const confirmDelete = async () => {
    if (!taskToDelete) return

    try {
      await taskService.delete(taskToDelete)
      
      setTasks(prevTasks => 
        prevTasks.filter(task => task.Id !== taskToDelete)
      )
      
      toast.success("Task deleted successfully")
    } catch (error) {
      console.error("Error deleting task:", error)
      toast.error("Failed to delete task")
    } finally {
      setTaskToDelete(null)
    }
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setEditTask(null)
  }

  if (loading) {
    return <Loading variant="skeleton" />
  }

  if (error) {
    return (
      <ErrorView
        error={error}
        onRetry={loadData}
        title="Unable to load tasks"
        description="There was a problem loading your tasks. Please check your connection and try again."
      />
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Flow Tasks
          </h1>
          <p className="text-slate-600 mt-1">
            {tasks.length === 0 ? "No tasks yet" : `${tasks.filter(t => !t.completed).length} pending, ${tasks.filter(t => t.completed).length} completed`}
          </p>
        </div>
        
        <Button
          onClick={() => setIsFormOpen(true)}
          className="fab shadow-lg"
        >
          <ApperIcon name="Plus" size={20} />
          <span className="hidden sm:inline ml-2">Add Task</span>
        </Button>
      </div>

      <FilterBar
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
        showCompleted={showCompleted}
        onToggleCompleted={() => setShowCompleted(!showCompleted)}
      />

      <div className="min-h-96">
        {filteredTasks.length === 0 ? (
          <Empty
            title={tasks.length === 0 ? "No tasks yet" : "No tasks match your filters"}
            description={tasks.length === 0 
              ? "Get started by creating your first task to stay organized and productive"
              : "Try adjusting your search or filters to find what you're looking for"
            }
            onAction={tasks.length === 0 ? () => setIsFormOpen(true) : undefined}
            actionText="Create your first task"
            icon={tasks.length === 0 ? "CheckSquare" : "Filter"}
          />
        ) : (
          <motion.div 
            layout
            className="grid gap-4"
          >
            <AnimatePresence mode="popLayout">
              {filteredTasks.map(task => (
                <TaskCard
                  key={task.Id}
                  task={task}
                  categories={categories}
                  onToggleComplete={handleToggleComplete}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      <TaskForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onTaskCreated={handleTaskCreated}
        editTask={editTask}
        categories={categories}
      />

      {taskToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-card-lifted p-6 max-w-sm w-full"
          >
            <div className="text-center space-y-4">
              <div className="mx-auto w-12 h-12 bg-gradient-to-br from-red-100 to-red-50 rounded-full flex items-center justify-center">
                <ApperIcon name="Trash2" className="w-6 h-6 text-error" />
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Delete Task
                </h3>
                <p className="text-slate-600 text-sm">
                  Are you sure you want to delete this task? This action cannot be undone.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  variant="secondary"
                  onClick={() => setTaskToDelete(null)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  onClick={confirmDelete}
                  className="flex-1"
                >
                  Delete
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default TaskList