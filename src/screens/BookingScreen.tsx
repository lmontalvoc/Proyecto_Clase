import React from "react";
import { View, Text, FlatList } from "react-native";

const bookings = [
  { id: "1", cliente: "Ana López", fecha: "2025-11-22", hora: "2:00 PM" },
  { id: "2", cliente: "Carlos Ruiz", fecha: "2025-11-23", hora: "11:00 AM" },
  { id: "3", cliente: "María González", fecha: "2025-11-25", hora: "4:30 PM" },
];

export default function BookingScreen() {
  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, marginBottom: 10 }}>
        Reservas de clientes
      </Text>

      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ paddingVertical: 10 }}>
            <Text>Cliente: {item.cliente}</Text>
            <Text>Fecha: {item.fecha}</Text>
            <Text>Hora: {item.hora}</Text>
          </View>
        )}
      />
    </View>
  );
}
