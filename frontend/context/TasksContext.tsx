//Tiffany Santiago Garcia
// Context for managing tasks globally across the app, providing functions to add, update, delete (archive), and restore tasks


import React, { createContext, useContext, useMemo, useState } from "react";
import type { TaskDraft } from "../components/TaskForm";

export type Task = TaskDraft & { id: string; createdAt: string };

type Ctx = {
  tasks: Task[];
  addTask: (draft: TaskDraft) => void;
  updateTask: (id: string, draft: TaskDraft) => void;
  // Changed: deleteTask now marks as "deleted" instead of removing
  deleteTask: (id: string) => void;
  // New: restore task from archive
  restoreTask: (id: string) => void;
};

const TasksContext = createContext<Ctx | null>(null);

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);

  const addTask = (draft: TaskDraft) => {
    const now = new Date().toISOString();
    setTasks((prev) => [
      { ...draft, id: String(Date.now()), createdAt: now },
      ...prev,
    ]);
  };

  const updateTask = (id: string, draft: TaskDraft) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...draft, id } : t)));
  };

  // Changed: Instead of removing, mark task as deleted for archiving
  const deleteTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: "deleted" as const } : t
      )
    );
  };

  // New: Restore task from archive back to active
  const restoreTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: "not_started" as const } : t
      )
    );
  };

  const value = useMemo(
    () => ({ tasks, addTask, updateTask, deleteTask, restoreTask }),
    [tasks]
  );

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
}

export function useTasks() {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error("useTasks must be used inside TasksProvider");
  return ctx;
}
