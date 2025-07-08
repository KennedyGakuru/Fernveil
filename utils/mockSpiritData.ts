import { SpiritEncounter } from '../store/useFernveil';

export const mockSpirits: Omit<SpiritEncounter, 'id' | 'date' | 'completed' | 'personalNote'>[] = [
  {
    spiritName: "Aurelia, the Breath Keeper",
    type: "Mindfulness",
    task: "Find a comfortable spot beneath this ancient tree. Close your eyes and take 10 deep breaths, feeling the life energy flowing around you.",
    reward: "Glowing Seed of Tranquility",
    xpEarned: 15,
  },
  {
    spiritName: "Whisper, the Story Weaver",
    type: "Story",
    task: "Listen carefully as I share the tale of how this forest came to be. Let your imagination paint the scenes in your mind.",
    reward: "Memory Crystal",
    xpEarned: 20,
  },
  {
    spiritName: "Sage, the Riddle Master",
    type: "Puzzle",
    task: "I am always growing, yet never fully grown. I reach for the sky but am rooted in stone. What am I?",
    reward: "Wisdom Rune",
    xpEarned: 25,
  },
  {
    spiritName: "Luna, the Night Whisperer",
    type: "Mindfulness",
    task: "Stand still for 5 minutes and listen to all the sounds around you. How many different sounds can you identify?",
    reward: "Echo Stone",
    xpEarned: 18,
  },
  {
    spiritName: "Moss, the Patient One",
    type: "Story",
    task: "I've watched over this place for centuries. Let me tell you about the creatures that have called this forest home.",
    reward: "Ancient Bark Fragment",
    xpEarned: 22,
  },
];

export const getRandomSpirit = (): SpiritEncounter => {
  const randomSpirit = mockSpirits[Math.floor(Math.random() * mockSpirits.length)];
  return {
    ...randomSpirit,
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    date: new Date().toISOString(),
    completed: false,
  };
};

export const getSpiritByType = (type: 'Mindfulness' | 'Story' | 'Puzzle'): SpiritEncounter => {
  const spiritsOfType = mockSpirits.filter(spirit => spirit.type === type);
  const randomSpirit = spiritsOfType[Math.floor(Math.random() * spiritsOfType.length)];
  return {
    ...randomSpirit,
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    date: new Date().toISOString(),
    completed: false,
  };
};