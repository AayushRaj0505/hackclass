import React from 'react';
import TodoItem from './TodoItem';
import { ClipboardList } from 'lucide-react';

const TodoList = ({ todos, onToggleComplete, onEdit, onDelete, activeFilter }) => {
  if (todos.length === 0) {
    return (
      <div className="empty-state">
        <ClipboardList size={48} className="empty-icon" />
        <h3>No tasks found</h3>
        <p>
          {activeFilter === 'all'
            ? "You don't have any tasks yet. Create one above!"
            : activeFilter === 'active'
            ? 'No pending active tasks!'
            : 'No completed tasks yet!'}
        </p>
      </div>
    );
  }

  return (
    <div className="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggleComplete={onToggleComplete}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default TodoList;
