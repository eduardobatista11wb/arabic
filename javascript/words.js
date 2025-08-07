console.log("Javascript carregado com sucesso!");

// Variáveis globais
let alphabetData = [];
let wordsData = [];
let currentWord = null;

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
    return [];
  }
}

// Função para falar em árabe
function speakArabic(text) {
  if (window.responsiveVoice) {
    window.responsiveVoice.speak(text, "Arabic Male", { rate: 0.8 });
  }
}

// Função para mostrar alfabeto completo
function showAlphabetGrid() {
  const grid = document.getElementById("alphabet-grid");
  if (!grid || !alphabetData.length) return;
  const tipo = document.getElementById("tipoAlfabetoGrid")?.value || "alfabeto";
  grid.innerHTML = alphabetData
    .map((letter) => {
      const forms = letter.letters;
      let formas = ["", "", "", ""];
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
          break;
        case "alfabeto_kasra":
          formas = [
            forms[0].kasra,
            forms[1].kasra,
            forms[2].kasra,
            forms[3].kasra,
          ];
          break;
        case "alfabeto_damma":
          formas = [
            forms[0].damma,
            forms[1].damma,
            forms[2].damma,
            forms[3].damma,
          ];
          break;
        case "alfabeto_sukun":
          formas = [
            forms[0].sukun,
            forms[1].sukun,
            forms[2].sukun,
            forms[3].sukun,
          ];
          break;
        case "alfabeto_todas": {
          const vogais = ["fatha", "kasra", "damma", "sukun"];
          const idxVogal = Math.floor(Math.random() * vogais.length);
          const vogal = vogais[idxVogal];
          formas = [
            forms[0][vogal],
            forms[1][vogal],
            forms[2][vogal],
            forms[3][vogal],
          ];
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

// Função para mostrar palavra aleatória
function showRandomWord() {
  if (!wordsData.length) return;
  const randomWord = wordsData[Math.floor(Math.random() * wordsData.length)];
  currentWord = randomWord;
  const wordDisplay = document.getElementById("word-display");
  wordDisplay.innerHTML = `
    <div class="word-arabic">${randomWord.arabic}</div>
    <div class="word-transliteration">${randomWord.transliteration}</div>
    <div class="word-portuguese">${randomWord.portuguese}</div>
    <div class="word-category">${randomWord.category}</div>
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

// Função para popular seletor de categorias
function populateCategorySelector() {
  const categorySelect = document.getElementById("category-select");
  if (!categorySelect || !wordsData.length) return;
  const categories = [...new Set(wordsData.map((word) => word.category))];
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    categorySelect.appendChild(option);
  });
}

// Event listeners
document.addEventListener("DOMContentLoaded", async () => {
  await loadAlphabet();
  await loadWords();
  showRandomWord();
  populateCategorySelector();
  showWordsByCategory();
  const tipoAlfabetoGrid = document.getElementById("tipoAlfabetoGrid");
  if (tipoAlfabetoGrid) {
    tipoAlfabetoGrid.addEventListener("change", showAlphabetGrid);
  }
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
  const randomWordBtn = document.getElementById("random-word-btn");
  if (randomWordBtn) {
    randomWordBtn.addEventListener("click", showRandomWord);
  }
  document.getElementById("word-sound-btn").addEventListener("click", () => {
    const wordDisplay = document.getElementById("word-display");
    const arabic = wordDisplay
      ?.querySelector(".word-arabic")
      ?.textContent?.trim();
    if (arabic) speakArabic(arabic);
  });
  document.getElementById("category-select").addEventListener("change", (e) => {
    showWordsByCategory(e.target.value);
  });
  showWordsByCategory();
});

// Funções globais para uso no HTML
window.showLetterDetails = showLetterDetails;
window.speakArabic = speakArabic;
//
