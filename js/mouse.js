export class Mouse {
    constructor(context) {
        this.context = context
        this.x = 0
        this.y = 0
        this.on = false
    }

    movementHandler(event) {
        this.x = event.offsetX
        this.y = event.offsetY
    }

    overHandler() {
        this.on = true
    }

    outHandler() {
        this.on = false
    }

    render(canvasContext) {
        const { config } = this.context

        if(this.on) {
            var x = Math.floor(this.x / config.cell_width) * config.cell_width
            var y = Math.floor(this.y / config.cell_height) * config.cell_height

            canvasContext.strokeStyle = 'rgb(0, 255, 255)'
            canvasContext.lineWidth = '2'

            canvasContext.beginPath()
            canvasContext.strokeRect(x, y, config.cell_width, config.cell_height)
            canvasContext.closePath()
        }
    }
}