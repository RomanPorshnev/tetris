export class Figure{
    x
    y
    xInNextFigureWindow
    yInNextFigureWindow
    #figureTypes = ['I', 'O', 'T', 'S', 'Z', 'J', 'L']
    #figureMatrices = {
        'I': [
            [0,0,0,0],
            [2,2,2,2],
            [0,0,0,0],
            [0,0,0,0]
        ],
        'J': [
            [3,0,0],
            [3,3,3],
            [0,0,0],
        ],
        'L': [
            [0,0,4],
            [4,4,4],
            [0,0,0],
        ],
        'O': [
            [5,5],
            [5,5],
        ],
        'S': [
            [0,6,6],
            [6,6,0],
            [0,0,0],
        ],
        'Z': [
            [7,7,0],
            [0,7,7],
            [0,0,0],
        ],
        'T': [
            [0,8,0],
            [8,8,8],
            [0,0,0],
        ]
    }
    #colorsOfFigures = {
        'I': 'cyan',
        'O': 'yellow',
        'T': 'purple',
        'S': 'green',
        'Z': 'red',
        'J': 'blue',
        'L': 'orange'
    }
    type
    matrix
    color
    size
    constructor() {
        this.type = this.#generateNextFigure(0, this.#figureTypes.length)
        this.matrix = this.#figureMatrices[this.type]
        this.color = this.#colorsOfFigures[this.type]
        this.size = this.#figureMatrices[this.type].length
        this.#initCoordinates()
    }

    #initCoordinates(){
        if (this.size === 2){
            this.x = 5
            this.y = 1
            this.xInNextFigureWindow = 2
            this.yInNextFigureWindow = 2
        }
        else if (this.size === 4){
            this.x = 4
            this.y = 0
            this.xInNextFigureWindow = 1
            this.yInNextFigureWindow = 1
        }
        else{
            this.x = 4
            this.y = 1
            this.xInNextFigureWindow = 1
            this.yInNextFigureWindow = 2
        }
    }

    #generateNextFigure(min, max){
        const figureTypeId = Math.floor(Math.random() * (max - min)) + min
        return this.#figureTypes[figureTypeId]
    }
}