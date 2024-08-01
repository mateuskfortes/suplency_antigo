const csrf_token = document.querySelector('#csrf_token').getAttribute('content');
const link_caderno = document.querySelector('#link_caderno').getAttribute('content')
const link_salvar_caderno = document.querySelector('#link_salvar_caderno').getAttribute('content')
const caderno = document.getElementById('caderno')
const espaco_select_materia = document.getElementById('select_materias')
const bt_nova_materia = document.getElementById('bt_nova_materia')
const show_numero_pg = document.getElementById('show-numero-pg')
const altura_maxima_pagina = 300
const nova_pg_padrao = '<p><br></p>'
const classe_select_materia = 'op_materia'
const nome_materia_padrao = 'Nova matéria '
const classe_materia_selecionada_padrao = 'materia_selecionada'
let save_alteracoes = {
  ultima_materia: null,
  materias: {}
}
let save_materias
let materia_atual
let materia_anterior
let pagina_atual
let quill

async function salvarCaderno() {
  mudarPagina(pagina_atual)
  await fetch(link_salvar_caderno, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrf_token
    },
    credentials: 'include',
    body: JSON.stringify(save_alteracoes)
  })
  .then(response => {
    if (!response.ok) throw new Error('Erro ao salvar: ', response.statusText)
    response.json().then(json => {
      console.log(json)
      console.log(save_alteracoes)
      save_alteracoes = {
        ultima_materia: null,
        materias: {}
      }
    })
  })
  .catch(error => {
    console.error('Erro: ', error.message)
  })
}

async function baixarCaderno() {
  try {
    const response = await fetch(link_caderno);
    if (!response.ok) {
      throw new Error(`Erro durante a requisição: ${response.statusText}`);
    }
    save_materias =  await response.json()
  } catch (error) {
    console.log('Erro:', error);
  }
}

function alterarNomeMateria(materiaId, novoNome) {
  if (!save_alteracoes.materias[materiaId]) {
    var materia = save_materias.materias[materiaId]
    save_alteracoes.materias[materiaId] = {
      nome: novoNome,
      ultima_pagina: materia.ultima_pagina,
      paginas: []
    };
  } else {
    save_alteracoes.materias[materiaId].nome = novoNome;
  }
}

function definirUltimaPagina(materiaId, n_pagina) {
  if (!save_alteracoes.materias[materiaId]) {
    var materia = save_materias.materias[materiaId]
    save_alteracoes.materias[materiaId] = {
      nome: materia.nome,
      ultima_pagina: n_pagina,
      paginas: []
    };
  } else {
    save_alteracoes.materias[materiaId].ultima_pagina = n_pagina;
  }
}

function alterarConteudoPagina(materiaId, pagina_id, novoConteudo, posicao=null) {
  if (!save_alteracoes.materias[materiaId]) {
    var materia = save_materias.materias[materiaId]
    save_alteracoes.materias[materiaId] = {
      nome: materia.nome,
      ultima_pagina: materia.ultima_pagina,
      paginas: []
    };
  }
  let paginas = save_alteracoes.materias[materiaId].paginas;
  let pagina = paginas.find(p => p.id == pagina_id);
  if (pagina) {
    pagina.conteudo = novoConteudo;
  } 
  else if (posicao != null) {
    paginas.push({
      id: pagina_id,
      posicao: posicao,
      conteudo: novoConteudo
    });
  }
  else {
    paginas.push({
      id: pagina_id,
      conteudo: novoConteudo
    });
  }
}

function adicionarMateria(materiaId, pagina_id, nome) {
  if (!save_alteracoes.materias[materiaId]) {
    save_alteracoes.materias[materiaId] = {
      nome: nome,
      ultima_pagina: 0,
      paginas: []
    };
    alterarConteudoPagina(materiaId, pagina_id, nova_pg_padrao, 0)
  }
}

function setIdAuto(json) {
  var contador = 0;
  var continuar = true
  while (continuar) {
    if (!json.hasOwnProperty(--contador)) return contador
  }
}

