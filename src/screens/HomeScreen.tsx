import React, { useEffect, useState, useContext } from "react";
import { View, Text, ActivityIndicator, Image, StyleSheet, TouchableOpacity } from "react-native";
import { auth, db } from "../firebase/firebaseConfig";
import { doc, onSnapshot } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { ThemeContext } from "../theme/ThemeContext";

interface UserData {
  email: string;
  username: string;
}

export default function HomeScreen() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigation = useNavigation<any>();
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    // Intentar cargar datos del usuario en background, pero no bloquear la UI
    const user = auth.currentUser;
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const unsubscribe = onSnapshot(
      userRef,
      (docSnap) => {
        if (docSnap.exists()) setUserData(docSnap.data() as UserData);
      },
      (error) => console.log("Error al escuchar cambios:", error)
    );

    return () => unsubscribe();
  }, []);

  // Show description always; show user info if available
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}> 
      <Image source={require('../assets/logo.png')} style={styles.logo} />

      <Text style={[styles.title, { color: theme.text }]}>¿Qué es esto?</Text>
      <Text style={[styles.subtitle, { color: theme.text }]}>Una app que identifica objetos al momento usando visión por IA.</Text>

      <View style={[styles.card, { backgroundColor: theme.card }]}> 
        <Text style={[styles.cardTitle, { color: theme.text }]}>Cómo funciona</Text>
        <Text style={[styles.step, { color: theme.text }]}>• Ve a la pestaña Cámara.</Text>
        <Text style={[styles.step, { color: theme.text }]}>• Apunta al objeto que quieras identificar.</Text>
        <Text style={[styles.step, { color: theme.text }]}>• Recibirás el resultado al instante gracias a IA.</Text>

        <Text style={[styles.note, { color: theme.text }]}>Las fotos no se guardan en el historial; sólo se usan temporalmente para la detección.</Text>
      </View>

      {userData && (
        <Text style={[styles.info, { color: theme.text }]}>Conectado como: {userData.username || userData.email}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 8 },
  notFound: { fontSize: 16 },
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  logo: { width: 120, height: 120, marginBottom: 16 },
  title: { fontSize: 26, fontWeight: "800", marginBottom: 8 },
  subtitle: { fontSize: 16, textAlign: "center", maxWidth: 560, marginBottom: 10, opacity: 0.95 },
  card: { width: '100%', maxWidth: 520, padding: 18, borderRadius: 14, alignItems: 'flex-start', marginTop: 8 },
  cardTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  step: { fontSize: 15, marginBottom: 6, lineHeight: 20 },
  note: { fontSize: 13, marginTop: 8, opacity: 0.85 },
  cta: { marginTop: 14, paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10 },
  ctaText: { fontSize: 16, fontWeight: '700' },
  actions: { width: "100%", alignItems: "center" },
});
