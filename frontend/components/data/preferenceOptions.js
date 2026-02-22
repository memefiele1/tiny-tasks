export const preferenceOptions = [
  {
    title: "What are you using this app for?",
    isText: false,
    type: "multiple choice",
    options: ["School", "Work", "Personal"],
  },
  {
    title: "How many credit hours are you taking?",
    isText: true,
    type: "numeric",
    options: [" < 12 ", "12 - 14", "15"],
  },
  {
    title: "How many tasks would you like displayed at a time?",
    isText: true,
    type: "numeric",
    options: ["2", "4", "5"],
  },
  {
    title: "On average, how many hours do you work daily?",
    isText: true,
    type: "numeric",
    options: ["2-4", "5-7", "7+"],
  },
];