
import React, { useState, useCallback } from 'react';
import { WellnessFormData, AppState, Topic } from './types';
import { generateWellnessReport } from './services/geminiService';
import WellnessForm from './components/WellnessForm';
import Report from './components/Report';
import LoadingSpinner from './components/LoadingSpinner';
import Header from './components/Header';
import ErrorDisplay from './components/ErrorDisplay';

declare global {
  interface Window {
    jspdf: any;
    html2canvas: any;
  }
}


const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('form');
  const [currentTopic, setCurrentTopic] = useState<Topic>('mentalHealth');
  const [reportContent, setReportContent] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  function stripMarkdown(text: string): string {
    return text
      .replace(/\*\*(.*?)\*\*/g, '$1') // remove **negrito**
      .replace(/\*(.*?)\*/g, '$1')     // remove *itálico*
      .replace(/#+\s?(.*)/g, '$1')     // remove títulos (###, ##, #)
      .replace(/`(.*?)`/g, '$1')       // remove blocos de código ``
      .replace(/-\s+/g, '• ')          // transforma "-" em bolinha
      .replace(/\n{2,}/g, '\n\n')      // normaliza quebras de linha
      .trim();
  }


  const handleGenerateReport = useCallback(async (topic: Topic, formData: WellnessFormData) => {
    setAppState('loading');
    if ('name' in formData) {
      setUserName(formData.name);
    }
    try {
      const result = await generateWellnessReport(topic, formData);
      const cleanResult = stripMarkdown(result);
      setReportContent(cleanResult);

      setAppState('report');
    } catch (error) {
      console.error("Failed to generate report:", error);
      setErrorMessage('Ocorreu um erro ao gerar seu relatório. Por favor, verifique sua chave de API e tente novamente.');
      setAppState('error');
    }
  }, []);

  const handleReset = useCallback(() => {
    setAppState('form');
    setReportContent('');
    setUserName('');
    setErrorMessage('');
    setCurrentTopic('mentalHealth');
  }, []);

  const handleDownloadPdf = useCallback(() => {
    const { jsPDF } = window.jspdf;
    const input = document.getElementById('report-container');
    if (input && userName) {
      window.html2canvas(input, { scale: 2 }).then((canvas: HTMLCanvasElement) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        const imgWidth = pdfWidth;
        const imgHeight = (canvas.height * pdfWidth) / canvas.width;

        let heightLeft = imgHeight;
        let position = 0;

        // Função para limpar o nome do arquivo
        const sanitizeFileName = (text: string) => {
          return text
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-zA-Z0-9_]/g, '_');
        };

        const fileName = sanitizeFileName(`Relatorio_Bem_Estar_${currentTopic}_${userName}`);

        // Adiciona a primeira imagem
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;

        // Adiciona novas páginas conforme necessário
        while (heightLeft > 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pdfHeight;
        }

        pdf.save(`${fileName}.pdf`);
      });
    }
  }, [userName, currentTopic]);


  const renderContent = () => {
    switch (appState) {
      case 'loading':
        return <LoadingSpinner />;
      case 'report':
        return <Report reportContent={reportContent} userName={userName} onDownload={handleDownloadPdf} onReset={handleReset} />;
      case 'error':
        return <ErrorDisplay message={errorMessage} onReset={handleReset} />;
      case 'form':
      default:
        return (
          <WellnessForm
            key={currentTopic} // força o React a recarregar o componente quando o tema muda
            topic={currentTopic}
            onGenerateReport={handleGenerateReport}
          />
        );

    }
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800">
      {/* FIX: Type 'void' is not assignable to type '(topic: Topic) => void'. The onTopicChange prop expects a function. The original code was executing state setters directly. This has been corrected to a callback function that receives the 'topic' and updates the state. */}
      <Header activeTopic={currentTopic} onTopicChange={(topic) => { setAppState('form'); setCurrentTopic(topic); }} />
      <main className="container mx-auto px-4 py-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
