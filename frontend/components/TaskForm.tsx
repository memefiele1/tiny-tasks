import React, { useMemo, useState } from "react";
import { View, Text, TextInput, Pressable, Alert } from "react-native";

export type Priority = "low" | "medium" | "high";

export type Status = "not_started" | "in_progress" | "completed";


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
};

const priorities: Priority[] = ["low", "medium", "high"];

const formatYYYYMMDD = (d: Date) => d.toISOString().slice(0, 10);
const addDays = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return formatYYYYMMDD(d);
};

export default function TaskForm({ onSubmit, onCancel }: Props) {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<Status>("not_started");
  const [priority, setPriority] = useState<Priority>("medium"); // ADHD-friendly default
  const [dueDate, setDueDate] = useState(""); // user can type OR tap chip
  const [showDetails, setShowDetails] = useState(false);
  const [description, setDescription] = useState("");

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

  return (
    <View style={{ gap: 14 }}>
      {/* TASK NAME */}
      <View style={{ gap: 6 }}>
        <Text style={{ fontSize: 14, fontWeight: "700" }}>Task name</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="e.g., Study for quiz (30 min)"
          returnKeyType="done"
          style={{
            borderWidth: 1,
            borderRadius: 12,
            padding: 12,
            fontSize: 16,
          }}
        />
        {titleError ? <Text style={{ fontSize: 12 }}>{titleError}</Text> : null}
      </View>

      {/* DUE DATE */}
      <View style={{ gap: 6 }}>
        <Text style={{ fontSize: 14, fontWeight: "700" }}>Due date</Text>

        {/* Quick options reduce typing/friction */}
        <View style={{ flexDirection: "row", gap: 10, flexWrap: "wrap" }}>
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
          style={{
            borderWidth: 1,
            borderRadius: 12,
            padding: 12,
            fontSize: 16,
          }}
        />
        {dueDateError ? <Text style={{ fontSize: 12 }}>{dueDateError}</Text> : null}

        <Text style={{ fontSize: 12, opacity: 0.7 }}>
          Tip: Use the quick buttons to avoid typing.
        </Text>
      </View>

      {/* STATUS */}
      <View style={{ gap: 6 }}>
        <Text style={{ fontSize: 14, fontWeight: "700" }}>Status</Text>

        <View style={{ flexDirection: "row", gap: 10 }}>
          {[
            { label: "Not Started", value: "not_started" },
            { label: "In Progress", value: "in_progress" },
            { label: "Completed", value: "completed" },
          ].map((s) => {
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
                }}
              >
                <Text style={{ fontWeight: selected ? "800" : "600" }}>
                  {s.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>






      {/* PRIORITY */}
      <View style={{ gap: 6 }}>
        <Text style={{ fontSize: 14, fontWeight: "700" }}>Priority</Text>

        <View style={{ flexDirection: "row", gap: 10 }}>
          {priorities.map((p) => {
            const selected = p === priority;
            return (
              <Pressable
                key={p}
                onPress={() => setPriority(p)}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  borderRadius: 12,
                  borderWidth: 1,
                  alignItems: "center",
                  opacity: selected ? 1 : 0.6,
                }}
              >
                <Text style={{ fontWeight: selected ? "800" : "600" }}>
                  {p === "low" ? "Low" : p === "medium" ? "Medium" : "High"}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={{ fontSize: 12, opacity: 0.7 }}>
          Default is Medium to keep decisions simple.
        </Text>
      </View>

      {/* OPTIONAL DETAILS (progressive disclosure) */}
      <Pressable
        onPress={() => setShowDetails((s) => !s)}
        style={{ paddingVertical: 6 }}
      >
        <Text style={{ fontWeight: "800" }}>
          {showDetails ? "Hide details" : "Add details (optional)"}
        </Text>
      </Pressable>

      {showDetails ? (
        <View style={{ gap: 6 }}>
          <Text style={{ fontSize: 14, fontWeight: "700" }}>Description</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Notes, steps, or reminders…"
            multiline
            style={{
              borderWidth: 1,
              borderRadius: 12,
              padding: 12,
              minHeight: 100,
              textAlignVertical: "top",
              fontSize: 16,
            }}
          />
        </View>
      ) : null}

      {/* ACTIONS */}
      <View style={{ flexDirection: "row", gap: 10, marginTop: 4 }}>
        {onCancel ? (
          <Pressable
            onPress={onCancel}
            style={{
              flex: 1,
              padding: 14,
              borderRadius: 14,
              borderWidth: 1,
              alignItems: "center",
            }}
          >
            <Text style={{ fontWeight: "700" }}>Cancel</Text>
          </Pressable>
        ) : null}

        <Pressable
          onPress={handleSubmit}
          style={{
            flex: 1,
            padding: 14,
            borderRadius: 14,
            borderWidth: 1,
            alignItems: "center",
            opacity: canSave ? 1 : 0.45,
          }}
        >
          <Text style={{ fontWeight: "900" }}>Save task</Text>
        </Pressable>
      </View>
    </View>
  );
}
