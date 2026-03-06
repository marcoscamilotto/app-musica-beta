import OpenAI from "openai";
import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    try {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Erro ao ler arquivo" });
      }

      const audioFile = files.audio[0];

      const transcription = await client.audio.transcriptions.create({
        file: fs.createReadStream(audioFile.filepath),
        model: "gpt-4o-mini-transcribe",
      });

      res.status(200).json({
        texto: transcription.text,
      });

    } catch (error) {
      console.error("ERRO:", error);
      res.status(500).json({
        error: "Erro na transcrição",
      });
    }
  });
}
