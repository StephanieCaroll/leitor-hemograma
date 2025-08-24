'use client';

import { useState, useEffect, useRef } from 'react';

// --- SVG Icon Components for a cleaner look ---
const BloodDropIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width: '2rem', height: '2rem', color: 'white'}}>
    <path d="M12 22s8-4 8-10a8 8 0 0 0-16 0c0 6 8 10 8 10Z"/>
  </svg>
);

const UploadCloudIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="upload-icon">
    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/>
    <path d="M12 12v9"/>
    <path d="m16 16-4-4-4 4"/>
  </svg>
);

const FileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width: '1.25rem', height: '1.25rem'}}>
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
    <polyline points="14 2 14 8 20 8"/>
  </svg>
);

const BeakerIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width: '1.25rem', height: '1.25rem'}}>
        <path d="M4.5 3h15"/><path d="M6 3v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V3"/><path d="M6 14h12"/>
    </svg>
);

const ClipboardCheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width: '1rem', height: '1rem'}}>
        <rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/>
    </svg>
);

const ClipboardIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width: '1rem', height: '1rem'}}>
        <rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
    </svg>
);

const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width: '1.25rem', height: '1.25rem'}}>
        <circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>
    </svg>
);

const MoonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width: '1.25rem', height: '1.25rem'}}>
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
    </svg>
);


const CSSStyles = () => (
  <style>{`
    :root {
      --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
      --font-mono: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;
    }
    
    /* --- Global Reset and Theme Background --- */
    html {
      box-sizing: border-box;
    }
    *, *:before, *:after {
      box-sizing: inherit;
    }
    body {
      margin: 0;
      padding: 0;
      background-color: var(--bg-main);
      transition: background-color 0.3s;
    }
    
    [data-theme='light'] {
      --bg-main: #f8fafc;
      --bg-card: #ffffff;
      --bg-card-secondary: #f8fafc;
      --bg-card-secondary-hover: #f1f5f9;
      --bg-dropzone-dragging: #e0f2fe;
      --bg-button-copy-hover: #f1f5f9;
      --text-primary: #1e293b;
      --text-secondary: #64748b;
      --text-title: #0f172a;
      --text-label: #334155;
      --text-copy: #475569;
      --border-primary: #e2e8f0;
      --border-secondary: rgba(226, 232, 240, 0.8);
      --border-dropzone: #cbd5e1;
      --border-dropzone-dragging: #38bdf8;
      --shadow-card: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1);
      --shadow-button: 0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1);
    }
    
    [data-theme='dark'] {
      --bg-main: #0f172a;
      --bg-card: #1e293b;
      --bg-card-secondary: #0f172a;
      --bg-card-secondary-hover: #1e293b;
      --bg-dropzone-dragging: #374151;
      --bg-button-copy-hover: #374151;
      --text-primary: #e2e8f0;
      --text-secondary: #94a3b8;
      --text-title: #f8fafc;
      --text-label: #cbd5e1;
      --text-copy: #cbd5e1;
      --border-primary: #334155;
      --border-secondary: #334155;
      --border-dropzone: #475569;
      --border-dropzone-dragging: #60a5fa;
      --shadow-card: 0 10px 15px -3px rgba(0,0,0,0.2), 0 4px 6px -4px rgba(0,0,0,0.2);
      --shadow-button: 0 1px 3px 0 rgba(0,0,0,0.2), 0 1px 2px -1px rgba(0,0,0,0.2);
    }

    .analyzer-container {
      min-height: 100vh;
      background-color: var(--bg-main);
      font-family: var(--font-sans);
      color: var(--text-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      position: relative;
      transition: background-color 0.3s, color 0.3s;
    }
    .top-controls {
      position: absolute;
      top: 1.5rem;
      left: 1.5rem;
      right: 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .control-button {
      background-color: var(--bg-card);
      border: 1px solid var(--border-primary);
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      box-shadow: var(--shadow-button);
      transition: background-color 0.2s;
      color: var(--text-label);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .control-button:hover {
      background-color: var(--bg-card-secondary-hover);
    }
    .analyzer-content { width: 100%; max-width: 42rem; margin: 0 auto; }
    .analyzer-content > * + * { margin-top: 2rem; }
    .header { text-align: center; }
    .header > * + * { margin-top: 0.5rem; }
    .icon-wrapper { display: inline-flex; align-items: center; justify-content: center; padding: 0.75rem; background-color: #dc2626; border-radius: 9999px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1); }
    .title { font-size: 2.25rem; font-weight: 700; color: var(--text-title); }
    .subtitle { font-size: 1.125rem; color: var(--text-secondary); max-width: 42rem; margin: 0 auto; }
    .card { background-color: var(--bg-card); border-radius: 1rem; box-shadow: var(--shadow-card); border: 1px solid var(--border-secondary); transition: background-color 0.3s, border-color 0.3s; }
    .card-padding { padding: 2rem; }
    .card-padding > * + * { margin-top: 1.5rem; }
    .file-label { display: block; font-size: 0.875rem; font-weight: 500; color: var(--text-label); margin-bottom: 0.5rem; }
    .file-dropzone { display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; height: 12rem; border: 2px dashed var(--border-dropzone); border-radius: 0.5rem; cursor: pointer; background-color: var(--bg-card-secondary); transition: background-color 0.2s, border-color 0.2s; }
    .file-dropzone:hover { background-color: var(--bg-card-secondary-hover); }
    .file-dropzone.dragging { background-color: var(--bg-dropzone-dragging); border-color: var(--border-dropzone-dragging); }
    .upload-icon { width: 2rem; height: 2rem; color: var(--text-secondary); }
    .file-dropzone-text { font-size: 0.875rem; color: var(--text-secondary); }
    .file-dropzone-text-small { font-size: 0.75rem; color: var(--text-secondary); }
    .file-dropzone-text-bold { font-weight: 600; }
    .hidden-input { display: none; }
    .file-selected-info { display: flex; align-items: center; gap: 0.75rem; font-size: 0.875rem; color: #15803d; background-color: #f0fdf4; padding: 0.75rem; border-radius: 0.375rem; border: 1px solid #bbf7d0; }
    .analyze-button { width: 100%; background-color: #dc2626; color: white; font-weight: 700; padding: 0.75rem 1rem; border: none; border-radius: 0.5rem; cursor: pointer; transition: background-color 0.2s, opacity 0.2s; display: flex; align-items: center; justify-content: center; gap: 0.5rem; font-size: 1rem; box-shadow: 0 1px 2px 0 rgba(0,0,0,0.05); }
    .analyze-button:hover { background-color: #b91c1c; }
    .analyze-button:disabled { opacity: 0.5; cursor: not-allowed; }
    .error-box { padding: 1rem; background-color: #fee2e2; border: 1px solid #fecaca; border-radius: 0.5rem; text-align: center; font-size: 0.875rem; color: #991b1b; font-weight: 500; }
    .results-section { border-top: 1px solid var(--border-primary); }
    .results-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; }
    .results-title { font-size: 1.125rem; font-weight: 600; color: var(--text-title); }
    .copy-button { padding: 0.375rem 0.75rem; font-size: 0.875rem; border: 1px solid var(--border-primary); color: var(--text-copy); background-color: var(--bg-card); border-radius: 0.375rem; cursor: pointer; transition: background-color 0.2s; display: flex; align-items: center; gap: 0.375rem; }
    .copy-button:hover { background-color: var(--bg-button-copy-hover); }
    .results-box { background-color: var(--bg-card-secondary); border-radius: 0.5rem; padding: 1rem; border: 1px solid var(--border-secondary); min-height: 100px; }
    .results-pre { white-space: pre-wrap; font-size: 0.875rem; font-family: var(--font-mono); color: var(--text-primary); line-height: 1.6; }
    .footer { text-align: center; font-size: 0.75rem; color: var(--text-secondary); }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    .spinner { width: 1.25rem; height: 1.25rem; animation: spin 1s linear infinite; }
  `}</style>
);

