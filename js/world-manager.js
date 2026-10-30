import { game } from './game.js'

const cenarioDownloadButton = document.getElementById('world-button')

cenarioDownloadButton.addEventListener('click', (e) => {

    const { world } = game.context

    world.download()

})