import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

class CategoryService {
  constructor() {
    this.tableName = 'category_c';
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
          {"field": {"Name": "name_c"}}, 
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "task_count_c"}}
        ]
      };
      
      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      // Transform data to match UI expectations
      const categories = response.data?.map(category => ({
        Id: category.Id,
        name: category.name_c || category.Name,
        color: category.color_c,
        taskCount: category.task_count_c || 0
      })) || [];
      
      return categories;
    } catch (error) {
      console.error("Error fetching categories:", error?.response?.data?.message || error);
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
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "task_count_c"}}
        ]
      };
      
      const response = await apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success || !response.data) {
        return null;
      }
      
      // Transform data to match UI expectations
      const category = {
        Id: response.data.Id,
        name: response.data.name_c || response.data.Name,
        color: response.data.color_c,
        taskCount: response.data.task_count_c || 0
      };
      
      return category;
    } catch (error) {
      console.error(`Error fetching category ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async create(categoryData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return null;
      }

      const params = {
        records: [{
          Name: categoryData.name,
          name_c: categoryData.name,
          color_c: categoryData.color,
          task_count_c: 0
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
          console.error(`Failed to create ${failed.length} categories:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const createdCategory = successful[0].data;
          return {
            Id: createdCategory.Id,
            name: createdCategory.name_c || createdCategory.Name,
            color: createdCategory.color_c,
            taskCount: createdCategory.task_count_c || 0
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error creating category:", error?.response?.data?.message || error);
      return null;
    }
  }

  async update(id, categoryData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return null;
      }

      const params = {
        records: [{
          Id: parseInt(id),
          Name: categoryData.name,
          name_c: categoryData.name,
          color_c: categoryData.color,
          ...(categoryData.taskCount !== undefined && { task_count_c: categoryData.taskCount })
        }]
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
          console.error(`Failed to update ${failed.length} categories:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const updatedCategory = successful[0].data;
          return {
            Id: updatedCategory.Id,
            name: updatedCategory.name_c || updatedCategory.Name,
            color: updatedCategory.color_c,
            taskCount: updatedCategory.task_count_c || 0
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error updating category:", error?.response?.data?.message || error);
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
          console.error(`Failed to delete ${failed.length} categories:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0;
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting category:", error?.response?.data?.message || error);
      return false;
    }
  }

  async updateTaskCount(categoryName, increment = true) {
    try {
      // First find the category by name
      const categories = await this.getAll();
      const category = categories.find(cat => cat.name === categoryName);
      
      if (!category) {
        return null;
      }
      
      const newCount = Math.max(0, (category.taskCount || 0) + (increment ? 1 : -1));
      const updatedCategory = await this.update(category.Id, {
        name: category.name,
        color: category.color,
        taskCount: newCount
      });
      
      return updatedCategory;
    } catch (error) {
      console.error("Error updating task count:", error?.response?.data?.message || error);
      return null;
    }
  }
}

export const categoryService = new CategoryService();