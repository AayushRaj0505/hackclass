const TodoModel = require('../models/todoModel');

class TodoService {
  /**
   * Create a new todo for the authenticated user
   */
  static async createTodo(userId, { title, description }) {
    if (!title || !title.trim()) {
      const error = new Error('Todo title is required');
      error.statusCode = 400;
      throw error;
    }

    return await TodoModel.create({
      userId,
      title,
      description
    });
  }

  /**
   * Get all todos belonging to the authenticated user
   */
  static async getUserTodos(userId) {
    return await TodoModel.findAllByUserId(userId);
  }

  /**
   * Get a single todo by ID for the authenticated user
   */
  static async getTodoById(userId, todoId) {
    const todo = await TodoModel.findByIdAndUserId(todoId, userId);
    if (!todo) {
      const error = new Error('Todo not found');
      error.statusCode = 404;
      throw error;
    }
    return todo;
  }

  /**
   * Update a todo for the authenticated user
   */
  static async updateTodo(userId, todoId, { title, description, completed }) {
    // 1. Verify existence & ownership
    const existingTodo = await TodoModel.findByIdAndUserId(todoId, userId);
    if (!existingTodo) {
      const error = new Error('Todo not found or unauthorized');
      error.statusCode = 404;
      throw error;
    }

    const updates = {};

    if (title !== undefined) {
      if (!title.trim()) {
        const error = new Error('Todo title cannot be empty');
        error.statusCode = 400;
        throw error;
      }
      updates.title = title.trim();
    }

    if (description !== undefined) {
      updates.description = description ? description.trim() : '';
    }

    if (completed !== undefined) {
      if (typeof completed !== 'boolean') {
        const error = new Error('Completed must be a boolean value');
        error.statusCode = 400;
        throw error;
      }
      updates.completed = completed;
    }

    if (Object.keys(updates).length === 0) {
      return existingTodo;
    }

    return await TodoModel.update(todoId, userId, updates);
  }

  /**
   * Delete a todo for the authenticated user
   */
  static async deleteTodo(userId, todoId) {
    // Verify existence & ownership
    const existingTodo = await TodoModel.findByIdAndUserId(todoId, userId);
    if (!existingTodo) {
      const error = new Error('Todo not found or unauthorized');
      error.statusCode = 404;
      throw error;
    }

    return await TodoModel.delete(todoId, userId);
  }
}

module.exports = TodoService;
