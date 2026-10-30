import { game } from './game.js'

const worldDownloadButton = document.getElementById('world-download')

worldDownloadButton.addEventListener('click', (e) => {

    const { world } = game.context

    world.download()

})

const worldLoadButton = document.getElementById('world-load')

worldLoadButton.addEventListener('change', async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const { world } = game.context

    try {
        await world.load(file)
    } catch (err) {
        if (err instanceof SyntaxError) {
            alert("Arquivo JSON inválido.")
        } else {
            alert(err.message)
        }
    } finally {
        e.target.value = ""
    }
})