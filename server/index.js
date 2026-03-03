/**
 * Evolgeist - Akashic Proxy
 * index.js
 *
 * Segurança: NÃO coloque sua OPENAI / GEMINI key no app.
 * O app chama este proxy com X-Client-Key; o proxy chama a IA.
 */

import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import pino from "pino";
import pinoHttp from "pino-http";
import axios from "axios";
import invariant from "tiny-invariant";

import dotenv from "dotenv";
dotenv.config();

const logger = pino({
  prettyPrint: process.env.NODE_ENV !== "production",
});

// validate minimal env
invariant(process.env.CLIENT_KEY, "CLIENT_KEY is required in env");
invariant(process.env.PROVIDER, "PROVIDER is required in env");

const PROVIDER = process.env.PROVIDER.toUpperCase();

// optional provider keys validated at runtime
if (PROVIDER === "OPENAI") {
  invariant(process.env.OPENAI_API_KEY, "OPENAI_API_KEY required for OPENAI provider");
}
if (PROVIDER === "GEMINI") {
  invariant(process.env.GEMINI_API_KEY, "GEMINI_API_KEY required for GEMINI provider");
}

const PORT = process.env.PORT || 3000;

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "20kb" }));
app.use(pinoHttp({ logger }));

// rate limiter (basic)
const limiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 60_000),
  max: Number(process.env.RATE_LIMIT_MAX || 30),
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Basic health check
app.get("/health", (req, res) => {
  res.json({ ok: true, provider: PROVIDER });
});

// Helper: retry with backoff
async function retry(fn, { retries = 2, minDelay = 500 } = {}) {
  let attempt = 0;
  while (true) {
    try {
      return await fn();
    } catch (err) {
      attempt++;
      if (attempt > retries) throw err;
      const wait = minDelay * Math.pow(2, attempt - 1);
      await new Promise((r) => setTimeout(r, wait));
    }
  }
}

// OpenAI Responses API call
async function callOpenAI(question) {
  const key = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

  const payload = {
    model,
    input: `Você é uma entidade simbólica do Registro Akáshico. Responda de forma poética, reflexiva e acolhedora.\n\nPergunta: ${question}`,
    temperature: 0.8,
  };

  const res = await axios.post("https://api.openai.com/v1/responses", payload, {
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    timeout: 30_000,
  });

  // robust extraction
  if (res?.data?.output_text) return res.data.output_text;
  // fallback to structure
  if (res?.data?.output?.[0]?.content?.[0]?.text) return res.data.output[0].content[0].text;
  // final fallback
  throw new Error("OpenAI returned no content");
}

// Gemini (Google) call (REST)
async function callGemini(question) {
  const key = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || "gemini-1.5-mini";
  // Using the public REST pattern with API key in URL (simple)
  const url = `https://generativelanguage.googleapis.com/v1beta2/models/${model}:generateText?key=${key}`;

  const body = {
    prompt: {
      text: `Você é uma entidade simbólica do Registro Akáshico. Responda de forma poética, reflexiva e acolhedora.\n\nPergunta: ${question}`
    },
    temperature: 0.8,
    maxOutputTokens: 512
  };

  const res = await axios.post(url, body, { timeout: 30_000 });
  // Extract text (Google may use candidates)
  const text =
    res?.data?.candidates?.[0]?.output ||
    res?.data?.candidates?.[0]?.content?.[0]?.text ||
    res?.data?.output?.[0]?.content?.[0]?.text;
  if (text) return text;
  throw new Error("Gemini returned no content");
}

// Optional: log to Supabase (if set)
async function logToSupabase(entry) {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) return;
  try {
    await axios.post(
      `${process.env.SUPABASE_URL}/rest/v1/akashic_logs`,
      entry,
      {
        headers: {
          apikey: process.env.SUPABASE_SERVICE_KEY,
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        timeout: 10_000,
      }
    );
  } catch (e) {
    // non-blocking
    logger.warn({ err: e }, "Supabase log failed");
  }
}

// Main endpoint
app.post("/api/akashic", async (req, res) => {
  req.log.info("akashic request");
  try {
    const clientKey = req.header("x-client-key") || req.header("authorization");
    if (!clientKey) return res.status(401).json({ error: "Missing client key" });

    // support Bearer token or direct key
    const normalized = clientKey.startsWith("Bearer ") ? clientKey.split(" ")[1] : clientKey;
    if (normalized !== process.env.CLIENT_KEY) {
      return res.status(403).json({ error: "Invalid client key" });
    }

    const question = (req.body && req.body.question) ? String(req.body.question).trim() : null;
    if (!question) return res.status(400).json({ error: "Question required" });

    // call provider with retry
    let answer;
    if (PROVIDER === "OPENAI") {
      answer = await retry(() => callOpenAI(question), { retries: 2, minDelay: 800 });
    } else if (PROVIDER === "GEMINI") {
      answer = await retry(() => callGemini(question), { retries: 2, minDelay: 800 });
    } else {
      throw new Error("Unsupported provider");
    }

    // optional: log to supabase
    logToSupabase({
      question,
      answer,
      created_at: new Date().toISOString(),
    });

    return res.json({ answer });
  } catch (err) {
    req.log.error(err, "akashic error");
    // return friendly fallback
    return res.json({
      answer:
        "🜂 O Registro encontra-se em silêncio temporário. Retorne mais tarde."
    });
  }
});

// start
app.listen(PORT, () => {
  logger.info({ port: PORT, provider: PROVIDER }, "Akashic proxy running");
});