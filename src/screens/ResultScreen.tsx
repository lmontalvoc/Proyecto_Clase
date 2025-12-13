import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import CustomButton from '../components/CustomButton';
import { auth, db } from '../firebase/firebaseConfig';
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  getDocs,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { ThemeContext } from '../theme/ThemeContext';

export default function ResultScreen({ route, navigation }: any) {
  const { imageUri, prediction } = route.params || {};
  const [saved, setSaved] = useState(false);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    let mounted = true;

    async function saveHistory() {
      try {
        const user = auth.currentUser;
        if (!user || !imageUri || saved) return;

        const refCol = collection(db, 'users', user.uid, 'history');

        await addDoc(refCol, {
          label: prediction || 'No identificado',
          imageUrl: imageUri,
          createdAt: serverTimestamp(),
        });

        const q = query(refCol, orderBy('createdAt', 'asc'));
        const snap = await getDocs(q);

        if (snap.size > 5) {
          const toDelete = snap.docs.slice(0, snap.size - 5);
          for (const d of toDelete) {
            await deleteDoc(doc(refCol, d.id));
          }
        }

        if (mounted) setSaved(true);
      } catch (e) {
        console.log('Error saving history:', e);
      }
    }

    saveHistory();

    return () => {
      mounted = false;
    };
  }, [imageUri, prediction, saved]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {imageUri ? <Image source={{ uri: imageUri }} style={styles.image} /> : null}

      <Text style={[styles.label, { color: theme.text }]}>Objeto identificado:</Text>
      <Text style={[styles.prediction, { color: theme.text }]}>
        {prediction || 'No identificado'}
      </Text>

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
