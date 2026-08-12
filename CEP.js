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
    // coleta os elementos, aqueles que tem .trim o usa para eliminar os " "(espaços)
    const uf = document.getElementById("UF").value;
    const cidade = document.getElementById("Cidade").value.trim();
    const logradouro = document.getElementById("Logradouro").value.trim();

    // SE uf for nulo, cidade, bairro ou logradouro forem - de 3 dígitos, exibe pedido de reformulação
    if (uf == "" || cidade.length < 3 || logradouro.length < 3) {
        Resposta.innerHTML = "Preencha UF, Cidade, Bairro e Logradouro novamente :(";
        return;
    }

    // Mensagem à API, buscando os dados
    try {
        const resposta = await fetch(`https://viacep.com.br/ws/${uf}/${cidade}/${logradouro}/json/`);
        const dados = await resposta.json();

        if (dados.length == 0) {
            Resposta.innerHTML = "Endereço não encontrado :<";
            return;
        }

        // string vazia para inserção dos dados traduzidos em html
        // (exemplo: SP/Santana de Parnaíba/Fazendinha)
        let html = "";

        // for percorre a lista adicionando os dados
        for (let i = 0; i < dados.length; i++) {
            html += `
                <strong>CEP:</strong> ${dados[i].cep}<br>
                <strong>Logradouro:</strong> ${dados[i].logradouro}<br>
                <strong>Cidade:</strong> ${dados[i].localidade} - ${dados[i].uf}<hr>
            `;

            // Os adiciona ao LocalStorage
            salvarHistorico(dados[i].cep);
        }

        // Adiciona os dados no HTML
        Resposta.innerHTML = html;
    }

    // Se der erro, já sabe, faz o L
    catch (erro) {
        console.log(erro);
        Resposta.innerHTML = "Erro ao buscar o endereço.";
    }
}

function processarBusca() {
    // Trim elimina os espaços('')
    const input = CEP.value.trim();

    // substitui tudo que não é número por "nada" ('')
    const Numerosdocep = input.replace(/\D/g, '');

    if (Numerosdocep.length == 8) {
        buscarPorCEP(Numerosdocep);
    } else {
        Resposta.innerHTML = "Digite um CEP válido com 8 dígitos.";
    }
}

function salvarHistorico(cep) {
    // pega uma string que está no formato JSON e transforma em um valor JS.
    // Caso não haja nenhum, é um espaço vazio, um []
    let lista = JSON.parse(localStorage.getItem("historicoCEP")) || [];

    // caso o indexOf não ache CEP algum, vai retornar -1 e executar o if
    if (lista.indexOf(cep) === -1) {

        // Adiciona o mais novo CEP no início da lista
        // diferente de push, que o colocaria no fim da lista
        lista.unshift(cep);

        // slice, corta os elementos em 0 a 10, passando de 10 é ignorado
        lista = lista.slice(0, 10);

        // setItem recebe o nome da lista e o conteúdo, os transformando em string.
        // O navegador o guarda como nomear uma gaveta e dizer seu conteúdo
        localStorage.setItem("historicoCEP", JSON.stringify(lista));
    }

    // Ativa a função seguinte
    carregarHistorico();
}

function carregarHistorico() {
    // Igual à anterior
    const lista = JSON.parse(localStorage.getItem("historicoCEP")) || [];

    Historico.innerHTML = "";

    // laço de repetição pra coleta e lista dos elementos da constante lista
    for (let i = 0; i < lista.length; i++) {
        const li = document.createElement("li");

        li.textContent = lista[i];

        li.onclick = function() {
            // Ao clicar num item do histórico ele se reutilizará
            CEP.value = lista[i];
            buscarPorCEP(lista[i].replace(/\D/g, ''));
        };

        Historico.appendChild(li);
    }
}

// espera a página carregar pra usar o "carregarHistorico"
document.addEventListener("DOMContentLoaded", carregarHistorico);

// torna todos os elementos em nada, os anula
document.getElementById("Limpar").onclick = function() {
    CEP.value = "";
    document.getElementById("UF").value = "";
    document.getElementById("Bairro").value = "";
    document.getElementById("Cidade").value = "";
    document.getElementById("Logradouro").value = "";
    Resposta.innerHTML = "";
};