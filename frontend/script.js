const map = L.map('map').setView([-17.8572, -41.5056], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

let todosOsPontos = [];
let marcadores = [];

function limparMarcadores() {
  marcadores.forEach(m => map.removeLayer(m));
  marcadores = [];
}

function renderizarPontos(filtrados) {
  limparMarcadores();
  filtrados.forEach(ponto => {
    const marker = L.marker([ponto.latitude, ponto.longitude]).addTo(map);
    marker.bindPopup(`
      <strong>${ponto.nome}</strong><br>
      Categoria: ${ponto.categoria.nome}<br>
      Responsável: ${ponto.responsavel.nome}<br>
      Endereço: ${ponto.endereco || 'Não informado'}
    `);
    marcadores.push(marker);
  });
}

async function carregarPontos() {
  try {
    const resposta = await fetch('http://localhost:3000/pontos');
    todosOsPontos = await resposta.json();
    preencherCategorias(todosOsPontos);
    renderizarPontos(todosOsPontos);
  } catch (erro) {
    console.error('Erro ao carregar pontos:', erro);
  }
}

function preencherCategorias(pontos) {
  const select = document.getElementById("filtro-categoria");
  const categorias = [...new Set(pontos.map(p => p.categoria.nome))];
  categorias.forEach(nome => {
    const option = document.createElement("option");
    option.value = nome;
    option.textContent = nome;
    select.appendChild(option);
  });
}

function aplicarFiltros() {
  const categoriaSelecionada = document.getElementById("filtro-categoria").value;
  const bairroBusca = document.getElementById("filtro-bairro").value.toLowerCase();
  const filtrados = todosOsPontos.filter(ponto => {
    const matchCategoria = !categoriaSelecionada || ponto.categoria.nome === categoriaSelecionada;
    const matchBairro = !bairroBusca || (ponto.bairro && ponto.bairro.toLowerCase().includes(bairroBusca));
    return matchCategoria && matchBairro;
  });
  renderizarPontos(filtrados);
}

document.getElementById("filtro-categoria").addEventListener("change", aplicarFiltros);
document.getElementById("filtro-bairro").addEventListener("input", aplicarFiltros);

document.getElementById("doacao-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const usuario = JSON.parse(sessionStorage.getItem("usuario"));
  const dados = {
    usuarioId: usuario.id,
    pontoId: Number(form.pontoId.value),
    categoriaId: Number(form.categoriaId.value),
    descricao: form.descricao.value
  };
  try {
    const resposta = await fetch("http://localhost:3000/doacoes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados)
    });
    const mensagem = document.getElementById("mensagem-doacao");
    if (resposta.ok) {
      mensagem.textContent = "Doação registrada com sucesso!";
      mensagem.style.color = "green";
      form.reset();
      fecharFormularios();
    } else {
      mensagem.textContent = "Erro ao registrar doação.";
      mensagem.style.color = "red";
    }
  } catch (erro) {
    console.error("Erro ao enviar:", erro);
  }
});

document.getElementById("ponto-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const usuario = JSON.parse(sessionStorage.getItem("usuario"));
  const dados = {
    nome: form.nome.value,
    descricao: form.descricao.value,
    endereco: form.endereco.value,
    bairro: form.bairro.value,
    cidade: form.cidade.value,
    estado: form.estado.value,
    latitude: Number(form.latitude.value),
    longitude: Number(form.longitude.value),
    horarioFunc: form.horarioFunc.value,
    categoriaId: Number(form.categoriaId.value),
    responsavelId: usuario.id
  };
  try {
    const resposta = await fetch("http://localhost:3000/pontos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados)
    });
    const msg = document.getElementById("mensagem-ponto");
    if (resposta.ok) {
      msg.textContent = "Ponto cadastrado com sucesso!";
      msg.style.color = "green";
      form.reset();
      fecharFormularios();
      carregarPontos();
    } else {
      msg.textContent = "Erro ao cadastrar ponto.";
      msg.style.color = "red";
    }
  } catch (erro) {
    console.error("Erro:", erro);
  }
});

async function carregarSelects() {
  await preencherSelect("pontos", "pontoId", "nome");
  await preencherSelect("categorias", "categoriaId", "nome");
  await preencherSelect("categorias", "categoriaIdPonto", "nome");
}

async function preencherSelect(endpoint, selectId, campoNome) {
  try {
    const res = await fetch(`http://localhost:3000/${endpoint}`);
    const dados = await res.json();
    const select = document.getElementById(selectId);
    dados.forEach(item => {
      const opt = document.createElement("option");
      opt.value = item.id;
      opt.textContent = item[campoNome];
      select.appendChild(opt);
    });
  } catch (err) {
    console.error(`Erro ao carregar ${endpoint}:`, err);
  }
}

