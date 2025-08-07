console.log("Javascript carregado com sucesso!");

// Função para obter o caminho base correto
function getBasePath() {
  // Se estamos em produção (GitHub Pages), o caminho pode ser diferente
  const currentPath = window.location.pathname;
  if (currentPath.includes("/arab/") || currentPath.includes("/arab")) {
    return "./";
  }
  // Para desenvolvimento local
  return "./";
}

// Variáveis globais
let alphabetData = [];
let wordsData = [];
let currentPracticeQuestion = null;
let practiceScore = { correct: 0, total: 0 };
let currentWord = null;

// Função para tentar carregar um arquivo com múltiplos caminhos
async function fetchWithFallback(paths) {
  for (const path of paths) {
    try {
      console.log(`Tentando carregar: ${path}`);
      const response = await fetch(path);
      if (response.ok) {
        console.log(`Sucesso ao carregar: ${path}`);
        return await response.json();
      } else {
        console.warn(`Falha ao carregar ${path}: Status ${response.status}`);
      }
    } catch (e) {
      console.warn(`Erro ao carregar ${path}:`, e);
    }
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

    // Converte o objeto em um array de letras com nome e formas
    alphabetData = Object.entries(data).map(([name, letterData]) => ({
      name,
      isolated: letterData.isolated,
      letters: letterData.letter,
    }));
    window._alphabet = alphabetData;
    return alphabetData;
  } catch (e) {
    console.error("Erro ao carregar alfabeto:", e);
    return [];
  }
}

// Função para carregar palavras
async function loadWords() {
  try {
    const paths = [
      "./others/words.json",
      "../others/words.json",
      "others/words.json",
      "/others/words.json",
    ];

    const data = await fetchWithFallback(paths);
    wordsData = data.basic_words;
    return wordsData;
  } catch (e) {
    console.error("Erro ao carregar palavras:", e);
    return [];
  }
}

// Função para falar em árabe
function speakArabic(text) {
  if (window.responsiveVoice) {
    window.responsiveVoice.speak(text, "Arabic Male", { rate: 0.8 });
  } else {
    console.warn("ResponsiveVoice não carregado.");
  }
}

// Função para mostrar letra aleatória
function showRandomLetter() {
  if (!alphabetData.length) return;

  const tipo = document.getElementById("category-select")?.value || "alfabeto";
  const idx = Math.floor(Math.random() * alphabetData.length);
  const letter = alphabetData[idx];
  let resultado = "";
  let explicacao = "";
  let formas = ["", "", "", ""]; // isolada, inicial, medial, final
  let labelVogal = "";

  // Sempre usar a forma isolada para o sorteio simples
  const forms = letter.letters;

  switch (tipo) {
    case "alfabeto":
      resultado = letter.isolated;
      explicacao = "Letra isolada";
      formas = [forms[0].form, forms[1].form, forms[2].form, forms[3].form];
      break;
    case "alfabeto_fatha":
      resultado = forms[0].fatha;
      explicacao = "Letra com Fatha ( َ )";
      formas = [forms[0].fatha, forms[1].fatha, forms[2].fatha, forms[3].fatha];
      labelVogal = "Fatha";
      break;
    case "alfabeto_kasra":
      resultado = forms[0].kasra;
      explicacao = "Letra com Kasra ( ِ )";
      formas = [forms[0].kasra, forms[1].kasra, forms[2].kasra, forms[3].kasra];
      labelVogal = "Kasra";
      break;
    case "alfabeto_damma":
      resultado = forms[0].damma;
      explicacao = "Letra com Damma ( ُ )";
      formas = [forms[0].damma, forms[1].damma, forms[2].damma, forms[3].damma];
      labelVogal = "Damma";
      break;
    case "alfabeto_sukun":
      resultado = forms[0].sukun;
      explicacao = "Letra com Sukun ( ْ )";
      formas = [forms[0].sukun, forms[1].sukun, forms[2].sukun, forms[3].sukun];
      labelVogal = "Sukun";
      break;
    case "alfabeto_todas": {
      const vogais = ["fatha", "kasra", "damma", "sukun"];
      const labelMap = {
        fatha: "Fatha ( َ )",
        kasra: "Kasra ( ِ )",
        damma: "Damma ( ُ )",
        sukun: "Sukun ( ْ )",
      };
      const idxVogal = Math.floor(Math.random() * vogais.length);
      const vogal = vogais[idxVogal];
      resultado = forms[0][vogal];
      explicacao = "Letra com " + labelMap[vogal];
      formas = [
        forms[0][vogal],
        forms[1][vogal],
        forms[2][vogal],
        forms[3][vogal],
      ];
      labelVogal = labelMap[vogal];
      break;
    }
    default:
      resultado = letter.isolated;
      explicacao = "Letra isolada";
      formas = [forms[0].form, forms[1].form, forms[2].form, forms[3].form];
  }

  document.getElementById("resultado").innerHTML = `
    <div class="flex-col flex-center">
      <span class="alphabet-large" title="${letter.name}">${resultado}</span>
      <small class="alphabet-small text-light p-2 blurred-text" id="letter-name">${
        letter.name
      }</small>
      <div class="flex-row flex-center p-2">
        <small class="text-xs">${explicacao}</small>
      </div>
      <div class="flex-row flex-center" style="margin-top:8px;">
        <div class="flex-col flex-center p-2">
          <span class="alphabet-medium">${formas[1]}</span>
          <small class="text-xs">Inicial${
            labelVogal ? " (" + labelVogal + ")" : ""
          }</small>
        </div>
        <div class="flex-col flex-center p-2">
          <span class="alphabet-medium">${formas[2]}</span>
          <small class="text-xs">Medial${
            labelVogal ? " (" + labelVogal + ")" : ""
          }</small>
        </div>
        <div class="flex-col flex-center p-2">
          <span class="alphabet-medium">${formas[3]}</span>
          <small class="text-xs">Final${
            labelVogal ? " (" + labelVogal + ")" : ""
          }</small>
        </div>
      </div>
    </div>
  `;

  setTimeout(() => {
    const nameEl = document.getElementById("letter-name");
    if (nameEl) {
      nameEl.onclick = () => {
        nameEl.classList.remove("blurred-text");
      };
    }
  }, 0);
}

