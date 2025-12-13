import React, { useContext } from 'react';
import { TextInput, StyleSheet, TextInputProps, View, Text } from 'react-native';
import { ThemeContext } from '../theme/ThemeContext';

interface Props extends TextInputProps {
  label?: string;
  error?: string;
}

const CustomInput: React.FC<Props> = ({ label, error, ...rest }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <View style={styles.container}>
      {label && <Text style={[styles.label, { color: theme.text }]}>{label}</Text>}
      <TextInput
        style={[styles.input, { backgroundColor: theme.card, color: theme.text, borderColor: theme.text + '20' }]}
        placeholderTextColor={theme.text === '#000' ? '#999' : '#888'}
        {...rest}
      />
      {error && <Text style={[styles.error, { color: '#ff6666' }]}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  error: {
    marginTop: 4,
    fontSize: 12,
    color: 'red',
  },
});

export default CustomInput;
