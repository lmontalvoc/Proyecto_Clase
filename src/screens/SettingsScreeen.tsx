import React, { useContext } from "react";
import { View, Text, Switch } from "react-native";
import { ThemeContext } from "../theme/ThemeContext";

export default function SettingsScreen() {
  const { theme, mode, setMode } = useContext(ThemeContext);

  return (
    <View
      style={{
        flex: 1,
        padding: 20,
        backgroundColor: theme.background,
      }}
    >
      <Text style={{ color: theme.text, marginBottom: 10 }}>Modo oscuro</Text>

      <Switch
        value={mode === "dark"}
        onValueChange={() => setMode(mode === "light" ? "dark" : "light")}
      />
    </View>
  );
}
