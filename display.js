export class Display{
    #figureColors = {0: '#e5afaf', 1: '#BF77F6', 2: 'cyan', 3: 'blue', 4: 'orange',
        5: 'yellow', 6: 'green', 7: 'red', 8: 'purple'}
    #canvas
    #ctx
    #fieldHeight
    #fieldWidth
    constructor() {
        this.#fieldHeight = 20
        this.#fieldWidth = 10
        this.#canvas = document.getElementById('game')
        this.#ctx = this.#canvas.getContext('2d')
        this.#ctx.fillStyle = '#e5afaf'
        this.#ctx.fillRect(10, 10, 382, 652)
    }

    show(field){
        this.#ctx.fillStyle = '#BF77F6'
        this.#ctx.fillRect(66, 66, 270, 540)
        for(let y = 0; y < this.#fieldHeight + 2; y++){
            for(let x = 0; x <this.#fieldWidth + 2; x++){
                this.#ctx.fillStyle = this.#figureColors[field[y][x]]
                this.#ctx.fillRect(66 + (x - 1) * 27, 66 + (y - 1) * 27, 26, 26)
            }
        }
    }
}