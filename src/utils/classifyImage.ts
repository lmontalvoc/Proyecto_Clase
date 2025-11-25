import * as FileSystem from "expo-file-system";
import { GOOGLE_VISION_API_KEY } from "../config/google.config";

export async function classifyImage(uri: string) {
  try {
    // Some Expo versions may not expose EncodingType; fallback to literal 'base64'
    const encoding = (FileSystem as any)?.EncodingType?.Base64 ?? "base64";
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding,
    });

    const body = {
      requests: [
        {
          image: { content: base64 },
          features: [{ type: "LABEL_DETECTION", maxResults: 3 }],
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

    if (!json.responses || !json.responses[0].labelAnnotations) {
      return { label: "Objeto no identificado", confidence: 0 };
    }

    const best = json.responses[0].labelAnnotations[0];

    return {
      label: best.description,
      confidence: best.score * 100,
    };
  } catch (err) {
    console.log("Error identificando imagen:", err);
    return {
      label: "Objeto no identificado",
      confidence: 0,
    };
  }
}