function iniciarMaterias() {
  var json = save_materias['materias']
  for (var id in json) {
    const novo_select_materia = document.createElement('div')
    novo_select_materia.id = id
    novo_select_materia.className = classe_select_materia
    novo_select_materia.innerText = json[id].nome
    espaco_select_materia.appendChild(novo_select_materia)
    novo_select_materia.addEventListener('click', ()=> mudarMateriaAtual(novo_select_materia.id))
    novo_select_materia.addEventListener('dblclick', () => mudarNome(novo_select_materia))
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
    save_materias['materias'][materia.id]['nome'] = nome_antigo
  }
  function setNomeNovo() {
    save_materias['materias'][materia.id]['nome'] = materia.innerText
  }
  function keyHandler(event) {
    if (event.key === 'Enter') {
      materia.removeEventListener('blur', blurHandler)
      materia.removeEventListener('keydown', keyHandler);
      if (materia.innerText == '') {
        setNomeAntigo()
      }
      else {
        setNomeNovo()
      }
      removerEditavel()
      mudarMateriaAtual(materia.id)
      alterarNomeMateria(materia.id,materia.innerText)
    }
  }
  function blurHandler() {
    setNomeAntigo()
    removerEditavel();
    materia.removeEventListener('blur', blurHandler);
    materia.removeEventListener('keydown', keyHandler)
    mudarMateriaAtual(materia.id)
  };


  let nome_antigo = materia.innerText
  materia.innerText = ''

  materia.addEventListener('blur', blurHandler);
  materia.addEventListener('keydown', keyHandler)

  deixarEditavel()
  materia.focus()
}

function criarSelectMateria() {
  const novo_select_materia = document.createElement('div')
  novo_select_materia.id = setIdAuto(save_materias['materias'])
  novo_select_materia.className = classe_select_materia
  novo_select_materia.innerText = nome_materia_padrao
  espaco_select_materia.appendChild(novo_select_materia)
  const id_pagina_1 = setIdPaginaAuto(save_materias['materias'][materia_atual]['paginas'])
  save_materias['materias'][novo_select_materia.id] = {
    'nome': novo_select_materia.innerText,
    'ultima_pagina': 0,
    'paginas': [
      {
        'id': id_pagina_1,
        'conteudo': nova_pg_padrao
      }
    ]
  }
  novo_select_materia.addEventListener('click', ()=> mudarMateriaAtual(novo_select_materia.id))
  novo_select_materia.addEventListener('dblclick', () => mudarNome(novo_select_materia))
  adicionarMateria(novo_select_materia.id, id_pagina_1, nome_materia_padrao)
  mudarNome(novo_select_materia)
}

function setIdPaginaAuto(json) {
  var contador = 0
  var continuar = true
  while (continuar) {
    contador--
    continuar = false
    for (let pg in json) {
      if (json[pg]['id'] == contador) continuar = true
    }
  }
  return contador
}

function novaPagina() {
  var n_nova_pagina = pagina_atual+1
  var id_nova_pagina = setIdPaginaAuto(save_materias['materias'][materia_atual]['paginas'])
  var nova_pagina = {
    'id': id_nova_pagina,
    'conteudo': nova_pg_padrao
  }
  save_materias['materias'][materia_atual]['paginas'].splice(n_nova_pagina, 0, nova_pagina)
  alterarConteudoPagina(materia_atual, id_nova_pagina, nova_pg_padrao, n_nova_pagina)
  mudarPagina(n_nova_pagina)
}

