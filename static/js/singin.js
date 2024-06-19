var nome = document.getElementById('nome')
var email = document.getElementById('email')
var senha = document.getElementById('senha')
var confirmacao_senha = document.getElementById('confirmar')
var botao_entrar = document.getElementById('entrar')

function validarFormulario() {
    var submit = true
    texto_nome = nome.value
    var tem_espaco = texto_nome.includes(' ') 
    if (tem_espaco || texto_nome == '') {
        submit = false
        if (tem_espaco) {
            nome.classList.add('erro')
        }
    }
    else {
        nome.classList.remove('erro')
        submit = true
    }
    var senha_diferente = senha.value != confirmacao_senha.value 
    if (senha_diferente || senha.value == '') {
        submit = false
        if(senha_diferente) {
            senha.classList.add('erro')
            confirmacao_senha.classList.add('erro')
        }
    }
    else {
        senha.classList.remove('erro')
        confirmacao_senha.classList.remove('erro')
        submit = true
    }

    if (submit) {
        botao_entrar.disabled = false
        console.log('false')
    }
    else {
        botao_entrar.disabled=true
        console.log('true')
    }
}   

nome.addEventListener('input', () => {
    
})