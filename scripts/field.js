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
        this.#scoreLevel = 200
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

    /*
    Данный метод возвращает информацию о факте окончания игры.
     */
    isGameOver(){
        return this.#gameOver
    }

    /*
    Данный метод возвращает информацию о факте приземелния фигуры.
     */
    hasFigureLanded(){
        if (this.#figureHasLanded){
            this.#figureHasLanded = false
            return true
        }
        else{
            return false
        }
    }

    /*
    Данный метод на вход получает координаты поля, начиная с которых нужно проверить возможность
    постановки фигуры, матрицу фигуры figureMatrix, а также смещение shiftX, которое нужно для
    корректной проверки на возможность установки фигуры в данной области в том случае, если левый верхний
    угол фигуры находится за границами поля; выходными данными является ответ на вопрос о факте возможности
    размещения фигуры в данной области
    Входные данные: область на карте, матрица текущей фигуры, смещение.
    Выходные данные: возможно ли вставить фигуру.
     */
    #checkInstallOfFigure(startX, startY, endX, endY, figureMatrix, shiftX){
        let figureCanBeInserted = true
        for(let y = startY; y < endY; y++){
            if (!figureCanBeInserted)
                break
            for(let x = startX; x < endX; x++)
                if ((this.#field[y][x] !== 0) && (figureMatrix[y - startY][x - startX + shiftX] !== 0)){
                    figureCanBeInserted = false
                    break
                }
        }
        return figureCanBeInserted
    }

    /*
     данный метод на вход получает область в виде координат, которую нужно закрасить,
     матрицу фигуры figureMatrix и смещение shiftX, которое выполняет ту же роль,
     что и в методе #checkInstallOfFigure(startX, startY, endX, endY, figureMatrix, shiftX).
     Входные данные: область на карте, матрица текущей фигуры, смещение.
     */
    #drawFigure(startX, startY, endX, endY, figureMatrix, shiftX){
        for(let y = startY; y < endY; y++){
            for(let x = startX; x < endX; x++)
                if (figureMatrix[y - startY][x - startX + shiftX] !== 0){
                    this.#field[y][x] = figureMatrix[y - startY][x - startX + shiftX]
                }
        }
    }

    /*
    Данный метод получает на вход фигуру figure, проверяет возможность появления новой фигуры
    и в случае одобрения новая фигура появляется на карте; в ином случае объявляется окончание игры.
    Входные данные: объект класса текущей фигуры Figure.
     */
    spawnFigure(figure){
        const figureCanBeInserted =
            this.#checkInstallOfFigure(figure.x, figure.y,
                figure.x + figure.size, figure.y + figure.size, figure.matrix, 0)
        if (figureCanBeInserted){
            this.#drawFigure(figure.x, figure.y, figure.x + figure.size, figure.y + figure.size,
                figure.matrix, 0)
        }
        else{
            this.#gameOver = true
            this.#sound.gameOver()
        }
    }

    /*
    Данный метод принимает на вход координаты области, в которой нужно стереть фигуру, что нужно в том случае,
    когда фигура пытается поменять своё положение карте, а для этого нужно стереть старые координаты и
    попытаться установить новые; также данный метод принимает на вход матрицу фигуры figureMatrix и смещение shiftX,
    которое выполняет ту же роль, что и в методе #checkInstallOfFigure(startX, startY, endX, endY, figureMatrix, shiftX).
    Входные данные: область на карте, матрица текущей фигуры, смещение.
     */
    #removeFigure(startX, startY, endX, endY, figureMatrix, shiftX){
        for(let y = startY; y < endY; y++)
            for(let x = startX; x < endX; x++)
                if ((this.#field[y][x] !== 0) && (figureMatrix[y - startY][x - startX + shiftX] !== 0)){
                    this.#field[y][x] = 0
                }
    }

    /*
    данный метод принимает на вход фигуру figure и команду command, которую нужно выполнить фигуре,
    а в зависимости от значения command вызываются определённые методы,
    отвечающие за движения фигуры на карте, и стирается текущая фигура с карты.
    Входные данные: объект класса текущей фигуры Figure, команда.
     */
    InitDataForMovement(figure, command){
        if(!this.#figureHasLanded){
            let yBorder = Math.min(figure.y + figure.size, this.#fieldHeight + 2)
            let xBorder = Math.min(figure.x + figure.size, this.#fieldWidth + 2)
            if (figure.x < 0){
                this.#removeFigure(0, figure.y, xBorder, yBorder, figure.matrix, -figure.x)
            }
            else{
                this.#removeFigure(figure.x, figure.y, xBorder, yBorder, figure.matrix, 0)
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

    /*
    Данный метод удаляет заполненные строки на карте, индексы которых хранятся во входном массиве linesToDelete.
    Входные данные: массив индексов строк, которые нужно удалить.
     */
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

    /*
    Данный метод принимает на вход количество линий,
    которое нужно удалить, и в соответствии с их количеством добавляет
    фиксированное количество очков.
    Входные данные: количество линиий.
     */
    #addScores(numberOfLines){
        switch (numberOfLines){
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

    /*
    Данный метод ищет индексы заполненный линий на карте.
     */
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
        this.#addScores(linesToDelete.length)
    }

    /*
    Данный метод принимает на вход объект класса Figure и первоначальные границы работы метода по осям
    xBorder и yBorder; его назначение – попытка сдвинуть фигуру на карте на 1 клетку вниз,
    что осуществляется за счёт проверки на сдвиг с помощью метода
    #checkInstallOfFigure(startX, startY, endX, endY, figureMatrix, shiftX) и независимо от результата
    проверки вызывается метод #drawFigure(startX, startY, endX, endY, figureMatrix, shiftX) для рисования фигуры,
    но с разными аргументами в случае успешного прохождения проверки и неуспешной
    (в случае неуспеха на карте рисуется фигура в тех координатах, где она была ранее).
    Входные данные: объект класса фигуры Figure, границы работы метода осям Ox и Oy.
     */
    #shiftFigureDown(figure, xBorder, yBorder){
        const shiftedY = figure.y + 1
        yBorder = Math.min(shiftedY + figure.size, this.#fieldHeight + 2)
        if (figure.x < 0){
            if (this.#checkInstallOfFigure(0, shiftedY, xBorder, yBorder, figure.matrix, -figure.x)){
                this.#drawFigure(0, shiftedY, xBorder, yBorder, figure.matrix, -figure.x)
                figure.y += 1
            }
            else{
                yBorder = Math.min(figure.y + figure.size, this.#fieldHeight + 2)
                this.#drawFigure(0, figure.y, xBorder, yBorder, figure.matrix, -figure.x)
                this.#sound.land()
                this.#figureHasLanded = true
            }
        }
        else{
            if (this.#checkInstallOfFigure(figure.x, shiftedY, xBorder, yBorder, figure.matrix, 0)){
                this.#drawFigure(figure.x, shiftedY, xBorder, yBorder, figure.matrix, 0)
                figure.y += 1
            }
            else{
                yBorder = Math.min(figure.y + figure.size, this.#fieldHeight + 2)
                this.#drawFigure(figure.x, figure.y, xBorder, yBorder, figure.matrix, 0)
                this.#sound.land()
                this.#figureHasLanded = true
            }
        }
    }

    /*
    Данный метод отличается от предыдущего лишь тем, что фигура сдвигается на 1 клетку влево.
    Входные данные: объект класса фигуры Figure, границы работы метода осям Ox и Oy.
     */
    #shiftFigureLeft(figure, xBorder, yBorder){
        const shiftedX = figure.x - 1
        xBorder = Math.min(shiftedX + figure.size, this.#fieldWidth + 2)
        if (figure.x < 0){
            if (this.#checkInstallOfFigure(0, figure.y, xBorder, yBorder, figure.matrix, -shiftedX)){
                this.#drawFigure(0, figure.y, xBorder, yBorder, figure.matrix, -shiftedX)
                figure.x -= 1
            }
            else{
                xBorder = Math.min(figure.x + figure.size, this.#fieldWidth + 2)
                this.#drawFigure(0, figure.y, xBorder, yBorder, figure.matrix, -figure.x)
            }
        }
        else{
            if (this.#checkInstallOfFigure(shiftedX, figure.y, xBorder, yBorder, figure.matrix, 0)){
                this.#drawFigure(shiftedX, figure.y, xBorder, yBorder, figure.matrix, 0)
                figure.x -= 1
            }
            else{
                xBorder = Math.min(figure.x + figure.size, this.#fieldWidth + 2)
                this.#drawFigure(figure.x, figure.y, xBorder, yBorder, figure.matrix, 0)
            }
        }
    }

    /*
    Данный метод отличается от предыдущего лишь тем, что фигура сдвигается на 1 клетку вправо.
    Входные данные: объект класса фигуры Figure, границы работы метода осям Ox и Oy.
     */
    #shiftFigureRight(figure, xBorder, yBorder){
        const shiftedX = figure.x + 1
        xBorder = Math.min(shiftedX + figure.size, this.#fieldWidth + 2)
        if (figure.x < 0){
            if (this.#checkInstallOfFigure(0, figure.y, xBorder, yBorder, figure.matrix, -shiftedX)){
                this.#drawFigure(0, figure.y, xBorder, yBorder, figure.matrix, -shiftedX)
                figure.x += 1
            }
            else{
                xBorder = Math.min(figure.x + figure.size, this.#fieldWidth + 2)
                this.#drawFigure(0, figure.y, xBorder, yBorder, figure.matrix, -figure.x)
            }
        }
        else{
            if (this.#checkInstallOfFigure(shiftedX, figure.y, xBorder, yBorder, figure.matrix, 0)){
                this.#drawFigure(shiftedX, figure.y, xBorder, yBorder, figure.matrix, 0)
                figure.x += 1
            }
            else{
                xBorder = Math.min(figure.x + figure.size, this.#fieldWidth + 2)
                this.#drawFigure(figure.x, figure.y, xBorder, yBorder, figure.matrix, 0)
            }
        }
    }

    /*
    Данный метод принимает на вход объект класса Figure и первоначальные границы работы метода по осям
    xBorder и yBorder; его назначение – попытка повернуть фигуру на 90 градусов по часовой стрелке
    с помощью метода #checkInstallOfFigure(startX, startY, endX, endY, figureMatrix, shiftX)
    и независимо от результата проверки вызывается метод
    #drawFigure(startX, startY, endX, endY, figureMatrix, shiftX) для рисования фигуры, но с разными
    аргументами в случае успешного прохождения проверки и неуспешной
    (в случае неуспеха на карте рисуется фигура в том же виде, в котором была ранее).
    Входные данные: объект класса текущей фигуры Figure, границы работы метода по осям Ox и Oy.
     */
    #figureRotate(figure, xBorder, yBorder){
        const N = figure.matrix.length - 1
        const oldMatrix = figure.matrix
        figure.matrix = figure.matrix.map((row, i) =>
            row.map((val, j) => figure.matrix[N - j][i])
        )
        if (figure.x < 0){
            if (this.#checkInstallOfFigure(0, figure.y, xBorder, yBorder, figure.matrix, -figure.x)){
                this.#drawFigure(0, figure.y, xBorder, yBorder, figure.matrix, -figure.x)
            }
            else{
                figure.matrix = oldMatrix
                this.#drawFigure(0, figure.y, xBorder, yBorder, figure.matrix, -figure.x)
            }
        }
        else{
            if (this.#checkInstallOfFigure(figure.x, figure.y, xBorder, yBorder, figure.matrix, 0)){
                this.#drawFigure(figure.x, figure.y, xBorder, yBorder, figure.matrix, 0)
            }
            else{
                figure.matrix = oldMatrix
                this.#drawFigure(figure.x, figure.y, xBorder, yBorder, figure.matrix, 0)
            }
        }
    }

    /*
    Данный метод принимает на вход объект класса Figure и
    его назначение – это сбросить фигуру вниз,
    что осуществляется за счёт циклического вызова
    метода сдвига фигуры вниз на 1 клетку.
    Входные данные: объект класса текущей фигуры Figure.
     */
    #figureDrop(figure){
        while (!this.#figureHasLanded){
            this.InitDataForMovement(figure, "down")
        }
    }

    /*
    Выходные данные: игровое поле в виде матрицы
     */
    getField(){
        return this.#field
    }
}