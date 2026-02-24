/** filtering archieved tasks */

import { useMemo } from "react";

type Task = {
  id: string;
  title: string;
  description?: string;
  status: "not_started" | "in_progress" | "completed" | "deleted";
  priority: "low" | "medium" | "high";
  dueDate: string;
};

export function useArchivedTasksFilter(
  allTasks: Task[],
  filterType: "all" | "completed" | "deleted",
  searchQuery: string
) {
  // only archived tasks
  const archivedTasks = useMemo(
    () => allTasks.filter((t) => t.status === "completed" || t.status === "deleted"),
    [allTasks]
  );

  // status filter
  const filteredByStatus = useMemo(() => {
    if (filterType === "all") return archivedTasks;
    return archivedTasks.filter((t) => t.status === filterType);
  }, [archivedTasks, filterType]);

  // search filter
  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return filteredByStatus;
    const query = searchQuery.toLowerCase().trim();
    return filteredByStatus.filter(
      (t) =>
        t.title.toLowerCase().includes(query) ||
        (t.description?.toLowerCase().includes(query) ?? false)
    );
  }, [filteredByStatus, searchQuery]);

  return filtered;
}

// all achieved 

export function useFilteredArchivedTasks(
  tasks: Task[],
  filterType: "all" | "completed" | "deleted",
  searchQuery: string
) {
  return useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    return tasks.filter((task) => {
      // archived
      const isArchived =
        task.status === "completed" || task.status === "deleted";
      if (!isArchived) return false;

      // status filter all
      if (filterType !== "all" && task.status !== filterType) return false;

      // if filtered much match search
      if (query) {
        const matchesSearch =
          task.title.toLowerCase().includes(query) ||
          (task.description?.toLowerCase().includes(query) ?? false);
        return matchesSearch;
      }

      return true;
    });
  }, [tasks, filterType, searchQuery]);
}

// ============================================================================
// PATTERN 3: Advanced Filtering with Secondary Filters (Extensible)
// ============================================================================
// For future ADHD features like priority/date range filtering

interface AdvancedFilterOptions {
  statusFilter: "all" | "completed" | "deleted";
  searchQuery: string;
  priorityFilter?: "low" | "medium" | "high" | "all";
  sortBy?: "newest" | "oldest" | "priority";
}

export function useAdvancedArchivedFilter(
  tasks: Task[],
  options: AdvancedFilterOptions
) {
  return useMemo(() => {
    let filtered = tasks.filter(
      (t) => t.status === "completed" || t.status === "deleted"
    );

    // Apply status filter
    if (options.statusFilter !== "all") {
      filtered = filtered.filter((t) => t.status === options.statusFilter);
    }

    // Apply priority filter
    if (options.priorityFilter && options.priorityFilter !== "all") {
      filtered = filtered.filter((t) => t.priority === options.priorityFilter);
    }

    // Apply search
    if (options.searchQuery.trim()) {
      const query = options.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          (t.description?.toLowerCase().includes(query) ?? false)
      );
    }

    // Apply sorting
    if (options.sortBy === "newest") {
      filtered.sort((a, b) => b.dueDate.localeCompare(a.dueDate));
    } else if (options.sortBy === "oldest") {
      filtered.sort((a, b) => a.dueDate.localeCompare(b.dueDate));
    } else if (options.sortBy === "priority") {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      filtered.sort(
        (a, b) =>
          priorityOrder[b.priority] - priorityOrder[a.priority]
      );
    }

    return filtered;
  }, [tasks, options]);
}

// ============================================================================
// PATTERN 4: Grouped Filtering (For UI Sections)
// ============================================================================
// Returns tasks grouped by status for rendering separate sections

export function useGroupedArchivedTasks(tasks: Task[], searchQuery: string) {
  return useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    const completed = tasks.filter((t) => {
      if (t.status !== "completed") return false;
      if (!query) return true;
      return (
        t.title.toLowerCase().includes(query) ||
        (t.description?.toLowerCase().includes(query) ?? false)
      );
    });

    const deleted = tasks.filter((t) => {
      if (t.status !== "deleted") return false;
      if (!query) return true;
      return (
        t.title.toLowerCase().includes(query) ||
        (t.description?.toLowerCase().includes(query) ?? false)
      );
    });

    return { completed, deleted };
  }, [tasks, searchQuery]);
}

// ============================================================================
// PATTERN 5: Non-Memoized Quick Filter (Performance Trade-off)
// ============================================================================
// Use only if performance isn't a concern or filtering is very simple

export function getFilteredArchivedTasks(
  tasks: Task[],
  filterType: "all" | "completed" | "deleted",
  searchQuery: string
): Task[] {
  return tasks.filter((task) => {
    // must be archived
    if (task.status !== "completed" && task.status !== "deleted") return false;

    // must match status filter
    if (filterType !== "all" && task.status !== filterType) return false;

    // must match search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      return (
        task.title.toLowerCase().includes(query) ||
        (task.description?.toLowerCase().includes(query) ?? false)
      );
    }

    return true;
  });
}

//common filters below

// get count of archived tasks by type
export function getArchivedCounts(tasks: Task[]) {
  return {
    total: tasks.filter((t) => t.status === "completed" || t.status === "deleted")
      .length,
    completed: tasks.filter((t) => t.status === "completed").length,
    deleted: tasks.filter((t) => t.status === "deleted").length,
  };
}

// check if any archived tasks exist
export function hasArchivedTasks(tasks: Task[]): boolean {
  return tasks.some((t) => t.status === "completed" || t.status === "deleted");
}

// get recently archived (by date)
export function getRecentlyArchived(tasks: Task[], days: number = 7): Task[] {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  return tasks.filter((task) => {
    if (task.status !== "completed" && task.status !== "deleted") return false;
    return new Date(task.dueDate) >= cutoffDate;
  });
}

