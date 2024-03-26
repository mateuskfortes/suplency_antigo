/* Método pomodoro ---------------------------*/

const start = document.getElementById('start/stop')
const continuar = document.getElementById('continuar')
const contador = document.getElementById('timer')
const input_foco = document.getElementById('tp_foco')
const input_pausa = document.getElementById('tp_pausa')
const input_pausa_longa = document.getElementById('tp_pausa_longa')
const input_ate_pl = document.getElementById('focos_ate_pausa_longa')

let tempo_total_foco = 0
let tempo_total_pausa = 0
let tempo_total_pausa_longa = 0
let ate_pl = input_ate_pl.value * 2
let ligado = false
let timer = 0
let tempo = 0
let i = ate_pl

start.addEventListener('click', () => {
    tempo_total_foco = input_foco.value * 60
    tempo_total_pausa = input_pausa.value * 60
    tempo_total_pausa_longa = input_pausa_longa.value * 60
    ate_pl = input_ate_pl.value * 2
    if (!ligado && input_foco.value > 0 && input_pausa.value > 0 && input_pausa_longa.value > 0 && input_ate_pl.value > 0) pomodoro()
    else parar_timer()
})

input_foco.addEventListener('change', () => {
    tempo = input_foco.value * 60
    mostrar_timer()
})

async function pomodoro() {
    ligado = true
    while (ligado) {
        for (i = 0; i < ate_pl; i++) {
            if (i % 2 == 0) tempo = tempo_total_foco
            else if (i % 2 != 0 && i != ate_pl - 1) tempo = tempo_total_pausa
            else tempo = tempo_total_pausa_longa
            await new Promise(resolve => timer = setInterval(() => {
                tempo--
                mostrar_timer()
                if (tempo <= 0) {
                    clearInterval(timer)
                    contador.textContent = '00:00 esperando resposta'
                    continuar.addEventListener('click', resolve)
                }
            }, 1000))
        }
    }
}

function mostrar_timer() {
    var minutos = Math.floor(tempo / 60);
    var segundos = tempo % 60;
    var mostrar_tempo = `${minutos < 10 ? '0' : ''}${minutos}:${segundos < 10 ? '0' : ''}${segundos}`
    contador.textContent = `${mostrar_tempo} ${i % 2 == 0 && i != ate_pl ? 'foco' : i % 2 != 0 && i != ate_pl - 1 ? 'pausa' : i == ate_pl - 1 ? 'pausa longa' : ''}`
}

function parar_timer() {
    clearInterval(timer)
    ligado = false
    i = ate_pl
    tempo = 0
    mostrar_timer()
}

/* Bloco de anotações ------------------*/




/*--------------------------------------*/