const cartas = [
  { id: 1, nome: "Lula", foto: "./assets/cartas/Lula.png" },
  { id: 2, nome: "Renan Santos", foto: "./assets/cartas/Renan.png" },
  { id: 3, nome: "Flávio Bolsonaro", foto: "./assets/cartas/Flavio.png" }
];

const temas = [
  { nome: "Fim das facções", video: "./assets/faccoes.mp4", cartaId: 2 },
  { nome: "Socialismo", video: "./assets/socialismo.mp4", cartaId: 1 },
  { nome: "Desfavelização", video: "./assets/desfavelizacao.mp4", cartaId: 2 },
  { nome: "Liberalismo econômico", video: "./assets/economia.mp4", cartaId: 2 },
  { nome: "Agenda LGBTQIA+", video: "./assets/lgbt.mp4", cartaId: 1 },
  { nome: "Educação básica forte", video: "./assets/educacao.mp4", cartaId: 2 },
  { nome: "Menos STF", video: "./assets/stf.mp4", cartaId: 2 },
  { nome: "Centrão forte", video: "./assets/centrao.mp4", cartaId: 3 },
  { nome: "Industrializar o nordeste", video: "./assets/nordeste.mp4", cartaId: 2 },
  { nome: "Combate a corrupção", video: "./assets/corrupcao.mp4", cartaId: 2 }
];

const pontosCartas = [0, 0, 0];
const escolhas = [];
let jogoFinalizado = false;

const temasEsquerdaEl = document.getElementById("temas-esquerda");
const temasDireitaEl = document.getElementById("temas-direita");
const contadorEl = document.getElementById("contador");
const resultadoEl = document.getElementById("resultado");
const reiniciarEl = document.getElementById("reiniciar");
const modalEl = document.getElementById("video-modal");
const modalMediaEl = document.getElementById("modal-media");
const fecharModalEl = document.getElementById("fechar-modal");

function atualizarCartas() {
  for (let i = 0; i < 3; i += 1) {
    const span = document.querySelector(`#carta-${i + 1} span`);
    span.textContent = String(pontosCartas[i]);
  }
}

function renderizarFotosCartas() {
  cartas.forEach((carta, index) => {
    const fotoEl = document.querySelector(`#carta-${index + 1} .foto`);

    if (!fotoEl) {
      return;
    }

    fotoEl.innerHTML = `<img src="${carta.foto}" alt="${carta.nome}" class="foto-img" hidden />`;
  });
}

function ocultarFotosCartas() {
  const cartasCentroEl = document.getElementById("cartas");
  cartasCentroEl.classList.remove("resultado-ativo");

  cartas.forEach((_, index) => {
    const cartaEl = document.getElementById(`carta-${index + 1}`);
    const fotoEl = document.querySelector(`#carta-${index + 1} .foto`);
    const imgEl = fotoEl ? fotoEl.querySelector(".foto-img") : null;

    if (!cartaEl || !fotoEl || !imgEl) {
      return;
    }

    cartaEl.classList.remove("vencedora");
    cartaEl.classList.remove("nao-vencedora");
    imgEl.hidden = true;
    fotoEl.setAttribute("data-hidden", "true");
    fotoEl.textContent = "❓";
    fotoEl.appendChild(imgEl);
  });
}

function revelarResultadoCartas(indiceVencedor) {
  const cartasCentroEl = document.getElementById("cartas");
  ocultarFotosCartas();
  cartasCentroEl.classList.add("resultado-ativo");

  cartas.forEach((_, index) => {
    const cartaEl = document.getElementById(`carta-${index + 1}`);
    const fotoEl = document.querySelector(`#carta-${index + 1} .foto`);
    const imgEl = fotoEl ? fotoEl.querySelector(".foto-img") : null;

    if (!cartaEl || !fotoEl || !imgEl) {
      return;
    }

    fotoEl.removeAttribute("data-hidden");
    fotoEl.textContent = "";
    imgEl.hidden = false;
    fotoEl.appendChild(imgEl);

    if (index === indiceVencedor) {
      cartaEl.classList.add("vencedora");
      cartaEl.classList.remove("nao-vencedora");
      return;
    }

    cartaEl.classList.remove("vencedora");
    cartaEl.classList.add("nao-vencedora");
  });
}

