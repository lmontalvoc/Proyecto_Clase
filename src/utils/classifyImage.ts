import * as FileSystem from "expo-file-system";
import { GOOGLE_VISION_API_KEY } from "../config/google.config";

export async function classifyImage(uri: string) {
  try {
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: 'base64' as any,
    });

    const body = {
      requests: [
        {
          image: { content: base64 },
          features: [{ type: "LABEL_DETECTION", maxResults: 1 }],
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

    const result = json.responses?.[0]?.labelAnnotations?.[0];

    if (!result) {
      return { label: "Objeto no identificado", confidence: 0 };
    }

    return {
      label: result.description,
      confidence: Math.round(result.score * 100),
    };
  } catch (error) {
    console.log("Error identificando imagen:", error);

    return { label: "Error al identificar", confidence: 0 };
  }
}
