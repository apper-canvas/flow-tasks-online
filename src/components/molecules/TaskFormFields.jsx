import React from "react"
import Input from "@/components/atoms/Input"
import Textarea from "@/components/atoms/Textarea"
import Select from "@/components/atoms/Select"

const TaskFormFields = ({ formData, onChange, categories }) => {
  const handleInputChange = (field, value) => {
    onChange({
      ...formData,
      [field]: value
    })
  }

  return (
    <div className="space-y-6">
      <Input
        label="Task Title"
        placeholder="Enter task title..."
        value={formData.title}
        onChange={(e) => handleInputChange("title", e.target.value)}
        required
      />

      <Textarea
        label="Description"
        placeholder="Add task description..."
        value={formData.description}
        onChange={(e) => handleInputChange("description", e.target.value)}
        rows={3}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Priority"
          value={formData.priority}
          onChange={(e) => handleInputChange("priority", e.target.value)}
        >
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </Select>

        <Select
          label="Category"
          value={formData.category}
          onChange={(e) => handleInputChange("category", e.target.value)}
        >
          <option value="">Select category...</option>
          {categories.map(category => (
            <option key={category.Id} value={category.name}>
              {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
            </option>
          ))}
        </Select>
      </div>

      <Input
        label="Due Date"
        type="date"
        value={formData.dueDate}
        onChange={(e) => handleInputChange("dueDate", e.target.value)}
      />
    </div>
  )
}

export default TaskFormFields