import React from "react";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import { useSelector } from "react-redux";

export default function HistoryScreen() {
  const items = useSelector((state: any) => state?.history?.items ?? []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Historial de detecciones</Text>

      {items.map((item) => (
        <View key={item.id} style={styles.card}>
          <Image source={{ uri: item.imageUri }} style={styles.thumb} />

          <View style={{ flex: 1 }}>
            <Text style={styles.label}>{item.label}</Text>
            <Text style={styles.conf}>Confianza: {item.confidence.toFixed(1)}%</Text>
            <Text style={styles.date}>{item.date}</Text>
            {item.notes ? <Text style={styles.notes}>Notas: {item.notes}</Text> : null}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  card: {
    flexDirection: "row",
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 12,
    marginBottom: 15,
  },
  thumb: { width: 90, height: 90, borderRadius: 8, marginRight: 10 },
  label: { fontSize: 18, fontWeight: "bold" },
  conf: { fontSize: 14 },
  date: { opacity: 0.6, fontSize: 12 },
  notes: { marginTop: 5, fontStyle: "italic" },
});