// --- Text translations object ---
const translations = {
  title: { 'pt-br': 'Analisador de Hemograma', 'en-us': 'Hemogram Analyzer' },
  subtitle: { 'pt-br': 'Faça o upload do seu PDF de exame de sangue para obter uma análise inteligente dos resultados.', 'en-us': 'Upload your blood test PDF to get an intelligent analysis of the results.' },
  fileLabel: { 'pt-br': 'Arquivo PDF do Exame', 'en-us': 'Exam PDF File' },
  uploadClick: { 'pt-br': 'Clique para enviar', 'en-us': 'Click to upload' },
  uploadDrag: { 'pt-br': 'ou arraste e solte', 'en-us': 'or drag and drop' },
  uploadHint: { 'pt-br': 'Apenas PDF (máx. 10MB)', 'en-us': 'PDF only (max. 10MB)' },
  selectedFile: { 'pt-br': 'Arquivo selecionado:', 'en-us': 'Selected file:' },
  analyzeButton: { 'pt-br': 'Analisar Exame', 'en-us': 'Analyze Exam' },
  analyzingButton: { 'pt-br': 'Analisando Exame...', 'en-us': 'Analyzing Exam...' },
  resultsTitle: { 'pt-br': 'Resultados da Análise', 'en-us': 'Analysis Results' },
  copy: { 'pt-br': 'Copiar', 'en-us': 'Copy' },
  copied: { 'pt-br': 'Copiado!', 'en-us': 'Copied!' },
  generating: { 'pt-br': 'Gerando análise...', 'en-us': 'Generating analysis...' },
  footer: { 'pt-br': '© 2025 Hemotrack por Daniel Nóbrega. Todos os direitos reservados.', 'en-us': '© 2025 Hemotrack by Daniel Nóbrega. All rights reserved.' },
  errorPDF: { 'pt-br': 'Por favor, selecione um arquivo PDF válido.', 'en-us': 'Please select a valid PDF file.' }
};

