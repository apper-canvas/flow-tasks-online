import categoriesData from "@/services/mockData/categories.json";

class CategoryService {
  constructor() {
    this.initializeData();
  }

  initializeData() {
    if (!localStorage.getItem("categories")) {
      localStorage.setItem("categories", JSON.stringify(categoriesData));
    }
  }

  async delay(ms = 200) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll() {
    await this.delay();
    const categories = JSON.parse(localStorage.getItem("categories")) || [];
    return [...categories];
  }

  async getById(id) {
    await this.delay(150);
    const categories = JSON.parse(localStorage.getItem("categories")) || [];
    return categories.find(category => category.Id === parseInt(id));
  }

  async create(categoryData) {
    await this.delay(200);
    const categories = JSON.parse(localStorage.getItem("categories")) || [];
    const maxId = categories.length > 0 ? Math.max(...categories.map(cat => cat.Id)) : 0;
    
    const newCategory = {
      Id: maxId + 1,
      ...categoryData,
      taskCount: 0
    };
    
    categories.push(newCategory);
    localStorage.setItem("categories", JSON.stringify(categories));
    return { ...newCategory };
  }

  async update(id, categoryData) {
    await this.delay(150);
    const categories = JSON.parse(localStorage.getItem("categories")) || [];
    const index = categories.findIndex(category => category.Id === parseInt(id));
    
    if (index === -1) {
      throw new Error("Category not found");
    }
    
    const updatedCategory = {
      ...categories[index],
      ...categoryData
    };
    
    categories[index] = updatedCategory;
    localStorage.setItem("categories", JSON.stringify(categories));
    return { ...updatedCategory };
  }

  async delete(id) {
    await this.delay(150);
    const categories = JSON.parse(localStorage.getItem("categories")) || [];
    const filteredCategories = categories.filter(category => category.Id !== parseInt(id));
    localStorage.setItem("categories", JSON.stringify(filteredCategories));
    return true;
  }

  async updateTaskCount(categoryName, increment = true) {
    await this.delay(100);
    const categories = JSON.parse(localStorage.getItem("categories")) || [];
    const category = categories.find(cat => cat.name === categoryName);
    
    if (category) {
      category.taskCount += increment ? 1 : -1;
      if (category.taskCount < 0) category.taskCount = 0;
      localStorage.setItem("categories", JSON.stringify(categories));
    }
    
    return category;
  }
}

export const categoryService = new CategoryService();