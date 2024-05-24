document.getElementById('proxima_pagina').addEventListener('click', function() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://127.0.0.1:8000/caderno/matematica/2', true);
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log(xhr)
            var data = JSON.parse(xhr.responseText);

            var caderno = document.getElementById('texto');
            caderno.innerHTML = data.conteudo;
        }
    };
    
    xhr.send();
});