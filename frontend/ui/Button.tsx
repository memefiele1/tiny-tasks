//Tiffany Santiago Garcia 
// reusable button component that accepts primary or outline variants 

import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  PressableProps,
  StyleProp,
  ViewStyle,
} from 'react-native';

type Variant = 'primary' | 'outline';

type Props = {
  label: string;
  variant?: Variant;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
} & Omit<PressableProps, 'children' | 'style'>;

export default function Button({
  label,
  variant = 'primary',
  disabled = false,
  style,
  ...rest
}: Props) {
  const isOutline = variant === 'outline';

  return (
    <Pressable
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        isOutline ? styles.outline : styles.primary,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
      {...rest}
    >
      <Text style={[styles.label, isOutline && styles.labelOutline]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: '#007AFF',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  pressed: {
    opacity: 0.7,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  labelOutline: {
    color: '#007AFF',
  },
});