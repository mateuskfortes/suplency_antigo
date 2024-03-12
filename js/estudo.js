const start = document.getElementById('start/stop')
const contador = document.getElementById('timer')

let ligado = false
let timer
let tempo

start.addEventListener('click', pomodoro())

function pomodoro() {
    if (ligado == false) {
        var tp_foco = (document.getElementById('tp_foco').value) * 60
        var tp_pausa = (document.getElementById('tp_pausa').value) * 60
        var tp_pausa_longa = (document.getElementById('tp_pausa_longa').value) * 60
        tempo = tp_foco
        timer = setInterval(() => {
            tempo--
            mostrar_timer()
            if (tempo == 0) {
                parar_timer()
            }
        }, 1000)
        ligado = true
    }
    else {
        parar_timer()
    }
}

function mostrar_timer() {
    var minutos = Math.floor(tempo / 60);
    var segundos = tempo % 60;
    var mostrar_tempo = `${minutos < 10 ? '0' : ''}${minutos}:${segundos < 10 ? '0' : ''}${segundos}`;
    contador.textContent = mostrar_tempo
}

function parar_timer() {
    clearInterval(timer);
    ligado = false;
    mostrar_timer();
}
