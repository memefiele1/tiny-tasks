
import React from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TaskForm, {TaskDraft} from "../../components/TaskForm";
import TaskCard from "../../components/TaskCard";
import { useState } from "react";


export default function HomeScreen() {

  const [tasks, setTasks] = useState<TaskDraft[]>([]);
  const handleCreateTask = (draft: TaskDraft) => {
    setTasks(prev => [draft, ...prev]);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "800" }}>Create a Task</Text>
     

      <TaskForm onSubmit={handleCreateTask} />

      {tasks.map((task, index) => (
        <TaskCard key={index} task={task} />
      ))}
    </View>
    </SafeAreaView>
  );
}


