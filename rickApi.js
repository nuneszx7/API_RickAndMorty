'use strict'

// const rickApi = 'https://rickandmortyapi.com/api/character/'
// import { ApiResponse, Character, CharacterFilter, Info } from '../rickmortyapi/dist/character';

import { getCharacter } from './node_modules/rickmortyapi'

const rickApi = 'https://rickandmortyapi.com/api/character/'




const MESSAGE_ERRO = { status: false, status_code: 500, development: 'João Pedro Teodoro Nunes Correia' }



function getAllPersonagens(){
fetch(rickApi)
  .then(response => response.json())
  .then(data => {
    console.log(data)
    // processando os dados
  })
  .catch(MESSAGE_ERRO => {
    console.error('Error fetching data:', MESSAGE_ERRO)
  })

}

console.log(getAllPersonagens)


async function getPersonagemAleatorio() {

    const response = await fetch(rickApi);
    const data = await response.json();
    return data.info.count
  
}

function getPersonagemById (totalDePersonagens){

  return Math.floor(math.random() * totalDePersonagens) + 1

}





//   module.exports = getPersonagemAleatorio
