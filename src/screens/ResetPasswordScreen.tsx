import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<AuthStackParamList, "ResetPassword">;

export default function ResetPasswordScreen({ navigation }: Props) {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleResetPassword = async (): Promise<void> => {
    if (!email.trim()) {
      Alert.alert("Error", "Por favor ingresa tu correo electrónico");
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setSent(true);
      Alert.alert(
        "Correo enviado",
        "Se ha enviado un enlace de restablecimiento de contraseña a tu correo electrónico"
      );
    } catch (error: any) {
      Alert.alert("Error", error.message || "Error al enviar el correo de restablecimiento");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setEmail("");
    setSent(false);
    navigation.navigate("Login");
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Restablecer contraseña</Text>
        <Text style={styles.subtitle}>
          {sent
            ? "Se envió un enlace a tu correo. Revisa tu bandeja de entrada."
            : "Ingresa tu correo electrónico para recibir un enlace de restablecimiento"}
        </Text>

        {!sent ? (
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              editable={!loading}
            />

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleResetPassword}
              disabled={loading}
            >
              <Text style={styles.primaryButtonText}>
                {loading ? "Enviando..." : "Enviar enlace"}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.form}>
            <Text style={styles.successMessage}>
              ✓ Enlace de restablecimiento enviado correctamente
            </Text>
          </View>
        )}

        <TouchableOpacity style={styles.ghostButton} onPress={handleBackToLogin}>
          <Text style={styles.ghostButtonText}>Volver a Iniciar sesión</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f2f6ff" },
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  title: { fontSize: 26, fontWeight: "700", color: "#0b2545", marginBottom: 6, textAlign: "center" },
  subtitle: { color: "#5b6b8a", marginBottom: 30, textAlign: "center", fontSize: 14 },
  form: { width: "100%", maxWidth: 380, alignItems: "center", marginBottom: 16 },
  input: {
    width: "100%",
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    elevation: 1,
    fontSize: 14,
  },
  primaryButton: {
    width: "100%",
    backgroundColor: "#4A90E2",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#4A90E2",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  ghostButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  ghostButtonText: {
    color: "#4A90E2",
    fontSize: 14,
    fontWeight: "600",
  },
  successMessage: {
    color: "#27AE60",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
