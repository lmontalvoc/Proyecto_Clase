import React, { useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ThemeContext } from "../theme/ThemeContext";

export default function AppearanceScreen() {
  const { mode, setMode, theme } = useContext(ThemeContext);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Modo de apariencia</Text>

      <TouchableOpacity
        style={[styles.option, mode === "light" && styles.active]}
        onPress={() => setMode("light")}
      >
        <Text style={[styles.txt, { color: theme.text }]}>Modo claro</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.option, mode === "dark" && styles.active]}
        onPress={() => setMode("dark")}
      >
        <Text style={[styles.txt, { color: theme.text }]}>Modo oscuro</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.option, mode === "system" && styles.active]}
        onPress={() => setMode("system")}
      >
        <Text style={[styles.txt, { color: theme.text }]}>Usar modo del sistema</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  option: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 12,
    marginBottom: 15,
  },
  active: { backgroundColor: "#ddd" },
  txt: { fontSize: 18 },
});
