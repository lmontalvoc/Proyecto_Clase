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
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { ThemeContext } from "../theme/ThemeContext";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "../navigation/types";

const logo = require("../assets/logo.png");

type Props = NativeStackScreenProps<AuthStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { mode, setMode, theme } = useContext(ThemeContext);

  const handleLogin = async (): Promise<void> => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      alert(error.message || "Error al iniciar sesión");
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

        <Text style={[styles.title, { color: theme.text }]}>Bienvenido</Text>
        <Text style={[styles.subtitle, { color: theme.text }]}>Inicia sesión para continuar</Text>

        <View style={styles.form}>
          <TextInput
            style={[styles.input, { backgroundColor: theme.card, color: theme.text }]}
            placeholder="Email"
            placeholderTextColor={theme.text === "#000" ? "#999" : "#888"}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={[styles.input, { backgroundColor: theme.card, color: theme.text }]}
            placeholder="Contraseña"
            placeholderTextColor={theme.text === "#000" ? "#999" : "#888"}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity style={[styles.primaryButton, { backgroundColor: theme.button }]} onPress={handleLogin} disabled={loading}>
            <Text style={[styles.primaryButtonText, { color: theme.buttonText }]}>{loading ? "Ingresando..." : "Iniciar sesión"}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.forgotButton} onPress={() => navigation.navigate("ResetPassword")}>
            <Text style={[styles.forgotButtonText, { color: theme.text }]}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.ghostButton} onPress={() => navigation.navigate("Register")}>
            <Text style={[styles.ghostButtonText, { color: theme.button }]}>Crear cuenta</Text>
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
  logo: { width: 140, height: 140, marginBottom: 16 },
  title: { fontSize: 26, fontWeight: "700", marginBottom: 6 },
  subtitle: { marginBottom: 20 },
  form: { width: "100%", maxWidth: 380, alignItems: "center" },
  input: {
    width: "100%",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    elevation: 1,
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
  forgotButton: { marginTop: 12, paddingVertical: 8 },
  forgotButtonText: { fontSize: 13, fontWeight: "500" },
  ghostButton: { marginTop: 12 },
  ghostButtonText: { color: "#4A90E2" },
});
