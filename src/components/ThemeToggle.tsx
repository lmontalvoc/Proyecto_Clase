import React, { useContext } from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { ThemeContext } from "../theme/ThemeContext";

export default function ThemeToggle() {
  const { mode, setMode, theme } = useContext(ThemeContext);

  const toggle = () => {
    setMode(mode === "light" ? "dark" : "light");
  };

  return (
    <TouchableOpacity onPress={toggle} style={[styles.button, { backgroundColor: theme.button }]}> 
      <Text style={[styles.text, { color: theme.buttonText }]}>{mode === "light" ? "🌙" : "☀️"}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 10,
  },
  text: {
    fontSize: 18,
  },
});
