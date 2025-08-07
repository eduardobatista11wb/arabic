// Letras isoladas do árabe (ordem tradicional)
const arabicLetters = [
  "ا",
  "ب",
  "ت",
  "ث",
  "ج",
  "ح",
  "خ",
  "د",
  "ذ",
  "ر",
  "ز",
  "س",
  "ش",
  "ص",
  "ض",
  "ط",
  "ظ",
  "ع",
  "غ",
  "ف",
  "ق",
  "ك",
  "ل",
  "م",
  "ن",
  "ه",
  "و",
  "ي",
];
// Distribuição em linhas (como teclado)
const keyboardRows = [
  ["ض", "ص", "ث", "ق", "ف", "غ", "ع", "ه", "خ", "ح", "ج", "د"],
  ["ش", "س", "ي", "ب", "ل", "ا", "ت", "ن", "م", "ك", "ط"],
  ["ئ", "ء", "ؤ", "ر", "لا", "ى", "ة", "و", "ز", "ظ"],
];
// Sinais diacríticos árabes
const diacriticsRow = [
  { symbol: "\u064E", name: "Fatha" }, // َ
  { symbol: "\u064F", name: "Damma" }, // ُ
  { symbol: "\u0650", name: "Kasra" }, // ِ
  { symbol: "\u0652", name: "Sukun" }, // ْ
  { symbol: "\u0651", name: "Shadda" }, // ّ
  { symbol: "\u064B", name: "Tanwin Fath" }, // ً
  { symbol: "\u064C", name: "Tanwin Damm" }, // ٌ
  { symbol: "\u064D", name: "Tanwin Kasr" }, // ٍ
  { symbol: "\u0621", name: "Hamza" }, // ء
  { symbol: "\u0623", name: "Alif Hamza" }, // أ
  { symbol: "\u0625", name: "Alif Hamza Below" }, // إ
  { symbol: "\u0624", name: "Waw Hamza" }, // ؤ
  { symbol: "\u0626", name: "Ya Hamza" }, // ئ
];
// Se quiser só as letras do alfabeto.json, use arabicLetters
function createKeyboard() {
  const keyboard = document.getElementById("arabicKeyboard");
  keyboard.innerHTML = "";
  // Linha de diacríticos
  const diacriticsDiv = document.createElement("div");
  diacriticsDiv.className = "keyboard-row";
  diacriticsRow.forEach((diacritic) => {
    const btn = document.createElement("button");
    btn.className = "key-btn diacritic";
    btn.type = "button";
    btn.textContent = diacritic.symbol;
    btn.title = diacritic.name;
    btn.onclick = () => insertArabicLetter(diacritic.symbol);
    diacriticsDiv.appendChild(btn);
  });
  keyboard.appendChild(diacriticsDiv);
  // Linhas de letras
  keyboardRows.forEach((row, idx) => {
    const rowDiv = document.createElement("div");
    rowDiv.className = "keyboard-row";
    row.forEach((letter) => {
      const btn = document.createElement("button");
      btn.className = "key-btn";
      btn.type = "button";
      btn.textContent = letter;
      btn.onclick = () => insertArabicLetter(letter);
      rowDiv.appendChild(btn);
    });
    // Adiciona o botão de espaço na última linha
    if (idx === keyboardRows.length - 1) {
      const spaceBtn = document.createElement("button");
      spaceBtn.className = "key-btn";
      spaceBtn.type = "button";
      spaceBtn.style.minWidth = "80px";
      spaceBtn.textContent = "⎵ Espaço";
      spaceBtn.onclick = () => insertArabicLetter(" ");
      rowDiv.appendChild(spaceBtn);
    }
    keyboard.appendChild(rowDiv);
  });
}
function insertArabicLetter(letter) {
  const textarea = document.getElementById("arabicInput");
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const text = textarea.value;
  textarea.value = text.slice(0, start) + letter + text.slice(end);
  textarea.focus();
  textarea.selectionStart = textarea.selectionEnd = start + letter.length;
}
function clearArabicInput() {
  document.getElementById("arabicInput").value = "";
}
function copyArabicInput() {
  const textarea = document.getElementById("arabicInput");
  textarea.select();
  document.execCommand("copy");
}
// Inicializa teclado ao carregar
createKeyboard();
