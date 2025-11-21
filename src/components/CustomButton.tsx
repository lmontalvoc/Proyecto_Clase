import React from "react";
import { TouchableOpacity, Text } from "react-native";

type Props = {
  title: string;
  onPress: () => void;
};

export default function CustomButton({ title, onPress }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: "#1E88E5",
        padding: 12,
        borderRadius: 8,
        marginVertical: 8,
      }}
    >
      <Text style={{ color: "#fff", textAlign: "center", fontSize: 16 }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}
