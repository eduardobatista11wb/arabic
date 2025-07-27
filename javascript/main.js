console.log("Javascript carregado com sucesso!");

// Função para carregar o alfabeto e exibir uma letra aleatória
async function loadAlphabetAndRandomize() {
  try {
    const response = await fetch("../data/alphabet.json");
    const alphabetData = await response.json();
    // Converte o objeto em um array de letras com nome e formas
    const alphabet = Object.entries(alphabetData).map(([name, data]) => ({
      name,
      isolated: data.isolated,
      letters: data.letter, // agora é um array de objetos com form, fatha, kasra, damma, sukun
    }));
    window._alphabet = alphabet;
    showRandomLetter();
  } catch (e) {
    document.getElementById("alphabet-container").textContent =
      "Erro ao carregar alfabeto.";
  }
}

function speakArabic(text) {
  if (window.responsiveVoice) {
    window.responsiveVoice.speak(text, "Arabic Male");
  } else {
    console.warn("ResponsiveVoice não carregado.");
  }
}

function showRandomLetter() {
  if (!window._alphabet) return;
  const idx = Math.floor(Math.random() * window._alphabet.length);
  const letter = window._alphabet[idx];
  // Sorteia qual forma mostrar: 0=isolated, 1=initial, 2=medial, 3=final
  const formIdx = Math.floor(Math.random() * letter.letters.length);
  const formObj = letter.letters[formIdx];
  // Sorteia o diacrítico
  const diacritics = ["fatha", "kasra", "damma", "sukun"];
  const diacriticIdx = Math.floor(Math.random() * diacritics.length);
  const diacriticKey = diacritics[diacriticIdx];
  const diacriticLabelMap = {
    fatha: "Fatha ( َ )",
    kasra: "Kasra ( ِ )",
    damma: "Damma ( ُ )",
    sukun: "Sukun ( ْ )",
  };
  const formLabels = ["Isolada", "Inicial", "Medial", "Final"];
  document.getElementById("alphabet-container").innerHTML = `
    <div class="flex-col flex-center">
        <span class="alphabet-large" title="${letter.name}">
            ${formObj[diacriticKey]}
        </span>
        <small class="alphabet-small text-light p-2 blurred-text" id="letter-name">
            ${letter.name}
        </small>
        <div class="flex-row flex-center" style="margin-top:8px;">
            <div class="flex-col flex-center p-2"><span class="alphabet-medium">${letter.letters[1].fatha}</span><small class="text-xs">Inicial</small></div>
            <div class="flex-col flex-center p-2"><span class="alphabet-medium">${letter.letters[2].fatha}</span><small class="text-xs">Medial</small></div>
            <div class="flex-col flex-center p-2"><span class="alphabet-medium">${letter.letters[3].fatha}</span><small class="text-xs">Final</small></div>
        </div>
        <div class="flex-row flex-center p-2"><small class="text-xs">Forma: ${formLabels[formIdx]} | Diacrítico: ${diacriticLabelMap[diacriticKey]}</small></div>
    </div>
  `;
  //   speakArabic(formObj[diacriticKey]); // Fala a forma sorteada
  setTimeout(() => {
    const nameEl = document.getElementById("letter-name");
    if (nameEl) {
      nameEl.onclick = () => {
        nameEl.classList.remove("blurred-text");
      };
    }
  }, 0);
}

document.addEventListener("DOMContentLoaded", () => {
  loadAlphabetAndRandomize();
  document
    .getElementById("randomize-btn")
    .addEventListener("click", showRandomLetter);
  document.getElementById("sound-btn").addEventListener("click", () => {
    // Pega a letra atualmente exibida
    const container = document.getElementById("alphabet-container");
    const span = container.querySelector(".alphabet-large");
    if (span) {
      speakArabic(span.textContent.trim());
    }
  });
  // Loga as vozes disponíveis para depuração
  window.speechSynthesis.onvoiceschanged = () => {
    console.log("Vozes disponíveis:", window.speechSynthesis.getVoices());
  };
});
