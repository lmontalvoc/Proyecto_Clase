import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';
import { useDetections } from '../context/DetectionsContext';
import { Detection } from '../types/detection';
import { v4 as uuidv4 } from 'uuid';

type Props = NativeStackScreenProps<RootStackParamList, 'Result'>;

const ResultScreen: React.FC<Props> = ({ route, navigation }) => {
  const { imageUri, label, confidence } = route.params;
  const { addDetection } = useDetections();
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | undefined>();

  const handleSave = () => {
    if (!label) {
      setError('No hay etiqueta para guardar.');
      return;
    }
    setError(undefined);

    const now = new Date();
    const detection: Detection = {
      id: uuidv4(),
      label,
      confidence,
      createdAt: now.toLocaleString(),
      imageUri,
      notes,
    };

    addDetection(detection);
    Alert.alert('Guardado', 'La detección se guardó en el historial.');
    navigation.navigate('Tabs', { screen: 'Historial' });
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: imageUri }} style={styles.image} />
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.confidence}>{confidence}% de confianza</Text>

      <CustomInput
        label="Notas (opcional)"
        placeholder="Ej: Perro que vimos en el parque"
        value={notes}
        onChangeText={setNotes}
        error={error}
      />

      <CustomButton title="Guardar en historial" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    marginBottom: 16,
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  confidence: {
    marginBottom: 16,
  },
});

export default ResultScreen;
