import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

type Props = {
  options: string[];
  selected: string;
  onSelect: (option: string) => void;
};

const ToggleButton: React.FC<Props> = ({ options, selected, onSelect }) => (
  <View style={styles.toggleRow}>
    {options.map(option => (
      <TouchableOpacity
        key={option}
        style={[
          styles.button,
          selected === option && styles.selectedButton,
        ]}
        onPress={() => onSelect(option)}
        activeOpacity={0.8}
      >
        <Text style={[
          styles.buttonText,
          selected === option && styles.selectedText,
        ]}>
          {option}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);

export default ToggleButton;

const styles = StyleSheet.create({
  toggleRow: {
    flexDirection: 'row',
    borderRadius: 8,
    backgroundColor: '#E4E7ED',
    overflow: 'hidden',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 32,
    backgroundColor: '#E4E7ED',
  },
  selectedButton: {
    backgroundColor: '#4F8CFF',
  },
  buttonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  selectedText: {
    color: '#fff',
    fontWeight: '700',
  },
});