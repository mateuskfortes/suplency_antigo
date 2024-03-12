const start = document.getElementById('start/stop')
const contador = document.getElementById('timer')
const input_foco = document.getElementById('tp_foco')

let ligado = false
let timer = 0
let tempo = 0

start.addEventListener('click', pomodoro)
input_foco.addEventListener('change', () => {
    tempo = input_foco.value * 60
    mostrar_timer()
})

function pomodoro() {
    if (ligado == false && input_foco.value > 0) {
        var tp_foco = input_foco.value
        var tp_pausa = (document.getElementById('tp_pausa').value) * 60
        var tp_pausa_longa = (document.getElementById('tp_pausa_longa').value) * 60
        tempo = tp_foco
        timer = setInterval(() => {
            tempo--
            mostrar_timer()
            if (tempo <= 0) {
                clearInterval(timer);
                ligado = false;
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
    
    mostrar_timer();
}


const fc = document.getElementById('fc')
const pc = document.getElementById('pc')
const pl = document.getElementById('pl')
const iniciar = document.getElementById('in')

iniciar.addEventListener('click', () => {
    tempo = fc.value * 60
    tim = setInterval(() => {
        tempo--
        mostrar_timer()
        var minutos = Math.floor(tempo / 60);
        var segundos = tempo % 60;
        var mostrar_tempo = `${minutos < 10 ? '0' : ''}${minutos}:${segundos < 10 ? '0' : ''}${segundos}`;
        fc.value = mostrar_tempo
    }, 1000)
})
