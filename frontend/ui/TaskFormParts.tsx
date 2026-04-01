import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ViewStyle,
} from "react-native";

/**
 * Brand colors - Georgia State
 */
const COLORS = {
  primaryBlue: "#0039A6",
  white: "#FFFFFF",
  redAccent: "#CC0000",
  blueSteel: "#374057",
  vibrantBlue: "#00AEEF",
};

/** SPACING SCALE across all form components */
const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
} as const;

/**FormField - wrapper for form inputs */
interface FormFieldProps {
  label: string;
  helperText?: string;
  errorText?: string;
  required?: boolean;
  children: React.ReactNode;
  style?: ViewStyle;
}

export function FormField({
  label,
  helperText,
  errorText,
  required = false,
  children,
  style,
}: FormFieldProps) {
  const hasError = !!errorText;

  return (
    <View style={[styles.fieldContainer, style]}>
      {/* Label - clear and prominent */}
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>

      {/* Helper text - guidance without overwhelming */}
      {helperText && !hasError && (
        <Text style={styles.helperText}>{helperText}</Text>
      )}

      {/* Input children */}
      <View
        style={[
          styles.inputWrapper,
          hasError && styles.inputWrapperError,
        ]}
      >
        {children}
      </View>

      {/* Error message - clear, red, helpful */}
      {errorText && <Text style={styles.errorText}>{errorText}</Text>}
    </View>
  );
}

/** TextArea - Multi-line text input for descriptions */
interface TextAreaProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  maxLength?: number;
  editable?: boolean;
}

export function TextArea({
  placeholder = "Enter description...",
  value,
  onChangeText,
  maxLength,
  editable = true,
}: TextAreaProps) {
  return (
    <TextInput
      style={styles.textarea}
      placeholder={placeholder}
      placeholderTextColor="#999"
      value={value}
      onChangeText={onChangeText}
      maxLength={maxLength}
      multiline
      numberOfLines={5}
      editable={editable}
      textAlignVertical="top"
    />
  );
}

/** ChipGroup - Priority selector (low/medium/high)*/
type Priority = "low" | "medium" | "high";

interface ChipGroupProps {
  value: Priority;
  onChange: (priority: Priority) => void;
  disabled?: boolean;
}

export function ChipGroup({
  value,
  onChange,
  disabled = false,
}: ChipGroupProps) {
  const options: Array<{ value: Priority; label: string; emoji: string }> = [
    { value: "low", label: "Low", emoji: "🟢" },
    { value: "medium", label: "Medium", emoji: "🟡" },
    { value: "high", label: "High", emoji: "🔴" },
  ];

  return (
    <View style={styles.chipGroupContainer}>
      {options.map((option) => {
        const isSelected = value === option.value;

        return (
          <Pressable
            key={option.value}
            onPress={() => !disabled && onChange(option.value)}
            disabled={disabled}
            style={[
              styles.chip,
              isSelected && styles.chipSelected,
              disabled && styles.chipDisabled,
            ]}
          >
            <Text
              style={[
                styles.chipText,
                isSelected && styles.chipTextSelected,
              ]}
            >
              {option.emoji} {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  // form field
  fieldContainer: {
    marginBottom: SPACING.lg,
    gap: SPACING.sm,
  },
  label: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.blueSteel,
    marginBottom: SPACING.xs,
  },
  required: {
    color: COLORS.redAccent,
    fontWeight: "900",
  },
  helperText: {
    fontSize: 13,
    color: "#666",
    opacity: 0.7,
    marginBottom: SPACING.xs,
  },
  inputWrapper: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 8,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.white,
  },
  inputWrapperError: {
    borderColor: COLORS.redAccent,
    borderWidth: 2,
  },
  errorText: {
    fontSize: 13,
    color: COLORS.redAccent,
    fontWeight: "500",
    marginTop: SPACING.xs,
  },

  // textarea
  textarea: {
    fontSize: 16,
    color: COLORS.blueSteel,
    paddingVertical: SPACING.md,
    paddingHorizontal: 0,
    minHeight: 100, 
    lineHeight: 22,
  },

  // status chips 
  chipGroupContainer: {
    flexDirection: "row",
    gap: SPACING.md,
    justifyContent: "space-between",
  },
  chip: {
    flex: 1,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#CCC",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.white,
    minHeight: 48, // ADHD: Large tap target
  },
  chipSelected: {
    backgroundColor: COLORS.primaryBlue,
    borderColor: COLORS.primaryBlue,
  },
  chipDisabled: {
    opacity: 0.5,
  },
  chipText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.blueSteel,
    textAlign: "center",
  },
  chipTextSelected: {
    color: COLORS.white,
  },
});
