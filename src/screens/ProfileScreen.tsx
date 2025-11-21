import React, { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";

export default function ProfileScreen() {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [saved, setSaved] = useState(false);

  return (
    <View style={{ padding: 20 }}>
      <Text>Nombre</Text>
      <TextInput
        placeholder="Ingresa tu nombre"
        value={name}
        onChangeText={setName}
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />

      <Text>Bio</Text>
      <TextInput
        placeholder="Escribe una bio"
        value={bio}
        onChangeText={setBio}
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />

      <Button title="Guardar" onPress={() => setSaved(true)} />

      {saved && (
        <Text style={{ marginTop: 20 }}>
          Guardado: {name} – {bio}
        </Text>
      )}
    </View>
  );
}
