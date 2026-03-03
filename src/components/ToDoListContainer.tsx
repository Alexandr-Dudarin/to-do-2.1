import React, { useEffect, useMemo, useState } from "react";
import ToDoList from "./ToDoList";
import type { Task } from "../types/task";

type Filter = "all" | "active" | "completed";

const STORAGE_KEY = "todo.tasks.v1";
const FILTER_KEY = "todo.filter.v1";
const MAX_TASK_LENGTH = 80;

function loadTasks(): Task[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];
        return parsed as Task[];
    } catch {
        return [];
    }
}

function saveTasks(tasks: Task[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function normalize(text: string) {
    return text.trim().replace(/\s+/g, " ").toLowerCase();
}

const ToDoListContainer: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>(() => loadTasks());
    const [newTaskText, setNewTaskText] = useState<string>("");
    const [filter, setFilter] = useState<Filter>(() => {
        const raw = localStorage.getItem(FILTER_KEY);
        if (raw === "all" || raw === "active" || raw === "completed") return raw;
        return "all";
    });

    useEffect(() => {
        localStorage.setItem(FILTER_KEY, filter);
    }, [filter]);

    const handleToggleAll = () => {
        if (tasks.length === 0) return;

        const allCompleted = tasks.every((t) => t.completed);
        setTasks((prev) => prev.map((t) => ({ ...t, completed: !allCompleted })));
    };

    const [addError, setAddError] = useState<string | null>(null);

    const nextId = useMemo(() => {
        const maxId = tasks.reduce((max, t) => Math.max(max, t.id), 0);
        return maxId + 1;
    }, [tasks]);

    const activeCount = useMemo(
        () => tasks.filter((t) => !t.completed).length,
        [tasks]
    );
    const completedCount = useMemo(
        () => tasks.filter((t) => t.completed).length,
        [tasks]
    );
    const totalCount = tasks.length;

    useEffect(() => {
        saveTasks(tasks);
    }, [tasks]);

    const validateText = (textRaw: string, options?: { excludeId?: number }) => {
        const text = textRaw.trim();

        if (!text) return "Введите текст задачи.";
        if (text.length > MAX_TASK_LENGTH)
            return `Слишком длинно: максимум ${MAX_TASK_LENGTH} символов.`;

        const norm = normalize(text);
        const isDuplicate = tasks.some((t) => {
            if (options?.excludeId != null && t.id === options.excludeId) return false;
            return normalize(t.text) === norm;
        });

        if (isDuplicate) return "Такая задача уже есть.";
        return null;
    };

    const handleAddTask = (): boolean => {
        const err = validateText(newTaskText);
        if (err) {
            setAddError(err);
            return false;
        }

        const text = newTaskText.trim();

        const newTask: Task = {
            id: nextId,
            text,
            completed: false,
        };

        setTasks((prev) => [...prev, newTask]);
        setNewTaskText("");
        setAddError(null);
        return true;
    };

    const handleToggleCompleted = (id: number) => {
        setTasks((prev) =>
            prev.map((task) =>
                task.id === id ? { ...task, completed: !task.completed } : task
            )
        );
    };

    const handleDeleteTask = (id: number) => {
        setTasks((prev) => prev.filter((task) => task.id !== id));
    };

    const handleEditTask = (id: number, newText: string): string | null => {
        const err = validateText(newText, { excludeId: id });
        if (err) return err;

        const text = newText.trim();
        setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, text } : t)));
        return null;
    };

    const handleClearCompleted = () => {
        setTasks((prev) => prev.filter((t) => !t.completed));
        if (filter === "completed") setFilter("all");
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") handleAddTask();
    };

    const handleNewTaskTextChange = (text: string) => {
        setNewTaskText(text);
        if (addError) setAddError(null);
    };

    return (
        <ToDoList
            tasks={tasks}
            filter={filter}
            onChangeFilter={setFilter}
            onToggleCompleted={handleToggleCompleted}
            onToggleAll={handleToggleAll}
            onDeleteTask={handleDeleteTask}
            newTaskText={newTaskText}
            onNewTaskTextChange={handleNewTaskTextChange}
            onAddTask={handleAddTask}
            onKeyDown={handleKeyDown}
            onEditTask={handleEditTask}
            onClearCompleted={handleClearCompleted}
            totalCount={totalCount}
            activeCount={activeCount}
            completedCount={completedCount}
            addError={addError}
            maxTaskLength={MAX_TASK_LENGTH}
        />
    );
};

export default ToDoListContainer;