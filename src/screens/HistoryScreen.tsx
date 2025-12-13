import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { auth, db } from '../firebase/firebaseConfig';
import { collection, query, orderBy, onSnapshot, DocumentData } from 'firebase/firestore';

const HistoryScreen = ({ navigation }: any) => {
  const [items, setItems] = useState<Array<DocumentData>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setItems([]);
      setLoading(false);
      return;
    }

    const ref = collection(db, 'users', user.uid, 'history');
    const q = query(ref, orderBy('createdAt', 'desc'));

    const unsub = onSnapshot(
      q,
      (snap) => {
        const arr: any[] = [];
        snap.forEach((d) => arr.push({ id: d.id, ...d.data() }));
        setItems(arr);
        setLoading(false);
      },
      (e) => {
        console.log('History snapshot error', e);
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historial</Text>

      {items.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>No hay imágenes guardadas aún.</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() =>
                navigation.navigate('ResultScreen', {
                  imageUri: item.imageUrl,
                  prediction: item.label,
                })
              }
            >
              <Image source={{ uri: item.imageUrl }} style={styles.thumb} />

              <View style={{ flex: 1 }}>
                <Text style={styles.label}>{item.label}</Text>
                <Text style={styles.date}>
                  {item.createdAt?.toDate
                    ? item.createdAt.toDate().toLocaleString()
                    : ''}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyBox: { alignItems: 'center', marginTop: 40 },
  emptyText: { fontSize: 16, color: '#666', fontStyle: 'italic' },
  card: {
    flexDirection: 'row',
    backgroundColor: '#f4f4f6',
    padding: 12,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: 'center',
  },
  thumb: { width: 90, height: 90, borderRadius: 8, marginRight: 12 },
  label: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  date: { opacity: 0.6, fontSize: 12, marginBottom: 6 },
});

export default HistoryScreen;
