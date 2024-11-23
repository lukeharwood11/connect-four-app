export const minimaxNames = [
  "MaxMind",
  "DeepThought",
  "QuantumMax",
  "MasterMind",
  "AlphaLogic",
  "OmegaMax",
  "NeuraMind",
  "SynapseX",
];

export const qlearningNames = [
  "QMaster",
  "NeuralQ",
  "QuantumQ",
  "QMind",
  "DeepQ",
  "QLogic",
  "BrainQ",
  "QIntel",
];

const randint = (n: number) => {
  return Math.floor(Math.random() * n)
}

export const getRandomName = (aiType: string) => {
  if (aiType == "minimax") {
    return minimaxNames[randint(minimaxNames.length)];
  } else if (aiType == "ql") {
    return qlearningNames[randint(qlearningNames.length)];
  } else {
    return "AI";
  }
}
