//Tiffany Santiago Garcia
// Tab layout defining the bottom tab navigation structure with icons and linking to main screens like Home and Settings
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#2563EB", // your brand color
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={28} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="focus-timer"
        options={{
          title: 'Focus Timer',
          tabBarIcon: ({ color }) => (
            <Ionicons name="timer" size={28} color={color} />
          ),
        }}
      />  

        <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => (
            <Ionicons name="settings" size={28} color={color} />
          ),
        }}
      />  









    </Tabs>
    
  );
}
