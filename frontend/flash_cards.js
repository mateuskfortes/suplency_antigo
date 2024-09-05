const flashcards = document.querySelector(".flashcards");
const cardForm = document.querySelector(".card-form");
const question = document.querySelector("#question");
const answer = document.querySelector("#answer");

let id = 0;

let myLocal = localStorage.getItem("items")
  ? JSON.parse(localStorage.getItem("items"))
  : [];
function create() {
  cardForm.style.display = "flex";
}

function cancel() {
  cardForm.style.display = "none";
}

function removeAll() {
  if (confirm("Deseja mesmo excluir todos os cards?")) {
    localStorage.clear();
    flashcards.innerHTML = "";
    myLocal = [];
  }
}

function save() {
  if (question.value.length >= 1 && answer.value.length >= 1) {
    let flashcardInfo = {
      question: question.value,
      answer: answer.value,
      id: id,
    };

    myLocal.push(flashcardInfo);
    localStorage.setItem("items", JSON.stringify(myLocal));

    addCard(myLocal[myLocal.length - 1]);
    question.value = "";
    answer.value = "";
  }
}

myLocal.forEach(addCard);

function addCard(card) {
  cardForm.style.display = "none";

  if (card.question.length >= 1 && card.answer.length >= 1) {
    let div = document.createElement("div");
    let h2question = document.createElement("h2");
    let h2answer = document.createElement("h2");
    let btn = document.createElement("button");
    let remove = document.createElement("span");
    let number = document.createElement("span");

    div.className = "flashcard";
    div.setAttribute("id", id);

    remove.className = "remove";
    number.className = "number";

    h2question.setAttribute("style", "text-align: justify");
    h2question.innerHTML = card.question;

    h2answer.setAttribute(
      "style",
      "text-align: center; display: none; color: green"
    );
    h2answer.innerHTML = card.answer;

    btn.innerHTML = "mostrar";
    remove.innerHTML = "<b>excluir</b>";
    
    div.appendChild(h2question);
    div.appendChild(h2answer);
    div.appendChild(btn);
    div.appendChild(remove);
    div.appendChild(number);

    flashcards.appendChild(div);

    btn.addEventListener("click", () => {
      h2answer.style.display === "none"
        ? (h2answer.style.display = "block")
        : (h2answer.style.display = "none");

      btn.innerHTML === "mostrar"
        ? (btn.innerHTML = "esconder")
        : (btn.innerHTML = "mostrar");
    });

    remove.addEventListener("click", (e) => {
      let flashcardId = e.target.parentNode.id;
      if (confirm(`Deseja mesmo excluir o card ${Number(flashcardId) + 1}?`)) {
        myLocal.splice(flashcardId, 1);
        localStorage.setItem("items", JSON.stringify(myLocal));
        window.location.reload();
      }
    });
    id++;
  }
}