const url=  'viacep.com.br/ws/agshdhaskd/json/';

async function BuscaCEP() {
    const resultado = document.getElementById('espaçoderesposta');

    try {
    // 1. Faz a requisição à API
        const Pedido = await fetch(url);
        
        // 2. Verifica se a resposta foi bem-sucedida
        if (!Pedido.ok) {
            throw new Error(`Erro na requisição: ${response.status}`);
        }

        // 3. Converte os dados para formato JSON
        const CEPs = await Pedido.json();

        // Vamos exibir apenas os 10 primeiros posts para o exemplo
        CEPs.forEach(post => {
            const postElement = document.createElement('div');
            postElement.classList.add('post');

            postElement.innerHTML = `
                <h2>${post.title}</h2>
                <p>${post.body}</p>
            `;

            container.appendChild(postElement);
        });

    } catch (error) {
        console.error('Erro ao buscar CPF:', error);
        container.innerHTML = '<p style="color: red;">Erro ao carregar os dados de localização.</p>';
    }
}

// Chama a função ao carregar a página
fetchPosts();