export default function Page() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState('');
  const [error, setError] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [language, setLanguage] = useState('pt-br');
  const [theme, setTheme] = useState('light'); // 'light' or 'dark'
  const responseTextRef = useRef(null);

  // --- PDF Text Extraction Logic ---
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

  // --- API Call Handler ---
  async function handleGerarValores() {
    if (!file) return;
    setLoading(true);
    setError('');
    setApiResponse('');
    try {
      const textoExtraido = await extractTextFromPdf(file);
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textoExtraido }),
      });
      if (!res.ok) throw new Error(`API returned an error: ${res.statusText}`);
      const data = await res.json();
      setApiResponse(data.reply);
    } catch (err) {
      console.error(err);
      setError(err.message || "Error processing PDF or communicating with the API");
    } finally {
      setLoading(false);
    }
  }

  // --- Effect to load pdf.js script ---
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
      try { document.body.removeChild(script); } catch (e) {}
    };
  }, []);

  // --- File Processing Logic ---
  const processFile = (selectedFile) => {
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError('');
      setApiResponse('');
    } else {
      setError(translations.errorPDF[language]);
      setFile(null);
    }
  };
  
  // --- Drag and Drop Handlers ---
  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    processFile(e.dataTransfer.files[0]);
  };
  
  // --- Input Change Handler ---
  const handleFileChange = (e) => { processFile(e.target.files?.[0]); };

  // --- Clipboard Copy Handler ---
  const handleCopyToClipboard = () => {
    if (responseTextRef.current) {
      const textArea = document.createElement('textarea');
      textArea.value = responseTextRef.current.innerText;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (err) { console.error('Failed to copy text: ', err); }
      document.body.removeChild(textArea);
    }
  };
  
  // --- Control Handlers ---
  const toggleLanguage = () => { setLanguage(prev => prev === 'pt-br' ? 'en-us' : 'pt-br'); };
  const toggleTheme = () => { setTheme(prev => prev === 'light' ? 'dark' : 'light'); };

  return (
    <>
      <CSSStyles />
      <div className="analyzer-container" data-theme={theme}>
        <div className="top-controls">
            <button onClick={toggleLanguage} className="control-button">
              {language === 'pt-br' ? 'EN' : 'PT'}
            </button>
            <button onClick={toggleTheme} className="control-button">
              {theme === 'light' ? <MoonIcon /> : <SunIcon />}
            </button>
        </div>

        <div className="analyzer-content">
          <div className="header">
            <div className="icon-wrapper"><BloodDropIcon /></div>
            <h1 className="title">{translations.title[language]}</h1>
            <p className="subtitle">{translations.subtitle[language]}</p>
          </div>

          <div className="card">
            <div className="card-padding">
              <div>
                <label htmlFor="file-upload" className="file-label">{translations.fileLabel[language]}</label>
                <label htmlFor="file-upload" className={`file-dropzone ${isDragging ? 'dragging' : ''}`} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
                    <UploadCloudIcon />
                    <p className="file-dropzone-text">
                        <span className="file-dropzone-text-bold">{translations.uploadClick[language]}</span> {translations.uploadDrag[language]}
                    </p>
                    <p className="file-dropzone-text-small">{translations.uploadHint[language]}</p>
                    <input id="file-upload" type="file" className="hidden-input" accept="application/pdf" onChange={handleFileChange} />
                </label>
              </div>

              {file && (
                <div className="file-selected-info">
                  <FileIcon />
                  <span><strong>{translations.selectedFile[language]}</strong> {file.name}</span>
                </div>
              )}

              <button onClick={handleGerarValores} disabled={loading || !file} className="analyze-button">
                {loading ? (
                  <>
                    <svg className="spinner" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v3m0 12v3m-9-9h3m12 0h3m-4.93-4.93l2.12 2.12M4.93 19.07l2.12-2.12m0-10.82l-2.12 2.12M19.07 4.93l-2.12 2.12" /></svg>
                    {translations.analyzingButton[language]}
                  </>
                ) : (
                  <>
                    <BeakerIcon />
                    {translations.analyzeButton[language]}
                  </>
                )}
              </button>

              {error && (<div className="error-box">⚠️ {error}</div>)}
            </div>

            {(apiResponse || loading) && (
              <div className="results-section">
                  <div className="card-padding">
                      <div className="results-header">
                          <h2 className="results-title">{translations.resultsTitle[language]}</h2>
                          {apiResponse && (
                               <button onClick={handleCopyToClipboard} className="copy-button">
                                  {copySuccess ? <ClipboardCheckIcon /> : <ClipboardIcon />}
                                  {copySuccess ? translations.copied[language] : translations.copy[language]}
                              </button>
                          )}
                      </div>
                      <div className="results-box">
                          {loading ? (
                              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-secondary)'}}>
                                  <p>{translations.generating[language]}</p>
                              </div>
                          ) : (
                              <pre ref={responseTextRef} className="results-pre">{apiResponse}</pre>
                          )}
                      </div>
                  </div>
              </div>
            )}
          </div>

          <div className="footer">
            <p>{translations.footer[language]}</p>
          </div>
        </div>
      </div>
    </>
  );
}
