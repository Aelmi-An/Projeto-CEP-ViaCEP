//Ambas as constantes recebem itens do HTML
const CEP = document.getElementById("CEPzin");
const Resposta = document.getElementById("espaçoderesposta");

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
    } catch (erro) {
        console.error("Erro na requisição por CEP:", erro);
        Resposta.innerHTML = "Erro ao buscar o CEP.";
    }
}

//
function processarBusca() {
    const input = document.querySelector('#CEPzin').value.trim();
    const Numerosdocep = input.replace(/\D/g, '');

    if (Numerosdocep.length === 8) {
        buscarPorCEP(Numerosdocep);
    } else {
        buscarPorNome(input);
    }
}

document.getElementById("Limpar").onclick = function() {
    CEP.value = "";
    Resposta.innerHTML = "";
};