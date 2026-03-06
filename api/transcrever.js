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

  const form = formidable();

  form.parse(req, async (err, fields, files) => {

    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao ler arquivo" });
    }

    try {

      const audio = files.audio[0];

      const transcription = await openai.audio.transcriptions.create({
        file: fs.createReadStream(audio.filepath),
        model: "whisper-1",
      });

      res.status(200).json({
        text: transcription.text,
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        error: "Erro na transcrição",
      });

    }

  });

}
