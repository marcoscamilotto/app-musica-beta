export const config = {
  runtime: "edge",
};

export default async function handler(req) {
  try {
    const formData = await req.formData();
    const audio = formData.get("audio");

    if (!audio) {
      return new Response(
        JSON.stringify({ error: "Nenhum áudio enviado" }),
        { status: 400 }
      );
    }

    const openaiForm = new FormData();
    openaiForm.append("file", audio);
    openaiForm.append("model", "whisper-1");

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

    return new Response(
      JSON.stringify({ text: data.texto }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}
