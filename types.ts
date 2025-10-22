
export type Topic = 'mentalHealth' | 'sleep' | 'diet' | 'activity';

export interface MentalHealthFormData {
  name: string;
  stressFrequency: string;
  stressSource: string;
  leisureTime: string;
  relaxationTechniques: string;
  mood: number;
}

export interface SleepFormData {
  name: string;
  sleepHours: string;
  sleepDifficulty: string;
  phoneBeforeBed: string;
  wakingUpRested: string;
  regularSchedule: string;
}

export interface DietFormData {
  name: string;
  mealsPerDay: string;
  skipBreakfast: string;
  processedFoodFrequency: string;
  waterIntake: string;
  fruitAndVeg: string;
  alcoholFrequency: string;
}

export interface ActivityFormData {
  name: string;
  physicalActivity: string;
  movementMinutes: string;
  isSedentary: string;
  hasMusclePain: string;
}

export type WellnessFormData = MentalHealthFormData | SleepFormData | DietFormData | ActivityFormData;

export type AppState = 'form' | 'loading' | 'report' | 'error';
