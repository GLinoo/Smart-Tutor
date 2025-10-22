
import React from 'react';

interface ReportProps {
  reportContent: string;
  userName: string;
  onDownload: () => void;
  onReset: () => void;
}

const Report: React.FC<ReportProps> = ({ reportContent, userName, onDownload, onReset }) => {
  
  const parseMarkdown = (text: string) => {
    return text.split('\n').map((line, index) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return <h3 key={index} className="text-xl font-bold text-slate-700 mt-6 mb-2">{line.replace(/\*\*/g, '')}</h3>;
      }
      if (line.startsWith('* ')) {
        return <li key={index} className="ml-5 list-disc text-slate-600">{line.substring(2)}</li>;
      }
       if (line.trim().match(/^\d+\./)) {
        return <li key={index} className="ml-5 list-decimal text-slate-600">{line.replace(/^\d+\.\s*/, '')}</li>;
      }
      if (line.trim() === '') {
          return <br key={index} />;
      }
      return <p key={index} className="text-slate-600 leading-relaxed mb-2">{line}</p>;
    });
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div id="report-container" className="bg-white p-10 md:p-12 rounded-2xl shadow-lg border border-slate-200">
        <header className="text-center border-b-2 border-emerald-500 pb-4 mb-8">
            <h1 className="text-4xl font-extrabold text-emerald-600">Relatório de Bem-Estar</h1>
            <p className="text-slate-500 text-lg mt-2">Personalizado para <span className="font-bold">{userName}</span></p>
            <p className="text-sm text-slate-400 mt-1">Gerado em: {new Date().toLocaleDateString('pt-BR')}</p>
        </header>
        <div className="prose prose-slate max-w-none">
          {parseMarkdown(reportContent)}
        </div>
      </div>
      <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
        <button onClick={onDownload} className="bg-emerald-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-emerald-700 transition duration-300">
          Baixar Relatório em PDF
        </button>
        <button onClick={onReset} className="bg-slate-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-slate-700 transition duration-300">
          Começar de Novo
        </button>
      </div>
    </div>
  );
};

export default Report;
