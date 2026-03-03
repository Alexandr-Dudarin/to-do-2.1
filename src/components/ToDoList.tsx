import React, { useMemo, useState } from "react";
import "./TodoStyles.css";
import type { Task } from "../types/task";

type Filter = "all" | "active" | "completed";

type ToDoListProps = {
  tasks: Task[];
  filter: Filter;
  onChangeFilter: (filter: Filter) => void;

  onToggleCompleted: (id: number) => void;
  onDeleteTask: (id: number) => void;

  newTaskText: string;
  onNewTaskTextChange: (text: string) => void;
  onAddTask: () => boolean;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;

  onEditTask: (id: number, newText: string) => string | null;

  onClearCompleted: () => void;
  totalCount: number;
  activeCount: number;
  completedCount: number;

  addError: string | null;
  maxTaskLength: number;
};

const ToDoList: React.FC<ToDoListProps> = ({
  tasks,
  filter,
  onChangeFilter,
  onToggleCompleted,
  onDeleteTask,
  newTaskText,
  onNewTaskTextChange,
  onAddTask,
  onKeyDown,
  onEditTask,
  onClearCompleted,
  totalCount,
  activeCount,
  completedCount,
  addError,
  maxTaskLength,
}) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState<string>("");
  const [editError, setEditError] = useState<string | null>(null);

  const filteredTasks = useMemo(() => {
    if (filter === "active") return tasks.filter((t) => !t.completed);
    if (filter === "completed") return tasks.filter((t) => t.completed);
    return tasks;
  }, [tasks, filter]);

  const startEdit = (task: Task) => {
    setEditingId(task.id);
    setEditingText(task.text);
    setEditError(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText("");
    setEditError(null);
  };

  const saveEdit = (id: number) => {
    const err = onEditTask(id, editingText);
    if (err) {
      setEditError(err);
      return;
    }
    cancelEdit();
  };

  const handleAddClick = () => {
    onAddTask();
  };

  return (
    <div className="todo-container">
      <h2 className="todo-title">Мой список дел</h2>

      <div className="todo-topbar">
        <div className="filters">
          <button
            className={`filter-btn ${filter === "all" ? "active" : ""}`}
            onClick={() => onChangeFilter("all")}
            type="button"
          >
            Все
          </button>
          <button
            className={`filter-btn ${filter === "active" ? "active" : ""}`}
            onClick={() => onChangeFilter("active")}
            type="button"
          >
            Активные
          </button>
          <button
            className={`filter-btn ${filter === "completed" ? "active" : ""}`}
            onClick={() => onChangeFilter("completed")}
            type="button"
          >
            Выполненные
          </button>
        </div>

        <button
          className="clear-btn"
          onClick={onClearCompleted}
          disabled={completedCount === 0}
          type="button"
          title={completedCount === 0 ? "Нет выполненных задач" : "Удалить выполненные"}
        >
          Очистить выполненные
        </button>
      </div>

      <div className="counters">
        <span>Всего: {totalCount}</span>
        <span>Осталось: {activeCount}</span>
        <span>Выполнено: {completedCount}</span>
      </div>

      <input
        className={`todo-input ${addError ? "input-error" : ""}`}
        type="text"
        value={newTaskText}
        onChange={(e) => onNewTaskTextChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={`Добавьте новую задачу (до ${maxTaskLength} символов)`}
      />

      {addError && <div className="error-text">{addError}</div>}

      <ul className="todo-list">
        {filteredTasks.map((task) => {
          const isEditing = editingId === task.id;

          return (
            <li
              key={task.id}
              className={`todo-item ${task.completed ? "completed" : ""}`}
            >
              <div
                className={`checkbox ${task.completed ? "checked" : ""}`}
                onClick={() => onToggleCompleted(task.id)}
                role="button"
                tabIndex={0}
                aria-label="Отметить выполненной"
              />

              {!isEditing ? (
                <span
                  onDoubleClick={() => startEdit(task)}
                  onClick={() => onToggleCompleted(task.id)}
                  title="Двойной клик для редактирования"
                  style={{ cursor: "pointer" }}
                >
                  {task.text}
                </span>
              ) : (
                <div className="edit-wrap">
                  <input
                    className={`edit-input ${editError ? "input-error" : ""}`}
                    value={editingText}
                    onChange={(e) => {
                      setEditingText(e.target.value);
                      if (editError) setEditError(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveEdit(task.id);
                      if (e.key === "Escape") cancelEdit();
                    }}
                    autoFocus
                  />
                  {editError && <div className="error-text">{editError}</div>}
                </div>
              )}

              <div className="actions">
                {!isEditing ? (
                  <button
                    className="edit-button"
                    onClick={() => startEdit(task)}
                    type="button"
                  >
                    Ред.
                  </button>
                ) : (
                  <>
                    <button
                      className="save-button"
                      onClick={() => saveEdit(task.id)}
                      type="button"
                    >
                      Ок
                    </button>
                    <button
                      className="cancel-button"
                      onClick={cancelEdit}
                      type="button"
                    >
                      ✕
                    </button>
                  </>
                )}

                <button
                  className="delete-button"
                  onClick={() => onDeleteTask(task.id)}
                  type="button"
                >
                  Удалить
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      <button className="add-button" onClick={handleAddClick} type="button">
        Добавить задачу
      </button>
    </div>
  );
};

export default ToDoList;