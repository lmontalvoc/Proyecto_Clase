import React, { useContext } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { ThemeContext } from "../theme/ThemeContext";
import { useNavigation } from "@react-navigation/native";

export default function HomeScreen() {
  const { theme } = useContext(ThemeContext);
  const navigation = useNavigation<any>();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Image source={require("../assets/logo.png")} style={styles.logo} />
      <Text style={[styles.title, { color: theme.text }]}>¿Qué Es Esto?</Text>
      <Text style={[styles.subtitle, { color: theme.text }]}>
        Apunta la cámara a un objeto y deja que la app intente identificarlo.
      </Text>

      <TouchableOpacity
        style={[styles.btn, { backgroundColor: theme.button }]}
        onPress={() => navigation.navigate("Cámara")}
      >
        <Text style={[styles.btnTxt, { color: theme.buttonText }]}>
          Abrir Cámara
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.btnSecondary]}
        onPress={() => navigation.navigate("Apariencia")}
      >
        <Text style={{ color: theme.text }}>Cambiar apariencia</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  logo: { width: 140, height: 140, marginBottom: 20 },
  title: { fontSize: 28, fontWeight: "bold" },
  subtitle: { fontSize: 16, textAlign: "center", marginBottom: 20 },
  btn: {
    padding: 12,
    paddingHorizontal: 35,
    borderRadius: 12,
    marginTop: 10,
  },
  btnTxt: { fontSize: 16, fontWeight: "bold" },
  btnSecondary: {
    marginTop: 20,
    padding: 10,
    paddingHorizontal: 30,
    borderRadius: 12,
  },
});