function mudarPagina(nova_pagina, mesma_materia=true) {
  n_pg = save_materias['materias'][materia_atual]['paginas'].length
  if (nova_pagina < n_pg && nova_pagina >= 0) {

    var conteudo = quill.root.innerHTML
    
    if (mesma_materia) {
      if (save_materias['materias'][materia_atual]['paginas'][pagina_atual]['conteudo'] != conteudo) {
        save_materias['materias'][materia_atual]['paginas'][pagina_atual]['conteudo'] = conteudo
        let id_pagina_atual = save_materias['materias'][materia_atual]['paginas'][pagina_atual].id
        alterarConteudoPagina(materia_atual, id_pagina_atual, conteudo)
      }
      else save_materias['materias'][materia_atual]['paginas'][pagina_atual]['conteudo'] = conteudo
    }
    else {
      if (save_materias['materias'][materia_anterior]['paginas'][pagina_atual]['conteudo'] != conteudo) {
        save_materias['materias'][materia_anterior]['paginas'][pagina_atual]['conteudo'] = conteudo
        let id_pagina_atual = save_materias['materias'][materia_anterior]['paginas'][pagina_atual].id
        alterarConteudoPagina(materia_anterior, id_pagina_atual, conteudo)
      }
      else save_materias['materias'][materia_anterior]['paginas'][pagina_atual]['conteudo'] = conteudo
    }

    pagina_atual = nova_pagina
    save_materias['materias'][materia_atual]['ultima_pagina'] = pagina_atual
    if(save_alteracoes['materias'].hasOwnProperty(materia_atual)) save_alteracoes['materias'][materia_atual]['ultima_pagina'] = pagina_atual
    quill.root.innerHTML = save_materias['materias'][materia_atual]['paginas'][pagina_atual]['conteudo']
    show_numero_pg.innerText = pagina_atual+1
  }
}

function mudarMateriaAtual(nova_materia_atual) {
  if (save_materias['materias'].hasOwnProperty(nova_materia_atual)) {
    definirUltimaPagina(materia_atual, pagina_atual)
    materia_anterior = materia_atual
    materia_atual = nova_materia_atual
    save_materias['ultima_materia'] = materia_atual
    save_alteracoes['ultima_materia'] = materia_atual
    espaco_select_materia.querySelectorAll('.'+classe_select_materia).forEach(conteiner=>conteiner.classList.remove(classe_materia_selecionada_padrao))
    document.getElementById(nova_materia_atual).classList.add(classe_materia_selecionada_padrao)
    mudarPagina(save_materias['materias'][materia_atual]['ultima_pagina'], false)
  }
}

function initQuill() {
  const Size = Quill.import('attributors/style/size');
  Size.whitelist = ['8pt', '9pt', '10pt', '11pt', '12pt', '14pt', '18pt', '24pt', '36pt', '48pt', '72pt'];
  Quill.register(Size, true);

  const Font = Quill.import('attributors/style/font');
  Font.whitelist = ['arial', 'courier', 'georgia', 'roboto', 'times', 'trebuchet', 'verdana'];
  Quill.register(Font, true);
  const options = {
    modules: {
      toolbar: '#toolbar',
      toolbar:
      [
        [{ 'font': Font.whitelist }],
        [{ 'size': Size.whitelist }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'script': 'sub' }, { 'script': 'super' }],
        ['blockquote'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'indent': '-1' }, { 'indent': '+1' }],
        [{ 'align': [] }],
        ['link', 'clean']
      ]
    },
    placeholder: 'O que você está pensando?',
    theme: 'snow'
  };
  quill = new Quill(caderno, options)
  quill.on('text-change', ()=> {
    var altura_conteudo = caderno.querySelector('.ql-editor').scrollHeight
    if (altura_conteudo > altura_maxima_pagina) {
      quill.history.undo()
      alert("Você atingiu o tamanho máximo permitido do editor.");
    }
  });

}

async function init() {
  initQuill()
  await baixarCaderno()
  iniciarMaterias()
  materia_atual = save_materias['ultima_materia']
  pagina_atual = save_materias['materias'][materia_atual]['ultima_pagina']
  quill.root.innerHTML = save_materias.materias[materia_atual].paginas[pagina_atual].conteudo
  mudarMateriaAtual(save_materias['ultima_materia'], true)
  bt_nova_materia.addEventListener('click', criarSelectMateria)
  document.getElementById('new-page').addEventListener('click', () => novaPagina())
  document.getElementById('prev-page').addEventListener('click', () => mudarPagina(pagina_atual-1))
  document.getElementById('next-page').addEventListener('click', () => mudarPagina(pagina_atual+1))
  document.getElementById('save').addEventListener('click', salvarCaderno)
}

init()
