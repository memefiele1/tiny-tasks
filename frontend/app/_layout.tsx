//Tiffany Santiago Garcia
// Root layout wrapping the entire app with navigation and context providers
// Root layout wrapping the entire app with navigation and context providers
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { TasksProvider } from "../context/TasksContext";

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  return (
    <TasksProvider>
      <ThemeProvider value={DefaultTheme}>
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false}}/>
            <Stack.Screen name="Login" options={{ headerShown: false}}/>
            <Stack.Screen name="Register" options={{ headerShown: false}}/>
            <Stack.Screen name="ForgotPassword" options={{ headerShown: false }}/>
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </TasksProvider>
  );
}