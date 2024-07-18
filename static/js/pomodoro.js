/* Método pomodoro ---------------------------*/

const start = document.getElementById('start/stop')
const continuar = document.getElementById('continuar')
const minutos_timer = document.getElementById('minutes')
const segundos_timer = document.getElementById('seconds')
const estado_timer = document.getElementById('estado_timer')
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
let tempo_parcial = 0
let sequencia = []
let sequencia_atual=''

start.addEventListener('click', () => {
    if (!ligado
        && input_foco.value > 0
        && input_pausa.value > 0
        && input_pausa_longa.value > 0 
        && input_ate_pausa_longa.value > 0) 
        {
            tempo = tempo_parcial
            tempo_total_foco = input_foco.value * 60
            tempo_total_pausa = input_pausa.value * 60
            tempo_total_pausa_longa = input_pausa_longa.value * 60
            ate_pausa_longa = input_ate_pausa_longa.value
            preencher_sequencia()
            pomodoro()
    }
    else
    {
        parar_timer()
    }
})

input_foco.addEventListener('input', () => {
    tempo_parcial = input_foco.value * 60
    if (!ligado) {
        tempo = tempo_parcial
        mostrar_timer()
    }
})

async function pomodoro() {
    start.innerText = 'Parar'
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
                    minutos_timer.textContent = '00'
                    segundos_timer.textContent = '00'
                    estado_timer.innerHTML = 'Aguardando responsta...'
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
}

function mostrar_timer() {
    var minutos = Math.floor(tempo / 60);
    var segundos = tempo % 60;
    minutos_timer.textContent = `${minutos < 10 ? '0' : ''}${minutos}`
    segundos_timer.textContent = `${segundos < 10 ? '0' : ''}${segundos}`
    estado_timer.innerHTML = sequencia_atual
}

function parar_timer(tempo_final = 0) {
    start.innerText = 'Iniciar'
    clearInterval(timer)
    ligado = false
    tempo = tempo_final
    mostrar_timer()
    estado_timer.innerHTML = ''
}