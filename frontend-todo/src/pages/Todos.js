import React, { useState, useEffect } from 'react';
import TodoService from '../services/todoService';
import TodoForm from '../components/TodoForm';
import TodoList from '../components/TodoList';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import Modal from '../components/Modal';
import { useAuth } from '../hooks/useAuth';

const Todos = () => {
  const { user } = useAuth();
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  // Modal State for Editing
  const [editingTodo, setEditingTodo] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editCompleted, setEditCompleted] = useState(false);
  const [editError, setEditError] = useState('');

  const fetchTodos = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await TodoService.getTodos();
      if (res.success) {
        setTodos(res.data || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleAddTodo = async (title, description) => {
    try {
      setSubmitting(true);
      const res = await TodoService.createTodo(title, description);
      if (res.success && res.data) {
        setTodos((prev) => [res.data, ...prev]);
      }
    } catch (err) {
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleComplete = async (id, completedStatus) => {
    try {
      // Optimistic Update
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: completedStatus } : t))
      );
      await TodoService.updateTodo(id, { completed: completedStatus });
    } catch (err) {
      // Revert on error
      fetchTodos();
      setError('Failed to update task status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      setTodos((prev) => prev.filter((t) => t.id !== id));
      await TodoService.deleteTodo(id);
    } catch (err) {
      fetchTodos();
      setError('Failed to delete task');
    }
  };

  const handleOpenEditModal = (todo) => {
    setEditingTodo(todo);
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
    setEditCompleted(todo.completed);
    setEditError('');
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setEditError('');

    if (!editTitle.trim()) {
      setEditError('Task title cannot be empty');
      return;
    }

    try {
      const res = await TodoService.updateTodo(editingTodo.id, {
        title: editTitle,
        description: editDescription,
        completed: editCompleted
      });

      if (res.success && res.data) {
        setTodos((prev) =>
          prev.map((t) => (t.id === editingTodo.id ? res.data : t))
        );
        setEditingTodo(null);
      }
    } catch (err) {
      setEditError(err.response?.data?.message || err.message || 'Failed to update task');
    }
  };

  // Filter Logic
  const filteredTodos = todos.filter((todo) => {
    if (activeFilter === 'active') return !todo.completed;
    if (activeFilter === 'completed') return todo.completed;
    return true;
  });

  const activeCount = todos.filter((t) => !t.completed).length;
  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <div>
      <div className="dashboard-header">
        <h1 className="dashboard-title">My Task Dashboard</h1>
        <p className="dashboard-subtitle">
          Welcome back, {user?.name}! Keep track of your daily goals and stay organized.
        </p>
      </div>

      <TodoForm onAddTodo={handleAddTodo} submitting={submitting} />

      <ErrorMessage message={error} />

      <div className="filter-container">
        <div className="filter-tabs">
          <button
            className={`tab-btn ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            All ({todos.length})
          </button>
          <button
            className={`tab-btn ${activeFilter === 'active' ? 'active' : ''}`}
            onClick={() => setActiveFilter('active')}
          >
            Active ({activeCount})
          </button>
          <button
            className={`tab-btn ${activeFilter === 'completed' ? 'active' : ''}`}
            onClick={() => setActiveFilter('completed')}
          >
            Completed ({completedCount})
          </button>
        </div>

        <div className="todo-stats">
          {completedCount} of {todos.length} completed
        </div>
      </div>

      {loading ? (
        <Loading message="Fetching your tasks..." />
      ) : (
        <TodoList
          todos={filteredTodos}
          onToggleComplete={handleToggleComplete}
          onEdit={handleOpenEditModal}
          onDelete={handleDelete}
          activeFilter={activeFilter}
        />
      )}

      {/* Edit Todo Modal */}
      <Modal
        isOpen={!!editingTodo}
        onClose={() => setEditingTodo(null)}
        title="Edit Task"
      >
        <ErrorMessage message={editError} />
        <form onSubmit={handleSaveEdit}>
          <div className="form-group">
            <label htmlFor="edit-title">Title *</label>
            <input
              id="edit-title"
              type="text"
              className="input-control"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-desc">Description</label>
            <textarea
              id="edit-desc"
              className="input-control"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
              id="edit-completed"
              type="checkbox"
              className="checkbox-custom"
              checked={editCompleted}
              onChange={(e) => setEditCompleted(e.target.checked)}
            />
            <label htmlFor="edit-completed" style={{ margin: 0, cursor: 'pointer' }}>
              Mark as Completed
            </label>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setEditingTodo(null)}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary" style={{ width: 'auto' }}>
              Save Changes
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Todos;
