//Ambas as constantes recebem itens do HTML
const CEP = document.getElementById("CEPzin");
const Resposta = document.getElementById("espaçoderesposta");
const Historico = document.getElementById("historico");

//Função inicial de contato com a API
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
        console.error("Erro na requisição por CEP:", erro);
        Resposta.innerHTML = "Erro ao buscar o CEP.";
    }
}

//Busca CEP a partir de UF, Cidade e Logradouro
async function buscarPorEndereco() {
    const uf = document.getElementById("UF").value;
    const cidade = document.getElementById("Cidade").value.trim();
    const logradouro = document.getElementById("Logradouro").value.trim();

    if (!uf || cidade.length < 3 || logradouro.length < 3) {
        Resposta.innerHTML = "Preencha UF, Cidade e Logradouro (mín. 3 letras).";
        return;
    }

    try {
        const url = `https://viacep.com.br/ws/${uf}/${encodeURIComponent(cidade)}/${encodeURIComponent(logradouro)}/json/`;
        const resposta = await fetch(url);
        const dados = await resposta.json();

        if (!dados.length) {
            Resposta.innerHTML = "Endereço não encontrado!";
            return;
        }

        Resposta.innerHTML = dados.map(item => `
            <strong>CEP:</strong> ${item.cep}<br>
            <strong>Logradouro:</strong> ${item.logradouro}<br>
            <strong>Bairro:</strong> ${item.bairro}<br>
            <strong>Cidade:</strong> ${item.localidade} - ${item.uf}<hr>
        `).join("");
        dados.forEach(item => salvarHistorico(item.cep));
    } catch (erro) {
        console.error("Erro na requisição por endereço:", erro);
        Resposta.innerHTML = "Erro ao buscar o endereço.";
    }
}

//Decide qual busca fazer com base no CEP digitado
function processarBusca() {
    const input = CEP.value.trim();
    const Numerosdocep = input.replace(/\D/g, '');

    if (Numerosdocep.length === 8) {
        buscarPorCEP(Numerosdocep);
    } else {
        Resposta.innerHTML = "Digite um CEP válido com 8 dígitos.";
    }
}

//Salva o CEP pesquisado no localStorage e atualiza a lista
function salvarHistorico(cep) {
    let lista = JSON.parse(localStorage.getItem("historicoCEP")) || [];
    if (!lista.includes(cep)) {
        lista.unshift(cep);
        lista = lista.slice(0, 10);
        localStorage.setItem("historicoCEP", JSON.stringify(lista));
    }
    carregarHistorico();
}

//Exibe o histórico salvo e permite clicar para repetir a busca
function carregarHistorico() {
    const lista = JSON.parse(localStorage.getItem("historicoCEP")) || [];
    Historico.innerHTML = "";
    lista.forEach(cep => {
        const li = document.createElement("li");
        li.textContent = cep;
        li.onclick = () => {
            CEP.value = cep;
            buscarPorCEP(cep.replace(/\D/g, ''));
        };
        Historico.appendChild(li);
    });
}

document.addEventListener("DOMContentLoaded", carregarHistorico);

document.getElementById("Limpar").onclick = function() {
    CEP.value = "";
    document.getElementById("UF").value = "";
    document.getElementById("Cidade").value = "";
    document.getElementById("Logradouro").value = "";
    Resposta.innerHTML = "";
};