export const config = {
  api: {
    bodyParser: false,
  },
};

export const maxDuration = 60;

import formidable from "formidable";
import fs from "fs";
import OpenAI, { toFile } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const form = formidable({ multiples: false });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Erro ao processar upload:", err);
      return res.status(500).json({ error: "Erro no upload do arquivo" });
    }

    try {
      const audioFile = Array.isArray(files.audio)
        ? files.audio[0]
        : files.audio;

      if (!audioFile) {
        return res.status(400).json({ error: "Nenhum arquivo enviado" });
      }

      const fileBuffer = fs.readFileSync(audioFile.filepath);

      const transcription = await openai.audio.transcriptions.create({
  file: await toFile(fileBuffer, "audio.mp3"),
  model: "gpt-4o-mini-transcribe",
});

      return res.status(200).json({
        texto: transcription.text,
      });

    } catch (error) {
      console.error("Erro na transcrição:", error);

      return res.status(500).json({
        error: "Erro ao transcrever áudio",
        details: error.message,
      });
    }
  });
}
