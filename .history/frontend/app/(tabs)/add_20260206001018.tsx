import React from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TaskForm from "../../components/TaskForm";

export default function AddScreen() {

  const handleCreateTask = (draft: any) => {
    console.log("New task:", draft);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, padding: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: "800" }}>
          Add New Task
        </Text>

        <TaskForm onSubmit={handleCreateTask} />

      </View>
    </SafeAreaView>
  );
}
