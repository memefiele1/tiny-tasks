import React, { useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import Button from "../ui/Button";
import { FormField, TextArea, ChipGroup } from "../ui/TaskFormParts";

export type Priority = "low" | "medium" | "high";
export type Status = "not_started" | "in_progress" | "completed" | "deleted";

export type TaskDraft = {
  title: string;
  description: string;
  priority: Priority;
  dueDate: string; // YYYY-MM-DD
  status: Status;
};

type Props = {
  onSubmit: (draft: TaskDraft) => void;
  onCancel?: () => void;
  initial?: Partial<TaskDraft>;
};

const formatYYYYMMDD = (d: Date) => d.toISOString().slice(0, 10);
const addDays = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return formatYYYYMMDD(d);
};

export default function TaskForm({ onSubmit, onCancel, initial }: Props) {
  const scrollRef = useRef<ScrollView | null>(null);

  const [title, setTitle] = useState(initial?.title ?? "");
  const [priority, setPriority] = useState<Priority>(initial?.priority ?? "medium");
  const [dueDate, setDueDate] = useState(initial?.dueDate ?? "");
  const [status, setStatus] = useState<Status>(initial?.status ?? "not_started");
  const [showDetails, setShowDetails] = useState(!!initial?.description);
  const [description, setDescription] = useState(initial?.description ?? "");

  const titleError = useMemo(() => {
    if (title.length === 0) return "";
    return title.trim().length === 0 ? "Task name can’t be blank." : "";
  }, [title]);

  const dueDateError = useMemo(() => {
    if (dueDate.length === 0) return "";
    const ok = /^\d{4}-\d{2}-\d{2}$/.test(dueDate.trim());
    return ok ? "" : "Use YYYY-MM-DD (ex: 2026-02-06) or tap a quick option.";
  }, [dueDate]);

  const canSave = useMemo(() => {
    return title.trim().length > 0 && dueDate.trim().length > 0 && !titleError && !dueDateError;
  }, [title, dueDate, titleError, dueDateError]);

  const handleSubmit = () => {
    if (!canSave) {
      Alert.alert("Almost there", "Please add a task name and a valid due date.");
      return;
    }

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate: dueDate.trim(),
      status,
    });

    // Reset (keeps form feeling “light”)
    setTitle("");
    setPriority("medium");
    setDueDate("");
    setDescription("");
    setShowDetails(false);
  };

  // When you open details, auto-scroll so "Save task" stays reachable.
  const toggleDetails = () => {
    setShowDetails((prev) => {
      const next = !prev;
      if (!prev && next) {
        // details are opening — wait for layout + keyboard anim, then scroll
        setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 150);
      }
      return next;
    });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <ScrollView
        ref={(r) => {
          scrollRef.current = r;
        }}
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, paddingBottom: 220 }}
        keyboardShouldPersistTaps="always"
        keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"}
        nestedScrollEnabled
        onContentSizeChange={() => {
          // if details are open, keep bottom reachable as content changes
          if (showDetails) {
            requestAnimationFrame(() => scrollRef.current?.scrollToEnd({ animated: true }));
          }
        }}
      >
        {/* TASK NAME */}
        <FormField
          label="Task name"
          helperText="Be specific: 'Study for quiz (30 min)' instead of 'Study'"
          errorText={titleError}
          required
        >
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="e.g., Study for quiz (30 min)"
            returnKeyType="done"
            style={{ fontSize: 16, color: "#374057" }}
          />
        </FormField>

        {/* DUE DATE */}
        <View style={{ marginBottom: 14 }}>
          <Text style={{ fontSize: 14, fontWeight: "700", marginBottom: 6 }}>Due date</Text>

          <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 8 }}>
            {[
              { label: "Today", value: addDays(0) },
              { label: "Tomorrow", value: addDays(1) },
              { label: "This Week", value: addDays(7) },
            ].map((chip) => (
              <Pressable
                key={chip.label}
                onPress={() => setDueDate(chip.value)}
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 12,
                  borderRadius: 999,
                  borderWidth: 1,
                  marginRight: 10,
                  marginBottom: 10,
                }}
              >
                <Text style={{ fontWeight: "700" }}>{chip.label}</Text>
              </Pressable>
            ))}
          </View>

          <TextInput
            value={dueDate}
            onChangeText={setDueDate}
            placeholder="YYYY-MM-DD"
            autoCapitalize="none"
            keyboardType="numbers-and-punctuation"
            style={{ borderWidth: 1, borderRadius: 12, padding: 12, fontSize: 16 }}
          />
          {dueDateError ? <Text style={{ fontSize: 12 }}>{dueDateError}</Text> : null}

          <Text style={{ fontSize: 12, opacity: 0.7 }}>Tip: Use the quick buttons to avoid typing.</Text>
        </View>

        {/* STATUS */}
        <View style={{ marginBottom: 14 }}>
          <Text style={{ fontSize: 14, fontWeight: "700", marginBottom: 6 }}>Status</Text>

          <View style={{ flexDirection: "row" }}>
            {[
              { label: "Not Started", value: "not_started" },
              { label: "In Progress", value: "in_progress" },
              { label: "Completed", value: "completed" },
            ].map((s, idx) => {
              const selected = s.value === status;
              return (
                <Pressable
                  key={s.value}
                  onPress={() => setStatus(s.value as Status)}
                  style={{
                    flex: 1,
                    paddingVertical: 12,
                    borderRadius: 12,
                    borderWidth: 1,
                    alignItems: "center",
                    opacity: selected ? 1 : 0.6,
                    marginRight: idx === 2 ? 0 : 10,
                  }}
                >
                  <Text style={{ fontWeight: selected ? "800" : "600" }}>{s.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* PRIORITY */}
        <FormField
          label="Priority"
          helperText="Low = can wait, Medium = normal, High = urgent"
        >
          <ChipGroup value={priority} onChange={setPriority} />
        </FormField>

        {/* OPTIONAL DETAILS (progressive disclosure) */}
        <Pressable onPress={toggleDetails} style={{ paddingVertical: 6, marginBottom: 10 }}>
          <Text style={{ fontWeight: "800" }}>
            {showDetails ? "Hide details" : "Add details (optional)"}
          </Text>
        </Pressable>

        {showDetails ? (
          <FormField label="Description (Optional)">
            <TextArea
              value={description}
              onChangeText={setDescription}
              placeholder="Notes, steps, or reminders…"
            />
          </FormField>
        ) : null}

        {/* ACTIONS */}
        <View style={{ flexDirection: "row", gap: 12, marginTop: 4 }}>
          {onCancel ? (
            <Button
              label="Cancel"
              onPress={onCancel}
              variant="secondary"
              style={{ flex: 1 }}
            />
          ) : null}
          <Button
            label="Save task"
            onPress={handleSubmit}
            disabled={!canSave}
            variant="primary"
            style={{ flex: 1 }}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}