// Função para mostrar alfabeto completo
function showAlphabetGrid() {
  const grid = document.getElementById("alphabet-grid");
  if (!grid || !alphabetData.length) return;

  const tipo = document.getElementById("tipoAlfabetoGrid")?.value || "alfabeto";

  // Decide como mostrar cada letra
  grid.innerHTML = alphabetData
    .map((letter) => {
      const forms = letter.letters;
      let formas = ["", "", "", ""];
      let labelVogal = "";
      switch (tipo) {
        case "alfabeto":
          formas = [forms[0].form, forms[1].form, forms[2].form, forms[3].form];
          break;
        case "alfabeto_fatha":
          formas = [
            forms[0].fatha,
            forms[1].fatha,
            forms[2].fatha,
            forms[3].fatha,
          ];
          labelVogal = "Fatha";
          break;
        case "alfabeto_kasra":
          formas = [
            forms[0].kasra,
            forms[1].kasra,
            forms[2].kasra,
            forms[3].kasra,
          ];
          labelVogal = "Kasra";
          break;
        case "alfabeto_damma":
          formas = [
            forms[0].damma,
            forms[1].damma,
            forms[2].damma,
            forms[3].damma,
          ];
          labelVogal = "Damma";
          break;
        case "alfabeto_sukun":
          formas = [
            forms[0].sukun,
            forms[1].sukun,
            forms[2].sukun,
            forms[3].sukun,
          ];
          labelVogal = "Sukun";
          break;
        case "alfabeto_todas": {
          const vogais = ["fatha", "kasra", "damma", "sukun"];
          const idxVogal = Math.floor(Math.random() * vogais.length);
          const vogal = vogais[idxVogal];
          const labelMap = {
            fatha: "Fatha",
            kasra: "Kasra",
            damma: "Damma",
            sukun: "Sukun",
          };
          formas = [
            forms[0][vogal],
            forms[1][vogal],
            forms[2][vogal],
            forms[3][vogal],
          ];
          labelVogal = labelMap[vogal];
          break;
        }
        default:
          formas = [forms[0].form, forms[1].form, forms[2].form, forms[3].form];
      }
      return `
        <div class="letter-card" onclick="showLetterDetails('${letter.name}')">
          <div class="letter-main">${formas[0]}</div>
          <div class="letter-name">${letter.name}</div>
          <div class="letter-forms">
            <span class="letter-form">${formas[1]}</span>
            <span class="letter-form">${formas[2]}</span>
            <span class="letter-form">${formas[3]}</span>
          </div>
          <button class="letter-sound" onclick="event.stopPropagation(); speakArabic('${
            formas[0] || letter.isolated
          }')">
            🔊
          </button>
        </div>
      `;
    })
    .join("");
}

