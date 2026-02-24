import React from "react";
import { View, Text, Pressable, TextInput, StyleSheet } from "react-native";

// FILTER BUTTON COMPONENT
export function FilterButton({
  label,
  type,
  icon,
  isActive,
  onPress,
}: {
  label: string;
  type: string;
  icon: string;
  isActive: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.filterButton,
        isActive && styles.filterButtonActive,
      ]}
    >
      <Text
        style={[
          styles.filterButtonText,
          isActive && styles.filterButtonTextActive,
        ]}
      >
        {icon} {label}
      </Text>
    </Pressable>
  );
}

// EMPTY STATE COMPONENT
export function EmptyState({
  searchQuery,
}: {
  searchQuery: string;
}) {
  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📭</Text>
      <Text style={styles.emptyText}>No archived tasks here</Text>
      {searchQuery && (
        <Text style={styles.emptySubtext}>
          Try a different search term
        </Text>
      )}
    </View>
  );
}

// SECTION COMPONENT
export function ArchiveSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.taskSection}>{children}</View>
    </View>
  );
}

// RESTORE BUTTON
export function RestoreButton({
  onPress,
}: {
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.restoreButton}>
      <Text style={styles.restoreButtonText}>Restore</Text>
    </Pressable>
  );
}

// SEARCH INPUT
export function ArchiveSearchInput({
  value,
  onChangeText,
}: {
  value: string;
  onChangeText: (text: string) => void;
}) {
  return (
    <TextInput
      placeholder="🔍 Search archived tasks..."
      value={value}
      onChangeText={onChangeText}
      style={styles.searchInput}
      placeholderTextColor="#999"
    />
  );
}

// STYLES
const styles = StyleSheet.create({
  // SEARCH INPUT - Large touch area
  searchInput: {
    fontSize: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: "#f5f5f5",
  },

  // FILTER SECTION - Clear grouping
  filterButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 2,
    borderColor: "#ccc",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    minHeight: 48, // ADHD: Large tap target
  },
  filterButtonActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  filterButtonText: {
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
  filterButtonTextActive: {
    color: "#fff",
  },

  // EMPTY STATE - Clear feedback
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  emptyIcon: {
    fontSize: 48,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
  },
  emptySubtext: {
    fontSize: 14,
    opacity: 0.6,
  },

  // SECTION STYLES - Clear visual categories
  sectionContainer: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  taskSection: {
    gap: 12,
  },

  // RESTORE BUTTON - Low friction
  restoreButton: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#007AFF",
    borderRadius: 8,
    alignItems: "center",
    minHeight: 44, // ADHD: Large tap target
  },
  restoreButtonText: {
    color: "#007AFF",
    fontWeight: "600",
    fontSize: 14,
  },
});
