/* Método pomodoro ---------------------------*/

const start = document.getElementById('start/stop')
const continuar = document.getElementById('continuar')
const contador = document.getElementById('timer')
const input_foco = document.getElementById('tp_foco')
const input_pausa = document.getElementById('tp_pausa')
const input_pausa_longa = document.getElementById('tp_pausa_longa')
const input_ate_pausa_longa = document.getElementById('focos_ate_pausa_longa')

let tempo_total_foco = 0
let tempo_total_pausa = 0
let tempo_total_pausa_longa = 0
let ate_pausa_longa = 1
let ligado = false
let timer = 0
let tempo = 0
let sequencia = []
let sequencia_atual=''

start.addEventListener('click', () => {
    tempo_total_foco = input_foco.value * 60
    tempo_total_pausa = input_pausa.value * 60
    tempo_total_pausa_longa = input_pausa_longa.value * 60
    ate_pausa_longa = input_ate_pausa_longa.value
    if (!ligado
    && input_foco.value > 0
    && input_pausa.value > 0
    && input_pausa_longa.value > 0 
    && input_ate_pausa_longa.value > 0) 
    {
        preencher_sequencia()
        pomodoro()
    }
    else
    {
        parar_timer()
    }
})

input_foco.addEventListener('input', () => {
    tempo = input_foco.value * 60
    mostrar_timer()
})

async function pomodoro() {
    ligado = true
    while (ligado) {
        for (let momento of sequencia) {
            sequencia_atual = momento
            if (!ligado) break

            else if (momento == 'foco') tempo = tempo_total_foco
            else if (momento == 'pausa') tempo = tempo_total_pausa
            else if (momento == 'pausa_longa') tempo = tempo_total_pausa_longa

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

function preencher_sequencia() {
    sequencia = []
    for (i=0; i <= ate_pausa_longa; i++) {
        sequencia.push('foco')
        if (i != ate_pausa_longa) sequencia.push('pausa')
        else sequencia.push('pausa_longa')
    }
    console.log(sequencia)
}

function mostrar_timer() {
    var minutos = Math.floor(tempo / 60);
    var segundos = tempo % 60;
    var mostrar_tempo = `${minutos < 10 ? '0' : ''}${minutos}:${segundos < 10 ? '0' : ''}${segundos}`
    contador.textContent = `${mostrar_tempo} ${sequencia_atual}`
}

function parar_timer(tempo_final = 0) {
    clearInterval(timer)
    ligado = false
    tempo = tempo_final
    mostrar_timer()
}