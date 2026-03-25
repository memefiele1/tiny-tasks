import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import ToggleButton from '../components/ui/inputs/ToggleButton';
import TaskCard from '../components/TaskCard';
import type { Task } from '../context/TasksContext';
const mockTasks: Task[] = [
  {
    id: '1',
    createdAt: '2026-03-09T08:00:00Z',
    title: 'Read Chapter 5',
    description: 'Read and summarize key points.',
    priority: 'high',
    dueDate: '2026-03-10',
    status: 'not_started',
  },
  {
    id: '2',
    createdAt: '2026-03-09T10:00:00Z',
    title: 'Math Homework',
    description: 'Complete exercises 1-10.',
    priority: 'medium',
    dueDate: '2026-03-10',
    status: 'in_progress',
  },
  {
    id: '3',
    createdAt: '2026-03-09T14:00:00Z',
    title: 'Science Project',
    description: 'Prepare experiment materials.',
    priority: 'low',
    dueDate: '2026-03-10',
    status: 'not_started',
  },
];

const mockMorningTasks: Task[] = [];
const mockAfternoonTasks: Task[] = [];

// If you want to split by time, add a time field or parse from dueDate

const TaskScreen = () => {
  const [view, setView] = useState<'Daily' | 'Half-Day'>('Daily');

  // TODO: Replace mock data with API calls:
  // - GET /api/tasks/today/:user_id
  // - GET /api/tasks/morning/:user_id
  // - GET /api/tasks/afternoon/:user_id
  // - GET /api/tasks/filtered/:user_id

  return (
    <View style={styles.container}>
      <View style={styles.toggleContainer}>
        <ToggleButton
          options={['Daily', 'Half-Day']}
          selected={view}
          onSelect={(option) => setView(option as 'Daily' | 'Half-Day')}
        />
      </View>
      {view === 'Daily' ? (
        <FlatList<Task>
          data={mockTasks}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <TaskCard task={item} onEdit={() => {}} onComplete={() => {}} />}
          contentContainerStyle={styles.list}
        />
      ) : (
        <View>
          <Text style={styles.sectionTitle}>Morning</Text>
          <FlatList<Task>
            data={mockMorningTasks}
            keyExtractor={item => item.id}
            renderItem={({ item }) => <TaskCard task={item} onEdit={() => {}} onComplete={() => {}} />}
            contentContainerStyle={styles.list}
          />
          <Text style={styles.sectionTitle}>Afternoon</Text>
          <FlatList<Task>
            data={mockAfternoonTasks}
            keyExtractor={item => item.id}
            renderItem={({ item }) => <TaskCard task={item} onEdit={() => {}} onComplete={() => {}} />}
            contentContainerStyle={styles.list}
          />
        </View>
      )}
    </View>
  );
};

export default TaskScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
    paddingTop: 40,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  list: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 16,
    marginTop: 16,
    marginBottom: 8,
    color: '#333',
  },
});