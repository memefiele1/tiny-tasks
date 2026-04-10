//Tiffany Santiago Garcia
// Modal screen for adding and editing tasks, with form and delete option when editing

import TaskForm, { TaskDraft } from '@/components/TaskForm';
import { useTasks } from '@/context/TasksContext';
import API_BASE_URL from '@/utils/config';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';


export default function ModalScreen() {
  const router = useRouter();
  const { editingId } = useLocalSearchParams<{ editingId?: string }>();
  const { tasks, addTask, updateTask, deleteTask } = useTasks();
  const [isDeleting, setIsDeleting] = useState(false);

  const editingTask = editingId ? tasks.find((t) => t.id === editingId) : undefined;

  const handleSubmit = (draft: TaskDraft) => {
    if (editingId) {
      updateTask(editingId, draft);
    } else {
      addTask(draft);
    }
    router.dismiss();
  };

  // const handleDelete = () => {
  //   if (!editingId) return;
  //   setIsDeleting(true);
  //   deleteTask(editingId);
  //   router.dismiss();
  // };

  // api call to delete task
  const handleDelete = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks/delete`, {
        method: "delete",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ "task_id": editingId })
      });
      console.log(response);

      if (response.ok) {
        console.log("Successfully deleted task");
      } else {
        console.log("There was an error deleting your task");
      }

    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: editingId ? 'Edit Task' : 'Add Task',
          headerLeft: () => (
            <Pressable onPress={() => router.dismiss()} hitSlop={8}>
              <Text style={{ color: '#007AFF', fontSize: 16 }}>Cancel</Text>
            </Pressable>
          ),
        }}
      />
      <View style={styles.container}>
        <TaskForm
          initial={editingTask}
          onSubmit={handleSubmit}
          onCancel={() => router.dismiss()}
        />
        {editingId ? (
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
