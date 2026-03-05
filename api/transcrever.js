export const config = {
  runtime: "edge",
};

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Método não permitido" }),
      { status: 405 }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get("audio");

    if (!file) {
      return new Response(
        JSON.stringify({ error: "Nenhum arquivo enviado" }),
        { status: 400 }
      );
    }

    const openaiResponse = await fetch(
      "https://api.openai.com/v1/audio/transcriptions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: (() => {
          const newForm = new FormData();
          newForm.append("file", file);
          newForm.append("model", "gpt-4o-mini-transcribe");
          return newForm;
        })(),
      }
    );

    const data = await openaiResponse.json();

    return new Response(JSON.stringify(data), {
      status: 200,
    });

  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Erro ao transcrever" }),
      { status: 500 }
    );
  }
}
