import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet } from "react-native";

export default function FuturisticLoader() {
  const rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotate, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const spin = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Animated.View style={[styles.loader, { transform: [{ rotate: spin }] }]} />
  );
}

const styles = StyleSheet.create({
  loader: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 4,
    borderColor: "#00e0ff",
    borderTopColor: "transparent",
    marginVertical: 20,
  },
});
