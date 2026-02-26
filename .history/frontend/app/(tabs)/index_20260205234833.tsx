
import React from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TaskForm, {TaskDraft} from "../../components/TaskForm";


export default function HomeScreen() {
  const handleCreateTask = (draft: TaskDraft) => {
    console.log("New task:", draft);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "800" }}>Create a Task</Text>
     

      <TaskForm onSubmit={handleCreateTask} />
    </View>
    </SafeAreaView>
  );
}
