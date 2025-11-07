import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import TaskCard from '@/components/organisms/TaskCard';
import TaskForm from '@/components/organisms/TaskForm';
import FilterBar from '@/components/organisms/FilterBar';
import Empty from '@/components/ui/Empty';
import Loading from '@/components/ui/Loading';
import { taskService } from '@/services/api/taskService';
import { categoryService } from '@/services/api/categoryService';
import { useAuth } from '@/layouts/Root';

const TaskList = () => {
  const { logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('created');
  const [showCompleted, setShowCompleted] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [tasksData, categoriesData] = await Promise.all([
        taskService.getAll(),
        categoryService.getAll()
      ]);
      
      if (tasksData) setTasks(tasksData);
      if (categoriesData) setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const filteredTasks = tasks.filter(task => {
    // Category filter
    if (activeCategory !== 'all' && task.category_c !== activeCategory) {
      return false;
    }
    
    // Completion filter
    if (!showCompleted && task.completed_c) {
      return false;
    }
    
    // Search filter
    if (searchQuery && !task.title_c.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !task.description_c?.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return (priorityOrder[b.priority_c] || 0) - (priorityOrder[a.priority_c] || 0);
      case 'dueDate':
        if (!a.due_date_c && !b.due_date_c) return 0;
        if (!a.due_date_c) return 1;
        if (!b.due_date_c) return -1;
        return new Date(a.due_date_c) - new Date(b.due_date_c);
      case 'created':
      default:
        return new Date(b.created_date_c || 0) - new Date(a.created_date_c || 0);
    }
  });

  const handleToggleComplete = async (taskId) => {
    try {
      const task = tasks.find(t => t.Id === taskId);
      if (!task) return;

      const updatedTask = await taskService.update(taskId, {
        completed_c: !task.completed_c
      });

      if (updatedTask) {
        setTasks(prev => prev.map(t => t.Id === taskId ? updatedTask : t));
        toast.success(task.completed_c ? 'Task marked as incomplete' : 'Task completed!');
      }
    } catch (error) {
      console.error('Error toggling task completion:', error);
      toast.error('Failed to update task');
    }
  };

  const handleEditTask = (task) => {
    setEditTask(task);
    setIsFormOpen(true);
  };

  const handleDeleteTask = (task) => {
    setTaskToDelete(task);
  };

  const confirmDelete = async () => {
    if (!taskToDelete) return;

    try {
      await taskService.delete(taskToDelete.Id);
      setTasks(prev => prev.filter(t => t.Id !== taskToDelete.Id));
      toast.success('Task deleted successfully');
      setTaskToDelete(null);
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    }
  };

  const handleTaskCreated = (newTask) => {
    setTasks(prev => [newTask, ...prev]);
    loadData(); // Refresh to get updated data
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditTask(null);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Flow Tasks
          </h1>
          <p className="text-slate-600 mt-1">
            {tasks.length === 0 ? "No tasks yet" : `${tasks.filter(t => !t.completed_c).length} pending, ${tasks.filter(t => t.completed_c).length} completed`}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Logout Button */}
          <button
            onClick={logout}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
          >
            <ApperIcon name="LogOut" size={16} />
            Logout
          </button>
        
          <Button
            onClick={() => setIsFormOpen(true)}
            className="fab shadow-lg"
          >
            <ApperIcon name="Plus" size={20} />
            <span className="hidden sm:inline ml-2">Add Task</span>
          </Button>
        </div>
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
  );
};

export default TaskList;