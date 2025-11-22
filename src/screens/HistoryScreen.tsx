import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { useAppSelector } from '../store/hooks';

const HistoryScreen = () => {
  const detections = useAppSelector(state => state.detections.items);
  return (
    <View style={styles.container}>
      {detections.length === 0 ? (
        <Text>No hay detecciones aún.</Text>
      ) : (
        <FlatList
          data={detections}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={{ uri: item.imageUri }} style={styles.thumb} />
              <View style={styles.info}>
                <Text style={styles.label}>{item.label}</Text>
                <Text>{item.confidence}% • {item.createdAt}</Text>
                {item.notes ? <Text style={styles.notes}>{item.notes}</Text> : null}
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'center',
  },
  thumb: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  label: {
    fontWeight: 'bold',
  },
  notes: {
    fontStyle: 'italic',
    marginTop: 2,
  },
});

export default HistoryScreen;
