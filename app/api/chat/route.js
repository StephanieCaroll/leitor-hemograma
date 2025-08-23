import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { message } = await req.json();

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { 
        role: "system", content: "Você receberá resultados de exames. Sua diretiva é convertê-los em um sumário de linha única, seguindo estritamente o padrão: Lab DD.MM.AA: Hb 11,2; Ht 33,4%; PT 7,1 (alb 4,3 | Glob 2,8); BT 8,3 (BD 7,5 | BI 0,7); ... e usando os glifos: Hb, Ht, Leucograma, Plaquetas, Ur, Cr, TGO, TGP, FA, GGT, PT, alb, Glob, Na, BT, BD, BI, K, Lipase, Amilase. Omita qualquer glifo com valor ausente e não inclua unidades." 
        },
        { role: "user", content: message },
      ],
    });

    return new Response(
      JSON.stringify({ reply: response.choices[0].message.content }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}