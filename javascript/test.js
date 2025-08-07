console.log("Javascript carregado com sucesso!");

let alphabetData = [];
let currentPracticeQuestion = null;
let practiceScore = { correct: 0, total: 0 };

// Função para tentar carregar um arquivo com múltiplos caminhos
async function fetchWithFallback(paths) {
  for (const path of paths) {
    try {
      const response = await fetch(path);
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {}
  }
  throw new Error(
    `Não foi possível carregar o arquivo. Tentou: ${paths.join(", ")}`
  );
}

// Função para carregar o alfabeto
async function loadAlphabet() {
  try {
    const paths = [
      "./others/alphabet.json",
      "../others/alphabet.json",
      "others/alphabet.json",
      "/others/alphabet.json",
    ];
    const data = await fetchWithFallback(paths);
    alphabetData = Object.entries(data).map(([name, letterData]) => ({
      name,
      isolated: letterData.isolated,
      letters: letterData.letter,
    }));
    window._alphabet = alphabetData;
    return alphabetData;
  } catch (e) {
    return [];
  }
}

// Função para falar em árabe
function speakArabic(text) {
  if (window.responsiveVoice) {
    window.responsiveVoice.speak(text, "Arabic Male", { rate: 0.8 });
  }
}

// Função para iniciar modo de prática
function startPractice() {
  if (!alphabetData.length) return;
  practiceScore = { correct: 0, total: 0 };
  document.getElementById("practice-area").style.display = "block";
  generatePracticeQuestion();
}

// Função para gerar questão de prática
function generatePracticeQuestion() {
  if (!alphabetData.length) return;
  const questionTypes = ["name", "letter"];
  const questionType =
    questionTypes[Math.floor(Math.random() * questionTypes.length)];
  const correctLetter =
    alphabetData[Math.floor(Math.random() * alphabetData.length)];
  let question, correctAnswer, options;
  if (questionType === "name") {
    question = `Qual é o nome desta letra?`;
    correctAnswer = correctLetter.name;
    options = generateOptions(
      correctLetter.name,
      alphabetData.map((l) => l.name)
    );
  } else {
    question = `Qual letra corresponde a "${correctLetter.name}"?`;
    correctAnswer = correctLetter.isolated;
    options = generateOptions(
      correctLetter.isolated,
      alphabetData.map((l) => l.isolated)
    );
  }
  currentPracticeQuestion = {
    type: questionType,
    correct: correctAnswer,
    letter: correctLetter,
  };
  document.getElementById("practice-question").innerHTML = `
    <div>${question}</div>
    ${
      questionType === "name"
        ? `<div class="alphabet-large">${correctLetter.isolated}</div>`
        : ""
    }
  `;
  document.getElementById("practice-options").innerHTML = options
    .map(
      (option) => `
    <div class="practice-option" onclick="checkAnswer('${option}')">
      ${option}
    </div>
  `
    )
    .join("");
  updatePracticeScore();
}

// Função para gerar opções de resposta
function generateOptions(correct, allOptions) {
  const options = [correct];
  const filteredOptions = allOptions.filter((opt) => opt !== correct);
  while (options.length < 4 && filteredOptions.length > 0) {
    const randomIndex = Math.floor(Math.random() * filteredOptions.length);
    const randomOption = filteredOptions.splice(randomIndex, 1)[0];
    if (!options.includes(randomOption)) {
      options.push(randomOption);
    }
  }
  return options.sort(() => Math.random() - 0.5);
}

// Função para verificar resposta
function checkAnswer(selectedAnswer) {
  if (!currentPracticeQuestion) return;
  const options = document.querySelectorAll(".practice-option");
  const isCorrect = selectedAnswer === currentPracticeQuestion.correct;
  options.forEach((option) => {
    option.style.pointerEvents = "none";
    if (option.textContent.trim() === selectedAnswer) {
      option.classList.add(isCorrect ? "correct" : "incorrect");
    } else if (option.textContent.trim() === currentPracticeQuestion.correct) {
      option.classList.add("correct");
    }
  });
  practiceScore.total++;
  if (isCorrect) {
    practiceScore.correct++;
    speakArabic(currentPracticeQuestion.letter.isolated);
  }
  updatePracticeScore();
  setTimeout(() => {
    generatePracticeQuestion();
  }, 2000);
}

// Função para atualizar pontuação
function updatePracticeScore() {
  const scoreElement = document.getElementById("practice-score");
  if (scoreElement) {
    scoreElement.innerHTML = `
      <div>Pontuação: ${practiceScore.correct}/${practiceScore.total}</div>
      <div>Taxa de Acerto: ${
        practiceScore.total > 0
          ? Math.round((practiceScore.correct / practiceScore.total) * 100)
          : 0
      }%</div>
    `;
  }
}

// Função para resetar prática
function resetPractice() {
  practiceScore = { correct: 0, total: 0 };
  document.getElementById("practice-area").style.display = "none";
  updatePracticeScore();
}

// Event listeners
document.addEventListener("DOMContentLoaded", async () => {
  await loadAlphabet();
  const soundBtn = document.getElementById("sound-btn");
  if (soundBtn) {
    soundBtn.addEventListener("click", () => {
      const resultado = document.getElementById("resultado");
      const span = resultado?.querySelector(".alphabet-large");
      if (span) {
        speakArabic(span.textContent.trim());
      }
    });
  }
  const startPracticeBtn = document.getElementById("start-practice");
  if (startPracticeBtn) {
    startPracticeBtn.addEventListener("click", startPractice);
  }
  const resetPracticeBtn = document.getElementById("reset-practice");
  if (resetPracticeBtn) {
    resetPracticeBtn.addEventListener("click", resetPractice);
  }
  window.speechSynthesis.onvoiceschanged = () => {
    console.log("Vozes disponíveis:", window.speechSynthesis.getVoices());
  };
});

// Funções globais para uso no HTML
window.speakArabic = speakArabic;
window.checkAnswer = checkAnswer;
