interface Question {
  text: string;
  answer: string;
  options: string[];
}

const QUESTIONS: Question[] = [
  {
    text: "What does HTML stand for?",
    answer: "Hyper Text Markup Language",
    options: [
      "Hyper Trainer Marking Language",
      "Hyper Text Markup Language",
      "Hyper Text Marketing Language",
      "Hyper Tool Multi Language",
    ],
  },
  {
    text: "Which tag is used to create a hyperlink?",
    answer: "a",
    options: ["link", "a", "href", "hyper"],
  },
  {
    text: "Which keyword is used to declare a variable?",
    answer: "All of the above",
    options: ["var", "let", "const", "All of the above"],
  },
  {
    text: "Which method is used to print in console?",
    answer: "console.log()",
    options: ["print()", "console.log()", "log.console()", "write()"],
  },
  {
    text: "Which operator is used for strict equality?",
    answer: "===",
    options: ["==", "=", "===", "!="],
  },
];

const OPT_KEYS: string[] = ["A", "B", "C", "D"];

let currentIdx: number = 0;
let userAnswers: (string | null)[] = new Array(QUESTIONS.length).fill(null);
let totalSeconds: number = QUESTIONS.length * 10;
let timerInterval: ReturnType<typeof setInterval> | null = null;
let quizDone: boolean = false;

// DOM references
const totalLabel: HTMLSpanElement        = document.getElementById("totalLabel") as HTMLSpanElement;
const progressFill: HTMLDivElement       = document.getElementById("progressFill") as HTMLDivElement;
const quizArea: HTMLDivElement           = document.getElementById("quizArea") as HTMLDivElement;
const scoreScreen: HTMLDivElement        = document.getElementById("scoreScreen") as HTMLDivElement;
const timerDot: HTMLDivElement           = document.getElementById("timerDot") as HTMLDivElement;
const timerText: HTMLSpanElement         = document.getElementById("timerText") as HTMLSpanElement;
const questionNum: HTMLDivElement        = document.getElementById("questionNum") as HTMLDivElement;
const questionText: HTMLDivElement       = document.getElementById("questionText") as HTMLDivElement;
const optionsContainer: HTMLDivElement   = document.getElementById("optionsContainer") as HTMLDivElement;
const btnPrev: HTMLButtonElement         = document.getElementById("btnPrev") as HTMLButtonElement;
const btnNext: HTMLButtonElement         = document.getElementById("btnNext") as HTMLButtonElement;
const scoreBig: HTMLDivElement           = document.getElementById("scoreBig") as HTMLDivElement;
const scoreSub: HTMLDivElement           = document.getElementById("scoreSub") as HTMLDivElement;
const btnViewSheet: HTMLButtonElement    = document.getElementById("btnViewSheet") as HTMLButtonElement;
const overlay: HTMLDivElement            = document.getElementById("overlay") as HTMLDivElement;
const sheetBody: HTMLDivElement          = document.getElementById("sheetBody") as HTMLDivElement;
const btnClose: HTMLButtonElement        = document.getElementById("btnClose") as HTMLButtonElement;

// Init
totalLabel.textContent = `1 / ${QUESTIONS.length} questions`;
renderQuestion();
startTimer();

function renderQuestion(): void {
  const q: Question = QUESTIONS[currentIdx];

  // Progress bar
  const pct: number = (currentIdx / QUESTIONS.length) * 100;
  progressFill.style.width = `${pct}%`;
  totalLabel.textContent = `${currentIdx + 1} / ${QUESTIONS.length} questions`;

  // Question meta
  questionNum.textContent = `Question ${currentIdx + 1}`;
  questionText.textContent = q.text;

  // Build option elements
  optionsContainer.innerHTML = "";
  q.options.forEach((opt: string, i: number) => {
    const lbl = document.createElement("label");
    lbl.className = "opt-label";

    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "quiz-answer";
    radio.value = opt;
    if (userAnswers[currentIdx] === opt) radio.checked = true;

    const indicator = document.createElement("span");
    indicator.className = "opt-indicator";

    const key = document.createElement("span");
    key.className = "opt-key";
    key.textContent = OPT_KEYS[i];

    const text = document.createElement("span");
    text.className = "opt-text";
    text.textContent = opt;

    lbl.appendChild(radio);
    lbl.appendChild(indicator);
    lbl.appendChild(key);
    lbl.appendChild(text);
    optionsContainer.appendChild(lbl);
  });

  // Button state
  btnPrev.disabled = currentIdx === 0;
  btnNext.textContent = currentIdx === QUESTIONS.length - 1 ? "Submit" : "Next →";
}