// Função para mostrar detalhes de uma letra
function showLetterDetails(letterName) {
  const letter = alphabetData.find((l) => l.name === letterName);
  if (!letter) return;

  // Cria um modal ou substitui o conteúdo
  const container = document.getElementById("alphabet-container");
  container.innerHTML = `
    <div class="flex-col flex-center">
      <h2>${letter.name}</h2>
      <div class="letter-main">${letter.isolated}</div>
      <div class="letter-forms">
        <div class="flex-col flex-center p-2">
          <span class="alphabet-medium">${letter.letters[0].fatha}</span>
          <small>Isolada</small>
        </div>
        <div class="flex-col flex-center p-2">
          <span class="alphabet-medium">${letter.letters[1].fatha}</span>
          <small>Inicial</small>
        </div>
        <div class="flex-col flex-center p-2">
          <span class="alphabet-medium">${letter.letters[2].fatha}</span>
          <small>Medial</small>
        </div>
        <div class="flex-col flex-center p-2">
          <span class="alphabet-medium">${letter.letters[3].fatha}</span>
          <small>Final</small>
        </div>
      </div>
      <button class="btn" onclick="speakArabic('${letter.isolated}')">Ouvir Pronúncia</button>
      <button class="btn m-2" onclick="showAlphabetGrid()">Voltar ao Alfabeto</button>
    </div>
  `;
}

// Função para mostrar palavras por categoria
function showWordsByCategory(category = "") {
  const wordsGrid = document.getElementById("words-grid");
  if (!wordsGrid || !wordsData.length) return;

  const filteredWords = category
    ? wordsData.filter((word) => word.category === category)
    : wordsData;

  wordsGrid.innerHTML = filteredWords
    .map(
      (word) => `
    <div class="word-card" onclick="showWordDetails('${word.arabic}')">
      <div class="word-arabic">${word.arabic}</div>
      <div class="word-transliteration">${word.transliteration}</div>
      <div class="word-portuguese">${word.portuguese}</div>
      <div class="word-category">${word.category}</div>
      <button class="word-sound" onclick="event.stopPropagation(); speakArabic('${word.arabic}')">
        🔊
      </button>
    </div>
  `
    )
    .join("");
}

// Função para mostrar detalhes de uma palavra
function showWordDetails(arabicText) {
  const word = wordsData.find((w) => w.arabic === arabicText);
  if (!word) return;

  const wordDisplay = document.getElementById("word-display");
  wordDisplay.innerHTML = `
    <div class="word-arabic">${word.arabic}</div>
    <div class="word-transliteration">${word.transliteration}</div>
    <div class="word-portuguese">${word.portuguese}</div>
    <div class="word-category">${word.category}</div>
  `;

  currentWord = word;
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

  // Embaralha as opções
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

// Sistema de navegação por tabs
function switchTab(tabName) {
  // Remove active de todas as tabs
  document
    .querySelectorAll(".tab-btn")
    .forEach((btn) => btn.classList.remove("active"));
  document
    .querySelectorAll(".tab-content")
    .forEach((content) => content.classList.remove("active"));

  // Adiciona active na tab selecionada
  document.querySelector(`[data-tab="${tabName}"]`).classList.add("active");
  document.getElementById(`${tabName}-tab`).classList.add("active");

  // Carrega conteúdo específico da tab
  if (tabName === "alphabet") {
    showAlphabetGrid();
  } else if (tabName === "practice") {
    resetPractice();
  }
}

// Event listeners
document.addEventListener("DOMContentLoaded", async () => {
  await loadAlphabet();
  await loadWords();

  // Tab navigation
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      switchTab(btn.dataset.tab);
    });
  });

  // Atualiza o grid do alfabeto ao mudar o select
  const tipoAlfabetoGrid = document.getElementById("tipoAlfabetoGrid");
  if (tipoAlfabetoGrid) {
    tipoAlfabetoGrid.addEventListener("change", showAlphabetGrid);
  }

  // Random letter functionality
  const randomizeBtn = document.getElementById("randomize-btn");
  if (randomizeBtn) {
    randomizeBtn.addEventListener("click", showRandomLetter);
  }

  // Sound button
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

  // Practice buttons
  const startPracticeBtn = document.getElementById("start-practice");
  if (startPracticeBtn) {
    startPracticeBtn.addEventListener("click", startPractice);
  }

  const resetPracticeBtn = document.getElementById("reset-practice");
  if (resetPracticeBtn) {
    resetPracticeBtn.addEventListener("click", resetPractice);
  }

  // Inicializa com letra aleatória
  showRandomLetter();

  // Loga as vozes disponíveis para depuração
  window.speechSynthesis.onvoiceschanged = () => {
    console.log("Vozes disponíveis:", window.speechSynthesis.getVoices());
  };
});

// Funções globais para uso no HTML
window.showLetterDetails = showLetterDetails;
window.speakArabic = speakArabic;
window.checkAnswer = checkAnswer;
