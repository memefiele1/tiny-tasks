//Tiffany Santiago Garcia
// Form component for creating and editing tasks, with validation and quick date options

import API_BASE_URL from "@/utils/config";
import React, { useMemo, useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Button from "../ui/Button";
import { FormField, TextArea } from "../ui/TaskFormParts";

export type Priority = "low" | "medium" | "high";
export type Status = "not_started" | "in_progress" | "completed" | "deleted";

export type TaskDraft = {
  title: string;
  description: string;
  priority: Priority;
  dueDate: string;
  time: string;
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

const statusOptions = [
  { label: "Not Started", value: "not_started" as Status },
  { label: "In Progress", value: "in_progress" as Status },
  { label: "Completed", value: "completed" as Status },
];

const priorityOptions = [
  { label: "Low", value: "low" as Priority },
  { label: "Medium", value: "medium" as Priority },
  { label: "High", value: "high" as Priority },
];


export default function TaskForm({ onSubmit, onCancel, initial }: Props) {
  // const { id } = useLocalSearchParams();
  const id = 1; // FOR TESTING ONLY, DELETE LATER
  const scrollRef = useRef<ScrollView | null>(null);

  
  const [title, setTitle] = useState(initial?.title ?? "");
  const [priority, setPriority] = useState<Priority>(
    initial?.priority ?? "medium"
  );
  const [time, setTime] = useState(initial?.time ?? "");
  const [dueDate, setDueDate] = useState(initial?.dueDate ?? "");
  const [status, setStatus] = useState<Status>(
    initial?.status ?? "not_started"
  );
  const [showDetails, setShowDetails] = useState(!!initial?.description);
  const [description, setDescription] = useState(
    initial?.description ?? ""
  );

  const titleError = useMemo(() => {
    if (title.length === 0) return "";
    return title.trim().length === 0 ? "Task name can't be blank." : "";
  }, [title]);

  const timeError = useMemo(() => {
    if (time.length === 0) return "";

    const ok = /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i.test(time.trim());
    return ok ? "" : "Use format HH:MM AM/PM (e.g., 2:00 PM)";
  }, [time]);

  const dueDateError = useMemo(() => {
    if (dueDate.length === 0) return "";
    const ok = /^\d{4}-\d{2}-\d{2}$/.test(dueDate.trim());
    return ok
      ? ""
      : "Use YYYY-MM-DD (ex: 2026-02-06) or tap a quick option.";
  }, [dueDate]);


  const canSave = useMemo(() => {
    return (
      title.trim().length > 0 &&
      dueDate.trim().length > 0 &&
      time.trim().length > 0 &&
      !titleError &&
      !dueDateError &&
      !timeError
    );
  }, [title, dueDate, titleError, dueDateError, timeError,time]);

  const handleSubmit = async () => {
  if (!canSave) {
    Alert.alert(
      "Almost there",
      "Please add a task name and a valid due date."
    );
    return;
  }

  try {
    const rawDate = dueDate.trim();
    const rawTime = time.trim();

    let formattedDateTime = rawDate;

    const match = rawTime.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (match) {
      let hour = Number(match[1]);
      const minute = match[2];
      const period = match[3].toUpperCase();

      if (period === "AM" && hour === 12) hour = 0;
      if (period === "PM" && hour !== 12) hour += 12;

      const hourStr = String(hour).padStart(2, "0");
      formattedDateTime = `${rawDate} ${hourStr}:${minute}:00`;
    }

    const payload = {
      title: title.trim(),
      description: description.trim(),
      priority,
      due_date: formattedDateTime,
      time_view: rawTime,
      status,
    };

    // decides CREATE vs UPDATE
    if ((initial as any)?.id || (initial as any)?.task_id) {
      const taskId = (initial as any).id ?? (initial as any).task_id;

      const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        console.log("Task updated");
        onCancel?.();
      } else {
        console.log("Error updating task");
      }
    } else {
      const response = await fetch(`${API_BASE_URL}/api/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: 1,
          ...payload,
        }),
      });

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        console.log("Task created");
        clear();
        onCancel?.();
      } else {
        console.log("Error creating task");
      }
    }
  } catch (error) {
    console.log("Error saving task:", error);
  }
};

  // API call to save task in database for user
  const createTask = async () => {
  try {
    const rawDate = dueDate.trim();   // ex: 2026-04-11
    const rawTime = time.trim();      // ex: 9:00 AM

    let formattedDateTime = rawDate;

    const match = rawTime.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (match) {
      let hour = Number(match[1]);
      const minute = match[2];
      const period = match[3].toUpperCase();

      if (period === "AM" && hour === 12) hour = 0;
      if (period === "PM" && hour !== 12) hour += 12;

      const hourStr = String(hour).padStart(2, "0");
      formattedDateTime = `${rawDate} ${hourStr}:${minute}:00`;
    }

    const response = await fetch(`${API_BASE_URL}/api/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: id,
        title: title.trim(),
        description: description.trim(),
        priority: priority,
        due_date: formattedDateTime,
        time_view: rawTime,
        status: status,
      }),
    });

    const data = await response.json();
    console.log(data);

    if (response.ok) {
      console.log("New task created");
      clear();
    } else {
      console.log("Error creating task");
    }
  } catch (error) {
    console.log(error);
  }
};

  // clear form after user has submitted data
  const clear = () => {
    setTitle("");
    setPriority("medium");
    setDueDate("");
    setDescription("");
    setTime("");
    setShowDetails(false);
  }

  const toggleDetails = () => {
    setShowDetails((prev) => {
      const next = !prev;
      if (!prev && next) {
        setTimeout(
          () => scrollRef.current?.scrollToEnd({ animated: true }),
          150
        );
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
        keyboardDismissMode={
          Platform.OS === "ios" ? "interactive" : "on-drag"
        }
        nestedScrollEnabled
        onContentSizeChange={() => {
          if (showDetails) {
            requestAnimationFrame(() =>
              scrollRef.current?.scrollToEnd({ animated: true })
            );
          }
        }}
      >
        {/* TASK NAME */}
        <View style={styles.card}>
          <FormField
            label="Task name"
            helperText="Be specific: 'Study for quiz (30 min)' instead of 'Study'"
            errorText={titleError}
            required
            labelStyle={styles.sectionLabel}
          >
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="e.g., Study for quiz (30 min)"
              returnKeyType="done"
              style={[styles.input, { color: "#374057" }]}
              placeholderTextColor="#A0AEC0"
            />
          </FormField>
        </View>

        {/* DUE DATE & TIME */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Due date</Text>
          <View style={styles.chipRow}>
            {[
              { label: "Today", value: addDays(0) },
              { label: "Tomorrow", value: addDays(1) },
              { label: "This Week", value: addDays(7) },
            ].map((chip) => (
              <Text
                key={chip.label}
                onPress={() => setDueDate(chip.value)}
                style={styles.chip}
              >
                {chip.label}
              </Text>
            ))}
          </View>
          <TextInput
            value={dueDate}
            onChangeText={setDueDate}
            placeholder="YYYY-MM-DD"
            autoCapitalize="none"
            keyboardType="numbers-and-punctuation"
            style={styles.input}
            placeholderTextColor="#A0AEC0"
          />
          {dueDateError ? (
            <Text style={styles.errorText}>{dueDateError}</Text>
          ) : null}
          <Text style={styles.helperText}>
            Tip: Use the quick buttons to avoid typing.
          </Text>

          <Text style={[styles.sectionLabel, { marginTop: 18 }]}>Time</Text>
          <View style={styles.chipRow}>
            {["9:00 AM", "12:00 PM", "2:00 PM", "6:00 PM"].map((slot) => (
              <Text
                key={slot}
                onPress={() => setTime(slot)}
                style={styles.chip}
              >
                {slot}
              </Text>
            ))}
          </View>
          <TextInput
            value={time}
            onChangeText={setTime}
            placeholder="e.g., 2:00 PM"
            autoCapitalize="characters"
            style={styles.input}
            placeholderTextColor="#A0AEC0"
          />
          {timeError ? (
            <Text style={styles.errorText}>{timeError}</Text>
          ) : null}
        </View>

        {/* STATUS & PRIORITY */}
        <View style={styles.rowWrap}>
          <View style={[styles.card, { flex: 1, marginRight: 10 }]}>
            <Text style={styles.sectionLabel}>Status</Text>
            
            <View style={styles.row}>
              {statusOptions.map((opt, idx) => (
                <Button
                  key={opt.value}
                  label={opt.label}
                  variant={status === opt.value ? "primary" : "outline"}
                  onPress={() => setStatus(opt.value)}
                  style={{
                    flex: 1,
                    marginRight: idx === statusOptions.length - 1 ? 0 : 8,
                  }}
                />
              ))}
            </View>
          </View>
          <View style={[styles.card, { flex: 1 }]}>
            <Text style={styles.sectionLabel}>Priority</Text>
            <Text style={styles.helperText}>
              Low = can wait, Medium = normal, High = urgent
            </Text>
            <View style={styles.row}>
              {priorityOptions.map((opt, idx) => (
                <Button
                  key={opt.value}
                  label={opt.label}
                  variant={priority === opt.value ? "primary" : "outline"}
                  onPress={() => setPriority(opt.value)}
                  style={{
                    flex: 1,
                    marginRight: idx === priorityOptions.length - 1 ? 0 : 8,
                  }}
                />
              ))}
            </View>
          </View>
        </View>

        {/* OPTIONAL DETAILS */}
        <View style={styles.card}>
          <Text
            onPress={toggleDetails}
            style={styles.toggleDetails}
          >
            {showDetails ? "Hide details" : "Add details (optional)"}
          </Text>
          {showDetails ? (
            <FormField label="Description (Optional)" labelStyle={styles.sectionLabel}>
              <TextArea
                value={description}
                onChangeText={setDescription}
                placeholder="Notes, steps, or reminders…"
                style={styles.textArea}
                placeholderTextColor="#A0AEC0"
              />
            </FormField>
          ) : null}
        </View>

        {/* ACTIONS */}
        <View style={styles.actionsRow}>
          {onCancel ? (
            <Button
              label="Cancel"
              variant="outline"
              onPress={onCancel}
              style={{ flex: 1, marginRight: 12 }}
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

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 20,
    marginTop: 4,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#D9DCE3",
    padding: 18,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#6B7280",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D9DCE3",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#F7F8FA",
    marginBottom: 8,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 8,
    gap: 8,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#D9DCE3",
    marginRight: 10,
    marginBottom: 10,
    fontWeight: "700",
    color: "#2F5BD2",
    backgroundColor: "#F7F8FA",
    fontSize: 14,
    overflow: "hidden",
  },
  errorText: {
    fontSize: 12,
    color: "crimson",
    marginBottom: 2,
  },
  helperText: {
    fontSize: 12,
    color: "#555",
    marginBottom: 6,
    marginTop: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  rowWrap: {
    flexDirection: "row",
    marginBottom: 20,
  },
  toggleDetails: {
    fontWeight: "800",
    paddingVertical: 6,
    marginBottom: 10,
    color: "#2F5BD2",
    fontSize: 15,
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#D9DCE3",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#F7F8FA",
    minHeight: 80,
    textAlignVertical: "top",
  },
  actionsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
    marginBottom: 40,
  },
});