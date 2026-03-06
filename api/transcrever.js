import OpenAI from "openai";
import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {

  const form = formidable();
  const [fields, files] = await form.parse(req);

  const file = files.audio[0];

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {

    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(file.filepath),
      model: "whisper-1",
    });

    res.status(200).json({
      texto: transcription.text
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Erro ao transcrever áudio"
    });

  }

}
