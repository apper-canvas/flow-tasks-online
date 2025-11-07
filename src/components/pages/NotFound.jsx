import React from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-md space-y-8"
      >
        <div className="space-y-4">
          <div className="mx-auto w-24 h-24 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center">
            <ApperIcon name="SearchX" className="w-12 h-12 text-primary" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              404
            </h1>
            <h2 className="text-2xl font-semibold text-slate-900">
              Page Not Found
            </h2>
            <p className="text-slate-600 leading-relaxed">
              The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <Link to="/">
            <Button className="w-full">
              <ApperIcon name="Home" size={18} className="mr-2" />
              Back to Tasks
            </Button>
          </Link>
          
          <div className="text-sm text-slate-500">
            <p>Need help? Try searching for your tasks or creating a new one.</p>
          </div>
        </div>

        <motion.div 
          className="pt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-center space-x-4 text-slate-400">
            <div className="w-16 h-1 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full"></div>
            <ApperIcon name="CheckSquare" className="w-5 h-5" />
            <div className="w-16 h-1 bg-gradient-to-r from-secondary/20 to-accent/20 rounded-full"></div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default NotFound