document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("login-email").value;
  const senha = document.getElementById("login-senha").value;
  const msg = document.getElementById("mensagem-login");

  try {
    const res = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha })
    });

    if (res.ok) {
      const usuario = await res.json();
      console.log("🔐 Login bem-sucedido:", usuario);
      sessionStorage.setItem("usuario", JSON.stringify(usuario));
      msg.textContent = "Login realizado!";
      msg.style.color = "green";
      fecharFormularios();
      atualizarSessaoUI();
    } else {
      msg.textContent = "E-mail ou senha inválidos.";
      msg.style.color = "red";
    }
  } catch (err) {
    console.error(err);
    msg.textContent = "Erro na conexão.";
  }
});

document.getElementById("btn-cadastro").addEventListener("click", () => {
  document.getElementById("form-cadastro").style.display = "flex";
  document.getElementById("overlay").style.display = "block";
});

document.getElementById("fechar-cadastro").addEventListener("click", fecharFormularios);
document.getElementById("fechar-doacao").addEventListener("click", fecharFormularios);
document.getElementById("fechar-ponto").addEventListener("click", fecharFormularios); 

document.getElementById("cadastro-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = document.getElementById("cadastro-nome").value;
  const email = document.getElementById("cadastro-email").value;
  const senha = document.getElementById("cadastro-senha").value;
  const msg = document.getElementById("mensagem-cadastro");

  try {

    const res = await fetch("http://localhost:3000/cadastro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, email, senha })
    });

    if (res.ok) {
      msg.textContent = "Usuário cadastrado com sucesso!";
      msg.style.color = "green";
      e.target.reset();
      fecharFormularios();
    } else {
      const erro = await res.json();
      msg.textContent = erro.erro || "Erro ao cadastrar.";
      msg.style.color = "red";
    }
  } catch (err) {
    console.error(err);
    msg.textContent = "Erro ao conectar com o servidor.";
    msg.style.color = "red";
  }
});

document.getElementById("btn-login").addEventListener("click", () => {
  document.getElementById("form-login").style.display = "flex";
  document.getElementById("overlay").style.display = "block";
});

document.getElementById("btn-logout").addEventListener("click", () => {
  sessionStorage.clear();
  atualizarSessaoUI();
});

document.getElementById("fechar-login").addEventListener("click", fecharFormularios);

function fecharFormularios() {
  document.getElementById("form-doacao").style.display = "none";
  document.getElementById("form-ponto").style.display = "none";
  document.getElementById("form-login").style.display = "none";
  document.getElementById("form-cadastro").style.display = "none"
  document.getElementById("overlay").style.display = "none";
}

document.getElementById("btn-doacao").addEventListener("click", () => {
  document.getElementById("form-doacao").style.display = "flex";
  document.getElementById("form-ponto").style.display = "none";
  document.getElementById("overlay").style.display = "block";
});

document.getElementById("btn-ponto").addEventListener("click", () => {
  document.getElementById("form-ponto").style.display = "flex";
  document.getElementById("form-doacao").style.display = "none";
  document.getElementById("overlay").style.display = "block";
});

function atualizarSessaoUI() {
  const usuario = JSON.parse(sessionStorage.getItem("usuario"));
  const logado = !!usuario;

  const saudacao = document.getElementById("saudacao");
  const botoesAuth = document.getElementById("botoes-auth");
  const botoesLogin = document.getElementById("botoes-login");
  const acoesInferiores = document.getElementById("acoes-inferiores");

  if (logado) {
    saudacao.textContent = `Olá, ${usuario.nome}`;
    botoesAuth.style.display = "none";
    botoesLogin.style.display = "flex";
    acoesInferiores.style.display = "flex";
  } else {
    botoesAuth.style.display = "flex";
    botoesLogin.style.display = "none";
    acoesInferiores.style.display = "none";
  }
}

function inicializarMapaCadastro() {
  const mapaCadastro = L.map('mapa-cadastro').setView([-17.8572, -41.5056], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(mapaCadastro);

  let marcador = null;

  mapaCadastro.on('click', function (e) {
    const { lat, lng } = e.latlng;
    document.getElementById('latitude').value = lat.toFixed(6);
    document.getElementById('longitude').value = lng.toFixed(6);

    if (marcador) {
      marcador.setLatLng(e.latlng);
    } else {
      marcador = L.marker(e.latlng).addTo(mapaCadastro);
    }
  });
}

document.getElementById("btn-logout").addEventListener("click", () => {
  sessionStorage.clear();
  atualizarSessaoUI();
});

carregarPontos();
carregarSelects();
inicializarMapaCadastro();
atualizarSessaoUI();