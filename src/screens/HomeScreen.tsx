import React from "react";
import { View, Text } from "react-native";
import CustomButton from "../components/CustomButton";

export default function HomeScreen({ navigation }: any) {
  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, marginBottom: 20 }}>
        Bienvenido a BookeArte
      </Text>

      <CustomButton
        title="Entrar"
        onPress={() => navigation.navigate("Tabs")}
      />
    </View>
  );
}
