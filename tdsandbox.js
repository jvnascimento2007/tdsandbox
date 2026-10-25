/** CONFIGURATION */

const CANVAS_WIDTH = 1024
const CANVAS_HEIGHT = 576

const COLUMNS = 28
const ROWS = 16

const CELL_WIDTH = CANVAS_WIDTH / COLUMNS
const CELL_HEIGHT = CANVAS_HEIGHT / ROWS

const MAX_WORLD_X = 280
const MAX_WORLD_Y = 160

/**
 * codificação lexicográfica
 * id = x * MAX_WORLD_Y + y
 * x = Math.floor(id / MAX_WORLD_Y)
 * y = id % MAX_WORLD_Y
 */

function encodeID(x, y) {
    return x * MAX_WORLD_Y + y
}

function decodeID(id) {
    return [Math.floor(id / MAX_WORLD_Y), id % MAX_WORLD_Y]
}

var worldData = []

worldDataSorted = false

function sortWorldData() {
    worldData.sort((a, b) => {
        if(a.id < b.id) {
            return -1
        } else if(a.id > b.id) {
            return 1
        }
        return 0
    })
    worldDataSorted = true
}

sortWorldData()

function pushWorldData(x, y, type, color) {
    worldDataSorted = false
    worldData.push({id: encodeID(x, y), type, color})
}

function findWorldData(id) {
    let start = 0;
    let end = worldData.length - 1;

    if(!worldDataSorted) {
        sortWorldData()
    }

    while (start <= end) {
        let middle = Math.floor((start + end) / 2);

        if (worldData[middle].id === id) {
            return middle;
        } else if (worldData[middle].id < id) {
            start = middle + 1;
        } else {
            end = middle - 1;
        }
    }

    return -1;
}

var offsetX = 0
var offsetY = 0

var mouseX = 0
var mouseY = 0

var mouseOn = false

function addDescription(description) {
    document.getElementById('page-description').innerText += description
}

function updateDescription() {

    document.getElementById('page-description').innerText = ''

    addDescription(`${CANVAS_WIDTH}x${CANVAS_HEIGHT}`)
    addDescription(` | OFFSET: (${offsetX}, ${offsetY})`)
    addDescription(` | MOUSE: (${mouseX}, ${mouseY}) ${mouseOn ? 'Over' : 'Out'}`)

}

function setupCtx() {
    var canvas = document.getElementById('tdsandbox')
    
    canvas.setAttribute('width', CANVAS_WIDTH)
    canvas.setAttribute('height', CANVAS_HEIGHT)

    canvas.addEventListener('mousemove', (e) => {
        mouseX = e.offsetX
        mouseY = e.offsetY
    })

    canvas.addEventListener('mouseover', (e) => {mouseOn = true})
    canvas.addEventListener('mouseout', (e) => {mouseOn = false})

    updateDescription()
    
    var ctx = canvas.getContext('2d')

    window.addEventListener('keydown', (e) => {
        if(e.code == 'ArrowLeft') {
            if(offsetX > 0) {
                offsetX -= 1
            }
        }
        if(e.code == 'ArrowRight') {
            if(offsetX + COLUMNS < MAX_WORLD_X) {
                offsetX += 1
            }
        }
        if(e.code == 'ArrowUp') {
            if(offsetY > 0) {
                offsetY -= 1
            }
        }
        if(e.code == 'ArrowDown') {
            if(offsetY + ROWS < MAX_WORLD_Y) {
                offsetY += 1
            }
        }
        if(e.code == 'KeyZ') {
            if(mouseOn) {
                var x = Math.floor(mouseX / CELL_WIDTH) + offsetX
                var y = Math.floor(mouseY / CELL_HEIGHT) + offsetY

                id = encodeID(x, y)

                if(findWorldData(id) == -1) {
                    pushWorldData(x, y, 'block', 'black')
                    console.log([...worldData])
                }

            }
        }
        if(e.code == 'KeyX') {
            if(mouseOn) {
                var x = Math.floor(mouseX / CELL_WIDTH) + offsetX
                var y = Math.floor(mouseY / CELL_HEIGHT) + offsetY

                id = findWorldData(encodeID(x, y))
                if(id != -1) {
                    worldData.splice(id, 1)
                    console.log([...worldData])
                }
            }
        }
    })
    
    return ctx
}

const ctx = setupCtx()

function drawWorld() {
    requestAnimationFrame(drawWorld)

    updateDescription()

    ctx.beginPath()

    /** FILL BACKGROUND */

    ctx.fillStyle = 'rgb(220, 220, 220)'

    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    /** DRAW CELLS */
    
    ctx.strokeStyle = 'rgb(200, 200, 200)'

    var num_of_cells = 0

    for(var i = 0; i < ROWS; i++) {
        for(var j = 0; j < COLUMNS; j++) {
            ctx.strokeRect(j * CELL_WIDTH, i * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT)
            num_of_cells++
        }
    }

    /** DRAW WORLD DATA */

    worldData.forEach((e) => {
        if(e.type && e.type == 'block') {
            ctx.fillStyle = e.color

            const [world_x, world_y] = decodeID(e.id)

            const x = world_x * CELL_WIDTH - (CELL_WIDTH * offsetX)
            const y = world_y * CELL_HEIGHT - (CELL_HEIGHT * offsetY)

            ctx.fillRect(x, y, CELL_WIDTH, CELL_HEIGHT)
        }
    })

    /** DRAW MOUSE POINTING */

    if(mouseOn) {
        ctx.strokeStyle = 'rgb(0, 255, 255)'
        ctx.lineWidth = '2'

        var x = Math.floor(mouseX / CELL_WIDTH) * CELL_WIDTH
        var y = Math.floor(mouseY / CELL_HEIGHT) * CELL_HEIGHT

        ctx.strokeRect(x, y, CELL_WIDTH, CELL_HEIGHT)
    }

    if(!worldDataSorted) {
        sortWorldData()
    }
}

drawWorld()
