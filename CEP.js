const CEP = document.getElementById("CEPzin");
const Resposta = document.getElementById("espaçoderesposta");
const Historico = document.getElementById("historico");

async function buscarPorCEP(CEPzin) {
    try {
        const resposta = await fetch(`https://viacep.com.br/ws/${CEPzin}/json/`);
        const dados = await resposta.json();

        if (dados.erro) {
            Resposta.innerHTML = "CEP não encontrado!";
            return;
        }

        Resposta.innerHTML = `
            <strong>Logradouro:</strong> ${dados.logradouro}<br>
            <strong>Bairro:</strong> ${dados.bairro}<br>
            <strong>Cidade:</strong> ${dados.localidade} - ${dados.uf}
        `;
        salvarHistorico(dados.cep);
    } catch (erro) {
        console.log(erro);
        Resposta.innerHTML = "Erro ao buscar o CEP.";
    }
}

async function buscarPorEndereco() {
    const uf = document.getElementById("UF").value;
    const cidade = document.getElementById("Cidade").value.trim();
    const logradouro = document.getElementById("Logradouro").value.trim();

    if (uf == "" || cidade.length < 3 || logradouro.length < 3) {
        Resposta.innerHTML = "Preencha UF, Cidade e Logradouro direito";
        return;
    }

    try {
        const resposta = await fetch(`https://viacep.com.br/ws/${uf}/${encodeURIComponent(cidade)}/${encodeURIComponent(logradouro)}/json/`);
        const dados = await resposta.json();

        if (dados.length == 0) {
            Resposta.innerHTML = "Endereço não encontrado!";
            return;
        }

        let html = "";
        for (let i = 0; i < dados.length; i++) {
            html += `
                <strong>CEP:</strong> ${dados[i].cep}<br>
                <strong>Logradouro:</strong> ${dados[i].logradouro}<br>
                <strong>Bairro:</strong> ${dados[i].bairro}<br>
                <strong>Cidade:</strong> ${dados[i].localidade} - ${dados[i].uf}<hr>
            `;
            salvarHistorico(dados[i].cep);
        }
        Resposta.innerHTML = html;
    } catch (erro) {
        console.log(erro);
        Resposta.innerHTML = "Erro ao buscar o endereço.";
    }
}

function processarBusca() {
    const input = CEP.value.trim();
    const Numerosdocep = input.replace(/\D/g, '');

    if (Numerosdocep.length === 8) {
        buscarPorCEP(Numerosdocep);
    } else {
        Resposta.innerHTML = "Digite um CEP válido com 8 dígitos.";
    }
}

function salvarHistorico(cep) {
    let lista = JSON.parse(localStorage.getItem("historicoCEP")) || [];
    if (lista.indexOf(cep) === -1) {
        lista.unshift(cep);
        lista = lista.slice(0, 10);
        localStorage.setItem("historicoCEP", JSON.stringify(lista));
    }
    carregarHistorico();
}

function carregarHistorico() {
    const lista = JSON.parse(localStorage.getItem("historicoCEP")) || [];
    Historico.innerHTML = "";
    for (let i = 0; i < lista.length; i++) {
        const li = document.createElement("li");
        li.textContent = lista[i];
        li.onclick = function() {
            CEP.value = lista[i];
            buscarPorCEP(lista[i].replace(/\D/g, ''));
        };
        Historico.appendChild(li);
    }
}

document.addEventListener("DOMContentLoaded", carregarHistorico);

document.getElementById("Limpar").onclick = function() {
    CEP.value = "";
    document.getElementById("UF").value = "";
    document.getElementById("Cidade").value = "";
    document.getElementById("Logradouro").value = "";
    Resposta.innerHTML = "";
};