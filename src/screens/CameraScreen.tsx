import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { identifyImageWithOpenAI } from '../utils/openaiVisionService';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../theme/ThemeContext';

async function fakeClassifyImage(uri: string): Promise<string> {
  const labels = ['Perro', 'Gato', 'Planta', 'Persona', 'Objeto desconocido'];
  const randomIndex = Math.floor(Math.random() * labels.length);
  return labels[randomIndex];
}

export default function CameraScreen() {
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    // no-op: permissions requested on demand by ImagePicker
  }, []);

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'No se concedió acceso a la cámara.');
        return;
      }

      setLoading(true);
      const result = await ImagePicker.launchCameraAsync({ quality: 0.6 });
      setLoading(false);

      const uri = (result as any).uri || ((result as any).assets && (result as any).assets[0]?.uri);
      if (!uri) return;

      setPhotoUri(uri);

      // Leer la imagen como base64 y enviar a OpenAI Vision
      setLoading(true);
      const base64 = await FileSystem.readAsStringAsync(uri, { encoding: 'base64' as any });
      const prediction = await identifyImageWithOpenAI(base64);
      setLoading(false);

      navigation.navigate('ResultScreen', { imageUri: uri, prediction });
    } catch (error) {
      setLoading(false);
      console.log('❌ Error CameraScreen:', error);
      Alert.alert('Error', 'Ocurrió un problema procesando la imagen.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}> 
      <Text style={[styles.title, { color: theme.text }]}>Tomá una foto</Text>

      {photoUri && <Image source={{ uri: photoUri }} style={styles.preview} />}

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled, { backgroundColor: theme.button }]}
        onPress={takePhoto}
        disabled={loading}
      >
        <Text style={[styles.buttonText, { color: theme.buttonText }]}> {loading ? 'Abrir cámara...' : 'Abrir cámara'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  cameraWrapper: {
    width: 320,
    height: 240,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
  },
  camera: { flex: 1 },
  cameraPlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#eee' },
  preview: {
    width: 260,
    height: 260,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#ccc',
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 10,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { fontSize: 16, fontWeight: 'bold' },
});
