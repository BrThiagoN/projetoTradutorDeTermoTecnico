let cardContainer = document.querySelector('.card-container');
let campoBusca = document.querySelector('.search-container input');
let botaoBusca = document.getElementById('botao-busca');
let dados = [];

async function iniciarBusca(){
    let resposta = await fetch('data.json');
    dados = await resposta.json();
}

function buscar() {
    const termoBusca = campoBusca.value.toLowerCase();
    
    const resultadosComPontuacao = dados.map(dado => {
        let pontuacao = 0;
        // Prioridade 1: Nome (maior pontuação)
        if (dado.nome.toLowerCase().includes(termoBusca)) {
            pontuacao += 3;
        }
        // Prioridade 2: Tags
        if (dado.tags.some(tag => tag.toLowerCase().includes(termoBusca))) {
            pontuacao += 2;
        }
        // Prioridade 3: Descrição
        if (dado.descricao_tecnica.toLowerCase().includes(termoBusca)) {
            pontuacao += 1;
        }
        return { ...dado, pontuacao };
    });

    // Filtra apenas os resultados que tiveram alguma pontuação e ordena
    const resultadosFiltradosEOrdenados = resultadosComPontuacao
        .filter(dado => dado.pontuacao > 0)
        .sort((a, b) => b.pontuacao - a.pontuacao || a.nome.localeCompare(b.nome));

    renderizarCards(resultadosFiltradosEOrdenados);
}

function renderizarCards(dados){
    // Limpa o container antes de renderizar novos cards
    cardContainer.innerHTML = '';

    if (dados.length === 0) {
        cardContainer.innerHTML = '<p>Nenhum resultado encontrado.</p>';
        return;
    }

    for(let dado of dados){
        let article = document.createElement('article');
        article.classList.add('card');
        article.innerHTML = `
        <h2>${dado.nome}</h2>
        <li>${dado.descricao_tecnica}</li>
        <li>${dado.descricao_basica}</li>
        <li>${dado.curiosidade}</li>
        <li>${dado.tags.join(', ')}</li>
        `
        cardContainer.appendChild(article);
    }
}

botaoBusca.addEventListener('click', buscar,);

campoBusca.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        buscar();
    }
});

iniciarBusca();