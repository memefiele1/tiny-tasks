//Tiffany Santiago Garcia
// helper components that wrap form inputs with labels , help text and error messages for consistent form field styling

import React from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';

type FormFieldProps = {
  label: string;
  helperText?: string;
  errorText?: string;
  required?: boolean;
  children: React.ReactNode;
};

export function FormField({
  label,
  helperText,
  errorText,
  required,
  children,
}: FormFieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>
        {label}
        {required ? ' *' : ''}
      </Text>
      {children}
      {helperText ? <Text style={styles.helper}>{helperText}</Text> : null}
      {errorText ? <Text style={styles.error}>{errorText}</Text> : null}
    </View>
  );
}

type TextAreaProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  style?: StyleProp<TextStyle>;
};

export function TextArea({
  value,
  onChangeText,
  placeholder,
  style,
}: TextAreaProps) {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      multiline
      style={[styles.textArea, style]}
    />
  );
}

type ChipGroupProps<T extends string> = {
  value: T;
  onChange: (val: T) => void;
  options: { label: string; value: T }[];
  equalWidth?: boolean; // for status row
  style?: StyleProp<ViewStyle>;      // container override
  buttonStyle?: StyleProp<ViewStyle>; // individual button override
};

export function ChipGroup<T extends string>({
  value,
  onChange,
  options,
  equalWidth = false,
  style,
  buttonStyle,
}: ChipGroupProps<T>) {
  return (
    <View style={[styles.chipContainer, style]}>
      {options.map((opt, idx) => {
        const selected = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
            style={({ pressed }) => [
              styles.chip,
              equalWidth && { flex: 1, marginRight: idx === options.length - 1 ? 0 : 10 },
              selected && styles.chipSelected,
              pressed && styles.chipPressed,
              buttonStyle,
            ]}
          >
            <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  field: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '700', marginBottom: 4 },
  helper: { fontSize: 12, color: '#555' },
  error: { fontSize: 12, color: 'crimson' },
  textArea: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  chipContainer: { flexDirection: 'row' },
  chip: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,    // same radius as status buttons
    borderWidth: 1,
    alignItems: 'center',
    marginRight: 8,
  },
  chipSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
    opacity: 1,
  },
  chipPressed: {
    opacity: 0.7,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  chipTextSelected: {
    color: '#fff',
  },
});