function construirVideoEmbed(url) {
  if (url.includes("youtube.com/watch?v=")) {
    const videoId = new URL(url).searchParams.get("v");
    return `https://www.youtube.com/embed/${videoId}`;
  }

  if (url.includes("youtu.be/")) {
    const videoId = url.split("youtu.be/")[1].split("?")[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }

  return url;
}

function abrirModalVideo(url) {
  modalMediaEl.innerHTML = "";

  const isLocalVideo = url.endsWith(".mp4") || url.endsWith(".webm") || url.endsWith(".ogg");

  if (isLocalVideo) {
    modalMediaEl.innerHTML = `<video controls autoplay src="${url}"></video>`;
  } else {
    const embedUrl = construirVideoEmbed(url);
    modalMediaEl.innerHTML = `<iframe src="${embedUrl}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
  }

  modalEl.hidden = false;
}

function fecharModalVideo() {
  modalEl.hidden = true;
  modalMediaEl.innerHTML = "";
}

function criarCardTema(tema) {
  const card = document.createElement("div");
  card.className = "tema-card";
  card.dataset.tema = tema.nome;

  const btnTema = document.createElement("button");
  btnTema.className = "btn-tema";
  btnTema.textContent = tema.nome;

  const btnVideo = document.createElement("button");
  btnVideo.className = "btn-video";
  btnVideo.textContent = "Assistir vídeo";
  btnVideo.type = "button";
  btnVideo.hidden = true;
  btnVideo.addEventListener("click", () => abrirModalVideo(tema.video));

  btnTema.addEventListener("click", () => escolherTema(tema, btnTema));

  card.appendChild(btnTema);
  card.appendChild(btnVideo);
  return card;
}

function criarTemas() {
  temasEsquerdaEl.innerHTML = "";
  temasDireitaEl.innerHTML = "";

  temas.forEach((tema, index) => {
    const card = criarCardTema(tema);

    if (index < 5) {
      temasEsquerdaEl.appendChild(card);
      return;
    }

    temasDireitaEl.appendChild(card);
  });
}

function finalizarJogo() {
  jogoFinalizado = true;

  const maiorPontuacao = Math.max(...pontosCartas);
  const indicesVencedores = pontosCartas
    .map((p, i) => ({ p, i }))
    .filter((item) => item.p === maiorPontuacao)
    .map((item) => item.i + 1);

  const indiceVencedor = indicesVencedores[0] - 1;
  const nomeVencedor = cartas[indiceVencedor].nome;
  revelarResultadoCartas(indiceVencedor);

  const mensagem =
    indicesVencedores.length === 1
      ? `Pré-Candidato: ${nomeVencedor} com ${maiorPontuacao} ponto(s)!`
      : `Empate com ${maiorPontuacao} ponto(s). Pré-Candidato exibido: ${nomeVencedor}.`;

  resultadoEl.innerHTML = `<strong>${mensagem}</strong><br>Temas escolhidos: ${escolhas.join(", ")}.`;

  document.querySelectorAll(".btn-tema").forEach((btn) => {
    btn.disabled = true;
  });

  document.querySelectorAll(".tema-card").forEach((card) => {
    const btnVideo = card.querySelector(".btn-video");
    const nomeTema = card.dataset.tema;

    if (!btnVideo) {
      return;
    }

    btnVideo.hidden = !escolhas.includes(nomeTema);
  });

  reiniciarEl.hidden = false;
}

function escolherTema(tema, botao) {
  if (jogoFinalizado || escolhas.length >= 3) {
    return;
  }

  escolhas.push(tema.nome);
  botao.disabled = true;

  const indiceCarta = tema.cartaId - 1;
  pontosCartas[indiceCarta] += 1;

  contadorEl.textContent = String(escolhas.length);
  atualizarCartas();

  if (escolhas.length === 3) {
    finalizarJogo();
  }
}

function reiniciarJogo() {
  pontosCartas[0] = 0;
  pontosCartas[1] = 0;
  pontosCartas[2] = 0;
  escolhas.length = 0;
  jogoFinalizado = false;

  contadorEl.textContent = "0";
  resultadoEl.textContent = "";
  reiniciarEl.hidden = true;

  fecharModalVideo();
  ocultarFotosCartas();
  atualizarCartas();
  criarTemas();
}

fecharModalEl.addEventListener("click", fecharModalVideo);
modalEl.addEventListener("click", (event) => {
  if (event.target instanceof HTMLElement && event.target.dataset.closeModal === "true") {
    fecharModalVideo();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !modalEl.hidden) {
    fecharModalVideo();
  }
});

reiniciarEl.addEventListener("click", reiniciarJogo);
criarTemas();
renderizarFotosCartas();
ocultarFotosCartas();
atualizarCartas();
resultadoEl.textContent = "Escolha 3 temas para revelar seu pré-candidato ideal.";
