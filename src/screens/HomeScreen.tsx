import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Image, StyleSheet } from "react-native";
import { auth, db } from "../firebase/firebaseConfig";
import { doc, onSnapshot } from "firebase/firestore";

interface UserData {
  email: string;
  username: string;
}

const logo = require("../assets/logo.png");

export default function HomeScreen() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const user = auth.currentUser;

    if (!user) {
      setLoading(false);
      return;
    }

    const userRef = doc(db, "users", user.uid);

    const unsubscribe = onSnapshot(
      userRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setUserData(docSnap.data() as UserData);
        }
        setLoading(false);
      },
      (error) => {
        console.log("Error al escuchar cambios:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Cargando datos...</Text>
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.center}>
        <Text style={styles.notFound}>No hay datos del usuario</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <Image source={logo} style={styles.logo} resizeMode="contain" />
        <Text style={styles.appName}>¿Qué Es Esto?</Text>
        <Text style={styles.welcome}>Bienvenido 👋</Text>
        <Text style={styles.info}>Email: {userData.email}</Text>
        <Text style={styles.info}>Usuario: {userData.username}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f2f6ff", justifyContent: "center", alignItems: "center" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 8, color: "#5b6b8a" },
  notFound: { color: "#5b6b8a" },
  card: {
    width: "90%",
    maxWidth: 540,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    elevation: 3,
  },
  logo: { width: 100, height: 100, marginBottom: 12 },
  appName: { fontSize: 20, fontWeight: "800", color: "#0b2545", marginBottom: 6 },
  welcome: { fontSize: 22, fontWeight: "700", color: "#0b2545", marginBottom: 8 },
  info: { color: "#333", marginTop: 6 },
});
