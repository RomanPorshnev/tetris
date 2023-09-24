export class Display{
    #figureColors = {0: '#e5afaf', 1: '#BF77F6', 2: 'cyan', 3: 'blue', 4: 'orange',
        5: 'yellow', 6: 'green', 7: 'red', 8: 'purple'}
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
        console.log(this.#nextFigureField.length)
    }

    showField(field){
        this.#ctxField.fillStyle = '#BF77F6'
        this.#ctxField.fillRect(66, 66, 270, 540)
        for(let y = 0; y < this.#fieldHeight + 2; y++){
            for(let x = 0; x <this.#fieldWidth + 2; x++){
                this.#ctxField.fillStyle = this.#figureColors[field[y][x]]
                this.#ctxField.fillRect(66 + (x - 1) * 27, 66 + (y - 1) * 27, 26, 26)
            }
        }
    }

    showWindow(field, score, level){
        this.#score = score
        this.#level = level
        let scoreElement = document.getElementById("score")
        scoreElement.textContent = this.#score
        let levelElement = document.getElementById("level")
        levelElement.textContent = this.#level
        this.showField(field)
    }

    #insertNextFigureInNextFigureField(figure){
        for(let y = figure.yInNextFigureWindow; y < figure.yInNextFigureWindow + figure.matrix.length; y++){
            for(let x = figure.xInNextFigureWindow; x < figure.xInNextFigureWindow + figure.matrix.length; x++){
                this.#nextFigureField[y][x] = figure.matrix[y - figure.yInNextFigureWindow]
                    [x - figure.xInNextFigureWindow]
            }
        }
    }

    #clearNextFigureField(){
        for(let y = 1; y < this.#nextFigureFieldSize + 1; y++){
            for(let x = 1; x < this.#nextFigureFieldSize + 1; x++){
                this.#nextFigureField[y][x] = 0
            }
        }
    }

    showNextFigure(figure){
        this.#clearNextFigureField()
        this.#insertNextFigureInNextFigureField(figure)
        this.#ctxNextFigure.fillStyle = '#e5afaf'
        this.#ctxNextFigure.fillRect(0, 0, 162, 162)
        this.#ctxNextFigure.fillStyle = '#BF77F6'
        this.#ctxNextFigure.fillRect(27, 27, 108, 108)
        for(let y = 0; y < this.#nextFigureFieldSize + 2; y++){
            for(let x = 0; x < this.#nextFigureFieldSize + 2; x++){
                this.#ctxNextFigure.fillStyle = this.#figureColors[this.#nextFigureField[y][x]]
                this.#ctxNextFigure.fillRect(x * 27,  y * 27, 26, 26)
            }
        }
    }

    showGameOver(){
        this.#canvasField.style.opacity = "0.25"
        document.getElementById("gameOver").style.opacity = "1"
    }

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
