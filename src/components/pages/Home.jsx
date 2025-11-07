import React from "react";
import { useSelector } from "react-redux";
import { useAuth } from "@/layouts/Root";
import ApperIcon from "@/components/ApperIcon";
import TaskList from "@/components/organisms/TaskList";

const Home = () => {
  const { user } = useSelector(state => state.user)
  const { logout } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="flex justify-between items-center p-4 bg-white/80 backdrop-blur-sm border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-r from-primary to-secondary text-white text-lg font-bold">
            F
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Flow Tasks</h1>
            {user && (
              <p className="text-sm text-slate-600">
                Welcome back, {user.firstName || user.emailAddress}
              </p>
            )}
          </div>
        </div>
        
        <button
          onClick={logout}
          className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
        >
          <ApperIcon name="LogOut" size={16} />
          Logout
        </button>
      </div>
      
      <TaskList />
    </div>
  )
}

export default Home