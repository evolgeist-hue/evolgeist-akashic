const SUPABASE_URL = "https://angtaeexbexxbpjvebhe.supabase.co";
const FUNCTION_NAME = "akashic";

export async function askAkashic(question) {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/functions/v1/${FUNCTION_NAME}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ question })
      }
    );

    const data = await response.json();
    return data.answer;
  } catch (error) {
    console.error("Erro Akashic AI:", error);
    return "🜂 O Registro silenciou por instantes. Retorne mais tarde.";
  }
}