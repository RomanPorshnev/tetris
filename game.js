import {Field} from "./field.js"
import {Figure} from "./figure.js"
import { Display } from "./display.js"

export class Game{
    #field
    #speedMs
    #figure
    #startSpeedMs
    #display
    constructor() {
        this.#field = new Field()
        this.#speedMs = 1000
        this.#startSpeedMs = this.#speedMs
        this.#display = new Display()
    }

    run(){
        this.#figureAutoPilot()
        this.#controller()
    }


    #figureAutoPilot() {
        if (!this.#field.isGameOver()){
            this.#figure = new Figure()
            this.#field.spawnFigure(this.#figure)
            this.#display.show(this.#field.getField())
            const interval = setInterval(() => {
                if (!this.#field.hasFigureLanded()){
                    this.#field.InitDataForMovement(this.#figure, "down")
                }
                else{
                    clearInterval(interval)
                    this.#field.searchForPoints()
                    this.#speedMs = Math.floor(this.#startSpeedMs / (this.#field.level + 1))
                    this.#figureAutoPilot()
                }
                this.#display.show(this.#field.getField())
            }, this.#speedMs)
        }
    }

    #controller(){
        document.addEventListener('keydown', (event) => {
            if(!this.#field.isGameOver()){
                switch(event.key){
                    case 'w':
                        this.#field.InitDataForMovement(this.#figure, "rotate")
                        this.#display.show(this.#field.getField())
                        break
                    case 's':
                        this.#field.InitDataForMovement(this.#figure, "down")
                        this.#display.show(this.#field.getField())
                        break
                    case 'a':
                        this.#field.InitDataForMovement(this.#figure, "left")
                        this.#display.show(this.#field.getField())
                        break
                    case 'd':
                        this.#field.InitDataForMovement(this.#figure, "right")
                        this.#display.show(this.#field.getField())
                        break
                    case ' ':
                        this.#field.InitDataForMovement(this.#figure, "drop")
                        this.#display.show(this.#field.getField())
                        break
                }
            }

        })
    }
}