import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { identifyImageWithOpenAI } from '../utils/openaiVisionService';
import { uploadImageWithDescription } from '../utils/uploadImageWithDescription';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../theme/ThemeContext';

export default function CameraScreen() {
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const { theme } = useContext(ThemeContext);

  const takePhoto = async () => {
    setLoading(true);

    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'No se concedió acceso a la cámara.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({ quality: 0.6 });

      const uri =
        (result as any).uri ||
        ((result as any).assets && (result as any).assets[0]?.uri);

      if (!uri) return;

      setPhotoUri(uri);

      // Leer imagen en base64
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: 'base64' as any,
      });

      // 🔍 RECONOCIMIENTO (puede tardar / timeout)
      let prediction = 'No se pudo identificar';
      try {
        prediction = await identifyImageWithOpenAI(base64);
      } catch {
        prediction = 'No se pudo identificar';
      }

      // 👉 NAVEGAR INMEDIATO (NUNCA BLOQUEAR UI)
      navigation.navigate('ResultScreen', {
        imageUri: uri,
        prediction,
      });

      // ☁️ FIREBASE EN BACKGROUND (NO await)
      uploadImageWithDescription({
        uri,
        description: prediction,
      }).catch(() => {
        // Silencioso: no afecta la experiencia
      });

    } catch (error) {
      console.log('❌ Error CameraScreen:', error);
      Alert.alert('Error', 'Ocurrió un problema procesando la imagen.');
    } finally {
      // 🔓 SIEMPRE desbloquea la UI
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Tomá una foto</Text>

      {photoUri && <Image source={{ uri: photoUri }} style={styles.preview} />}

      <TouchableOpacity
        style={[
          styles.button,
          loading && styles.buttonDisabled,
          { backgroundColor: theme.button },
        ]}
        onPress={takePhoto}
        disabled={loading}
      >
        <Text style={[styles.buttonText, { color: theme.buttonText }]}>
          {loading ? 'Procesando...' : 'Abrir cámara'}
        </Text>
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
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
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
