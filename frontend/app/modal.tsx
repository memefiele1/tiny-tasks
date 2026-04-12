//Tiffany Santiago Garcia
// Modal screen for adding and editing tasks, with form and delete option when editing

import React, { useState } from 'react';
import { StyleSheet, Pressable, Text, View } from 'react-native';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import TaskForm, { TaskDraft } from '@/components/TaskForm';
import API_BASE_URL from '@/utils/config';


export default function ModalScreen() {
  
  const router = useRouter();
  const params = useLocalSearchParams<{
    editingId?: string;
    title?: string;
    description?: string;
    priority?: string;
    dueDate?: string;
    time?: string;
    status?: string;
  }>();
  const [isDeleting, setIsDeleting] = useState(false);

  const initialTask = params.editingId
    ? {
        id: params.editingId,
        title: params.title ?? "",
        description: params.description ?? "",
        priority: (params.priority as any) ?? "medium",
        dueDate: params.dueDate ?? "",
        time: params.time ?? "",
        status: (params.status as any) ?? "not_started",
      }
    : undefined;

  const handleDelete = async () => {
  if (!params.editingId) return;
  setIsDeleting(true);

  try {
    const response = await fetch(`${API_BASE_URL}/api/tasks/${params.editingId}`, {
      method: "DELETE",
    });

    const data = await response.json();
    console.log(data);

    if (response.ok) {
      console.log("Task deleted");
      router.dismiss();
    } else {
      console.log("Error deleting task");
      setIsDeleting(false);
    }
  } catch (error) {
    console.log("Error deleting task:", error);
    setIsDeleting(false);
  }
};

  return (
    <>
      <Stack.Screen
        options={{
          title: params.editingId ? "Edit Task" : "Add Task",
        }}
      />
      <View style={styles.container}>
        <TaskForm
          initial={initialTask}
          onSubmit={() => {}}
          onCancel={() => router.dismiss()}
        />
        {params.editingId ? (
          <Pressable
            onPress={handleDelete}
            disabled={isDeleting}
            style={[
              styles.deleteButton,
              isDeleting && styles.deleteButtonDisabled,
            ]}
          >
            <Text style={styles.deleteButtonText}>Delete Task</Text>
          </Pressable>
        ) : null}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  deleteButton: {
    marginTop: 20,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ff3b30',
    alignItems: 'center',
  },
  deleteButtonDisabled: {
    opacity: 0.5,
  },
  deleteButtonText: {
    color: '#ff3b30',
    fontSize: 16,
    fontWeight: '600',
  },
});
