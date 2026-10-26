class Config {
    constructor() {
        this.canvas_width = 1024
        this.canvas_height = 576
        this.columns = 28
        this.rows = 16
        this.cell_width = this.canvas_width / this.columns
        this.cell_height = this.canvas_height / this.rows
        this.max_columns = 280
        this.max_rows = 160
    }
}

export const config = new Config()