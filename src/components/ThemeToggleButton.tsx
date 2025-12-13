import React, { useContext } from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { ThemeContext } from "../theme/ThemeContext";

export default function ThemeToggleButton() {
  const { mode, setMode, theme } = useContext(ThemeContext);

  const toggle = () => setMode(mode === "light" ? "dark" : "light");

  return (
    <TouchableOpacity
      accessibilityLabel="Toggle theme"
      onPress={toggle}
      style={[styles.btn, { backgroundColor: theme.button }]}
    >
      <Text style={[styles.txt, { color: theme.buttonText }]}>{mode === "light" ? "🌙" : "☀️"}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    position: "absolute",
    right: 16,
    bottom: 90,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
    zIndex: 1000,
  },
  txt: { fontSize: 22 },
});
