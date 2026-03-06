import OpenAI from "openai";
import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {

    const form = formidable({ multiples: false });

    form.parse(req, async (err, fields, files) => {

      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Erro ao processar arquivo" });
      }

      const file = files.audio;

      if (!file) {
        return res.status(400).json({ error: "Arquivo não enviado" });
      }

      // 👇 CORREÇÃO AQUI
      const filePath = file.filepath || file[0]?.filepath;

      const transcription = await openai.audio.transcriptions.create({
        file: fs.createReadStream(filePath),
        model: "whisper-1",
      });

      res.status(200).json({
        text: transcription.text,
      });

    });

  } catch (error) {

    console.error("Erro interno:", error);

    res.status(500).json({
      error: "Erro ao transcrever áudio",
    });

  }

}
