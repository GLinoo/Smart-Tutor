
import React from 'react';

interface ErrorDisplayProps {
  message: string;
  onReset: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onReset }) => {
  return (
    <div className="max-w-md mx-auto bg-red-50 border border-red-200 p-8 rounded-2xl shadow-lg text-center">
      <svg className="w-16 h-16 mx-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <h2 className="text-2xl font-bold text-red-800 mt-4">Ops! Algo deu errado.</h2>
      <p className="text-red-700 mt-2">{message}</p>
      <button
        onClick={onReset}
        className="mt-6 bg-red-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-red-700 transition duration-300"
      >
        Tentar Novamente
      </button>
    </div>
  );
};

export default ErrorDisplay;
