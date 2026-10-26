export class Keyboard {
    constructor(context) {
        this.context = context
        this.cameraOffsetX = 0
        this.cameraOffsetY = 0
    }

    cameraHandler(key) {
        const { config } = this.context

        if(key.code == 'ArrowLeft') {
            if(this.cameraOffsetX > 0) {
                this.cameraOffsetX -= 1
            }
        }
        if(key.code == 'ArrowRight') {
            if(this.cameraOffsetX + config.columns < config.max_columns) {
                this.cameraOffsetX += 1
            }
        }
        if(key.code == 'ArrowUp') {
            if(this.cameraOffsetY > 0) {
                this.cameraOffsetY -= 1
            }
        }
        if(key.code == 'ArrowDown') {
            if(this.cameraOffsetY + config.rows < config.max_rows) {
                this.cameraOffsetY += 1
            }
        }
    }

    placeBlockHandler(key) {
        const { config, mouse, world } = this.context

        if(key.code == 'KeyZ') {
            if(mouse.on) {
                var x = Math.floor(mouse.x / config.cell_width) + this.cameraOffsetX
                var y = Math.floor(mouse.y / config.cell_height) + this.cameraOffsetY

                var id = world.encode(x, y)

                if(world.find(id) == -1) {
                    world.push(x, y, 'block', 'black')
                }
            }
        }
    }

    removeBlockHandler(key) {
        const { config, mouse, world } = this.context
        
        if(key.code == 'KeyX') {
            if(mouse.on) {
                var x = Math.floor(mouse.x / config.cell_width) + this.cameraOffsetX
                var y = Math.floor(mouse.y / config.cell_height) + this.cameraOffsetY

                var id = world.find(world.encode(x, y))

                if(id != -1) {
                    world.cells.splice(id, 1)
                }
            }
        }
    }
}