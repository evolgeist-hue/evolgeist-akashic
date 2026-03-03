import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/akashic", async (req, res) => {
  const { question } = req.body;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer SUA_API_KEY_AQUI`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Você é uma entidade simbólica do Registro Akáshico. Responda com linguagem poética, reflexiva e ética."
        },
        { role: "user", content: question }
      ]
    })
  });

  const data = await response.json();
  res.json({ answer: data.choices[0].message.content });
});

app.listen(3000, () => {
  console.log("🜂 Registro Akáshico ativo em http://localhost:3000");
});