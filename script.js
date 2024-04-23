let botoesComOpcoes = document.querySelectorAll(".option-button");
let botoesComOpcoesAvancadas = document.querySelectorAll(".adv-option-button");
let fonte = document.getElementById("fontName");
let tamanho = document.getElementById("fontSize");
let editor = document.getElementById("text-input");
let criarLink = document.getElementById("createLink");
let botoesAlinhamento = document.querySelectorAll(".align");
let botoesEspacamento = document.querySelectorAll(".spacing");

let botoesFormatacao = document.querySelectorAll(".format");
let botoesScriptar = document.querySelectorAll(".script");

//List of listaDeFontes
let listaDeFontes = [
  "Arial",
  "Verdana",
  "Times New Roman",
  "Garamond",
  "Georgia",
  "Courier New",
  "cursive",
];

//Initial Settings
const initializer = () => {
  //function calls for highlighting buttons
  //No highlights for link, unlink,lists, undo,redo since they are one time operations
  highlighter(botoesAlinhamento, true);
  highlighter(botoesEspacamento, true);
  highlighter(botoesFormatacao, false);
  highlighter(botoesScriptar, true);

  //create options for font names
  listaDeFontes.map((valor) => {
    let option = document.createElement("option");
    option.value = valor;
    option.innerHTML = valor;
    fonte.appendChild(option);
  });

  //fontSize allows only till 7
  for (let i = 1; i <= 7; i++) {
    let option = document.createElement("option");
    option.value = i;
    option.innerHTML = i;
    tamanho.appendChild(option);
  }

  //default size
  tamanho.value = 3;
};

//main logic
const modifyText = (command, defaultUi, value) => {
  //execCommand executes command on selected text
  document.execCommand(command, defaultUi, value);
};

//For basic operations which don't need value parameter
botoesComOpcoes.forEach((botao) => {
  botao.addEventListener("click", () => {
    modifyText(botao.id, false, null);
  });
});

//options that require value parameter (e.g colors, fonts)
botoesComOpcoesAvancadas.forEach((botao) => {
  botao.addEventListener("change", () => {
    modifyText(botao.id, false, botao.value);
  });
});

//link
criarLink.addEventListener("click", () => {
  let userLink = prompt("Enter a URL");
  //if link has http then pass directly else add https
  if (/http/i.test(userLink)) {
    modifyText(criarLink.id, false, userLink);
  } else {
    userLink = "http://" + userLink;
    modifyText(criarLink.id, false, userLink);
  }
});

//Highlight clicked button
const highlighter = (className, needsRemoval) => {
  className.forEach((button) => {
    button.addEventListener("click", () => {
      //needsRemoval = true means only one button should be highlight and other would be normal
      if (needsRemoval) {
        let alreadyActive = false;

        //If currently clicked button is already active
        if (button.classList.contains("active")) {
          alreadyActive = true;
        }

        //Remove highlight from other buttons
        highlighterRemover(className);
        if (!alreadyActive) {
          //highlight clicked button
          button.classList.add("active");
        }
      } else {
        //if other buttons can be highlighted
        button.classList.toggle("active");
      }
    });
  });
};

const highlighterRemover = (className) => {
  className.forEach((button) => {
    button.classList.remove("active");
  });
};

window.onload = initializer();