import React, { useState } from "react";
import { View, Text, Switch } from "react-native";

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <View
      style={{
        flex: 1,
        padding: 20,
        backgroundColor: darkMode ? "#222" : "#fff",
      }}
    >
      <Text style={{ color: darkMode ? "#fff" : "#000" }}>Modo oscuro</Text>

      <Switch
        value={darkMode}
        onValueChange={() => setDarkMode(!darkMode)}
      />
    </View>
  );
}
