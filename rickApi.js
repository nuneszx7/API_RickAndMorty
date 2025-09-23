'use strict'



const rickApi = 'https://rickandmortyapi.com/api/character/'





fetch(rickApi)
  .then(response => response.json())
  .then(data => {
    console.log(data)
    // processando os dados
  })
  .catch(error => {
    console.error('Error fetching data:', error)
  })