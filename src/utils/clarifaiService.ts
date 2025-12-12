import Constants from "expo-constants";

const CLARIFAI_KEY =
  Constants.expoConfig?.extra?.EXPO_PUBLIC_CLARIFAI_API_KEY ||
  process.env.EXPO_PUBLIC_CLARIFAI_API_KEY;

// DATOS DE TU APP EN CLARIFAI
const USER_ID = "fernandopuertof";
const APP_ID = "que-es-esto";

// Modelo BLIP-2 para captions avanzados
const MODEL_ID = "general-english-image-caption-blip-2";
const MODEL_VERSION_ID = "03e37b9e08d442bfba63b5766ea92dcb"; // versión oficial BLIP-2

export async function identifyImage(base64Image: string) {
  if (!CLARIFAI_KEY) {
    console.log("❌ Clarifai key missing");
    return null;
  }

  const body = {
    user_app_id: {
      user_id: USER_ID,
      app_id: APP_ID,
    },
    inputs: [
      {
        data: {
          image: { base64: base64Image },
        },
      },
    ],
  };

  try {
    const response = await fetch(
      `https://api.clarifai.com/v2/models/${MODEL_ID}/versions/${MODEL_VERSION_ID}/outputs`,
      {
        method: "POST",
        headers: {
          Authorization: `Key ${CLARIFAI_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    console.log("🔍 Clarifai RAW:", JSON.stringify(data, null, 2));

    // BLIP-2 devuelve un caption dentro de "text.raw"
    const caption =
      data?.outputs?.[0]?.data?.text?.raw ||
      data?.outputs?.[0]?.data?.text?.caption ||
      null;

    return caption || "Objeto no identificado";
  } catch (error) {
    console.log("❌ Clarifai ERROR:", error);
    return null;
  }
}
