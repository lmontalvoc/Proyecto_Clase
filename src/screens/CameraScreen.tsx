import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

import { identifyImageWithOpenAI } from "../utils/openaiVisionService";
import { ThemeContext } from "../theme/ThemeContext";

export default function CameraScreen({ navigation }: any) {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { theme } = useContext(ThemeContext);

  const takePhoto = async () => {
    try {
      // 1️⃣ Permisos de cámara
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          "Permiso requerido",
          "Necesitas permitir acceso a la cámara."
        );
        return;
      }

      // 2️⃣ Tomar foto
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        base64: true,
        quality: 0.6,
      });

      if (result.canceled) return;

      const uri = result.assets[0].uri;
      const base64 = result.assets[0].base64;

      if (!base64) {
        Alert.alert("Error", "No se pudo obtener la imagen.");
        return;
      }

      setImageUri(uri);
      setLoading(true);

      // 3️⃣ OpenAI Vision (ÚNICO CEREBRO)
      const prediction = await identifyImageWithOpenAI(base64);

      console.log("🧠 OpenAI Vision:", prediction);

      setLoading(false);

      // 4️⃣ Navegar a ResultScreen
      navigation.navigate("ResultScreen", {
        imageUri: uri,
        prediction,
      });
    } catch (error) {
      setLoading(false);
      console.log("❌ Error CameraScreen:", error);
      Alert.alert("Error", "Ocurrió un problema procesando la imagen.");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}> 
      <Text style={[styles.title, { color: theme.text }]}>Tomá una foto</Text>

      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.preview} />
      )}

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled, { backgroundColor: theme.button }]}
        onPress={takePhoto}
        disabled={loading}
      >
        <Text style={[styles.buttonText, { color: theme.buttonText }]}> 
          {loading ? "Analizando..." : "Abrir cámara"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  preview: {
    width: 260,
    height: 260,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#ccc",
  },
  button: {
    backgroundColor: "#222",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
