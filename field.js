import {Sound} from "./audio.js";

export class Field {
    #field
    #figureHasLanded
    #fieldHeight
    #fieldWidth
    #gameOver
    scores
    level
    #scoreLevel
    #sound
    constructor() {
        this.#sound = new Sound()
        this.#scoreLevel = 500
        this.#fieldHeight = 20
        this.#fieldWidth = 10
        this.#field = []
        this.scores = 0
        this.level = 1
        for (let i = 0; i < this.#fieldHeight + 2; i++) {
            this.#field[i] = []
            for(let j = 0; j < this.#fieldWidth + 2; j++){
                this.#field[i][j] = 1
            }
        }
        for(let i = 1; i < this.#fieldHeight + 1; i++){
            for(let j = 1; j < this.#fieldWidth + 1; j++){
                this.#field[i][j] = 0
            }
        }
        this.#figureHasLanded = false
        this.#gameOver = false
    }

    isGameOver(){
        return this.#gameOver
    }

    hasFigureLanded(){
        if (this.#figureHasLanded){
            this.#figureHasLanded = false
            return true
        }
        else{
            return false
        }
    }

    #checkInstallOfFigure(startX, startY, endX, endY, figure, shiftX){
        let figureCanBeInserted = true
        for(let y = startY; y < endY; y++){
            if (!figureCanBeInserted)
                break
            for(let x = startX; x < endX; x++)
                if ((this.#field[y][x] !== 0) && (figure.matrix[y - startY][x - startX + shiftX] !== 0)){//!!!!!!! === 1
                    figureCanBeInserted = false
                    break
                }
        }
        return figureCanBeInserted
    }

