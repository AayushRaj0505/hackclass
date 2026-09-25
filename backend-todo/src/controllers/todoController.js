const TodoService = require('../services/todoService');
const { sendSuccess } = require('../utils/response');

class TodoController {
  /**
   * POST /api/todos
   */
  static async createTodo(req, res, next) {
    try {
      const userId = req.user.id;
      const { title, description } = req.body;
      const todo = await TodoService.createTodo(userId, { title, description });
      return sendSuccess(res, 201, 'Todo created successfully', todo);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/todos
   */
  static async getTodos(req, res, next) {
    try {
      const userId = req.user.id;
      const todos = await TodoService.getUserTodos(userId);
      return sendSuccess(res, 200, 'Todos fetched successfully', todos);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/todos/:id
   */
  static async getTodoById(req, res, next) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const todo = await TodoService.getTodoById(userId, id);
      return sendSuccess(res, 200, 'Todo fetched successfully', todo);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/todos/:id
   */
  static async updateTodo(req, res, next) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const { title, description, completed } = req.body;
      const updatedTodo = await TodoService.updateTodo(userId, id, { title, description, completed });
      return sendSuccess(res, 200, 'Todo updated successfully', updatedTodo);
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/todos/:id
   */
  static async deleteTodo(req, res, next) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const deletedTodo = await TodoService.deleteTodo(userId, id);
      return sendSuccess(res, 200, 'Todo deleted successfully', deletedTodo);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = TodoController;
