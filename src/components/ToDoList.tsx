import React from 'react';
import './TodoStyles.css';
import type { Task } from '../types/task';

type ToDoListProps = {
  tasks: Task[];
  onToggleCompleted: (id: number) => void;
  onDeleteTask: (id: number) => void;
  newTaskText: string;
  onNewTaskTextChange: (text: string) => void;
  onAddTask: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

const ToDoList: React.FC<ToDoListProps> = ({
  tasks,
  onToggleCompleted,
  onDeleteTask,
  newTaskText,
  onNewTaskTextChange,
  onAddTask,
  onKeyDown,
}) => {
  return (
    <div className="todo-container">
      <h2 className="todo-title">Мой список дел</h2>
      <input
        className="todo-input"
        type="text"
        value={newTaskText}
        onChange={(e) => onNewTaskTextChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Добавьте новую задачу"
      />
      <ul className="todo-list">
        {tasks.map((task) => (
          <li
            key={task.id}
            className={`todo-item ${task.completed ? 'completed' : ''}`}
          >
            {/* Квадратик с галочкой по центру */}
            <div
              className={`checkbox ${task.completed ? 'checked' : ''}`}
              onClick={() => onToggleCompleted(task.id)}
            ></div>

            {/* Текст задачи */}
            <span onClick={() => onToggleCompleted(task.id)} style={{ cursor: 'pointer' }}>
              {task.text}
            </span>

            {/* Кнопка "Удалить" — красная */}
            <button
              className="delete-button"
              onClick={() => onDeleteTask(task.id)}
            >
              Удалить
            </button>
          </li>
        ))}
      </ul>
      {/* Стильная кнопка "Добавить задачу" */}
      <button className="add-button" onClick={onAddTask}>Добавить задачу</button>
    </div>
  );
};

export default ToDoList;