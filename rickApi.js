'use strict'

const rickApi = 'https://rickandmortyapi.com/api/character/'

/**
 * Busca um personagem aleatório da API.
 * @returns {Promise<Object|null>} O objeto do personagem ou null em caso de erro
 */
export async function getPersonagemAleatorio() {
    try {
        // 1. filtrar quantos personagens existem
        const responseInfo = await fetch(rickApi);
        if (!responseInfo.ok) {
            throw new Error(`HTTP error! status: ${responseInfo.status}`)
        }
        const dataInfo = await responseInfo.json()
        const totalDePersonagens = dataInfo.info.count

        // 2. Gerar um ID aleatório
        const randomId = Math.floor(Math.random() * totalDePersonagens) + 1

        // 3. Buscar o personagem com o ID aleatório
        const responsePersonagem = await fetch(`${rickApi}${randomId}`)
        if (!responsePersonagem.ok) {
            throw new Error(`HTTP error! status: ${responsePersonagem.status}`)
        }
        const personagem = await responsePersonagem.json()
        
        console.log('Personagem Aleatório:', personagem)
        return personagem
    } catch (error) {
        console.error('Erro ao buscar personagem aleatório:', error)
        return null
    }
}

/**
 * Busca personagens da API pelo nome
 * @param {string} nome O nome do personagem a ser buscado
 * @returns {Promise<Array|Object>} Um array com os personagens encontrados ou um objeto de erro
 */

async function getPersonagemPorNome(nome) {
    // A API usa o parâmetro 'name' na URL para filtrar
    const url = `${rickApi}?name=${encodeURIComponent(nome)}`
    try {
        const response = await fetch(url)
        // A API retorna 404 se não encontrar nenhum personagem
        if (response.status === 404) {
            return { error: `Nenhum personagem encontrado com o nome "${nome}".` }
        }
        if (!response.ok) {
            throw new Error(`Erro na requisição! Status: ${response.status}`)
        }
        const data = await response.json()
        console.log(`Resultado da busca por "${nome}":`, data.results)
        return data.results // A API retorna um objeto com uma chave 'results' que é um array
    } catch (error) {
        console.error('Erro ao buscar personagem por nome:', error)
        return { error: 'Ocorreu um erro ao realizar a busca.' }
    }
}

/**
 * Cria o elemento HTML para um card de personagem
 * @param {Object} personagem O objeto do personagem vindo da API
 * @returns {HTMLElement} O elemento div do card
 */
export function criarCardPersonagem(personagem) {
    const card = document.createElement('div')
    card.dataset.id = personagem.id // Adiciona o ID do personagem no card
    card.classList.add('personagem-card')

    card.innerHTML = `
        <img src="${personagem.image}" alt="Imagem de ${personagem.name}" draggable="false">
        <div class="card-content">
            <h2>${personagem.name}</h2>
            <p><strong>Status:</strong> ${personagem.status}</p>
            <p><strong>Espécie:</strong> ${personagem.species}</p>
            <p><strong>Origem:</strong> ${personagem.origin.name}</p>
        </div>
    `;
    return card
}

/**
 * Busca um único personagem pelo seu ID
 * @param {number} id O ID do personagem
 * @returns {Promise<Object>} O objeto do personagem
 */

async function getPersonagemPorId(id) {
    const url = `${rickApi}${id}`
    try {
        const response = await fetch(url)
        if (!response.ok) {
            throw new Error(`Erro na requisição! Status: ${response.status}`)
        }
        return await response.json()
    } catch (error) {
        console.error(`Erro ao buscar personagem com ID ${id}:`, error)
        return null
    }
}

/**
 * Abre um modal com informações detalhadas de um personagem
 * @param {number} id O ID do personagem
 */

async function abrirModalComPersonagem(id) {
    const modalContainer = document.getElementById('modal-container')
    const modalBody = document.getElementById('modal-body')
    modalBody.innerHTML = '<p class="loading">Carregando detalhes...</p>'
    modalContainer.classList.add('show')

    const personagem = await getPersonagemPorId(id)

    if (!personagem) {
        modalBody.innerHTML = '<p class="error">Não foi possível carregar as informações.</p>'
        return
    }

    // Busca os nomes dos episódios
    const episodiosPromises = personagem.episode.map(url => fetch(url).then(res => res.json()))
    const episodios = await Promise.all(episodiosPromises)
    const listaEpisodios = episodios.map(ep => `<li>${ep.episode}: ${ep.name}</li>`).join('')

    modalBody.innerHTML = `
        <div class="modal-body-content">
            <img src="${personagem.image}" alt="Imagem de ${personagem.name}">
            <div>
                <h2>${personagem.name}</h2>
                <p><strong>Status:</strong> ${personagem.status}</p>
                <p><strong>Espécie:</strong> ${personagem.species}</p>
                <p><strong>Gênero:</strong> ${personagem.gender}</p>
                <p><strong>Origem:</strong> ${personagem.origin.name}</p>
                <p><strong>Localização Atual:</strong> ${personagem.location.name}</p>
                <h3>Episódios:</h3>
                <ul>
                    ${listaEpisodios}
                </ul>
            </div>
        </div>
    `
}

