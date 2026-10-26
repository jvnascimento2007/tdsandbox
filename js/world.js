export class World {
    constructor(context) {
        this.context = context
        this.cells = []
        this.sorted = false
    }

    encode(x, y) {
        const { config } = this.context
        return x * config.max_rows + y
    }

    decode(id) {
        const { config } = this.context
        return [Math.floor(id / config.max_rows), id % config.max_rows]
    }

    sort() {
        if(!this.sorted) {
            this.cells.sort((a, b) => {
                if(a.id < b.id) {
                    return -1
                } else if(a.id > b.id) {
                    return 1
                }
                return 0
            })
            this.sorted = true
        }
    }

    push(x, y, type, color) {
        this.sorted = false
        this.cells.push({
            id: this.encode(x, y),
            type,
            color
        })
    }

    find(id) {
        let start = 0;
        let end = this.cells.length - 1;

        if(!this.sorted) {
            this.sort()
        }

        while (start <= end) {
            let middle = Math.floor((start + end) / 2);

            if (this.cells[middle].id === id) {
                return middle;
            } else if (this.cells[middle].id < id) {
                start = middle + 1;
            } else {
                end = middle - 1;
            }
        }

        return -1;
    }

    render(canvasContext) {
        const { config, world, keyboard } = this.context

        world.cells.forEach((cell) => {
            if(cell.type && cell.type == 'block') {
                const [world_x, world_y] = world.decode(cell.id)

                const x = world_x * config.cell_width - (config.cell_width * keyboard.cameraOffsetX)
                const y = world_y * config.cell_height - (config.cell_height * keyboard.cameraOffsetY)

                canvasContext.fillStyle = cell.color

                canvasContext.beginPath()
                canvasContext.fillRect(x, y, config.cell_width, config.cell_height)
                canvasContext.closePath()
            }
        })
    }
}