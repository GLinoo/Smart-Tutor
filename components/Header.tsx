
import React from 'react';
import type { Topic } from '../types';
import { MentalHealthIcon, MoonIcon, UtensilsIcon, ActivityIcon } from './IconComponents';

interface HeaderProps {
  activeTopic: Topic;
  onTopicChange: (topic: Topic) => void;
}

// FIX: Replaced JSX.Element with React.ReactNode to resolve the "Cannot find namespace 'JSX'" error.
// React.ReactNode is a more general type that includes JSX elements and is a safe alternative.
const topicsConfig: { id: Topic; label: string; icon: React.ReactNode }[] = [
  { id: 'mentalHealth', label: 'Saúde Mental', icon: <MentalHealthIcon /> },
  { id: 'sleep', label: 'Sono', icon: <MoonIcon /> },
  { id: 'diet', label: 'Alimentação', icon: <UtensilsIcon /> },
  { id: 'activity', label: 'Atividade', icon: <ActivityIcon /> },
];

const Header: React.FC<HeaderProps> = ({ activeTopic, onTopicChange }) => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center py-3 text-center border-b mb-2">
           <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Assistente de Bem-Estar com IA</h1>
        </div>
        <nav className="flex justify-center -mb-px">
          {topicsConfig.map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => onTopicChange(id)}
              className={`flex-1 sm:flex-none flex flex-col sm:flex-row items-center justify-center gap-2 px-2 sm:px-4 py-3 font-medium transition-colors duration-200 border-b-4 ${
                activeTopic === id
                  ? 'text-emerald-600 border-emerald-500'
                  : 'text-slate-500 hover:text-emerald-600 border-transparent hover:border-emerald-300'
              }`}
              aria-current={activeTopic === id ? 'page' : undefined}
            >
              {icon}
              <span className="text-xs sm:text-base">{label}</span>
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
