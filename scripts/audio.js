export class Sound{
    #move
    #gameOver
    #lineDelete
    constructor() {
        this.#move = new Audio('../sounds/move.mp3')
        this.#gameOver = new Audio('../sounds/gameOver.mp3')
        this.#lineDelete = new Audio('../sounds/lineDelete.mp3')
    }

    land(){
        console.log("log")
        this.#move.play()
    }

    gameOver(){
        this.#gameOver.play()
    }

    linesDelete(){
        this.#lineDelete.play()
    }
}