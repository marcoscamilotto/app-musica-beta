import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const form = formidable({ multiples: false });

  form.parse(req, async (err, fields, files) => {

    try {

      if (err) {
        console.error("Erro formidable:", err);
        return res.status(500).json({ error: "Erro ao ler arquivo" });
      }

      const file = files.audio;

      if (!file) {
        return res.status(400).json({ error: "Arquivo não enviado" });
      }

      const formData = new FormData();

      formData.append("file", fs.createReadStream(file.filepath));
      formData.append("model", "gpt-4o-transcribe");

      const openaiResponse = await fetch(
        "https://api.openai.com/v1/audio/transcriptions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          body: formData,
        }
      );

      const data = await openaiResponse.json();

      console.log("Resposta OpenAI:", data);

      res.status(200).json({
        text: data.text || "Nenhum texto detectado",
      });

    } catch (error) {

      console.error("Erro interno:", error);

      res.status(500).json({
        error: "Erro ao transcrever áudio",
      });

    }

  });
}
