import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SpiritEncounter {
  id: string;
  spiritName: string;
  type: 'Mindfulness' | 'Story' | 'Puzzle';
  task: string;
  reward: string;
  date: string;
  personalNote?: string;
  completed: boolean;
  xpEarned: number;
}

interface FernveilState {
  xp: number;
  spiritBondLevel: number;
  journal: SpiritEncounter[];
  currentEncounter: SpiritEncounter | null;
  soundEnabled: boolean;
  
  // Actions
  completeEncounter: (encounter: SpiritEncounter, personalNote?: string) => Promise<void>;
  startEncounter: (encounter: SpiritEncounter) => void;
  toggleSound: () => Promise<void>;
  loadData: () => Promise<void>;
  resetData: () => Promise<void>;
}

const STORAGE_KEY = 'fernveil_data';

export const useFernveil = create<FernveilState>((set, get) => ({
  xp: 0,
  spiritBondLevel: 1,
  journal: [],
  currentEncounter: null,
  soundEnabled: true,

  startEncounter: (encounter) => {
    set({ currentEncounter: encounter });
  },

  completeEncounter: async (encounter, personalNote = '') => {
    const state = get();
    const completedEncounter: SpiritEncounter = {
      ...encounter,
      personalNote,
      completed: true,
      date: new Date().toISOString(),
    };

    const newXp = state.xp + encounter.xpEarned;
    const newSpiritBondLevel = Math.floor(newXp / 100) + 1;
    const newJournal = [...state.journal, completedEncounter];

    const newState = {
      xp: newXp,
      spiritBondLevel: newSpiritBondLevel,
      journal: newJournal,
      currentEncounter: null,
    };

    set(newState);

    // Save to AsyncStorage
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({
        xp: newXp,
        spiritBondLevel: newSpiritBondLevel,
        journal: newJournal,
        soundEnabled: state.soundEnabled,
      }));
    } catch (error) {
      console.error('Failed to save data:', error);
    }
  },

  toggleSound: async () => {
    const newSoundEnabled = !get().soundEnabled;
    set({ soundEnabled: newSoundEnabled });
    
    try {
      const currentData = await AsyncStorage.getItem(STORAGE_KEY);
      const data = currentData ? JSON.parse(currentData) : {};
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({
        ...data,
        soundEnabled: newSoundEnabled,
      }));
    } catch (error) {
      console.error('Failed to save sound setting:', error);
    }
  },

  loadData: async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        set({
          xp: parsed.xp || 0,
          spiritBondLevel: parsed.spiritBondLevel || 1,
          journal: parsed.journal || [],
          soundEnabled: parsed.soundEnabled ?? true,
        });
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  },

  resetData: async () => {
    set({
      xp: 0,
      spiritBondLevel: 1,
      journal: [],
      currentEncounter: null,
    });
    
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to reset data:', error);
    }
  },
}));