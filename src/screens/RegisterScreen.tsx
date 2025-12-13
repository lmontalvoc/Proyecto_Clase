import React, { useState, useContext } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig";
import { ThemeContext } from "../theme/ThemeContext";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "../navigation/types";

const logo = require("../assets/logo.png");

type Props = NativeStackScreenProps<AuthStackParamList, "Register">;

export default function RegisterScreen({ navigation }: Props) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { mode, setMode, theme } = useContext(ThemeContext);

  const handleRegister = async (): Promise<void> => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      await setDoc(doc(db, "users", userCredential.user.uid), {
        email,
        username,
        createdAt: new Date(),
      });

      navigation.navigate("Login");
    } catch (error: any) {
      alert(error.message || "Error al crear cuenta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.screen, { backgroundColor: theme.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.header}>
        <Text style={[styles.appName, { color: theme.text }]}>¿Qué Es Esto?</Text>
        <TouchableOpacity onPress={() => setMode(mode === "light" ? "dark" : "light")}>
          <Text style={styles.themeButton}>{mode === "light" ? "🌙" : "☀️"}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <Image source={logo} style={styles.logo} resizeMode="contain" />

        <Text style={[styles.title, { color: theme.text }]}>Crear cuenta</Text>
        <Text style={[styles.subtitle, { color: theme.text }]}>Únete y comienza a usar la app</Text>

        <View style={styles.form}>
          <TextInput
            style={[styles.input, { backgroundColor: theme.card, color: theme.text }]}
            placeholder="Usuario"
            placeholderTextColor={theme.text === "#000" ? "#999" : "#888"}
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            style={[styles.input, { backgroundColor: theme.card, color: theme.text }]}
            placeholder="Email"
            placeholderTextColor={theme.text === "#000" ? "#999" : "#888"}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={[styles.input, { backgroundColor: theme.card, color: theme.text }]}
            placeholder="Contraseña"
            placeholderTextColor={theme.text === "#000" ? "#999" : "#888"}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity style={[styles.primaryButton, { backgroundColor: theme.button }]} onPress={handleRegister} disabled={loading}>
            <Text style={[styles.primaryButtonText, { color: theme.buttonText }]}>{loading ? "Creando..." : "Crear cuenta"}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.ghostButton} onPress={() => navigation.navigate("Login")}> 
            <Text style={[styles.ghostButtonText, { color: theme.button }]}>Volver a iniciar sesión</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  appName: {
    fontSize: 20,
    fontWeight: "700",
  },
  themeButton: {
    fontSize: 24,
  },
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  logo: { width: 120, height: 120, marginBottom: 12 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 4 },
  subtitle: { marginBottom: 16 },
  form: { width: "100%", maxWidth: 380, alignItems: "center" },
  input: {
    width: "100%",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  primaryButton: {
    width: "100%",
    backgroundColor: "#4A90E2",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 6,
  },
  primaryButtonText: { color: "#fff", fontWeight: "600" },
  ghostButton: { marginTop: 12 },
  ghostButtonText: { color: "#4A90E2" },
});
