import api from './api';

class TodoService {
  static async getTodos() {
    const response = await api.get('/todos');
    return response.data;
  }

  static async getTodoById(id) {
    const response = await api.get(`/todos/${id}`);
    return response.data;
  }

  static async createTodo(title, description = '') {
    const response = await api.post('/todos', { title, description });
    return response.data;
  }

  static async updateTodo(id, updates) {
    const response = await api.put(`/todos/${id}`, updates);
    return response.data;
  }

  static async deleteTodo(id) {
    const response = await api.delete(`/todos/${id}`);
    return response.data;
  }
}

export default TodoService;
