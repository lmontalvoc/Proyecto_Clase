import React, { useState, useContext } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useDispatch } from "react-redux";
import { addHistory } from "../store/slices/historySlice";
import { v4 as uuid } from "uuid";
import { ThemeContext } from "../theme/ThemeContext";

export default function ResultScreen({ route, navigation }: any) {
  const { imageUri, prediction } = route.params;

  const [notes, setNotes] = useState("");
  const dispatch = useDispatch();
  const { theme } = useContext(ThemeContext);

  const handleSave = () => {
    const payload = {
      id: uuid(),
      imageUri,
      label: prediction,
      confidence: null, // Clarifai no devuelve un valor usable
      notes,
      date: new Date().toLocaleString(),
    };

    dispatch(addHistory(payload));

    Alert.alert("Guardado", "La detección se guardó en el historial.");
    navigation.navigate("Tabs", { screen: "Historial" });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }] }>
      <Image source={{ uri: imageUri }} style={styles.image} />

      <Text style={[styles.label, { color: theme.text }]}>
        Objeto identificado: {prediction || "No identificado"}
      </Text>

      <TextInput
        placeholder="Notas (opcional)"
        placeholderTextColor={theme.text === "#000" ? "#666" : "#999"}
        style={[styles.input, { backgroundColor: theme.card, color: theme.text }]}
        value={notes}
        onChangeText={setNotes}
      />

      <TouchableOpacity style={[styles.btn, { backgroundColor: theme.button }]} onPress={handleSave}>
        <Text style={[styles.btnTxt, { color: theme.buttonText }]}>Guardar en historial</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  image: { width: "100%", height: 250, borderRadius: 12, marginBottom: 20 },
  label: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    height: 70,
    padding: 10,
    marginBottom: 20,
  },
  btn: {
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  btnTxt: { fontWeight: "bold" },
});
