export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  try {

    const formData = await req.formData();
    const file = formData.get("audio");

    if (!file) {
      return res.status(400).json({ error: "Nenhum arquivo enviado" });
    }

    const openaiForm = new FormData();
    openaiForm.append("file", file);
    openaiForm.append("model", "gpt-4o-transcribe");

    const openaiResponse = await fetch(
      "https://api.openai.com/v1/audio/transcriptions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: openaiForm,
      }
    );

    const data = await openaiResponse.json();

    if (!openaiResponse.ok) {
      console.error(data);
      return res.status(500).json({ error: data });
    }

    return res.status(200).json({
      text: data.text,
    });

  } catch (error) {
    console.error("Erro:", error);
    return res.status(500).json({ error: "Erro ao transcrever áudio" });
  }
}
