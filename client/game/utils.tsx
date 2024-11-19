
export const minimaxNames = [
  "Minnie",
  "Max",
  "Milton",
  "Maple",
  "Maddie",
  "May",
];

export const qlearningNames = [
  "Quincy",
  "Quilton",
  "Quill",
  "Quinn",
]

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
