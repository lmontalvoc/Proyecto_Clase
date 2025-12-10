// src/config/google.config.ts
// Nota: Si deseas usar Google Cloud Vision, habilita la facturación en Google Cloud Console
export const GOOGLE_VISION_API_KEY =
  process.env.EXPO_PUBLIC_GOOGLE_VISION_API_KEY ?? "";

// Hugging Face API para reconocimiento de objetos (ALTERNATIVA GRATUITA)
export const HUGGING_FACE_API_KEY =
  process.env.EXPO_PUBLIC_HUGGING_FACE_API_KEY ?? "";
