import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTasks } from "../context/TasksContext";
import TaskCard from "../components/TaskCard";
import {
  FilterButton,
  EmptyState,
  ArchiveSection,
  RestoreButton,
  ArchiveSearchInput,
} from "../ui/ArchiveComponents";

type FilterType = "all" | "completed" | "deleted";

/* archived task screen */
export default function ArchivedScreen() {
  const { tasks, restoreTask, updateTask } = useTasks();
  const [filter, setFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");

  
  // get all archived tasks (completed + deleted)
  const archivedTasks = useMemo(() => {
    return tasks.filter(
      (t) => t.status === "completed" || t.status === "deleted"
    );
  }, [tasks]);

  // apply filter (completed / deleted / all)
  const filteredByStatus = useMemo(() => {
    if (filter === "all") return archivedTasks;
    if (filter === "completed") {
      return archivedTasks.filter((t) => t.status === "completed");
    }
    if (filter === "deleted") {
      return archivedTasks.filter((t) => t.status === "deleted");
    }
    return archivedTasks;
  }, [archivedTasks, filter]);

  // apply search filter
  const finalTasks = useMemo(() => {
    if (!searchQuery.trim()) return filteredByStatus;
    const query = searchQuery.toLowerCase().trim();
    return filteredByStatus.filter(
      (t) =>
        t.title.toLowerCase().includes(query) ||
        (t.description && t.description.toLowerCase().includes(query))
    );
  }, [filteredByStatus, searchQuery]);

  // filter button 
  const handleFilterChange = (type: FilterType) => {
    setFilter(type);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          {/*heading */}
          <Text style={styles.heading}>Archived Tasks</Text>
          <Text style={styles.subheading}>
            Completed or deleted tasks are kept here for reference
          </Text>

          {/* search input */}
          <ArchiveSearchInput value={searchQuery} onChangeText={setSearchQuery} />

          {/* filter buttons */}
          <View style={styles.filterContainer}>
            <Text style={styles.filterLabel}>Filter by:</Text>
            <View style={styles.filterButtonRow}>
              <FilterButton
                label="All"
                type="all"
                icon="📋"
                isActive={filter === "all"}
                onPress={() => handleFilterChange("all")}
              />
              <FilterButton
                label="Completed"
                type="completed"
                icon="✅"
                isActive={filter === "completed"}
                onPress={() => handleFilterChange("completed")}
              />
              <FilterButton
                label="Deleted"
                type="deleted"
                icon="🗑️"
                isActive={filter === "deleted"}
                onPress={() => handleFilterChange("deleted")}
              />
            </View>
          </View>

          {/* task list*/}
          {finalTasks.length === 0 ? (
            <EmptyState searchQuery={searchQuery} />
          ) : (
            <View style={styles.taskListContainer}>
              {/* completed tasaks  */}
              {filter !== "deleted" && finalTasks.some((t) => t.status === "completed") && (
                <ArchiveSection title="✅ Completed">
                  {finalTasks
                    .filter((t) => t.status === "completed")
                    .map((task) => (
                      <View key={task.id} style={styles.taskWithAction}>
                        <TaskCard
                          task={task}
                          onEdit={() => {
                            updateTask(task.id, {
                              ...task,
                              status: "in_progress",
                            });
                          }}
                          onComplete={() => {}}
                        />
                        <RestoreButton onPress={() => restoreTask(task.id)} />
                      </View>
                    ))}
                </ArchiveSection>
              )}

              {/* deleted tasks section */}
              {filter !== "completed" && finalTasks.some((t) => t.status === "deleted") && (
                <ArchiveSection title="🗑️ Deleted">
                  {finalTasks
                    .filter((t) => t.status === "deleted")
                    .map((task) => (
                      <View key={task.id} style={styles.taskWithAction}>
                        <TaskCard
                          task={task}
                          onEdit={() => {
                            updateTask(task.id, {
                              ...task,
                              status: "in_progress",
                            });
                          }}
                          onComplete={() => {}}
                        />
                        <RestoreButton onPress={() => restoreTask(task.id)} />
                      </View>
                    ))}
                </ArchiveSection>
              )}
            </View>
          )}

          {/* helper text */}
          <Text style={styles.helperText}>
            💡 Restore tasks to bring them back to your active list
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 16,
  },

  // HEADING STYLES - Large, prominent
  heading: {
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 4,
  },
  subheading: {
    fontSize: 14,
    opacity: 0.6,
    marginBottom: 8,
  },

  // FILTER SECTION - Clear grouping
  filterContainer: {
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 10,
    opacity: 0.7,
  },
  filterButtonRow: {
    flexDirection: "row",
    gap: 8,
  },

  // TASK LIST CONTAINER
  taskListContainer: {
    gap: 20,
  },

  // TASK WITH RESTORE ACTION - Low friction
  taskWithAction: {
    gap: 8,
  },

  // HELPER TEXT - Educational, not overwhelming
  helperText: {
    fontSize: 13,
    opacity: 0.6,
    marginTop: 12,
    padding: 12,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    textAlign: "center",
  },
});
