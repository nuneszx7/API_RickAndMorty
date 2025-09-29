'use strict'

const rickApi = 'https://rickandmortyapi.com/api/character/'

/**
 * Busca todos os personagens da API (respeitando a paginação padrão da API).
 */
async function getAllPersonagens() {
    try {
        const response = await fetch(rickApi);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Todos os personagens (primeira página):', data.results);
        return data.results;
    } catch (error) {
        console.error('Erro ao buscar personagens:', error);
    }
}

/**
 * Busca um personagem aleatório da API.
 * @returns {Promise<Object|null>} O objeto do personagem ou null em caso de erro.
 */
async function getPersonagemAleatorio() {
    try {
        // 1. Descobrir quantos personagens existem
        const responseInfo = await fetch(rickApi);
        if (!responseInfo.ok) {
            throw new Error(`HTTP error! status: ${responseInfo.status}`);
        }
        const dataInfo = await responseInfo.json();
        const totalDePersonagens = dataInfo.info.count;

        // 2. Gerar um ID aleatório
        const randomId = Math.floor(Math.random() * totalDePersonagens) + 1;

        // 3. Buscar o personagem com o ID aleatório
        const responsePersonagem = await fetch(`${rickApi}${randomId}`);
        if (!responsePersonagem.ok) {
            throw new Error(`HTTP error! status: ${responsePersonagem.status}`);
        }
        const personagem = await responsePersonagem.json();
        
        console.log('Personagem Aleatório:', personagem);
        return personagem;
    } catch (error) {
        console.error('Erro ao buscar personagem aleatório:', error);
        return null;
    }
}

// Exemplo de como chamar a função quando o script carregar
getPersonagemAleatorio();
