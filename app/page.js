'use client';

import { useState, useEffect } from 'react';
import './globals.css';

export default function Page() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [error, setError] = useState('');

  const GEMINI_API_KEY = 'AIzaSyDrmEIYBSqQzg7zZIpYO8RjYibuOGyaIMo'; 

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js';
    script.onload = () => {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
    };
    document.body.appendChild(script);
  }, []);

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected?.type === 'application/pdf') {
      setFile(selected);
      setError('');
      setExtractedData(null);
    } else {
      setError('Selecione um arquivo PDF válido.');
      setFile(null);
      setExtractedData(null);
    }
  };

  const handleExtractAll = async () => {
    if (!file || !window.pdfjsLib) {
      setError('PDF.js não carregado ou arquivo ausente.');
      return;
    }

    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'SUA_CHAVE_DE_API_AQUI') {
      setError('Chave de API do Gemini ausente. Por favor, adicione sua chave.');
      return;
    }

    setLoading(true);
    setError('');
    setExtractedData(null);

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const data = new Uint8Array(event.target.result);
        const pdf = await window.pdfjsLib.getDocument({ data }).promise;

        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          fullText += content.items.map(item => item.str).join(' ');
        }
        
        const prompt = `A partir do texto de um exame laboratorial, extraia os seguintes valores: 
                        Hemoglobina (Hb), Hematócrito (Ht), Leucograma, Plaquetas, Ureia (Ur), 
                        Creatinina (Cr), AST/TGO (TGO), ALT/TGP (TGP), Fosfatase Alcalina (FA), Gama GT (GGT), 
                        Proteínas Totais (PT) e suas frações (albumina e globulina), Sódio (Na), 
                        Bilirrubinas Totais (BT) e suas frações (BD e BI), Potássio (K), Lipase e Amilase.

                        Formate a resposta no seguinte formato:
                        "Lab DD.MM.YY: Hb valor; Ht valor%; Leucograma valor (S/D); Plaquetas valor; Ur valor; Cr valor; TGO valor; TGP valor; FA valor; GGT valor; PT valor (alb valor | Glob valor); Na valor; BT valor (BD valor | BI valor); K valor; Lipase valor; Amilase valor."

                        Se um valor não for encontrado, use 'Valor Não Encontrado'. Use apenas os valores numéricos.
                        
                        TEXTO DO EXAME:
                        ${fullText}`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        });
        
        const result = await response.json();
        
        if (result.candidates && result.candidates[0] && result.candidates[0].content) {
          const finalResult = result.candidates[0].content.parts[0].text;
          setExtractedData(finalResult);
        } else {
          setError('Não foi possível extrair os dados. A resposta da IA foi inválida.');
        }

      };
      reader.readAsArrayBuffer(file);
    } catch (err) {
      console.error(err);
      setError('Erro ao processar o PDF ou se conectar com a API.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1>Analisador de Exames</h1>
        <p>Selecione um PDF de exame para extrair os valores principais.</p>

        <label htmlFor="file-upload">Selecione o PDF:</label>
        <input id="file-upload" type="file" accept="application/pdf" onChange={handleFileChange} />

        <button onClick={handleExtractAll} disabled={loading || !file}>
          {loading ? 'Analisando...' : 'Extrair todos os valores'}
        </button>

        {error && <p className="error">{error}</p>}

        {extractedData && (
          <div className="result">
            <h3>Resultado extraído:</h3>
            <p><strong>Formato solicitado:</strong></p>
            <p>{extractedData}</p>
          </div>
        )}
      </div>
    </div>
  );
}