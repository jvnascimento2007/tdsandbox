import { config } from './config.js'
import { World } from './world.js'
import { Mouse } from './mouse.js'
import { Keyboard } from './keyboard.js'

class Game {
    constructor() {
        this.context = {
            config,
            world: null,
            mouse: null,
            keyboard: null
        }

        this.context.world = new World(this.context)
        this.context.mouse = new Mouse(this.context)
        this.context.keyboard = new Keyboard(this.context)

        this.canvasElement = document.getElementById('tdsandbox')
        this.canvasElement.setAttribute('width', config.canvas_width)
        this.canvasElement.setAttribute('height', config.canvas_height)

        this.canvasContext = this.canvasElement.getContext('2d')

        this.bindMouseEventHandlers()
        this.bindKeyboardEventHandlers()
    }

    bindMouseEventHandlers() {
        const { mouse } = this.context
        this.canvasElement.addEventListener('mousemove', mouse.movementHandler.bind(mouse))
        this.canvasElement.addEventListener('mouseover', mouse.overHandler.bind(mouse))
        this.canvasElement.addEventListener('mouseout', mouse.outHandler.bind(mouse))
    }

    bindKeyboardEventHandlers() {
        const { keyboard } = this.context
        window.addEventListener('keydown', keyboard.cameraHandler.bind(keyboard))
        window.addEventListener('keydown', keyboard.placeBlockHandler.bind(keyboard))
        window.addEventListener('keydown', keyboard.removeBlockHandler.bind(keyboard))
    }

    addDescription(description) {
        document.getElementById('page-description').innerText += description
    }

    updateDescription() {
        document.getElementById('page-description').innerText = ''

        const { mouse, keyboard } = this.context

        this.addDescription(`${config.canvas_width}x${config.canvas_height}`)
        this.addDescription(` | OFFSET: (${keyboard.cameraOffsetX}, ${keyboard.cameraOffsetY})`)
        this.addDescription(` | MOUSE: (${mouse.x}, ${mouse.y}) ${mouse.on ? 'Over' : 'Out'}`)
    }

    fillBackground() {
        this.canvasContext.fillStyle = 'rgb(220, 220, 220)'
        this.canvasContext.beginPath()
        this.canvasContext.fillRect(0, 0, config.canvas_width, config.canvas_height)
        this.canvasContext.closePath()
    }

    drawCellsWireframe() {
        this.canvasContext.strokeStyle = 'rgb(200, 200, 200)'

        var num_of_cells = 0

        for(var i = 0; i < config.rows; i++) {
            for(var j = 0; j < config.columns; j++) {
                this.canvasContext.beginPath()
                this.canvasContext.strokeRect(j * config.cell_width, i * config.cell_height, config.cell_width, config.cell_height)
                this.canvasContext.closePath()
                num_of_cells++
            }
        }
    }

    render() {
        const { world, mouse } = this.context

        requestAnimationFrame(this.render.bind(this))

        this.updateDescription()

        this.fillBackground()        
        this.drawCellsWireframe()

        world.render(this.canvasContext)
        mouse.render(this.canvasContext)

        world.sort()
    }
}

const game = new Game()
game.render()