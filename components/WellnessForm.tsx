
import React, { useState, useEffect } from 'react';
import type { Topic, WellnessFormData, MentalHealthFormData, SleepFormData, DietFormData, ActivityFormData } from '../types';
import { LeafIcon, MentalHealthIcon, MoonIcon, UtensilsIcon, ActivityIcon } from './IconComponents';

interface WellnessFormProps {
  topic: Topic;
  onGenerateReport: (topic: Topic, formData: WellnessFormData) => void;
}

const WellnessForm: React.FC<WellnessFormProps> = ({ topic, onGenerateReport }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const [mentalHealthData, setMentalHealthData] = useState<Omit<MentalHealthFormData, 'name'>>({ stressFrequency: 'Às vezes', stressSource: '', leisureTime: 'Sim', relaxationTechniques: 'Não', mood: 3 });
  const [sleepData, setSleepData] = useState<Omit<SleepFormData, 'name'>>({ sleepHours: '7-8 horas', sleepDifficulty: 'Não', phoneBeforeBed: 'Sim', wakingUpRested: 'Às vezes', regularSchedule: 'Não' });
  const [dietData, setDietData] = useState<Omit<DietFormData, 'name'>>({ mealsPerDay: '3', skipBreakfast: 'Não', processedFoodFrequency: '1-2 vezes', waterIntake: 'Sim', fruitAndVeg: 'Sim', alcoholFrequency: 'Raramente' });
  const [activityData, setActivityData] = useState<Omit<ActivityFormData, 'name'>>({ physicalActivity: '', movementMinutes: '30-60 minutos', isSedentary: 'Sim', hasMusclePain: 'Às vezes' });
  
  useEffect(() => {
    setError('');
  }, [topic]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Por favor, insira seu nome para personalizar o relatório.');
      return;
    }
    setError('');
    let formData: WellnessFormData;
    switch (topic) {
      case 'mentalHealth':
        formData = { name, ...mentalHealthData };
        break;
      case 'sleep':
        formData = { name, ...sleepData };
        break;
      case 'diet':
        formData = { name, ...dietData };
        break;
      case 'activity':
        formData = { name, ...activityData };
        break;
    }
    onGenerateReport(topic, formData);
  };
  
  const topicConfig = {
    mentalHealth: { title: 'Saúde Mental e Estresse', icon: <MentalHealthIcon /> },
    sleep: { title: 'Qualidade do Sono', icon: <MoonIcon /> },
    diet: { title: 'Hábitos Alimentares', icon: <UtensilsIcon /> },
    activity: { title: 'Atividade Física', icon: <ActivityIcon /> },
  }

  // FIX: Helper components (RadioGroup, TextInput, Slider) were defined inside renderFormContent,
  // making them inaccessible in the main return statement of the component.
  // They have been moved to the component's top-level scope to be accessible throughout.
  const RadioGroup = ({ label, name, options, value, setter }: any) => (
    <div>
      <label className="block text-sm font-medium text-slate-600 mb-2">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt: string) => (
          <button key={opt} type="button" onClick={() => setter(opt)} className={`px-4 py-2 text-sm rounded-full border transition-colors ${value === opt ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'}`}>{opt}</button>
        ))}
      </div>
    </div>
  );
  const TextInput = ({ label, name, value, setter, placeholder, required = false }: any) => (
      <div>
        <label htmlFor={name} className="block text-sm font-medium text-slate-600 mb-1">{label} {required && '*'}</label>
        <input type="text" id={name} name={name} value={value} onChange={e => setter(e.target.value)} className="w-full p-3 border border-slate-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500" placeholder={placeholder} required={required} />
    </div>
  );
  const Slider = ({ label, name, value, setter }: any) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-slate-600 mb-1">{label}: <span className="font-bold text-emerald-600">{value}</span></label>
      <input type="range" id={name} name={name} min="1" max="5" value={value} onChange={e => setter(parseInt(e.target.value, 10))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"/>
    </div>
  );

  const renderFormContent = () => {
    switch (topic) {
      case 'mentalHealth':
        return (
          <div className="space-y-6">
            <RadioGroup label="Você costuma se sentir estressado(a) ou ansioso(a)?" name="stressFrequency" options={['Raramente', 'Às vezes', 'Frequentemente']} value={mentalHealthData.stressFrequency} setter={(v: any) => setMentalHealthData(p => ({...p, stressFrequency: v}))} />
            <TextInput label="O que mais te causa estresse atualmente?" name="stressSource" value={mentalHealthData.stressSource} setter={(v: any) => setMentalHealthData(p => ({...p, stressSource: v}))} placeholder="Ex: Trabalho, estudos, família..." />
            <RadioGroup label="Você tem momentos de lazer ou descanso durante a semana?" name="leisureTime" options={['Sim', 'Não', 'Poucos']} value={mentalHealthData.leisureTime} setter={(v: any) => setMentalHealthData(p => ({...p, leisureTime: v}))} />
            <RadioGroup label="Pratica alguma técnica de relaxamento (ex: respiração, meditação, etc)?" name="relaxationTechniques" options={['Sim', 'Não', 'Gostaria de começar']} value={mentalHealthData.relaxationTechniques} setter={(v: any) => setMentalHealthData(p => ({...p, relaxationTechniques: v}))} />
            <Slider label="Como avalia seu humor geral nos últimos dias? (1-Ruim, 5-Excelente)" name="mood" value={mentalHealthData.mood} setter={(v: any) => setMentalHealthData(p => ({...p, mood: v}))} />
          </div>
        );
      case 'sleep':
        return (
          <div className="space-y-6">
            <RadioGroup label="Em média, quantas horas você dorme por noite?" name="sleepHours" options={['Menos de 5 horas', '5-6 horas', '7-8 horas', 'Mais de 8 horas']} value={sleepData.sleepHours} setter={(v: any) => setSleepData(p => ({...p, sleepHours: v}))} />
            <RadioGroup label="Você tem dificuldade para dormir ou acordar?" name="sleepDifficulty" options={['Não', 'Às vezes', 'Sim']} value={sleepData.sleepDifficulty} setter={(v: any) => setSleepData(p => ({...p, sleepDifficulty: v}))} />
            <RadioGroup label="Costuma usar o celular antes de dormir?" name="phoneBeforeBed" options={['Sim', 'Não']} value={sleepData.phoneBeforeBed} setter={(v: any) => setSleepData(p => ({...p, phoneBeforeBed: v}))} />
            <RadioGroup label="Acorda se sentindo descansado(a)?" name="wakingUpRested" options={['Sempre', 'Às vezes', 'Raramente']} value={sleepData.wakingUpRested} setter={(v: any) => setSleepData(p => ({...p, wakingUpRested: v}))} />
            <RadioGroup label="Você mantém horários regulares de sono mesmo nos fins de semana?" name="regularSchedule" options={['Sim', 'Não']} value={sleepData.regularSchedule} setter={(v: any) => setSleepData(p => ({...p, regularSchedule: v}))} />
          </div>
        );
      case 'diet':
        return (
          <div className="space-y-6">
            <RadioGroup label="Quantas refeições completas você faz por dia?" name="mealsPerDay" options={['1', '2', '3', 'Mais de 3']} value={dietData.mealsPerDay} setter={(v: any) => setDietData(p => ({...p, mealsPerDay: v}))} />
            <RadioGroup label="Você costuma pular o café da manhã?" name="skipBreakfast" options={['Não', 'Sim']} value={dietData.skipBreakfast} setter={(v: any) => setDietData(p => ({...p, skipBreakfast: v}))} />
            <RadioGroup label="Quantas vezes por semana você come alimentos ultraprocessados (ex: fast food)?" name="processedFoodFrequency" options={['Raramente', '1-2 vezes', '3-4 vezes', 'Quase todo dia']} value={dietData.processedFoodFrequency} setter={(v: any) => setDietData(p => ({...p, processedFoodFrequency: v}))} />
            <RadioGroup label="Você bebe água regularmente ao longo do dia?" name="waterIntake" options={['Sim', 'Não', 'Preciso melhorar']} value={dietData.waterIntake} setter={(v: any) => setDietData(p => ({...p, waterIntake: v}))} />
            <RadioGroup label="Costuma incluir frutas, legumes e verduras nas refeições?" name="fruitAndVeg" options={['Sim', 'Não', 'Às vezes']} value={dietData.fruitAndVeg} setter={(v: any) => setDietData(p => ({...p, fruitAndVeg: v}))} />
            <RadioGroup label="Ingere bebidas alcoólicas? Com que frequência?" name="alcoholFrequency" options={['Não bebo', 'Raramente', 'Fins de semana', 'Frequentemente']} value={dietData.alcoholFrequency} setter={(v: any) => setDietData(p => ({...p, alcoholFrequency: v}))} />
          </div>
        );
      case 'activity':
        return (
          <div className="space-y-6">
            <TextInput label="Você pratica alguma atividade física? Qual e com que frequência?" name="physicalActivity" value={activityData.physicalActivity} setter={(v: any) => setActivityData(p => ({...p, physicalActivity: v}))} placeholder="Ex: Nenhuma, caminhada 3x por semana..." />
            <RadioGroup label="Quantos minutos por dia você se movimenta (ex: caminhada, escadas, etc.)?" name="movementMinutes" options={['Menos de 30 minutos', '30-60 minutos', 'Mais de 60 minutos']} value={activityData.movementMinutes} setter={(v: any) => setActivityData(p => ({...p, movementMinutes: v}))} />
            <RadioGroup label="Você trabalha ou estuda sentado(a) por longos períodos?" name="isSedentary" options={['Sim', 'Não']} value={activityData.isSedentary} setter={(v: any) => setActivityData(p => ({...p, isSedentary: v}))} />
            <RadioGroup label="Sente dores musculares ou posturais com frequência?" name="hasMusclePain" options={['Não', 'Às vezes', 'Sim']} value={activityData.hasMusclePain} setter={(v: any) => setActivityData(p => ({...p, hasMusclePain: v}))} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-slate-200">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800 flex items-center justify-center gap-3">
            {topicConfig[topic].icon}
            <span>{topicConfig[topic].title}</span>
        </h2>
        <p className="text-slate-500 mt-2">Responda as perguntas para receber um relatório personalizado.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-8">
         <fieldset className="p-6 border border-slate-200 rounded-lg">
            <legend className="text-lg font-semibold text-slate-700 px-2">Suas Informações</legend>
            <div className="mt-4">
                 <TextInput label="Seu Nome" name="name" value={name} setter={setName} placeholder="Para quem é o relatório?" required={true} />
            </div>
         </fieldset>
         <fieldset className="p-6 border border-slate-200 rounded-lg">
            <legend className="text-lg font-semibold text-slate-700 px-2">Questionário</legend>
            <div className="mt-4">
                {renderFormContent()}
            </div>
         </fieldset>

        {error && <p className="text-red-500 text-sm text-center -mt-4">{error}</p>}

        <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-4 px-4 rounded-lg hover:bg-emerald-700 transition duration-300 flex items-center justify-center gap-2 text-lg">
          <LeafIcon /> Gerar Meu Relatório de {topicConfig[topic].title}
        </button>
      </form>
    </div>
  );
};

export default WellnessForm;
