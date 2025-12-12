import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useSelector } from "react-redux";
import type { RootState } from "../store";

export default function HistoryScreen({ navigation }: any) {
  const items = useSelector((state: RootState) => state.history.items);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Historial de detecciones</Text>

      {items.length === 0 && (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>No hay detecciones guardadas aún.</Text>
        </View>
      )}

      {items.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.card}
          onPress={() =>
            navigation.navigate("ResultScreen", {
              imageUri: item.imageUri,
              prediction: item.label,
            })
          }
        >
          <Image source={{ uri: item.imageUri }} style={styles.thumb} />

          <View style={{ flex: 1 }}>
            <Text style={styles.label}>{item.label}</Text>
            <Text style={styles.date}>{item.date}</Text>

            {item.notes ? (
              <Text style={styles.notes}>Notas: {item.notes}</Text>
            ) : (
              <Text style={styles.notesEmpty}>Sin notas</Text>
            )}
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },

  emptyBox: {
    alignItems: "center",
    marginTop: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    fontStyle: "italic",
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#eee",
    padding: 12,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: "center",
  },

  thumb: {
    width: 90,
    height: 90,
    borderRadius: 8,
    marginRight: 12,
  },

  label: { fontSize: 18, fontWeight: "bold", marginBottom: 4 },

  date: { opacity: 0.6, fontSize: 12, marginBottom: 6 },

  notes: { marginTop: 2, fontStyle: "italic" },

  notesEmpty: { marginTop: 2, fontStyle: "italic", color: "#777" },
});
