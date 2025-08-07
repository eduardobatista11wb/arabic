const topicsData = {
  alphabet: {
    title: "Alfabeto",
    description:
      "Aprenda o alfabeto árabe, as formas das letras e como elas se conectam",
    link: "../../alphabet.html",
  },
  harakat: {
    title: "Vogais curtas (Harakāt)",
    description:
      "Estude os sinais diacríticos que representam vogais curtas (fatha, kasra, damma) usados no Alcorão",
    link: "alphabet.html",
  },
  tanwin: {
    title: "Tanwīn",
    description:
      "Aprenda os sons de terminação -an, -in, -un usados frequentemente na recitação",
    link: "alphabet.html",
  },
  sukun_shadda: {
    title: "Sukūn e Shadda",
    description:
      "Entenda como ler consoantes sem vogal (sukūn) e com ênfase (shadda)",
    link: "alphabet.html",
  },
  long_vowels: {
    title: "Vogais Longas",
    description:
      "Aprenda as vogais longas (alif, yā’, wāw) que mudam o som das letras",
    link: "alphabet.html",
  },
  madd: {
    title: "Regras de Madd",
    description:
      "Estude os alongamentos vocálicos específicos da recitação corânica",
    link: "alphabet.html",
  },
  tajweed_intro: {
    title: "Introdução ao Tajwīd",
    description: "Conheça as regras básicas de pronúncia correta do Alcorão",
    link: "alphabet.html",
  },
  makharij: {
    title: "Pontos de Articulação (Makharij)",
    description: "Aprenda como e onde cada letra é articulada corretamente",
    link: "alphabet.html",
  },
  qalqalah: {
    title: "Qalqalah",
    description:
      "Estude o som de eco de certas letras quando estão em sukun ou no final da recitação",
    link: "alphabet.html",
  },
  practice_reading: {
    title: "Prática de Leitura",
    description: "Exercite a leitura com palavras e versos simples do Alcorão",
    link: "alphabet.html",
  },
  short_suras: {
    title: "Memorização de Suras Curtas",
    description:
      "Comece a memorizar pequenas suras com leitura e pronúncia corretas",
    link: "alphabet.html",
  },
};

const topicsContainer = document.getElementById("topics");

Object.entries(topicsData).forEach(([key, topic], index) => {
  console.log(`Criando tópico: ${key}`, topic.link);
  const topicDiv = document.createElement("div");
  topicDiv.className = "card"; // Adiciona uma classe extra

  const title = document.createElement("p");
  const description = document.createElement("span");

  title.textContent = `Aula ${index + 1}: ${topic.title}`;
  description.textContent = topic.description;

  // Adiciona o link
  const link = document.createElement("a");
  link.className = "button";
  link.textContent = "Ver mais";
  link.href = topic.link; // Altere para o destino desejado

  topicDiv.appendChild(title);
  topicDiv.appendChild(description);
  topicDiv.appendChild(link); // Adiciona o link ao card
  topicsContainer.appendChild(topicDiv);
});
