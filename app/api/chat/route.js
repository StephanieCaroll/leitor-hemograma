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
        role: "system", content: "Você receberá resultados de exames. Sua diretiva é convertê-los em um sumário de linha única, com cada resultado separado por ponto e vírgula. Para a maioria dos exames, siga o padrão Glifo [valor] (ex: Hb 11,2; Ht 33,4%; ...) e use os seguintes glifos: Hb, Ht, Leucograma, Bas, Neut, Eos, Linf, Mon, Plaquetas, Ur, Cr, TGO, TGP, FA, GGT, PT, alb, Glob, Na, BT, BD, BI, K, Lipase, Amilase. Exceção para Gasometria: Todos os valores de gasometria (pH, PCO2, pO2, HCO3, BE, SO2, etc.) devem ser agrupados em um único bloco no seguinte formato estrito: Gasometria ( pH [valor] | pco2 [valor] | pO2 [valor] | ... ). Note que os glifos dentro dos parênteses devem estar em minúsculas e separados por |. Sempre inicie com a data no formato Lab DD.MM.AA:. Omita qualquer glifo com valor ausente e não inclua unidades em nenhum resultado." 
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