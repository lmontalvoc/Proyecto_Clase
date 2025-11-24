import React, { useRef, useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { classifyImage } from "../utils/classifyImage";
import { useNavigation } from "@react-navigation/native";

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [flash, setFlash] = useState<"on" | "off">("off");
  const [dots] = useState([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]);

  const cameraRef = useRef<CameraView>(null);
  const navigation = useNavigation<any>();

  useEffect(() => {
    if (!permission) requestPermission();
  }, [permission]);

  useEffect(() => {
    dots.forEach((dot, index) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(dot, {
            toValue: 1,
            duration: 700,
            delay: index * 200,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 700,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
  }, []);

  const handleCapture = async () => {
    if (!cameraRef.current) return;

    const photo = await cameraRef.current.takePictureAsync({
      quality: 0.7,
    });

    const result = await classifyImage(photo.uri);

    navigation.navigate("Result", {
      imageUri: photo.uri,
      label: result.label,
      confidence: result.confidence,
    });

    setFlash("off");
  };

  if (!permission?.granted) {
    return (
      <View style={styles.center}>
        <Text>Necesitas dar permiso de cámara</Text>
        <TouchableOpacity onPress={requestPermission}>
          <Text>Dar permiso</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <CameraView
        ref={cameraRef}
        style={{ flex: 1 }}
        facing="back"
        flash={flash}
      />

      {/* Título estilo Amazon Lens */}
      <View style={styles.header}>
        <Text style={styles.title}>QEE ai</Text>

        <TouchableOpacity onPress={() => setFlash(flash === "off" ? "on" : "off")}>
          <Text style={styles.flash}>{flash === "off" ? "⚡" : "✖️"}</Text>
        </TouchableOpacity>
      </View>

      {/* Cuadro de enfoque */}
      <View style={styles.frame} />

      {/* Dots animados */}
      {dots.map((dot, i) => (
        <Animated.View
          key={i}
          style={[
            styles.dot,
            {
              opacity: dot,
              top: 300 + i * 30,
            },
          ]}
        />
      ))}

      {/* Botón disparador */}
      <View style={styles.captureContainer}>
        <TouchableOpacity style={styles.captureBtn} onPress={handleCapture} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    top: 50,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    zIndex: 10,
  },
  title: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },
  flash: {
    color: "white",
    fontSize: 28,
  },
  frame: {
    position: "absolute",
    top: 150,
    left: 30,
    right: 30,
    bottom: 200,
    borderWidth: 3,
    borderColor: "white",
    borderRadius: 20,
  },
  dot: {
    position: "absolute",
    left: "50%",
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "white",
  },
  captureContainer: {
    position: "absolute",
    bottom: 40,
    width: "100%",
    alignItems: "center",
  },
  captureBtn: {
    width: 85,
    height: 85,
    borderRadius: 50,
    borderWidth: 6,
    borderColor: "white",
    backgroundColor: "white",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
