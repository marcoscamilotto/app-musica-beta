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

    const chunks = []

    for await (const chunk of req) {
      chunks.push(chunk)
    }

    const buffer = Buffer.concat(chunks)

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    })

    const response = await openai.audio.transcriptions.create({
      file: new File([buffer], "audio.mp3"),
      model: "whisper-1"
    })

    res.status(200).json({
      texto: response.text
    })

  } catch (error) {

    console.error(error)

    res.status(500).json({
      error: "Erro ao processar áudio"
    })

  }

}
