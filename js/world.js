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
        let start = 0
        let end = this.cells.length - 1

        if(!this.sorted) {
            this.sort()
        }

        while (start <= end) {
            let middle = Math.floor((start + end) / 2)

            if (this.cells[middle].id === id) {
                return middle
            } else if (this.cells[middle].id < id) {
                start = middle + 1
            } else {
                end = middle - 1
            }
        }

        return -1
    }

    download(filename = '') {
        if(!filename) {
            const ts = new Date().toISOString().slice(0, 19).replace("T", "_").replace(/:/g, "-")
            filename = ts + '.json'
        }

        const json = JSON.stringify(this.cells, null, 2)
        const blob = new Blob([json], { type: "application/json" })
        const url = URL.createObjectURL(blob)

        const a = document.createElement("a")
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        a.remove()

        URL.revokeObjectURL(url)
    }

    async load(file) {
        const text = await file.text()
        const data = JSON.parse(text)

        if(!Array.isArray(data)) {
            throw new Error("O arquivo precisa conter uma lista (array) de objetos.")
        }

        const isObjects = data.every(
            (item) => item !== null && typeof item === "object" && !Array.isArray(item)
        )

        if(!isObjects) {
            throw new Error("Todos os itens da lista devem ser objetos.")
        }

        this.cells = data
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