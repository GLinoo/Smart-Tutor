
import { GoogleGenAI } from "@google/genai";
import type { Topic, WellnessFormData, MentalHealthFormData, SleepFormData, DietFormData, ActivityFormData } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const generateMarkdownReportStructure = (name: string, topicTitle: string, analysisSection: string) => `
  Use o formato Markdown para a resposta. O relatório deve ter as seguintes seções:
  1.  **Olá, ${name}! Um Relatório Sobre Seu Bem-Estar: ${topicTitle}** Um parágrafo introdutório e amigável.
  2.  **Análise Detalhada:** Com base nas respostas, comente sobre os pontos fortes e as áreas que merecem atenção.
  3.  **Plano de Ação Personalizado:** Crie uma lista com 3 a 5 passos simples e acionáveis que o usuário pode começar a implementar imediatamente.
  4.  **Mensagem Final:** Uma nota final positiva e de encorajamento.

  Aqui estão os dados do usuário:
  ${analysisSection}

  Seja gentil, preciso e use uma linguagem positiva e acessível. Evite jargões médicos complexos.
`;

function buildMentalHealthPrompt(formData: MentalHealthFormData): string {
    const analysisSection = `
    - Nome: ${formData.name}
    - Frequência com que se sente estressado(a) ou ansioso(a): ${formData.stressFrequency}
    - Principal causa de estresse: "${formData.stressSource}"
    - Possui momentos de lazer ou descanso: ${formData.leisureTime}
    - Pratica técnicas de relaxamento: ${formData.relaxationTechniques}
    - Humor geral nos últimos dias (1-5): ${formData.mood}
    `;
    return `Você é um especialista em saúde mental e bem-estar emocional. Sua tarefa é analisar as informações sobre estresse e saúde mental fornecidas pelo usuário e gerar um relatório personalizado com recomendações práticas e motivacionais.` + generateMarkdownReportStructure(formData.name, "Saúde Mental e Estresse", analysisSection);
}

function buildSleepPrompt(formData: SleepFormData): string {
    const analysisSection = `
    - Nome: ${formData.name}
    - Horas de sono por noite: ${formData.sleepHours}
    - Dificuldade para dormir ou acordar: ${formData.sleepDifficulty}
    - Uso de celular antes de dormir: ${formData.phoneBeforeBed}
    - Acorda se sentindo descansado(a): ${formData.wakingUpRested}
    - Mantém horários regulares de sono: ${formData.regularSchedule}
    `;
    return `Você é um especialista em sono e higiene do sono. Sua tarefa é analisar os hábitos de sono de um usuário e gerar um relatório personalizado com recomendações para melhorar a qualidade do descanso.` + generateMarkdownReportStructure(formData.name, "Qualidade do Sono", analysisSection);
}

function buildDietPrompt(formData: DietFormData): string {
    const analysisSection = `
    - Nome: ${formData.name}
    - Refeições completas por dia: ${formData.mealsPerDay}
    - Costuma pular o café da manhã: ${formData.skipBreakfast}
    - Frequência de consumo de alimentos ultraprocessados: ${formData.processedFoodFrequency}
    - Bebe água regularmente: ${formData.waterIntake}
    - Inclui frutas, legumes e verduras: ${formData.fruitAndVeg}
    - Frequência de ingestão de bebidas alcoólicas: ${formData.alcoholFrequency}
    `;
    return `Você é um nutricionista e especialista em alimentação saudável. Sua tarefa é analisar os hábitos alimentares de um usuário e gerar um relatório personalizado com recomendações práticas para uma dieta mais equilibrada.` + generateMarkdownReportStructure(formData.name, "Alimentação", analysisSection);
}

function buildActivityPrompt(formData: ActivityFormData): string {
    const analysisSection = `
    - Nome: ${formData.name}
    - Prática de atividade física (qual e frequência): "${formData.physicalActivity}"
    - Minutos de movimento por dia: ${formData.movementMinutes}
    - Trabalha ou estuda sentado(a) por longos períodos: ${formData.isSedentary}
    - Sente dores musculares ou posturais com frequência: ${formData.hasMusclePain}
    `;
    return `Você é um educador físico e especialista em saúde corporal. Sua tarefa é analisar o nível de atividade física de um usuário e gerar um relatório personalizado com recomendações para uma rotina mais ativa e saudável.` + generateMarkdownReportStructure(formData.name, "Atividade Física", analysisSection);
}

function buildPrompt(topic: Topic, formData: WellnessFormData): string {
  switch (topic) {
    case 'mentalHealth':
      return buildMentalHealthPrompt(formData as MentalHealthFormData);
    case 'sleep':
      return buildSleepPrompt(formData as SleepFormData);
    case 'diet':
      return buildDietPrompt(formData as DietFormData);
    case 'activity':
      return buildActivityPrompt(formData as ActivityFormData);
    default:
      const name = 'name' in formData ? formData.name : 'usuário';
      return `Por favor, forneça uma análise geral de bem-estar para ${name}.`;
  }
}


export async function generateWellnessReport(topic: Topic, formData: WellnessFormData): Promise<string> {
  const prompt = buildPrompt(topic, formData);
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    // FIX: The `response.text` can be undefined. Ensure a string is always returned.
    return response.text ?? '';
  } catch (error) {
    console.error("Gemini API call failed:", error);
    throw new Error("A chamada para a API Gemini falhou. Verifique o console para mais detalhes.");
  }
}
