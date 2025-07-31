// Função para buscar lista de suras
async function fetchSurasList() {
  const url = "https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/info.json";
  const res = await fetch(url);
  const data = await res.json();
  return data.chapters;
}

// Função para buscar o número de versículos de uma sura
function getAyasCount(suras, suraNumber) {
  const sura = suras.find((s) => s.id == suraNumber);
  return sura ? sura.verses : 0;
}

// Função para buscar e exibir um versículo
async function fetchAndDisplayAya(suraNumber, ayaNumber) {
  const container = document.getElementById("quran-container");
  const arabicUrl = `https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/ara-quranuthmani/${suraNumber}/${ayaNumber}.json`;
  const portugueseUrl = `https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/por-elhayek/${suraNumber}/${ayaNumber}.json`;
  try {
    const [arabicRes, portugueseRes] = await Promise.all([
      fetch(arabicUrl),
      fetch(portugueseUrl),
    ]);
    const arabicData = await arabicRes.json();
    const portugueseData = await portugueseRes.json();
    if (!arabicData.verse || !portugueseData.verse) {
      container.innerHTML = "<p>Erro ao carregar dados do Alcorão da API.</p>";
      return;
    }
    const suraName = arabicData.verse.chapter;
    const ayaNum = arabicData.verse.verse;
    const arabicText = arabicData.verse.text;
    const portugueseText = portugueseData.verse.text;
    let html = `<h2>${suraNumber}. ${suraName} - Versículo ${ayaNum}</h2>`;
    html += `<table style='width:100%;border-collapse:collapse;'>`;
    html += `<tr><th style='text-align:right'>Árabe</th><th style='text-align:left'>Português</th></tr>`;
    html += `<tr>`;
    html += `<td style='font-size:1.5em;text-align:right;padding:8px;border-bottom:1px solid #eee;'>${arabicText}</td>`;
    html += `<td style='padding:8px;border-bottom:1px solid #eee;'>${portugueseText}</td>`;
    html += `</tr>`;
    html += `</table>`;
    container.innerHTML = html;
  } catch (e) {
    container.innerHTML = "<p>Erro ao carregar o Alcorão da API.</p>";
  }
}

// Inicialização

document.addEventListener("DOMContentLoaded", async () => {
  const suraSelect = document.getElementById("sura-select");
  const ayaSelect = document.getElementById("aya-select");
  const container = document.getElementById("quran-container");
  // Preencher select de suras
  try {
    const suras = await fetchSurasList();
    suras.forEach((sura) => {
      const option = document.createElement("option");
      option.value = sura.id;
      option.textContent = `${sura.id}. ${sura.name}`;
      suraSelect.appendChild(option);
    });
    // Função para atualizar o select de ayas
    function updateAyaSelect() {
      ayaSelect.innerHTML = "";
      const count = getAyasCount(suras, suraSelect.value);
      for (let i = 1; i <= count; i++) {
        const option = document.createElement("option");
        option.value = i;
        option.textContent = i;
        ayaSelect.appendChild(option);
      }
    }
    // Inicializa selects e exibe primeiro versículo
    updateAyaSelect();
    fetchAndDisplayAya(suraSelect.value, ayaSelect.value);
    // Atualiza ayas ao mudar sura
    suraSelect.addEventListener("change", () => {
      updateAyaSelect();
      fetchAndDisplayAya(suraSelect.value, ayaSelect.value);
    });
    // Atualiza exibição ao mudar aya
    ayaSelect.addEventListener("change", () => {
      fetchAndDisplayAya(suraSelect.value, ayaSelect.value);
    });
  } catch (e) {
    container.innerHTML = "<p>Erro ao carregar a lista de suras.</p>";
  }
});
