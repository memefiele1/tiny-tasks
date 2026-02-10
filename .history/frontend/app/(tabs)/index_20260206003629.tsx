import React, { useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TaskForm, { TaskDraft } from "../../components/TaskForm";
import TaskCard from "../../components/TaskCard";

export default function HomeScreen() {
  const [tasks, setTasks] = useState<TaskDraft[]>([]);
  const [showForm, setShowForm] = useState(false);

  const handleCreateTask = (draft: TaskDraft) => {
  console.log("Submitted task:", draft);
  setTasks(prev => [draft, ...prev]);
};


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, padding: 20, gap: 12 }}>
        {/* Header */}
        <Text style={{ fontSize: 24, fontWeight: "800" }}>My Tasks</Text>

        {/* Add / Close button */}
        <Pressable
          onPress={() => setShowForm((s) => !s)}
          style={{
            paddingVertical: 10,
            paddingHorizontal: 14,
            borderWidth: 1,
            borderRadius: 12,
            alignSelf: "flex-start",
          }}
        >
          <Text style={{ fontWeight: "800" }}>
            {showForm ? "Close" : "+ Add Task"}
          </Text>
        </Pressable>

        {/* Form (only when user asks) */}
        {showForm ? <TaskForm onSubmit={handleCreateTask} /> : null}

        {/* Empty state */}
        {!showForm && tasks.length === 0 ? (
          <Text style={{ opacity: 0.7, marginTop: 12 }}>
            Tasks will appear here. Tap “+ Add Task” to create one.
          </Text>
        ) : null}

        {/* Task list */}
        <ScrollView style={{ marginTop: 8 }}>
          {tasks.map((task, index) => (
            <TaskCard key={index} task={task} />
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
