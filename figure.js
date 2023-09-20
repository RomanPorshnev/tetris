export class Figure{
    x
    y
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
        if (this.size === 2){
            this.x = 5
            this.y = 1
        }
        else if (this.size === 4){
            this.x = 4
            this.y = 0
        }
        else{
            this.x = 4
            this.y = 1
        }
    }
    /*
    Метод возвращает тип фигуры.
    Входные данные: [min, max) - промежуток генерации номера фигуры
    Выходные данные: символьный тип случайной фигуры
     */
    #generateNextFigure(min, max){
        const figureTypeId = Math.floor(Math.random() * (max - min)) + min
        return this.#figureTypes[figureTypeId]
    }
}