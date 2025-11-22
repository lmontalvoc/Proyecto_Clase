import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Camera, useCameraPermissions, CameraView } from 'expo-camera';
import CustomButton from '../components/CustomButton';
import { useNavigation } from '@react-navigation/native';

async function fakeClassifyImage(uri: string): Promise<{ label: string; confidence: number }> {
  // Simulación mientras conectan ML Kit real
  const labels = ['Perro', 'Gato', 'Planta', 'Persona', 'Objeto desconocido'];
  const randomIndex = Math.floor(Math.random() * labels.length);
  const confidence = 60 + Math.floor(Math.random() * 40);
  return {
    label: labels[randomIndex],
    confidence,
  };
}

const CameraScreen = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [isProcessing, setIsProcessing] = useState(false);
  const cameraRef = useRef<CameraView | null>(null);
  const navigation = useNavigation<any>();

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission]);

  if (!permission) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text>Se necesita permiso de cámara.</Text>
        <CustomButton title="Dar permiso" onPress={requestPermission} />
      </View>
    );
  }

  const handleCapture = async () => {
    if (!cameraRef.current) return;
    setIsProcessing(true);
    const photo = await cameraRef.current.takePictureAsync({ quality: 0.7 });

    const result = await fakeClassifyImage(photo.uri);

    setIsProcessing(false);
    navigation.navigate('Result', {
      imageUri: photo.uri,
      label: result.label,
      confidence: result.confidence,
    });
  };

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing="back" />
      <View style={styles.bottomBar}>
        {isProcessing ? (
          <ActivityIndicator />
        ) : (
          <CustomButton title="Tomar foto" onPress={handleCapture} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  bottomBar: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CameraScreen;
