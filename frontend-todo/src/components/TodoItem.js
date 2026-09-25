import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';

const TodoItem = ({ todo, onToggleComplete, onEdit, onDelete }) => {
  const formattedDate = new Date(todo.created_at).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <div className="todo-left">
        <input
          type="checkbox"
          className="checkbox-custom"
          checked={todo.completed}
          onChange={() => onToggleComplete(todo.id, !todo.completed)}
        />
        <div className="todo-content">
          <h3 className="todo-title">{todo.title}</h3>
          {todo.description && <p className="todo-desc">{todo.description}</p>}
          <div className="todo-date">Created on {formattedDate}</div>
        </div>
      </div>

      <div className="todo-actions">
        <button
          className="action-btn edit"
          title="Edit Task"
          onClick={() => onEdit(todo)}
        >
          <Edit2 size={16} />
        </button>
        <button
          className="action-btn delete"
          title="Delete Task"
          onClick={() => onDelete(todo.id)}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default TodoItem;
