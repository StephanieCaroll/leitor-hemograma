'use client';

import { useState, useEffect } from 'react';
import './globals.css';

export default function Page() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [error, setError] = useState('');
  const [selectedKey, setSelectedKey] = useState('');

  const keyOptions = [
    'Hemoglobina', 'Hemácias', 'VCM', 'HCM', 'CHCM', 'RDW', 'Leucocitos',
    'Promielócitos', 'Mielócitos', 'Basófilos', 'Blastos', 'Metamielócitos',
    'Bastões', 'Neutrófilos', 'Eosinófilos', 'Linfócito Típicos', 'Linfócito Atípicos', 'Monócitos',
    'Contagem de Plaquetas', 'Data/Hora Coleta', 'Data/Hora Laudo', 'Ureia Serica',
    'Creatinina Serica', 'AST/TGO', 'ALT/TGP', 'Proteínas Totais', 'Albumina',
    'Globulina', 'Relação Albumina/Globulina', 'Sódio', 'Bilirrubinas Totais',
    'Bilirrubinas Direta', 'Bilirrubinas Indireta', 'Potássio', 'Proteína C Reativa',
    'Gasometria pH', 'PO2', 'PCO2', 'Sódio Gaso', 'Potássio Gaso',
    'Cálcio Iônico', 'Glicose', 'Lactato', 'HCO3 Total', 'BE', 'SO2'
  ];

  const referenceValues = {
    Hemoglobina: '13,50 – 17,50 g/dL',
    Hemácias: '4,50 – 5,90 10⁶/mm³',
    VCM: '80,0 – 100,0 fl',
    HCM: '25,0 – 35,0 pg',
    CHCM: '31,0 – 37,0 g/dL',
    RDW: '11,70 – 15,00 %',
    Leucocitos: '4500 – 11000 /mm³',
    Promielócitos: '0%',
    Mielócitos: '0%',
    Basófilos: '0,0 - 1,0',
    Blastos: '0%',
    Metamielócitos: '0%',
    Bastões: '0,0 - 4,0',
    Neutrófilos: '45,5 – 73,5 %',
    Eosinófilos: '0,0 – 4,0',
    'Linfócito Típicos': '20,30 – 47,00 %',
    'Linfócito Atípicos': '0,00 - 0,00%',
    Monócitos: '2,00 - 10,0',
    'Contagem de Plaquetas': '150 – 500 mil/mm³',
    'Data/Hora Coleta': 'Verificar no laudo',
    'Data/Hora Laudo': 'Verificar no laudo',
    'Ureia Serica': '16,6 – 48,5 mg/dL',
    'Creatinina Serica': '0,70 – 1,20 mg/dL',
    'AST/TGO': 'Homem: até 50 U/L | Mulher: até 35 U/L',
    'ALT/TGP': 'Homem: até 41 U/L | Mulher: até 33 U/L',
    'Proteínas Totais': '6,6 – 8,7 g/dL',
    Albumina: '3,5 – 5,2 g/dL',
    Globulina: '2,2 – 4,2 g/dL',
    'Relação Albumina/Globulina': '≈ 1,0',
    'Sódio': '136 – 145 mmol/L',
    'Bilirrubinas Totais': '0,00 – 1,20 mg/dL',
    'Bilirrubinas Direta': '0,00 – 0,30 mg/dL',
    'Bilirrubinas Indireta': 'Calculada',
    'Potássio': '3,5 – 5,1 mmol/L',
    'Proteína C Reativa': '< 0,50 mg/dL',
    'Gasometria pH': '7,32 – 7,43',
    PO2: '38 – 50 mmHg',
    PCO2: '35 – 40 mmHg',
    'Sódio Gaso': '136 – 145 mmol/L',
    'Potássio Gaso': '3,4 – 4,5 mmol/L',
    'Cálcio Iônico': '1,15 – 1,35 mmol/L',
    Glicose: '60 – 95 mg/dL',
    Lactato: '0,5 – 2,2 mmol/L',
    'HCO3 Total': '22 – 29 mmol/L',
    BE: '-2,0 – +2,0 mmol/L',
    SO2: '60 – 75 %',
  };

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

  const handleKeyChange = (e) => {
    setSelectedKey(e.target.value);
    setExtractedData(null);
  };

  const handleExtract = async () => {
    if (!file || !window.pdfjsLib || selectedKey === '') {
      setError('PDF.js não carregado, arquivo ausente ou exame não selecionado.');
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
        
        const value = extractValue(fullText, selectedKey);
        setExtractedData(value);
      };
      reader.readAsArrayBuffer(file);
    } catch (err) {
      console.error(err);
      setError('Erro ao processar o PDF.');
    } finally {
      setLoading(false);
    }
  };

  const extractValue = (text, key) => {
    const patterns = {
      Hemácias: /Hem[aá]cias\s*([0-9.,]+)\s*10\\^6\/?mm³?/i,
      Hemoglobina: /Hemoglobina\s+(\d+[,\.]?\d*)\s*g\/dL/i,
      VCM: /VCM\s*[:\-]?\s*(\d+[,\.]?\d*)\s*fl/i,
      HCM: /HCM\s*[:\-]?\s*(\d+[,\.]?\d*)\s*pg/i,
      CHCM: /CHCM\s*[:\-]?\s*(\d+[,\.]?\d*)\s*g\/dL/i,
      RDW: /RDW\s*[:\-]?\s*(\d+[,\.]?\d*)\s*%/i,
      Leucocitos: /Leuc[oó]citos:?\s*(\d+[,\.]?\d*)\/mm[³3]/i,
      Promielócitos: /Promiel[oó]citos\s*[:\-]?\s*(\d+[,\.]?\d*)/i,
      Mielócitos: /Miel[oó]citos\s*[:\-]?\s*(\d+[,\.]?\d*)/i,
      Basófilos: /Bas[oó]filos\s*[:\-]?\s*(\d+[,\.]?\d*)/i,
      Blastos: /Blastos\s*[:\-]?\s*(\d+[,\.]?\d*)/i,
      Metamielócitos: /Metamiel[oó]citos\s*[:\-]?\s*(\d+[,\.]?\d*)/i,
      Bastões: /Bast[oõ]es\s*[:\-]?\s*(\d+[,\.]?\d*)/i,
      Neutrófilos: /Neutr[oó]filos\s*[:\-]?\s*(\d+[,\.]?\d*)/i,
      Eosinófilos: /Eosin[oó]filos\s*[:\-]?\s*(\d+[,\.]?\d*)/i,
      'Linfócito Típicos': /Linf[oó]cito[s]?\s+T[ií]picos\s*[:\-]?\s*(\d+[,\.]?\d*)/i,
      'Linfócito Atípicos': /Linf[oó]cito[s]?\s+At[ií]picos\s*[:\-]?\s*(\d+[,\.]?\d*)/i,
      Monócitos: /Mon[oó]citos\s*[:\-]?\s*(\d+[,\.]?\d*)/i,
      'Contagem de Plaquetas': /Plaquetas.*?(\d+[,\.]?\d*)\s*(mil\/mm|10\^3)/i,
      'Data/Hora Coleta': /Data\/Hora\s+Coleta:?\s*(\d{2}\/\d{2}\/\d{4}\s*\d{2}:\d{2})/i,
      'Data/Hora Laudo': /Data\/Hora\s+Laudo:?\s*(\d{2}\/\d{2}\/\d{4}\s*\d{2}:\d{2})/i,
      'Ureia Serica': /UR[ÉE]IA S[ÉE]RICA(?:\s+[^:]*?)?[:\-]?\s*([0-9.,]+)\s*mg\/dL/i,
      'Creatinina Serica': /CREATININA\s*S[ÉE]RICA\s*[:\-]?\s*(\d+[,\.]?\d*)\s*mg\/dL/i,
      'AST/TGO': /(AST|TGO)\s*[:\-]?\s*(\d+)\s*U\/L/i,
      'ALT/TGP': /(ALT|TGP)\s*[:\-]?\s*(\d+)\s*U\/L/i,
      'Proteínas Totais': /PROTEINAS TOTAIS\s*[:\-]?\s*(\d+[,\.]?\d*)\s*g\/dL/i,
      Albumina: /ALBUMINA\s*[:\-]?\s*(\d+[,\.]?\d*)\s*g\/dL/i,
      Globulina: /GLOBULINA\s*[:\-]?\s*(\d+[,\.]?\d*)\s*g\/dL/i,
      'Relação Albumina/Globulina': /RELAÇÃO ALBUMINA\/GLOBULINA\s*(\d+[,.]?\d*)/i,
      'Sódio': /S[oó]dio\s*[:\-]?\s*(\d+[,\.]?\d*)\s*mmol\/L/i,
      'Bilirrubinas Totais': /BILIRRUBINAS TOTAIS\s*[:\-]?\s*(\d+[,\.]?\d*)\s*mg\/dL/i,
      'Bilirrubinas Direta': /BILIRRUBINAS DIRETA\s*[:\-]?\s*(\d+[,\.]?\d*)\s*mg\/dL/i,
      'Bilirrubinas Indireta': /BILIRRUBINAS INDIRETA\s*[:\-]?\s*(\d+[,\.]?\d*)\s*mg\/dL/i,
      'Potássio': /POT[ÁA]SSIO\s*S[ÉE]RICO?\s*[:\-]?\s*(\d+[,.]?\d*)\s*mmol\/L/i,
      'Proteína C Reativa': /Prote[ií]na C Reativa\s*[:\-]?\s*(\d+[,\.]?\d*)\s*mg\/dL/i,
      'Gasometria pH': /pH:?\s*(\d+[,\.]?\d*)/i,
      PO2: /PO2:?\s*(\d+[,\.]?\d*)\s*mmHg/i,
      PCO2: /PCO2:?\s*(\d+[,\.]?\d*)\s*mmHg/i,
      'Sódio Gaso': /S[OÓ]DIO:\s*(\d+[,.]?\d*)\s*mmol\/L/i, 
      'Potássio Gaso': /POT[ÁA]SSIO:\s*(\d+[,.]?\d*)\s*mmol\/L/i,
      'Cálcio Iônico': /C[aá]lcio I[ôó]nico\s*:\s*(\d+[,\.]?\d*)\s*mmol\/L/i,
      Glicose: /Glicose:\s*(\d+[,\.]?\d*)\s*mg\/dL/i,
      Lactato: /Lactato:\s*(\d+[,\.]?\d*)\s*mmol\/L/i,
      'HCO3 Total': /HCO3\s+Total\s*[:\-]?\s*(\d+[,\.]?\d*)\s*mmol\/L/i,
      BE: /B\.?E:?\s*(-?\d+[,.]?\d*)\s*mmol\/L/i,
      SO2: /SO2:?\s*(\d+[,\.]?\d*)\s*%/i,
    };

    const regex = patterns[key];
    if (!regex) return 'Padrão não encontrado';

    const match = text.match(regex);
    if (key === 'AST/TGO' || key === 'ALT/TGP') {
      return match ? match[2] : 'Valor não encontrado';
    }
    return match ? match[1] : 'Valor não encontrado';
  };

  return (
    <div className="container">
      <div className="card">
        <h1>Analisador de Exames</h1>
        <p>Selecione um PDF de exame e o tipo de exame para extrair o valor.</p>

        <label htmlFor="file-upload">Selecione o PDF:</label>
        <input id="file-upload" type="file" accept="application/pdf" onChange={handleFileChange} />

        <label htmlFor="exam-select">Selecione o exame:</label>
        <select id="exam-select" value={selectedKey} onChange={handleKeyChange}>
          <option value="" disabled>-- Selecione um exame --</option>
          {keyOptions.map(key => (
            <option key={key} value={key}>{key}</option>
          ))}
        </select>

        <button onClick={handleExtract} disabled={loading || !file || !selectedKey}>
          {loading ? 'Analisando...' : 'Extrair Valor'}
        </button>

        {error && <p className="error">{error}</p>}

        {extractedData && (
          <div className="result">
            <h3>Resultado para: {selectedKey}</h3>
            <p><strong>Valor encontrado:</strong> {extractedData}</p>
            <p><strong>Valor de referência:</strong> {referenceValues[selectedKey]}</p>
          </div>
        )}
      </div>
    </div>
  );
}