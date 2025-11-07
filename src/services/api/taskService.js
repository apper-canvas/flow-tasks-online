import tasksData from "@/services/mockData/tasks.json";

class TaskService {
  constructor() {
    this.initializeData();
  }

  initializeData() {
    if (!localStorage.getItem("tasks")) {
      localStorage.setItem("tasks", JSON.stringify(tasksData));
    }
  }

  async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll() {
    await this.delay();
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    return [...tasks];
  }

  async getById(id) {
    await this.delay(200);
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    return tasks.find(task => task.Id === parseInt(id));
  }

  async create(taskData) {
    await this.delay(250);
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const maxId = tasks.length > 0 ? Math.max(...tasks.map(task => task.Id)) : 0;
    
    const newTask = {
      Id: maxId + 1,
      ...taskData,
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null
    };
    
    tasks.push(newTask);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    return { ...newTask };
  }

  async update(id, taskData) {
    await this.delay(200);
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const index = tasks.findIndex(task => task.Id === parseInt(id));
    
    if (index === -1) {
      throw new Error("Task not found");
    }
    
    const updatedTask = {
      ...tasks[index],
      ...taskData
    };

    if (taskData.completed !== undefined && taskData.completed !== tasks[index].completed) {
      updatedTask.completedAt = taskData.completed ? new Date().toISOString() : null;
    }
    
    tasks[index] = updatedTask;
    localStorage.setItem("tasks", JSON.stringify(tasks));
    return { ...updatedTask };
  }

  async delete(id) {
    await this.delay(200);
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const filteredTasks = tasks.filter(task => task.Id !== parseInt(id));
    localStorage.setItem("tasks", JSON.stringify(filteredTasks));
    return true;
  }

  async getByCategory(category) {
    await this.delay();
    const tasks = await this.getAll();
    return tasks.filter(task => task.category === category);
  }

  async getByPriority(priority) {
    await this.delay();
    const tasks = await this.getAll();
    return tasks.filter(task => task.priority === priority);
  }

  async search(query) {
    await this.delay(150);
    const tasks = await this.getAll();
    const lowercaseQuery = query.toLowerCase();
    return tasks.filter(task => 
      task.title.toLowerCase().includes(lowercaseQuery) ||
      task.description.toLowerCase().includes(lowercaseQuery)
    );
  }

  async getCompleted() {
    await this.delay();
    const tasks = await this.getAll();
    return tasks.filter(task => task.completed);
  }

  async getPending() {
    await this.delay();
    const tasks = await this.getAll();
    return tasks.filter(task => !task.completed);
  }
}

export const taskService = new TaskService();