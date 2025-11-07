import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

class TaskService {
  constructor() {
    this.tableName = 'task_c';
  }

  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return [];
      }

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "completed_at_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "CreatedOn"}}
        ]
      };
      
      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      // Transform data to match UI expectations
      const tasks = response.data?.map(task => ({
        Id: task.Id,
        title: task.title_c || task.Name,
        description: task.description_c || '',
        category: task.category_c || '',
        priority: task.priority_c || 'medium',
        dueDate: task.due_date_c || null,
        completed: task.completed_c || false,
        completedAt: task.completed_at_c || null,
        createdAt: task.created_at_c || task.CreatedOn
      })) || [];
      
      return tasks;
    } catch (error) {
      console.error("Error fetching tasks:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return null;
      }

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "completed_at_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "CreatedOn"}}
        ]
      };
      
      const response = await apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success || !response.data) {
        return null;
      }
      
      // Transform data to match UI expectations
      const task = {
        Id: response.data.Id,
        title: response.data.title_c || response.data.Name,
        description: response.data.description_c || '',
        category: response.data.category_c || '',
        priority: response.data.priority_c || 'medium',
        dueDate: response.data.due_date_c || null,
        completed: response.data.completed_c || false,
        completedAt: response.data.completed_at_c || null,
        createdAt: response.data.created_at_c || response.data.CreatedOn
      };
      
      return task;
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async create(taskData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return null;
      }

      const params = {
        records: [{
          Name: taskData.title,
          title_c: taskData.title,
          description_c: taskData.description || '',
          category_c: taskData.category || '',
          priority_c: taskData.priority || 'medium',
          due_date_c: taskData.dueDate || null,
          completed_c: false,
          completed_at_c: null,
          created_at_c: new Date().toISOString()
        }]
      };
      
      const response = await apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} tasks:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const createdTask = successful[0].data;
          return {
            Id: createdTask.Id,
            title: createdTask.title_c || createdTask.Name,
            description: createdTask.description_c || '',
            category: createdTask.category_c || '',
            priority: createdTask.priority_c || 'medium',
            dueDate: createdTask.due_date_c || null,
            completed: createdTask.completed_c || false,
            completedAt: createdTask.completed_at_c || null,
            createdAt: createdTask.created_at_c || createdTask.CreatedOn
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error creating task:", error?.response?.data?.message || error);
      return null;
    }
  }

  async update(id, taskData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return null;
      }

      const updateData = {
        Id: parseInt(id)
      };

      // Only include fields that are being updated
      if (taskData.title !== undefined) {
        updateData.Name = taskData.title;
        updateData.title_c = taskData.title;
      }
      if (taskData.description !== undefined) {
        updateData.description_c = taskData.description;
      }
      if (taskData.category !== undefined) {
        updateData.category_c = taskData.category;
      }
      if (taskData.priority !== undefined) {
        updateData.priority_c = taskData.priority;
      }
      if (taskData.dueDate !== undefined) {
        updateData.due_date_c = taskData.dueDate;
      }
      if (taskData.completed !== undefined) {
        updateData.completed_c = taskData.completed;
        updateData.completed_at_c = taskData.completed ? new Date().toISOString() : null;
      }

      const params = {
        records: [updateData]
      };
      
      const response = await apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} tasks:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const updatedTask = successful[0].data;
          return {
            Id: updatedTask.Id,
            title: updatedTask.title_c || updatedTask.Name,
            description: updatedTask.description_c || '',
            category: updatedTask.category_c || '',
            priority: updatedTask.priority_c || 'medium',
            dueDate: updatedTask.due_date_c || null,
            completed: updatedTask.completed_c || false,
            completedAt: updatedTask.completed_at_c || null,
            createdAt: updatedTask.created_at_c || updatedTask.CreatedOn
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error updating task:", error?.response?.data?.message || error);
      return null;
    }
  }

  async delete(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return false;
      }

      const params = { 
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} tasks:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0;
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting task:", error?.response?.data?.message || error);
      return false;
    }
  }

  async getByCategory(category) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return [];
      }

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "completed_at_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        where: [{
          "FieldName": "category_c",
          "Operator": "EqualTo",
          "Values": [category]
        }]
      };
      
      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      // Transform data to match UI expectations
      const tasks = response.data?.map(task => ({
        Id: task.Id,
        title: task.title_c || task.Name,
        description: task.description_c || '',
        category: task.category_c || '',
        priority: task.priority_c || 'medium',
        dueDate: task.due_date_c || null,
        completed: task.completed_c || false,
        completedAt: task.completed_at_c || null,
        createdAt: task.created_at_c || task.CreatedOn
      })) || [];
      
      return tasks;
    } catch (error) {
      console.error("Error fetching tasks by category:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getByPriority(priority) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return [];
      }

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "completed_at_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        where: [{
          "FieldName": "priority_c",
          "Operator": "EqualTo",
          "Values": [priority]
        }]
      };
      
      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      // Transform data to match UI expectations
      const tasks = response.data?.map(task => ({
        Id: task.Id,
        title: task.title_c || task.Name,
        description: task.description_c || '',
        category: task.category_c || '',
        priority: task.priority_c || 'medium',
        dueDate: task.due_date_c || null,
        completed: task.completed_c || false,
        completedAt: task.completed_at_c || null,
        createdAt: task.created_at_c || task.CreatedOn
      })) || [];
      
      return tasks;
    } catch (error) {
      console.error("Error fetching tasks by priority:", error?.response?.data?.message || error);
      return [];
    }
  }

  async search(query) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return [];
      }

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "completed_at_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        whereGroups: [{
          "operator": "OR",
          "subGroups": [
            {
              "conditions": [
                {
                  "fieldName": "title_c",
                  "operator": "Contains",
                  "values": [query]
                }
              ],
              "operator": "OR"
            },
            {
              "conditions": [
                {
                  "fieldName": "description_c", 
                  "operator": "Contains",
                  "values": [query]
                }
              ],
              "operator": "OR"
            }
          ]
        }]
      };
      
      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      // Transform data to match UI expectations
      const tasks = response.data?.map(task => ({
        Id: task.Id,
        title: task.title_c || task.Name,
        description: task.description_c || '',
        category: task.category_c || '',
        priority: task.priority_c || 'medium',
        dueDate: task.due_date_c || null,
        completed: task.completed_c || false,
        completedAt: task.completed_at_c || null,
        createdAt: task.created_at_c || task.CreatedOn
      })) || [];
      
      return tasks;
    } catch (error) {
      console.error("Error searching tasks:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getCompleted() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return [];
      }

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "completed_at_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        where: [{
          "FieldName": "completed_c",
          "Operator": "EqualTo",
          "Values": [true]
        }]
      };
      
      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      // Transform data to match UI expectations
      const tasks = response.data?.map(task => ({
        Id: task.Id,
        title: task.title_c || task.Name,
        description: task.description_c || '',
        category: task.category_c || '',
        priority: task.priority_c || 'medium',
        dueDate: task.due_date_c || null,
        completed: task.completed_c || false,
        completedAt: task.completed_at_c || null,
        createdAt: task.created_at_c || task.CreatedOn
      })) || [];
      
      return tasks;
    } catch (error) {
      console.error("Error fetching completed tasks:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getPending() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return [];
      }

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "completed_at_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        where: [{
          "FieldName": "completed_c",
          "Operator": "EqualTo", 
          "Values": [false]
        }]
      };
      
      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      // Transform data to match UI expectations
      const tasks = response.data?.map(task => ({
        Id: task.Id,
        title: task.title_c || task.Name,
        description: task.description_c || '',
        category: task.category_c || '',
        priority: task.priority_c || 'medium',
        dueDate: task.due_date_c || null,
        completed: task.completed_c || false,
        completedAt: task.completed_at_c || null,
        createdAt: task.created_at_c || task.CreatedOn
      })) || [];
      
      return tasks;
    } catch (error) {
      console.error("Error fetching pending tasks:", error?.response?.data?.message || error);
      return [];
    }
  }
}

export const taskService = new TaskService();