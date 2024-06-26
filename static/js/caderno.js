const input_opcoes = document.querySelectorAll(".opcao-texto");
const input_opcoes_avancado = document.querySelectorAll(".opcao-texto-avancado");

const input_fontName = document.getElementById("fontName");
const input_fontSize = document.getElementById("fontSize");
const caderno = document.getElementById("caderno");

const input_de_alinhamento = document.querySelectorAll(".alinhamento");
const input_de_espacamento = document.querySelectorAll(".spacing");
const input_de_formatacao = document.querySelectorAll(".format");
const input_de_script = document.querySelectorAll(".script");

let ultima_posicao_cursor = null

// LISTA DE FONTES
const fontes = [
  "Times New Roman",
  "Arial",
  "Verdana",
  "Garamond",
  "Georgia",
  "Courier New",
  "cursive",
];


const initializer = () => {
  caderno.focus()
  salvarPosicaoCursor()
  createMutationObserver();

  destacar(input_de_alinhamento);
  destacar(input_de_script);
  destacar(input_de_espacamento);
  destacar(input_de_formatacao, false);

  caderno.addEventListener("mouseup", salvarPosicaoCursor);

  // CRIA AS OPÇÕES PARA O NOME DA FONTE
  fontes.map((fontName) => {
    let opcao = document.createElement("option");
    opcao.value = fontName;
    opcao.innerHTML = fontName;
    input_fontName.appendChild(opcao);
  });

  // CRIA AS OPÇÕES PARA O TAMANHO DA FONTE
  for (let i = 1; i <= 7; i++) {
    let opcao = document.createElement("option");
    opcao.value = i;
    opcao.innerHTML = i;
    input_fontSize.appendChild(opcao);
  }
  // TAMANHO PADRAO DA FONTE
  input_fontSize.value = 3;
};


// DESTACA OS BOTOES PRECIONADOS
function destacar(classeBotoes, unico=true) {
  classeBotoes.forEach((botao) => {
    botao.addEventListener("click", () => {
      if (unico) {
        removerDestaque(classeBotoes);
      }
      botao.classList.toggle("active");
    });
  });
};

function removerDestaque(classeBotoes){
  classeBotoes.forEach((botao) => {
    botao.classList.remove("active");
  });
};

window.onload = initializer;




















function createMutationObserver() {
  const observer = new MutationObserver(function(mutationsList, observer) {
      for(let mutation of mutationsList) {
          if (mutation.type === 'characterData') {
              salvarPosicaoCursor()
          }
      }
  });

  // Observa mudanças no conteúdo do elemento contenteditable
  observer.observe(caderno, { childList: true, subtree: true, characterData: true });
}

// Chama a função para criar o observador de mutações

function salvarPosicaoCursor() {
  const selecao = window.getSelection();
  if (selecao.rangeCount > 0) {
    const range = selecao.getRangeAt(0);
    ultima_posicao_cursor = {
      startContainer: range.startContainer,
      startOffset: range.startOffset,
      endContainer: range.endContainer,
      endOffset: range.endOffset
    };
    console.log(ultima_posicao_cursor)
  }
}

function setarPosicaoCursor() { 
  if (ultima_posicao_cursor) {
    const selecao = window.getSelection();
    const range = document.createRange();
    range.setStart(ultima_posicao_cursor.startContainer, ultima_posicao_cursor.startOffset);
    range.setEnd(ultima_posicao_cursor.endContainer, ultima_posicao_cursor.endOffset);
    selecao.removeAllRanges();
    selecao.addRange(range);
  }
}

let lastCursorPosition = null;

function saveCursorPosition() {
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    lastCursorPosition = range.endOffset; // Armazena o offset de onde o cursor está no final da seleção
  }
}

function restoreCursorPosition() {
  const selection = window.getSelection();
  if (lastCursorPosition !== null) {
    const range = document.createRange();
    range.setStart(selection.anchorNode, lastCursorPosition);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
  }
}

// FUNÇÃO PRINCIPAL
function modifyText(command, defaultUi, value) {
  setarPosicaoCursor()
  document.execCommand(command, defaultUi, value);
  
};

// OPÇÕES QUE NÃO PRECISAM DE PARÂMETRO
input_opcoes.forEach((botao) => {
  botao.addEventListener("click", () => {
    if (botao == document.getElementById('insertOrderedList')) {
      saveCursorPosition()
      modifyText(botao.id, false, null);
      restoreCursorPosition()
    } else {
      modifyText(botao.id, false, null);
    }
  });
});

// OPÇÕES QUE PRECISAM DE PARÂMETRO
input_opcoes_avancado.forEach((botao) => {
  botao.addEventListener("change", () => {
    modifyText(botao.id, false, botao.value);
  });
});







































caderno.addEventListener("click", updateOptions);

function updateOptions() {
  updateFontSize()
  updateNegrito()
}

function updateFontSize() {
  const estilo = estiloLocalSelecionado()
  if (estilo) {
    const fontSize = parseInt(estilo.fontSize)
    var selectedFontSize = null
    switch (fontSize) {
      case 10:
        selectedFontSize = 1;
        break;
      case 13:
        selectedFontSize = 2;
        break;
      case 16:
        selectedFontSize = 3;
        break;
      case 18:
        selectedFontSize = 4;
        break;
      case 24:
        selectedFontSize = 5;
        break;
      case 32:
        selectedFontSize = 6;
        break;
      case 48:
        selectedFontSize = 7;
        break;
      default:
        selectedFontSize = 1
        break;
                                  
    }
    input_fontSize.value = selectedFontSize;
  }
}

function updateNegrito() {
  const estilo = estiloLocalSelecionado()
  if (estilo) {
    if (estilo.fontWeight === 'bold') {
      
    }
  }
}


// RETORNA O OBJETO SELECIONADO
function estiloLocalSelecionado() {
  const selecao = window.getSelection();
  if (selecao.rangeCount > 0) {
    const range = selecao.getRangeAt(0);
    const elemento_em_foco = range.startContainer.parentElement;
    const estilo = window.getComputedStyle(elemento_em_foco);
    return estilo;
  }
  return null;
}















