//Tiffany Santiago Garcia
// Main screen showing active tasks with option to add new tasks and edit existing ones, sorted by priority

import React, { useMemo } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import TaskCard from "../../components/TaskCard";
import { useTasks } from "../../context/TasksContext";

export default function HomeScreen() {
  const router = useRouter();
  const { tasks, updateTask } = useTasks();

  const activeTasks = useMemo(
    () =>
      tasks.filter(
        (t) => t.status !== "completed" && t.status !== "deleted"
      ),
    [tasks]
  );

  const sortedActive = useMemo(() => {
    const priorityOrder = { high: 3, medium: 2, low: 1 } as const;
    return [...activeTasks].sort(
      (a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]
    );
  }, [activeTasks]);

  const handleEdit = (id: string) => {
    router.push({ pathname: '/modal', params: { editingId: id } });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, padding: 20, gap: 12 }}>
        <Text style={{ fontSize: 24, fontWeight: "800" }}>My Tasks</Text>

        <Pressable
          onPress={() => router.push('/modal')}
          style={{
            paddingVertical: 10,
            paddingHorizontal: 14,
            borderWidth: 1,
            borderRadius: 12,
            alignSelf: "flex-start",
          }}
        >
          <Text style={{ fontWeight: "800" }}>+ Add Task</Text>
        </Pressable>

        {sortedActive.length === 0 ? (
          <Text style={{ opacity: 0.7, marginTop: 12 }}>
            Tasks will appear here. Tap &quot;+ Add Task&quot; to create one.
          </Text>
        ) : null}

        <ScrollView style={{ marginTop: 8 }}>
          {sortedActive.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={() => handleEdit(task.id)}
              onComplete={() =>
                updateTask(task.id, { ...task, status: "completed" })
              }
            />
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
