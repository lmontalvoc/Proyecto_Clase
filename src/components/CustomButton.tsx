>>>>>>> development
import React, { useContext } from 'react';
import { TouchableOpacity, Text, StyleSheet, GestureResponderEvent } from 'react-native';
import { ThemeContext } from '../theme/ThemeContext';

interface Props {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
}

const CustomButton: React.FC<Props> = ({ title, onPress }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <TouchableOpacity style={[styles.button, { backgroundColor: theme.button }]} onPress={onPress}>
      <Text style={[styles.text, { color: theme.buttonText }]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  text: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default CustomButton;
