import React, { useState } from "react";
import { View, Text, Image, TextInput, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useDispatch } from "react-redux";
import { addHistory } from "../store/slices/historySlice";
import { v4 as uuid } from "uuid";

export default function ResultScreen({ route, navigation }: any) {
  const { imageUri, label, confidence } = route.params;

  const [notes, setNotes] = useState("");
  const dispatch = useDispatch();

  const handleSave = () => {
    const payload = {
      id: uuid(),
      imageUri,
      label,
      confidence,
      notes,
      date: new Date().toLocaleString(),
    };

    dispatch(addHistory(payload));
    Alert.alert("Guardado", "La detección se guardó en el historial.");
    navigation.navigate("Tabs", { screen: "Historial" });
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: imageUri }} style={styles.image} />

      <Text style={styles.label}>Objeto identificado: {label}</Text>
<<<<<<< HEAD
      <Text style={styles.conf}>Confianza: {confidence.toFixed(1)}%</Text>
=======
      {/* <Text style={styles.conf}>Confianza: {confidence.toFixed(1)}%</Text> */}
>>>>>>> a65a77f759aeb9fd1774d649a1c1ebcf6310bc14

      <TextInput
        placeholder="Notas (opcional)"
        style={styles.input}
        value={notes}
        onChangeText={setNotes}
      />

      <TouchableOpacity style={styles.btn} onPress={handleSave}>
        <Text style={styles.btnTxt}>Guardar en historial</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  image: { width: "100%", height: 250, borderRadius: 12, marginBottom: 20 },
  label: { fontSize: 20, fontWeight: "bold" },
  conf: { marginBottom: 15 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    height: 70,
    padding: 10,
    marginBottom: 20,
  },
  btn: {
    backgroundColor: "#222",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  btnTxt: { color: "white", fontWeight: "bold" },
});
