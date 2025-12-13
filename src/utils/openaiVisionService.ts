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
                    "Responde en español con un nombre corto y claro. " +
                    "Sé específico solo si estás seguro (marca/modelo si aplica). " +
                    "Si no puedes identificarlo, responde EXACTAMENTE: Objeto no identificado.",
                },
                {
                  type: "input_image",
                  image_url: `data:image/jpeg;base64,${base64Image}`,
                },
              ],
            },
          ],
          max_output_tokens: 50,
        }),
      }
    );

    const data = await response.json();

    console.log("🔍 OpenAI RAW:", JSON.stringify(data, null, 2));

    const text =
      data?.output?.[0]?.content
        ?.filter((c: any) => c.type === "output_text")
        ?.map((c: any) => c.text)
        ?.join(" ")
        ?.trim() || "Objeto no identificado";

    return text;
  } catch (error) {
    console.log("❌ Error OpenAI Vision:", error);
    return "Objeto no identificado";
  }
}
