const caderno = document.getElementById('caderno')
const conteiner_select_materia = document.getElementById('select_materias')
const classe_nome_materia = 'nome_materia'
const classe_materia_selecionada = 'materia_selecionada'
const bt_nova_materia = document.getElementById('bt_nova_materia')
const show_numero_pg = document.getElementById('show-numero-pg')
const altura_maxima_pagina = 300
const quantidade_max_caracteres = 10000
const nova_pg_padrao = '<p></p>'
const nome_materia_padrao = 'Nova matéria '
let save_ultima_materia = 'Nova matéria 2'
let save_materias = {
  'Nova matéria 1': [0, ['<p>oiii</p>']],
  'Nova matéria 2': [1, ['<p>ola</p>', '<p>tchauuuuu</p>']],
  'Nova matéria 3': [0, ['<p>ola</p>', '<p>nauummm</p>']]
}
let materia_atual = save_ultima_materia
let pagina_atual = save_materias[materia_atual][0]

function setNomeMateriaAuto() {
  contador_materia = 0;
  var continuar = true
  while (continuar) {
    if (!save_materias.hasOwnProperty(nome_materia_padrao + ++contador_materia)) return nome_materia_padrao + contador_materia
  }
}

function mudarNome(materia) {
  function deixarEditavel() {
    materia.setAttribute('contenteditable', 'true')
  }
  function removerEditavel() {
    materia.setAttribute('contenteditable', 'false')
  }
  function setNomeAntigo() {
    materia.innerText = nome_antigo
    save_materias[nome_antigo] = conteudo_materia
  }
  function setNomeNovo() {
    materia.id = materia.innerText
    save_materias[materia.innerText] = conteudo_materia
    materia_atual = materia.innerText
  }
  function keyHandler(event) {
    if (event.key === 'Enter') {
      materia.removeEventListener('blur', blurHandler)
      materia.removeEventListener('keydown', keyHandler);
      if (save_materias.hasOwnProperty(materia.innerText) || materia.innerText == '') {
        setNomeAntigo()
      }
      else {
        setNomeNovo()
      }
      removerEditavel()
      mudarMateriaAtual(materia.innerText)
    }
  }
  function blurHandler() {
    setNomeAntigo()
    removerEditavel();
    materia.removeEventListener('blur', blurHandler);
    materia.removeEventListener('keydown', keyHandler)
    mudarMateriaAtual(materia.innerText)
  };


  let nome_antigo = materia.innerText
  var conteudo_materia = save_materias[nome_antigo]
  delete save_materias[nome_antigo]
  materia.innerText = ''

  materia.addEventListener('blur', blurHandler);
  materia.addEventListener('keydown', keyHandler)

  deixarEditavel()
  materia.focus()
}

function criarSelectMaterias(key) {
  const novo_select_materia = document.createElement('div')
  novo_select_materia.className = classe_nome_materia
  novo_select_materia.addEventListener('dblclick', () => mudarNome(novo_select_materia))
  conteiner_select_materia.appendChild(novo_select_materia)
  var nome
  if (key) {
    novo_select_materia.textContent = key
  }
  else {
    novo_select_materia.textContent = setNomeMateriaAuto()
    save_materias[novo_select_materia.textContent] = [0, [nova_pg_padrao]]
    mudarNome(novo_select_materia)
  }
  novo_select_materia.id = novo_select_materia.textContent
  novo_select_materia.addEventListener('click', ()=>mudarMateriaAtual(novo_select_materia.textContent))
}

function novaPagina() {
  var n_nova_pagina = pagina_atual+1
  save_materias[materia_atual][1].splice(n_nova_pagina, 0, nova_pg_padrao)
  mudarPagina(n_nova_pagina)
}

function mudarPagina(nova_pagina, mesma_materia=true) {
  n_pg = save_materias[materia_atual][1].length
  if (nova_pagina < n_pg && nova_pagina >= 0) {
    if (mesma_materia) save_materias[materia_atual][1][pagina_atual] = quill.root.innerHTML
    pagina_atual = nova_pagina
    quill.root.innerHTML = save_materias[materia_atual][1][pagina_atual]
    save_materias[materia_atual][0] = pagina_atual
    show_numero_pg.innerText = pagina_atual+1
  }
}

function mudarMateriaAtual(nova_materia_atual, load=false) {
  if (save_materias.hasOwnProperty(nova_materia_atual)) {
    if (!load) save_materias[materia_atual][1][pagina_atual] = quill.root.innerHTML
    materia_atual = nova_materia_atual
    save_ultima_materia = materia_atual
    conteiner_select_materia.querySelectorAll('.'+classe_nome_materia).forEach(conteiner=>conteiner.classList.remove(classe_materia_selecionada))
    document.getElementById(nova_materia_atual).classList.add(classe_materia_selecionada)
    mudarPagina(save_materias[materia_atual][0], false)
  }
}

document.getElementById('new-page').addEventListener('click', () => novaPagina());

document.getElementById('prev-page').addEventListener('click', () => mudarPagina(pagina_atual-1));

document.getElementById('next-page').addEventListener('click', () => mudarPagina(pagina_atual+1));

const options = {
  modules: {
    toolbar: '#toolbar',
  },
  placeholder: 'O que você está pensando?',
  theme: 'snow'
};
const quill = new Quill(caderno, options)
quill.on('text-change', ()=> {
  var altura_conteudo = caderno.querySelector('.ql-editor').scrollHeight
  
  if (altura_conteudo > altura_maxima_pagina) {
    quill.history.undo()
    alert("Você atingiu o tamanho máximo permitido do editor.");
  }
  var texto = quill.root.innerHTML
  if (texto.length > quantidade_max_caracteres) {
    quill.history.undo()
    alert("Você atingiu o limite máximo de " + quantidade_max_caracteres + " caracteres.");
  }
});
for (var key in save_materias) {
  criarSelectMaterias(key)
}
mudarMateriaAtual(materia_atual, true)
bt_nova_materia.addEventListener('click', () => criarSelectMaterias())