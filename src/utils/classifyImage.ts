import { HUGGING_FACE_API_KEY, GOOGLE_VISION_API_KEY } from "../config/google.config";
import { classifyImageLocalCanvas } from "./localClassifier";

// Función auxiliar para convertir URI a base64
async function uriToBase64(uri: string): Promise<string> {
  // Si es una URI local (file://)
  if (uri.startsWith("file://")) {
    // Para React Native, usar fetch directamente
    const response = await fetch(uri);
    const blob = await response.blob();
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        const base64String = result.split(",")[1];
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  // Si es una URL remota
  const response = await fetch(uri);
  const blob = await response.blob();
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      const base64String = result.split(",")[1];
      resolve(base64String);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// Función para usar Hugging Face (gratuita)
async function classifyWithHuggingFace(base64: string): Promise<any> {
  if (!HUGGING_FACE_API_KEY) {
    throw new Error("No hay API key de Hugging Face configurada");
  }

  // Usar el nuevo endpoint con modelo específico
  const response = await fetch(
    "https://router.huggingface.co/models/facebook/detr-resnet-50",
    {
      headers: { 
        Authorization: `Bearer ${HUGGING_FACE_API_KEY}`,
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        inputs: base64,
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Respuesta de error:", errorText);
    throw new Error(`Error en Hugging Face API: ${response.status}`);
  }

  return response.json();
}

// Función para usar Google Vision (requiere facturación)
async function classifyWithGoogleVision(base64: string): Promise<any> {
  if (!GOOGLE_VISION_API_KEY) {
    throw new Error("No hay API key de Google Vision configurada");
  }

  const body = {
    requests: [
      {
        image: { content: base64 },
        features: [
          { type: "LABEL_DETECTION", maxResults: 10 },
          { type: "OBJECT_LOCALIZATION", maxResults: 10 },
          { type: "WEB_DETECTION", maxResults: 5 },
        ],
      },
    ],
  };

  const response = await fetch(
    `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_VISION_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );

  const json = await response.json();

  if (json.error) {
    throw new Error(json.error.message || "Error en Google Vision API");
  }

  return json;
}

export async function classifyImage(uri: string) {
  try {
    // Convertir imagen URI a base64
    const base64 = await uriToBase64(uri);

    let result: any = null;

    // Intentar primero con Hugging Face (gratuita)
    if (HUGGING_FACE_API_KEY) {
      try {
        console.log("Usando Hugging Face API para reconocimiento...");
        const hfResult = await classifyWithHuggingFace(base64);
        result = parseHuggingFaceResult(hfResult);
        if (result.label !== "Objeto no identificado") {
          return result;
        }
      } catch (hfError) {
        console.warn("Error con Hugging Face:", hfError);
      }
    }

    // Si falla Hugging Face, intentar con Google Vision
    if (GOOGLE_VISION_API_KEY) {
      try {
        console.log("Usando Google Cloud Vision API...");
        const gvResult = await classifyWithGoogleVision(base64);
        result = parseGoogleVisionResult(gvResult);
        if (result.label !== "Objeto no identificado") {
          return result;
        }
      } catch (gvError) {
        console.warn("Error con Google Vision:", gvError);
      }
    }

    return {
      label: "Objeto no identificado",
      confidence: 0,
      message: "Configura una API key en las variables de entorno",
    };
  } catch (err) {
    console.error("Error identificando imagen:", err);
    return {
      label: "Error al procesar imagen",
      confidence: 0,
    };
  }
}

// Parser para resultados de Hugging Face
function parseHuggingFaceResult(data: any[]): any {
  if (!Array.isArray(data) || data.length === 0) {
    return { label: "Objeto no identificado", confidence: 0 };
  }

  const best = data[0];
  return {
    label: best.label || "Objeto detectado",
    confidence: Math.round((best.score || 0) * 100),
    type: "huggingface",
  };
}

// Parser para resultados de Google Vision
function parseGoogleVisionResult(json: any): any {
  if (!json.responses || !json.responses[0]) {
    return { label: "Objeto no identificado", confidence: 0 };
  }

  const responseData = json.responses[0];

  // Intentar obtener del reconocimiento de objetos primero
  if (
    responseData.localizedObjectAnnotations &&
    responseData.localizedObjectAnnotations.length > 0
  ) {
    const best = responseData.localizedObjectAnnotations[0];
    return {
      label: best.name,
      confidence: Math.round(best.score * 100),
      type: "object",
    };
  }

  // Si no hay objetos, intentar con etiquetas
  if (
    responseData.labelAnnotations &&
    responseData.labelAnnotations.length > 0
  ) {
    const best = responseData.labelAnnotations[0];
    return {
      label: best.description,
      confidence: Math.round(best.score * 100),
      type: "label",
    };
  }

  // Como último recurso, intentar con Web Detection
  if (
    responseData.webDetection &&
    responseData.webDetection.webEntities &&
    responseData.webDetection.webEntities.length > 0
  ) {
    const best = responseData.webDetection.webEntities[0];
    return {
      label: best.description || best.entityId || "Objeto encontrado",
      confidence: Math.round((best.score || 0) * 100),
      type: "web",
    };
  }

  return { label: "Objeto no identificado", confidence: 0 };
}
