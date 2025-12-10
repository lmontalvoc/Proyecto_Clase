import * as tf from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";
import { Image } from "react-native";

let model: any = null;

// Cargar el modelo de MobileNet (solo una vez)
async function loadModel() {
  if (model) {
    return model;
  }
  console.log("Cargando modelo MobileNet...");
  model = await mobilenet.load();
  console.log("Modelo MobileNet cargado");
  return model;
}

// Clasificar imagen usando MobileNet local
export async function classifyImageLocal(uri: string): Promise<any> {
  try {
    console.log("Iniciando clasificación local...");
    
    // Cargar el modelo
    const loadedModel = await loadModel();

    // Convertir URI a formato que pueda usar TensorFlow
    // En React Native, fetch devuelve un Blob
    const response = await fetch(uri);
    const blob = await response.blob();

    // Crear un elemento Image para que TensorFlow pueda procesarlo
    // En React Native usamos un método alternativo
    const img = new Image();
    img.src = uri;

    // Esperar a que la imagen cargue
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.crossOrigin = "anonymous";
    });

    // Hacer predicción
    const predictions = await loadedModel.classify(img, 5);

    if (!predictions || predictions.length === 0) {
      return {
        label: "Objeto no identificado",
        confidence: 0,
        type: "local",
      };
    }

    const best = predictions[0];
    return {
      label: best.className,
      confidence: Math.round(best.probability * 100),
      type: "local",
      allPredictions: predictions,
    };
  } catch (err) {
    console.error("Error en clasificación local:", err);
    throw err;
  }
}

// Función alternativa usando canvas en web
export async function classifyImageLocalCanvas(base64: string): Promise<any> {
  try {
    console.log("Clasificando con Canvas...");
    
    const loadedModel = await loadModel();

    // Crear elemento canvas
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("No se pudo obtener contexto de canvas");
    }

    // Cargar imagen desde base64
    const img = new Image();
    img.src = `data:image/jpeg;base64,${base64}`;

    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.crossOrigin = "anonymous";
    });

    // Dibujar imagen en canvas
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    // Clasificar
    const predictions = await loadedModel.classify(canvas, 5);

    if (!predictions || predictions.length === 0) {
      return {
        label: "Objeto no identificado",
        confidence: 0,
        type: "local-canvas",
      };
    }

    const best = predictions[0];
    return {
      label: best.className,
      confidence: Math.round(best.probability * 100),
      type: "local-canvas",
      allPredictions: predictions,
    };
  } catch (err) {
    console.error("Error en clasificación con canvas:", err);
    throw err;
  }
}
