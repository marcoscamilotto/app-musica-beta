import OpenAI from "openai"

export const config = {
  api: {
    bodyParser: false
  }
}

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" })
  }

  try {

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    })

    const transcription = await openai.audio.transcriptions.create({
      file: req,
      model: "whisper-1"
    })

    res.status(200).json({
      texto: transcription.text
    })

  } catch (error) {

    console.error(error)

    res.status(500).json({
      error: "Erro ao transcrever"
    })

  }

}
