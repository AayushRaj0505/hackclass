import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import ErrorMessage from './ErrorMessage';

const TodoForm = ({ onAddTodo, submitting }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Please enter a title for your task');
      return;
    }

    try {
      await onAddTodo(title, description);
      setTitle('');
      setDescription('');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to create task');
    }
  };

  return (
    <div className="todo-card-container">
      <h2 className="card-title">
        <PlusCircle size={20} color="var(--primary)" />
        Add New Task
      </h2>

      <ErrorMessage message={error} />

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="todo-title">Task Title *</label>
          <input
            id="todo-title"
            type="text"
            className="input-control"
            placeholder="e.g. Learn Express MVC Architecture"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={submitting}
          />
        </div>

        <div className="form-group">
          <label htmlFor="todo-desc">Description (Optional)</label>
          <textarea
            id="todo-desc"
            className="input-control"
            placeholder="Add additional details or notes..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={submitting}
          />
        </div>

        <button type="submit" className="btn-primary" disabled={submitting}>
          <PlusCircle size={18} />
          <span>{submitting ? 'Adding Task...' : 'Add Task'}</span>
        </button>
      </form>
    </div>
  );
};

export default TodoForm;
