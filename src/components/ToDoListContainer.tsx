import React, { useState } from 'react';
import ToDoList from './ToDoList';
import type { Task } from '../types/task';

const ToDoListContainer: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState<string>('');
  const [nextId, setNextId] = useState<number>(1);

  const handleAddTask = () => {
    if (newTaskText.trim() === '') return;
    const newTask: Task = {
      id: nextId,
      text: newTaskText,
      completed: false,
    };
    setTasks([...tasks, newTask]);
    setNewTaskText('');
    setNextId(nextId + 1);
  };

  const handleToggleCompleted = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleDeleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleInputChange = (text: string) => {
    setNewTaskText(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddTask();
    }
  };

  return (
    <ToDoList
      tasks={tasks}
      onToggleCompleted={handleToggleCompleted}
      onDeleteTask={handleDeleteTask}
      newTaskText={newTaskText}
      onNewTaskTextChange={handleInputChange}
      onAddTask={handleAddTask}
      onKeyDown={handleKeyDown}
    />
  );
};

export default ToDoListContainer;