function fecharModal() {
    const modalContainer = document.getElementById('modal-container')
    modalContainer.classList.remove('show')
}

// Adiciona o listener de evento quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    const formPesquisa = document.querySelector('.caixa-de-pesquisa')
    const inputPesquisa = document.getElementById('pesquisa-personagem')
    const textoCarregando = document.querySelector('.pesquise-o-personagem')
    const modalContainer = document.getElementById('modal-container')
    const modalCloseBtn = document.getElementById('modal-close-btn')
    const secaoPrincipais = document.querySelector('.principais-personagens')
    const containerResultados = document.getElementById('search-results-container')
    const btnLimparBusca = document.getElementById('limpar-busca-btn')
    
    const carregarSecoesPrincipais = async () => {
        const personagensContainer = document.getElementById('personagens-principais-container')

        if (!personagensContainer) return

        textoCarregando.textContent = 'Carregando personagens...'

        // Carrega os personagens 'principais'
        const idsPrincipais = [1, 2, 3, 4, 5] // Rick, Morty, Summer, Beth, Jerry
        const promises = idsPrincipais.map(id => getPersonagemPorId(id))
        const personagens = await Promise.all(promises)

        personagens.forEach(personagem => {
            if (personagem) {
                const card = criarCardPersonagem(personagem)
                personagensContainer.appendChild(card)
            }
        })

        textoCarregando.textContent = '' // Limpa o "Carregando"
    }

    const limparBusca = () => {
        containerResultados.style.display = 'none'
        containerResultados.innerHTML = '' // Limpa o conteúdo para futuras buscas
        btnLimparBusca.style.display = 'none'
        secaoPrincipais.style.display = 'flex'
        textoCarregando.textContent = ''
        inputPesquisa.value = ''
    }

    if (formPesquisa) {
        formPesquisa.addEventListener('submit', async (event) => {
            event.preventDefault() // Impede o recarregamento da página
            const termoBusca = inputPesquisa.value.trim()

            if (!termoBusca) return // Não faz nada se a busca for vazia

            // Esconde as seções principais e mostra um container de resultados
            secaoPrincipais.style.display = 'none'
            containerResultados.innerHTML = '' // Limpa resultados anteriores
            containerResultados.style.display = 'grid' // Mostra o container de resultados
            textoCarregando.textContent = `Buscando por "${termoBusca}"...`

            const resultados = await getPersonagemPorNome(termoBusca)

            if (resultados.error || resultados.length === 0) {
                const msgErro = resultados.error || `Nenhum personagem encontrado com o nome "${termoBusca}".`
                containerResultados.innerHTML = `<p class="error">${msgErro}</p>`
                textoCarregando.textContent = ''
            } else {
                textoCarregando.textContent = '' // Limpa a mensagem de "buscando"
                resultados.forEach(personagem => {
                    containerResultados.appendChild(criarCardPersonagem(personagem))
                })
            }

            // Adiciona e mostra o botão de limpar busca
            containerResultados.prepend(btnLimparBusca)
            btnLimparBusca.style.display = 'block'
        })
    }

    // Listener para fechar o modal
    modalCloseBtn.addEventListener('click', fecharModal)
    modalContainer.addEventListener('click', (event) => {
        // Fecha se clicar no container (fundo), mas não no conteúdo
        if (event.target === modalContainer) {
            fecharModal()
        }
    })

    // Listener para abrir o modal (usando delegação de evento)
    document.body.addEventListener('click', (event) => {
        const personagemCard = event.target.closest('.personagem-card')
        if (personagemCard && personagemCard.dataset.id) {
            abrirModalComPersonagem(personagemCard.dataset.id)
            return
        }
    })

    // Listener para o botão de limpar busca
    btnLimparBusca.addEventListener('click', limparBusca)

    carregarSecoesPrincipais()
})
