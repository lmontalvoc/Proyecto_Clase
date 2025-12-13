import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import CustomButton from '../components/CustomButton';

export default function ResultScreen({ route, navigation }: any) {
  const { imageUri, prediction } = route.params;

  return (
    <View style={styles.container}>
      {imageUri ? <Image source={{ uri: imageUri }} style={styles.image} /> : null}

      <Text style={styles.label}>Objeto identificado:</Text>
      <Text style={styles.prediction}>{prediction || 'No identificado'}</Text>

      <CustomButton title="Volver" onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' },
  image: { width: '90%', height: 300, borderRadius: 12, marginBottom: 24 },
  label: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  prediction: { fontSize: 20, fontWeight: '800', textAlign: 'center', marginBottom: 18 },
});
