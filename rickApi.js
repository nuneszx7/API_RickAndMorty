'use strict'

const rickApi = 'https://rickandmortyapi.com/api/character/'
import { ApiResponse, Character, CharacterFilter, Info } from '../interfaces';




fetch(rickApi)
  .then(response => response.json())
  .then(data => {
    console.log(data)
    // processando os dados
  })
  .catch(error => {
    console.error('Error fetching data:', error)
  })

async function getPersonagemAleatorio() {

  try{
    const response = await fetch(rickApi);
    const data = await response.json();

    if 
  }
  
}

  module.exports = getAleatorio