//Tiffany Santiago Garcia
// Archived tasks screen with filter and search functionality, allowing users to view and restore completed or deleted tasks
import API_BASE_URL from "@/utils/config";
import React, { useEffect, useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArchiveSearchInput,
  FilterButton
} from "../ui/ArchiveComponents";
import TaskCard from "../ui/TaskCard";
import { Stack } from "expo-router";

type FilterType = "all" | "completed" | "deleted";

export default function ArchivedScreen() {
  const userId = 1; // FOR TESTING
  const [filter, setFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [archivedTasks, setArchivedTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchArchivedTasks = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_BASE_URL}/api/archive/${userId}`);
      const data = await response.json();

      console.log("ARCHIVE status:", response.status);
      console.log("ARCHIVE data:", data);
      console.log(data.archived_tasks);

      if (response.ok && data.success) {
        setArchivedTasks(data.archived_tasks);
      } else {
        setError(data.error || "Error fetching archived tasks");
        setArchivedTasks([]);
      }
    } catch (err) {
      console.log("Error fetching archive:", err);
      setError("Error fetching archived tasks");
      setArchivedTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArchivedTasks();
  }, [ ]);

  // restore specified task
 const restoreTask = async (archiveId: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/archive/${archiveId}/restore`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ archive_id: archiveId }),
    });

    const data = await response.json();
    console.log(data);

    if (response.ok) {
      console.log(`TASK ${archiveId} RESTORED`);
      await fetchArchivedTasks();
    } else {
      console.log("Error restoring task");
    }
  } catch (error) {
    console.log("Error restoring task");
    setError("Error restoring task");
  }
};

  // restore specified task
  const deleteTask = async (archiveId: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/archive/${archiveId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();
    console.log(data);

    if (response.ok) {
      console.log(`TASK ${archiveId} PERMANENTLY DELETED`);
      await fetchArchivedTasks();
    } else {
      console.log("Error deleting task");
    }
  } catch (error) {
    console.log("Error deleting task");
    setError("Error deleting task");
  }
};

  // filter returned list of tasks by archive status (completed, deleted, ...)
 const filteredByStatus = useMemo(() => {
  if (filter === "all") return archivedTasks;

  return archivedTasks.filter((t) => {
    if (filter === "completed") return !!t.date_completed;
    if (filter === "deleted") return !!t.deleted_on;
    return true;
  });
}, [archivedTasks, filter]);

  const finalTasks = useMemo(() => {
    if (!searchQuery.trim()) return filteredByStatus;
    const query = searchQuery.toLowerCase().trim();

    return filteredByStatus.filter(
      (t) =>
        t.title?.toLowerCase().includes(query) ||
        (t.description && t.description.toLowerCase().includes(query))
    );
  }, [filteredByStatus, searchQuery]);

  return (


    <>
    <Stack.Screen
      options={{
        headerShown: true,
        title: "Archived Tasks",
      }}
    />

    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}> 
          <Text style={styles.heading}>Archived Tasks</Text>
          <Text style={styles.subheading}>
            Completed or deleted tasks are kept here for reference
          </Text>
        
          <ArchiveSearchInput value={searchQuery} onChangeText={setSearchQuery} />


          <View style={styles.filterContainer}> 
            <Text style={styles.filterLabel}>Filter by:</Text>
            <View style={styles.filterButtonRow}> 
              <FilterButton
                label="All"
                type="all"
                icon="📋"
                isActive={filter === "all"}
                onPress={() => setFilter("all")}
              />
              <FilterButton
                label="Completed"
                type="completed"
                icon="✅"
                isActive={filter === "completed"}
                onPress={() => setFilter("completed")}
              />
              <FilterButton
                label="Deleted"
                type="deleted"
                icon="🗑️"
                isActive={filter === "deleted"}
                onPress={() => setFilter("deleted")}
              />
            </View>
          </View>

          {/* {loading ? (
            <Text>Loading archived tasks...</Text>
          ) : error ? (
            <Text style={{ color: "crimson" }}>{error}</Text>
          ) : finalTasks.length === 0 ? (
            <EmptyState searchQuery={searchQuery} />
          ) : (
            <View style={styles.taskListContainer}> 
              {filter !== "deleted" &&
                finalTasks.some((t) => t.archive_status === "completed") && (
                  <ArchiveSection title="✅ Completed">
                    {finalTasks
                      .filter((t) => t.archive_status === "completed")
                      .map((task) => (
                        <View key={task.task_id} style={styles.taskWithAction}>
                          <TaskCard
                            task={task}
                            isArchived={true}
                            onEdit={() => {}}
                            onComplete={() => {}}
                            onRestore={() => { }}
                          />
                        </View>
                      ))}
                  </ArchiveSection>
                )}

              {filter !== "completed" &&
                finalTasks.some((t) => t.archive_status === "deleted") && (
                  <ArchiveSection title="🗑️ Deleted">
                    {finalTasks
                      .filter((t) => t.archive_status === "deleted")
                      .map((task) => (
                        <View key={task.task_id} style={styles.taskWithAction}>
                          <TaskCard
                            isArchived={false}
                            task={task}
                            onEdit={() => {}}
                            onComplete={() => {}}
                            onRestore={() => {}}
                          />
                        </View>
                      ))}
                  </ArchiveSection>
                )}
            </View>
          )} */}

          <View>
            { finalTasks && finalTasks.map((task) =>
              <View key={task.archive_id} style={styles.taskWithAction}>
                <TaskCard
                  task={task}
                  isArchived={true}
                  onEdit={() => { restoreTask(task.archive_id) }}
                  onComplete={() => { deleteTask(task.archive_id) }}
                />
              </View>
            )}
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
    </>
  );



}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 16,
  },
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
  taskListContainer: {
    gap: 20,
  },
  taskWithAction: {
    gap: 8,
  },
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