function getSelectedAnswer(): string | null {
  const radios = optionsContainer.querySelectorAll<HTMLInputElement>('input[type="radio"]');
  for (const r of radios) {
    if (r.checked) return r.value;
  }
  return null;
}

function saveAnswer(): void {
  userAnswers[currentIdx] = getSelectedAnswer();
}

btnNext.addEventListener("click", () => {
  saveAnswer();
  if (currentIdx < QUESTIONS.length - 1) {
    currentIdx++;
    renderQuestion();
  } else {
    finishQuiz();
  }
});

btnPrev.addEventListener("click", () => {
  saveAnswer();
  if (currentIdx > 0) {
    currentIdx--;
    renderQuestion();
  }
});

function startTimer(): void {
  updateTimerDisplay();
  timerInterval = setInterval(() => {
    if (totalSeconds <= 0) {
      clearInterval(timerInterval!);
      if (!quizDone) finishQuiz();
      return;
    }
    totalSeconds--;
    updateTimerDisplay();
  }, 1000);
}

function updateTimerDisplay(): void {
  const m: number = Math.floor(totalSeconds / 60);
  const s: number = totalSeconds % 60;
  timerText.textContent = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;

  const urgent: boolean = totalSeconds <= 10;
  timerText.classList.toggle("urgent", urgent);
  timerDot.style.background = urgent ? "var(--wrong)" : "var(--accent)";
}

function finishQuiz(): void {
  quizDone = true;
  saveAnswer();
  if (timerInterval) clearInterval(timerInterval);

  let score: number = 0;
  userAnswers.forEach((ans: string | null, i: number) => {
    if (ans === QUESTIONS[i].answer) score++;
  });

  progressFill.style.width = "100%";
  quizArea.classList.add("hidden");
  scoreScreen.classList.add("active");

  scoreBig.textContent = `${score}/${QUESTIONS.length}`;

  const pct: number = Math.round((score / QUESTIONS.length) * 100);
  if (pct === 100)      scoreSub.textContent = "Perfect score! Outstanding work.";
  else if (pct >= 80)   scoreSub.textContent = "Great job — you really know your stuff.";
  else if (pct >= 60)   scoreSub.textContent = "Decent result. A little more practice and you'll nail it.";
  else if (pct >= 40)   scoreSub.textContent = "Keep going — review the answers below to learn.";
  else                  scoreSub.textContent = "Tough one. Check the answer sheet and try again!";
}

btnViewSheet.addEventListener("click", showAnswerSheet);
btnClose.addEventListener("click", () => overlay.classList.remove("active"));
overlay.addEventListener("click", (e: MouseEvent) => {
  if (e.target === overlay) overlay.classList.remove("active");
});

function showAnswerSheet(): void {
  sheetBody.innerHTML = "";

  QUESTIONS.forEach((q: Question, i: number) => {
    const userAns: string | null = userAnswers[i];
    const isCorrect: boolean = userAns === q.answer;

    const item = document.createElement("div");
    item.className = "sheet-item";

    const qText = document.createElement("div");
    qText.className = "sheet-q";
    qText.textContent = `${i + 1}. ${q.text}`;

    const opts = document.createElement("div");
    opts.className = "sheet-opts";
    q.options.forEach((o: string, j: number) => {
      const sp = document.createElement("span");
      sp.className = "sheet-opt";
      sp.textContent = `${OPT_KEYS[j]}. ${o}`;
      opts.appendChild(sp);
    });

    const answers = document.createElement("div");
    answers.className = "sheet-answers";

    const correctChip = document.createElement("span");
    correctChip.className = "ans-chip correct";
    correctChip.textContent = `✓ ${q.answer}`;
    answers.appendChild(correctChip);

    const userChip = document.createElement("span");
    if (!userAns) {
      userChip.className = "ans-chip no-ans";
      userChip.textContent = "No answer";
    } else if (isCorrect) {
      userChip.className = "ans-chip user-right";
      userChip.textContent = "Your answer ✓";
    } else {
      userChip.className = "ans-chip user-wrong";
      userChip.textContent = `✗ ${userAns}`;
    }
    answers.appendChild(userChip);

    item.appendChild(qText);
    item.appendChild(opts);
    item.appendChild(answers);
    sheetBody.appendChild(item);
  });

  overlay.classList.add("active");
}