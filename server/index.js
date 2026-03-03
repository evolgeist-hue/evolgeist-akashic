import express from "express";
import OpenAI from "openai";

const app = express();
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/akashic", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.json({
        answer: "🜂 Nenhuma pergunta foi enviada."
      });
    }

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Você é o Registro Akáshico. Responda de forma simbólica, poética, ética e acolhedora."
        },
        { role: "user", content: question }
      ],
      temperature: 0.8
    });

    res.json({
      answer: completion.choices[0].message.content
    });

  } catch (err) {
    console.error(err);
    res.json({
      answer: "🜂 O Registro encontra-se em silêncio temporário."
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("🜂 Registro Akáshico ativo na porta", PORT);
});