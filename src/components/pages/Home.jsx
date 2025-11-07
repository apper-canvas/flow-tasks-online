import React from "react"
import TaskList from "@/components/organisms/TaskList"

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <TaskList />
    </div>
  )
}

export default Home