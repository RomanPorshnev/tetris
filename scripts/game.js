import {Field} from "./field.js"
import {Figure} from "./figure.js"
import { Display } from "./display.js"

export class Game{
    #field
    #speedMs
    #currentFigure
    #nextFigure
    #startSpeedMs
    #display
    #gameOverShowed
    constructor() {
        this.#gameOverShowed = false
        this.#field = new Field()
        this.#speedMs = 1000
        this.#startSpeedMs = this.#speedMs
        this.#display = new Display()
        this.#nextFigure = new Figure()
    }

    /*
    Данный меод запускает логику игры.
     */
    run(){
        this.#figureAutoPilot()
        this.#controller()
    }

    /*
    Данный метод данный метод управляет игровым циклом, а именно контролирует момент
    приземления фигуры, конца игры, удаления линий на поле, ускорения игры, отображения поля на
    экране и конца игры, а также добавления данных игры пользователя в базу данных.
     */
    #figureAutoPilot() {
        this.#currentFigure = this.#nextFigure
        this.#nextFigure = new Figure()
        this.#field.spawnFigure(this.#currentFigure)
        this.#display.showWindow(this.#field.getField(), this.#field.scores, this.#field.level)
        if(!this.#field.isGameOver()){
            this.#display.showNextFigure(this.#nextFigure)
            const interval = setInterval(() => {
                if (!this.#field.hasFigureLanded()){
                    this.#field.InitDataForMovement(this.#currentFigure, "down")
                }
                else{
                    clearInterval(interval)
                    this.#field.searchForScores()
                    this.#speedMs = Math.floor(this.#startSpeedMs / this.#field.level)
                    this.#figureAutoPilot()
                }
                this.#display.showWindow(this.#field.getField(), this.#field.scores, this.#field.level)
            }, this.#speedMs)
        }
        if((!this.#gameOverShowed) && (this.#field.isGameOver())){
            this.#display.addRecordInTable()
            this.#display.showGameOver()
            this.#display.showRecordTable()
            this.#gameOverShowed = true
        }
    }

    /*
     данный метод отслеживает клавиатуру пользователя и в зависимости от клавиш
     вызывает метод класса Field.InitDataForMovement(figure, command) с определёнными
     значениями переменной command.
     */
    #controller(){
        document.addEventListener('keydown', (event) => {
            if(!this.#field.isGameOver()){
                switch(event.key){
                    case 'w':
                        this.#field.InitDataForMovement(this.#currentFigure, "rotate")
                        this.#display.showField(this.#field.getField())
                        break
                    case 's':
                        this.#field.InitDataForMovement(this.#currentFigure, "down")
                        this.#display.showField(this.#field.getField())
                        break
                    case 'a':
                        this.#field.InitDataForMovement(this.#currentFigure, "left")
                        this.#display.showField(this.#field.getField())
                        break
                    case 'd':
                        this.#field.InitDataForMovement(this.#currentFigure, "right")
                        this.#display.showField(this.#field.getField())
                        break
                    case ' ':
                        this.#field.InitDataForMovement(this.#currentFigure, "drop")
                        this.#display.showField(this.#field.getField())
                        break
                }
            }

        })
    }
}