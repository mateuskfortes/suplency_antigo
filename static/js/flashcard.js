const csrf_token = document.querySelector('#csrf_token').getAttribute('content');
const link_load_flashcard = document.querySelector('#link_load_flashcard').getAttribute('content')
const link_save_flashcard = document.querySelector('#link_save_flashcard').getAttribute('content')

const flashcards = document.querySelector(".flashcards");
const cardForm = document.querySelector(".card-form");
const question = document.querySelector("#question");
const answer = document.querySelector("#answer");
let myLocal = null

async function init() {
  await loadFlashcards()
  myLocal.forEach(addCard);
}

async function deleteFromDataBase(id) {
  try {
    response = await fetch(`flashcard/delete/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrf_token
      }
    })
    if (!response.ok) {
      throw new Error('erro ao excluir ' + response.statusText);
    }
    else {
      return true
    }
  } 
  catch (error) {
    console.error('Houve um problema com a requisição Fetch:', error);
  }
}

async function saveOnDataBase(data) {
  try {
    response = await fetch(link_save_flashcard, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrf_token
      },
      credentials: 'include',
      body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error('Erro ao salvar: ', response.statusText)
    return await response.json()
  }

  catch(error) {
    console.error('Erro: ', error.message)
  }
}

async function loadFlashcards() {
  try {
    const response = await fetch(link_load_flashcard);
    if (!response.ok) {
      throw new Error(`Erro durante a requisição: ${response.statusText}`);
    }
    myLocal = await response.json()
  } catch (error) {
    console.log('Erro:', error);
  }
}


function create() {
  cardForm.style.display = "flex";
}

function cancel() {
  cardForm.style.display = "none";
}

function removeAll() {
  if (confirm("Deseja mesmo excluir todos os cards?")) {
    flashcards.innerHTML = "";
    myLocal.forEach(fc=>deleteFromDataBase(fc.id))
    myLocal = [];
  }
}

async function save() {
  if (question.value.length >= 1 && answer.value.length >= 1) {
    let flashcardInfo = {
      question: question.value,
      answer: answer.value,
    };
    let flashcardInfo_json = await saveOnDataBase(flashcardInfo)
    flashcardInfo.id = flashcardInfo_json.id

    myLocal.push(flashcardInfo);

    addCard(flashcardInfo);
    question.value = "";
    answer.value = "";
  }
}

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
    div.setAttribute("id", card.id);

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

    remove.addEventListener("click", async (e) => {
      console.log('CLICK DETECTED');
      console.log('Event:', e);
      let flashcardId = e.target.closest('.flashcard').id;
      console.log('Flashcard ID:', flashcardId);
      if (confirm('Tem certeza que deseja excluir o card?') && flashcardId) {
        if(await deleteFromDataBase(flashcardId)) {
          let fc = e.target.closest('.flashcard')
          if (fc) {
            fc.remove();
            //window.location.reload();
          }
        }
      }
    });
  }
}

init()