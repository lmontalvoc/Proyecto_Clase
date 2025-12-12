import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Camera, useCameraPermissions, CameraView } from 'expo-camera';
import CustomButton from '../components/CustomButton';
import { useNavigation } from '@react-navigation/native';

async function fakeClassifyImage(uri: string): Promise<{ label: string; confidence: number }> {
  // Simulación mientras conectamos ML Kit real
  const labels = ['Perro', 'Gato', 'Planta', 'Persona', 'Objeto desconocido'];
  const randomIndex = Math.floor(Math.random() * labels.length);
  const confidence = 60 + Math.floor(Math.random() * 40);
  return {
    label: labels[randomIndex],
    confidence,
  };
}

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
    <View style={styles.container}>
      <Text style={styles.title}>Tomá una foto</Text>

      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.preview} />
      )}

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={takePhoto}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
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
