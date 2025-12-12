import Constants from "expo-constants";

const OPENAI_KEY =
  Constants.expoConfig?.extra?.EXPO_PUBLIC_OPENAI_API_KEY;

export async function identifyImageWithOpenAI(base64Image: string) {
  if (!OPENAI_KEY) {
    return "No se encontró la API key de OpenAI.";
  }

  try {
    const response = await fetch(
      "https://api.openai.com/v1/responses",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENAI_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4.1-mini",
          input: [
            {
              role: "user",
              content: [
                {
                  type: "input_text",
                  text:
                    "Identifica el objeto principal de la imagen. " +
                    "Responde en español. " +
                    "Sé específico solo si estás seguro. " +
                    "Si no puedes identificarlo, di exactamente: 'Objeto no identificado'.",
                },
                {
                  type: "input_image",
                  image_url: `data:image/jpeg;base64,${base64Image}`,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    console.log("🔍 OpenAI RAW:", JSON.stringify(data, null, 2));

    const output =
      data?.output_text ??
      data?.output?.[0]?.content?.[0]?.text ??
      "Objeto no identificado";

    return output.trim();
  } catch (error) {
    console.log("❌ Error OpenAI Vision:", error);
    return "Error al analizar la imagen.";
  }
}
