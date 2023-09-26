export class Display{
    #figureColors = {'E': '#e5afaf', 'B': '#BF77F6', 'I': 'cyan', 'J': 'blue', 'L': 'orange',
        'O': 'yellow', 'S': 'green', 'Z': 'red', 'T': 'purple'}
    #figureIdAndType = {0: 'E', 1: 'B', 2: 'I', 3: 'J', 4: 'L', 5: 'O', 6: 'S', 7: 'Z', 8: 'T'}
    #canvasField
    #canvasNextFigure
    #ctxField
    #ctxNextFigure
    #fieldHeight
    #fieldWidth
    #score
    #level
    #nextFigureField
    #nextFigureFieldSize
    #userInfo = {
        score: 0,
        name: ""
    }
    #recordsTable
    #maxNumberOfBestRecords
    constructor() {
        this.#maxNumberOfBestRecords = 10
        this.#recordsTable = []
        this.#nextFigureFieldSize = 4
        this.#initNextFigureField()
        this.#score = 0
        this.#level = 1
        let playerNameElement = document.getElementById("playerName")
        playerNameElement.textContent = localStorage["tetris.username"]
        this.#fieldHeight = 20
        this.#fieldWidth = 10
        this.#canvasField = document.getElementById('game')
        this.#ctxField = this.#canvasField.getContext('2d')
        this.#canvasNextFigure = document.getElementById('nextFigureWindow')
        this.#ctxNextFigure = this.#canvasNextFigure.getContext('2d')
        this.#ctxField.fillStyle = '#e5afaf'
        this.#ctxField.fillRect(10, 10, 382, 652)
    }

    /*
    Данный метод предназначен для инициализации матрицы,
    в которой будет отображаться следующая фигура.
     */
    #initNextFigureField(){
        this.#nextFigureField = []
        for (let i = 0; i < this.#nextFigureFieldSize + 2; i++) {
            this.#nextFigureField[i] = []
            for(let j = 0; j < this.#nextFigureFieldSize + 2; j++){
                this.#nextFigureField[i][j] = 1
            }
        }
        for(let i = 1; i < this.#nextFigureFieldSize + 1; i++){
            for(let j = 1; j < this.#nextFigureFieldSize + 1; j++){
                this.#nextFigureField[i][j] = 0
            }
        }
    }

    /*
    Данный метод получает на вход поле field и на основе данной
    матрицы рисует игровое поле на холсте в непосредственно в браузере.
    Входные данные: объект класса текущей фигуры Figure.
     */
    showField(field){
        this.#ctxField.fillStyle = '#BF77F6'
        this.#ctxField.fillRect(66, 66, 270, 540)
        for(let y = 0; y < this.#fieldHeight + 2; y++){
            for(let x = 0; x <this.#fieldWidth + 2; x++){
                let figureType = this.#figureIdAndType[field[y][x]]
                this.#ctxField.fillStyle = this.#figureColors[figureType]
                this.#ctxField.fillRect(66 + (x - 1) * 27, 66 + (y - 1) * 27, 26, 26)
            }
        }
    }

    /*
    Данный метод принимает на вход матрицу field, количество очков и
    уровень пользователя; его назначение – обновить данные об очках и уровне игрока и нарисовать игровое поле
    на холсте на основе поданной на вход матрицы.
    Входные данные: матрица поля, кол-во очков и уровень.
     */
    showWindow(field, score, level){
        this.#score = score
        this.#level = level
        let scoreElement = document.getElementById("score")
        scoreElement.textContent = this.#score
        let levelElement = document.getElementById("level")
        levelElement.textContent = this.#level
        this.showField(field)
    }

    /*
    Данный метод принимает на вход объект класса Figure и предназначен для заполнения матрицы следующей фигуры,
    которая отображается в специальном окошке.
    Входные данные: объект класса Figure.
     */
    #insertNextFigureInNextFigureField(figure){
        for(let y = figure.yInNextFigureWindow; y < figure.yInNextFigureWindow + figure.matrix.length; y++){
            for(let x = figure.xInNextFigureWindow; x < figure.xInNextFigureWindow + figure.matrix.length; x++){
                this.#nextFigureField[y][x] = figure.matrix[y - figure.yInNextFigureWindow]
                    [x - figure.xInNextFigureWindow]
            }
        }
    }

    /*
    Данный метод предназначен для очистки матрицы,
    в которой хранится информация о прототипе следующей фигуры.
     */
    #clearNextFigureField(){
        for(let y = 1; y < this.#nextFigureFieldSize + 1; y++){
            for(let x = 1; x < this.#nextFigureFieldSize + 1; x++){
                this.#nextFigureField[y][x] = 0
            }
        }
    }

    /*
    Данный метод принимает на вход объект класса Figure и предназначен для отображения на холсте следующей фигуры.
    Входные данные: объект класса Figure.
     */
    showNextFigure(figure){
        this.#clearNextFigureField()
        this.#insertNextFigureInNextFigureField(figure)
        this.#ctxNextFigure.fillStyle = '#e5afaf'
        this.#ctxNextFigure.fillRect(0, 0, 162, 162)
        this.#ctxNextFigure.fillStyle = '#BF77F6'
        this.#ctxNextFigure.fillRect(27, 27, 108, 108)
        for(let y = 0; y < this.#nextFigureFieldSize + 2; y++){
            for(let x = 0; x < this.#nextFigureFieldSize + 2; x++){
                let figureType = this.#figureIdAndType[this.#nextFigureField[y][x]]
                this.#ctxNextFigure.fillStyle = this.#figureColors[figureType]
                this.#ctxNextFigure.fillRect(x * 27,  y * 27, 26, 26)
            }
        }
    }

    /*
    Данный метод отображает информацию о том, что игра окончена.
     */
    showGameOver(){
        this.#canvasField.style.opacity = "0.25"
        document.getElementById("gameOver").style.opacity = "1"
    }

    /*
    Данный метод предназначен для добавления игрового результата текущего игрока в список результатов.
     */
    addRecordInTable(){
        if (localStorage["recordsTable"] !== undefined){
            this.#recordsTable = JSON.parse(localStorage["recordsTable"])
        }
        this.#userInfo.name = localStorage["tetris.username"]
        this.#userInfo.score = this.#score
        this.#recordsTable.push(this.#userInfo)
        this.#recordsTable.sort((firstRecord, secondRecord) => secondRecord.score - firstRecord.score)
        localStorage["recordsTable"] = JSON.stringify(this.#recordsTable)
    }

    /*
    Данный метод предназначен для отображения таблицы рекордов.
     */
    showRecordTable(){
        let promise = new Promise((resolve) => {
            setTimeout(() => {
                this.#canvasField.style.opacity = "0"
                document.getElementById("gameOver").style.opacity = "0"
                setTimeout(() => {
                    resolve()
                }, 2000)
            }, 2000)
        })
        promise.then(() => {
            const recordsTable = document.getElementById("recordTable")
            recordsTable.style.opacity = "1"
            let bestNonRepeatingPlayers = []
            for(let i = 0; i < Math.min(this.#recordsTable.length, this.#maxNumberOfBestRecords); i++){
                const record = document.createElement("p")
                record.style.fontSize = "27px"
                const place = i + 1
                if (!bestNonRepeatingPlayers.includes(this.#recordsTable[i].name)){
                    record.innerHTML = place.toString() + '. ' + this.#recordsTable[i].name + ' ' +
                        this.#recordsTable[i].score.toString()
                    recordsTable.appendChild(record)
                    bestNonRepeatingPlayers.push(this.#recordsTable[i].name)
                }
            }
        })
    }
}