    #drawFigure(startX, startY, endX, endY, figure, shiftX){
        for(let y = startY; y < endY; y++){
            for(let x = startX; x < endX; x++)
                if (figure.matrix[y - startY][x - startX + shiftX] !== 0){// === 1
                    this.#field[y][x] = figure.matrix[y - startY][x - startX + shiftX]// было равно 1
                }
        }
    }

    spawnFigure(figure){
        const figureCanBeInserted =
            this.#checkInstallOfFigure(figure.x, figure.y,
                figure.x + figure.size, figure.y + figure.size, figure, 0)
        if (figureCanBeInserted){
            this.#drawFigure(figure.x, figure.y, figure.x + figure.size, figure.y + figure.size,
                figure, 0)
        }
        else{
            this.#figureHasLanded = true
            this.#gameOver = true
            this.#sound.gameOver()
        }
    }

    #removeFigure(startX, startY, endX, endY, figure, shiftX){
        for(let y = startY; y < endY; y++)
            for(let x = startX; x < endX; x++)
                if ((this.#field[y][x] !== 0) && (figure.matrix[y - startY][x - startX + shiftX] !== 0)){// === 1
                    this.#field[y][x] = 0
                }
    }

    InitDataForMovement(figure, command){
        if(!this.#figureHasLanded){
            let yBorder = Math.min(figure.y + figure.size, this.#fieldHeight + 2)
            let xBorder = Math.min(figure.x + figure.size, this.#fieldWidth + 2)
            if (figure.x < 0){
                this.#removeFigure(0, figure.y, xBorder, yBorder, figure, -figure.x)
            }
            else{
                this.#removeFigure(figure.x, figure.y, xBorder, yBorder, figure, 0)
            }
            switch (command){
                case "down":
                    this.#shiftFigureDown(figure, xBorder, yBorder)
                    break
                case "left":
                    this.#shiftFigureLeft(figure, xBorder, yBorder)
                    break
                case "right":
                    this.#shiftFigureRight(figure, xBorder, yBorder)
                    break
                case "rotate":
                    this.#figureRotate(figure, xBorder, yBorder)
                    break
                case "drop":
                    this.#figureDrop(figure)
                    break
            }
        }
    }
    #deleteLines(linesToDelete) {
        for (let k = 0; k < linesToDelete.length; k++) {
            for (let y = linesToDelete[k] - 1; y > 0; y--) {
                for (let x = 1; x < this.#fieldWidth + 1; x++) {
                    this.#field[y + 1][x] = this.#field[y][x]
                }
            }
            for (let i = k + 1; i < linesToDelete.length; i++) {
                linesToDelete[i]++
            }
        }
        this.#sound.linesDelete()
    }

    #addScores(linesToDelete){
        switch (linesToDelete.length){
            case 4:
                this.scores += 1500
                break
            case 3:
                this.scores += 700
                break
            case 2:
                this.scores += 300
                break
            case 1:
                this.scores += 100
                break
        }
        this.level = 1 + Math.floor(this.scores / this.#scoreLevel)
    }

    searchForScores(){
        let linesToDelete = []
        let dontNeedToDelete = false
        for(let y = this.#fieldHeight; y > 0; y--){
            dontNeedToDelete = false
            for(let x = 1; x < this.#fieldWidth + 1; x++){
                if(this.#field[y][x] === 0){
                    dontNeedToDelete = true
                }
            }
            if (!dontNeedToDelete){
                linesToDelete.push(y)
            }
        }
        if(linesToDelete.length > 0){
            this.#deleteLines(linesToDelete)
        }
        this.#addScores(linesToDelete)
    }

    #shiftFigureDown(figure, xBorder, yBorder){
        const shiftedY = figure.y + 1
        yBorder = Math.min(shiftedY + figure.size, this.#fieldHeight + 2)
        if (figure.x < 0){
            if (this.#checkInstallOfFigure(0, shiftedY, xBorder, yBorder, figure, -figure.x)){
                this.#drawFigure(0, shiftedY, xBorder, yBorder, figure, -figure.x)
                figure.y += 1
            }
            else{
                yBorder = Math.min(figure.y + figure.size, this.#fieldHeight + 2)
                this.#drawFigure(0, figure.y, xBorder, yBorder, figure, -figure.x)
                this.#sound.land()
                this.#figureHasLanded = true
            }
        }
        else{
            if (this.#checkInstallOfFigure(figure.x, shiftedY, xBorder, yBorder, figure, 0)){
                this.#drawFigure(figure.x, shiftedY, xBorder, yBorder, figure, 0)
                figure.y += 1
            }
            else{
                yBorder = Math.min(figure.y + figure.size, this.#fieldHeight + 2)
                this.#drawFigure(figure.x, figure.y, xBorder, yBorder, figure, 0)
                this.#sound.land()
                this.#figureHasLanded = true
            }
        }
    }

    #shiftFigureLeft(figure, xBorder, yBorder){
        const shiftedX = figure.x - 1
        xBorder = Math.min(shiftedX + figure.size, this.#fieldWidth + 2)
        if (figure.x < 0){
            if (this.#checkInstallOfFigure(0, figure.y, xBorder, yBorder, figure, -shiftedX)){
                this.#drawFigure(0, figure.y, xBorder, yBorder, figure, -shiftedX)
                figure.x -= 1
            }
            else{
                xBorder = Math.min(figure.x + figure.size, this.#fieldWidth + 2)
                this.#drawFigure(0, figure.y, xBorder, yBorder, figure, -figure.x)
            }
        }
        else{
            if (this.#checkInstallOfFigure(shiftedX, figure.y, xBorder, yBorder, figure, 0)){
                this.#drawFigure(shiftedX, figure.y, xBorder, yBorder, figure, 0)
                figure.x -= 1
            }
            else{
                xBorder = Math.min(figure.x + figure.size, this.#fieldWidth + 2)
                this.#drawFigure(figure.x, figure.y, xBorder, yBorder, figure, 0)
            }
        }
    }

    #shiftFigureRight(figure, xBorder, yBorder){
        const shiftedX = figure.x + 1
        xBorder = Math.min(shiftedX + figure.size, this.#fieldWidth + 2)
        if (figure.x < 0){
            if (this.#checkInstallOfFigure(0, figure.y, xBorder, yBorder, figure, -shiftedX)){
                this.#drawFigure(0, figure.y, xBorder, yBorder, figure, -shiftedX)
                figure.x += 1
            }
            else{
                xBorder = Math.min(figure.x + figure.size, this.#fieldWidth + 2)
                this.#drawFigure(0, figure.y, xBorder, yBorder, figure, -figure.x)
            }
        }
        else{
            if (this.#checkInstallOfFigure(shiftedX, figure.y, xBorder, yBorder, figure, 0)){
                this.#drawFigure(shiftedX, figure.y, xBorder, yBorder, figure, 0)
                figure.x += 1
            }
            else{
                xBorder = Math.min(figure.x + figure.size, this.#fieldWidth + 2)
                this.#drawFigure(figure.x, figure.y, xBorder, yBorder, figure, 0)
            }
        }
    }

    #figureRotate(figure, xBorder, yBorder){
        const N = figure.matrix.length - 1
        const oldMatrix = figure.matrix
        figure.matrix = figure.matrix.map((row, i) =>
            row.map((val, j) => figure.matrix[N - j][i])
        )
        if (figure.x < 0){
            if (this.#checkInstallOfFigure(0, figure.y, xBorder, yBorder, figure, -figure.x)){
                this.#drawFigure(0, figure.y, xBorder, yBorder, figure, -figure.x)
            }
            else{
                figure.matrix = oldMatrix
                this.#drawFigure(0, figure.y, xBorder, yBorder, figure, -figure.x)
            }
        }
        else{
            if (this.#checkInstallOfFigure(figure.x, figure.y, xBorder, yBorder, figure, 0)){
                this.#drawFigure(figure.x, figure.y, xBorder, yBorder, figure, 0)
            }
            else{
                figure.matrix = oldMatrix
                this.#drawFigure(figure.x, figure.y, xBorder, yBorder, figure, 0)
            }
        }
    }

    #figureDrop(figure){
        while (!this.#figureHasLanded){
            this.InitDataForMovement(figure, "down")
        }
    }

    getField(){
        return this.#field
    }
}
