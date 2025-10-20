'use strict'

// Import das funções necessárias do outro arquivo
import { getPersonagemAleatorio, criarCardPersonagem } from './rickApi.js'

document.addEventListener('DOMContentLoaded', () => {
    const portalImg = document.getElementById('portal-img')
    const personagemContainer = document.getElementById('personagem-container')
    const titulo = document.querySelector('h1')
    const voltarBtn = document.getElementById('voltar-btn')
    const botoesAcao = document.getElementById('botoes-acao')
    const textoOriginalTitulo = titulo.textContent

    //resetar para o estado padrão
    const resetarPagina = () => {
        personagemContainer.innerHTML = ''
        titulo.textContent = textoOriginalTitulo
        botoesAcao.classList.add('hidden')
        portalImg.style.display = 'block'
    }

    if (portalImg) {
        portalImg.addEventListener('click', async () => {
            //Limpa o container e mostra mensagem de carregamento
            personagemContainer.innerHTML = ''
            titulo.textContent = 'Viajando entre dimensões...'
            portalImg.style.pointerEvents = 'none' //função que desabilita cliques enquanto carrega
            portalImg.style.display = 'none' // Esconde o portal durante a busca

            try {
                const personagem = await getPersonagemAleatorio()

                if (personagem) {
                    const card = criarCardPersonagem(personagem)
                    // Adiciona o card e o botão de voltar
                    personagemContainer.appendChild(card)
                    titulo.textContent = `Você encontrou: ${personagem.name}!`
                    botoesAcao.classList.remove('hidden') // Mostra os botões de ação
                } else {
                    titulo.textContent = 'Erro ao buscar personagem. Tente novamente.'
                    portalImg.style.display = 'block' // Mostra o portal de novo em caso de erro
                }
            } catch (error) {
                console.error('Falha na operação do portal:', error)
                titulo.textContent = 'O portal parece instável. Tente de novo.'
            } finally {
                portalImg.style.pointerEvents = 'auto' // Reabilita cliques
            }
        })

        // Adiciona o evento de clique para o botão de voltar
        voltarBtn.addEventListener('click', resetarPagina)
    }
})