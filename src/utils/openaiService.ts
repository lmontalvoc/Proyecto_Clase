import Constants from "expo-constants";

const OPENAI_KEY =
  Constants.expoConfig?.extra?.EXPO_PUBLIC_OPENAI_API_KEY ||
  process.env.EXPO_PUBLIC_OPENAI_API_KEY;

export async function translateToSpanish(description: string) {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "Tu tarea es convertir una descripción visual en el nombre exacto del producto, en español. Nombra el objeto como se vende comercialmente. Si no estás seguro, da la mejor aproximación humana posible.",
          },
          {
            role: "user",
            content: `Descripción: ${description}`,
          },
        ],
      }),
    });

    const json = await response.json();

    const result =
      json?.choices?.[0]?.message?.content?.trim() ||
      "Objeto no identificado";

    return result;
  } catch (e) {
    console.log("❌ Error OpenAI:", e);
    return description;
  }
}
