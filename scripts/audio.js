export class Sound{
    #move
    #gameOver
    #lineDelete
    constructor() {
        this.#move = new Audio('../sounds/move.mp3')
        this.#gameOver = new Audio('../sounds/gameOver.mp3')
        this.#lineDelete = new Audio('../sounds/lineDelete.mp3')
    }

    /*
    Данный метод воспроизводит звук приземления фигуры.
     */
    land(){
        this.#move.play()
    }

    /*
    Данный метод предназначен для воспроизведения звука конца игры.
     */
    gameOver(){
        this.#gameOver.play()
    }

    /*
    Данный метод воспроизводит звук удаления одной или нескольких линий.
     */
    linesDelete(){
        this.#lineDelete.play()
    }
}