'use client';

import { useState, useEffect, useRef } from 'react';
import './globals.css';

export default function Page() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState('');
  const [error, setError] = useState('');
  const responseTextRef = useRef(null);

  async function extractTextFromPdf(file) {
    const reader = new FileReader();
    const fileReadPromise = new Promise((resolve, reject) => {
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error);
      reader.readAsArrayBuffer(file);
    });
    const arrayBuffer = await fileReadPromise;
    const pdf = await window.pdfjsLib.getDocument(arrayBuffer).promise;

    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      fullText += pageText + '\n';
    }
    return fullText;
  }

  async function handleGerarValores() {
    if (!file) return;

    setLoading(true);
    setError('');
    setApiResponse('');

    try {
      const textoExtraido = await extractTextFromPdf(file);
      
      // Your actual API call here
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textoExtraido }),
      });

      if (!res.ok) {
        throw new Error(`A API retornou um erro: ${res.statusText}`);
      }

      const data = await res.json();
      setApiResponse(data.reply);

    } catch (err) {
      console.error(err);
      setError(err.message || "Erro ao processar o PDF ou se comunicar com a API");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js';
    script.onload = () => {
      if (window.pdfjsLib) {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
      }
    };
    document.body.appendChild(script);
    
    return () => {
      try {
        document.body.removeChild(script);
      } catch (e) {
        // Script might already be removed
      }
    };
  }, []);

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected?.type === 'application/pdf') {
      setFile(selected);
      setError('');
      setApiResponse('');
    } else {
      setError('Selecione um arquivo PDF válido.');
      setFile(null);
    }
  };

  const handleCopyToClipboard = async () => {
    if (responseTextRef.current) {
      try {
        await navigator.clipboard.writeText(responseTextRef.current.innerText);
        alert('Texto copiado com sucesso!');
      } catch (err) {
        console.error('Falha ao copiar texto: ', err);
        alert('Erro ao copiar texto.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-gradient-to-r from-red-600 to-red-700 rounded-full shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
              Analisador de Exames
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Sistema inteligente de análise de hemogramas e exames laboratoriais. 
            Faça upload do seu PDF e obtenha uma interpretação detalhada dos resultados.
          </p>
        </div>

        {/* Upload Card */}
        <div className="bg-white rounded-xl shadow-lg border border-red-100 overflow-hidden">
          <div className="bg-gradient-to-r from-red-50 to-red-100 px-6 py-4 border-b border-red-200">
            <h2 className="text-xl font-semibold text-red-800 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Upload do Exame
            </h2>
            <p className="text-red-600 mt-1">
              Selecione um arquivo PDF contendo os resultados do seu exame
            </p>
          </div>
          
          <div className="p-6 space-y-6">
            {/* File Input */}
            <div className="space-y-2">
              <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700">
                Arquivo PDF do Exame
              </label>
              <div className="relative">
                <input
                  id="file-upload"
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-red-50 file:text-red-700 hover:file:bg-red-100 cursor-pointer border border-gray-300 rounded-lg p-3"
                />
                <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              {file && (
                <p className="text-sm text-red-700 bg-red-50 p-2 rounded-md">
                  ✓ {file.name} selecionado
                </p>
              )}
            </div>

            {/* Analyze Button */}
            <button 
              onClick={handleGerarValores} 
              disabled={loading || !file}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Analisando Exame...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Analisar Exame
                </>
              )}
            </button>

            {/* Error Display */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 font-medium">⚠️ {error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Results Card */}
        {apiResponse && (
          <div className="bg-white rounded-xl shadow-lg border border-red-100 overflow-hidden">
            <div className="bg-gradient-to-r from-red-50 to-red-100 px-6 py-4 border-b border-red-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-red-800 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Resultados da Análise
                </h2>
                <button
                  onClick={handleCopyToClipboard}
                  className="px-3 py-1 text-sm border border-red-300 text-red-700 hover:bg-red-50 rounded-md transition-colors duration-200 flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copiar
                </button>
              </div>
              <p className="text-red-600 mt-1">
                Interpretação detalhada dos valores encontrados no exame
              </p>
            </div>
            <div className="p-6">
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <pre 
                  ref={responseTextRef}
                  className="whitespace-pre-wrap text-sm font-mono text-gray-800 leading-relaxed overflow-x-auto"
                >
                  {apiResponse}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Info Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>
            ⚕️ Esta ferramenta oferece interpretações educativas. 
            Sempre consulte um profissional de saúde qualificado.
          </p>
        </div>
      </div>
    </div>
  );
}
