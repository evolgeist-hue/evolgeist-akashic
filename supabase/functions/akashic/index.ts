import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers":
          "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  try {
    const auth = req.headers.get("Authorization");
    if (!auth) {
      return new Response(
        JSON.stringify({ error: "Missing Authorization header" }),
        { status: 401 }
      );
    }

    const { question } = await req.json();

    if (!question) {
      return new Response(
        JSON.stringify({ answer: "Nenhuma pergunta enviada." }),
        { headers: { "Content-Type": "application/json; charset=utf-8" } }
      );
    }

    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({ answer: "Chave do Gemini não configurada." }),
        { headers: { "Content-Type": "application/json; charset=utf-8" } }
      );
    }

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `Você é uma entidade simbólica do Registro Akáshico.
Responda de forma poética, acolhedora e ética.

Pergunta:
${question}`,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await geminiResponse.json();

    const answer =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ??
      "O Registro permaneceu em silêncio.";

    return new Response(JSON.stringify({ answer }), {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        answer: "O Registro encontra-se temporariamente inacessível.",
      }),
      { headers: { "Content-Type": "application/json; charset=utf-8" } }
    );
  }
});