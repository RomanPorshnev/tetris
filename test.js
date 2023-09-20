const figureMatrices = {
    'I': [
        [0,0,0,0],
        [1,1,1,1],
        [0,0,0,0],
        [0,0,0,0]
    ]
}
const matrix = figureMatrices['I']
const N = matrix.length - 1
const oldMatrix = matrix.map((row, i) =>
    row.map((val, j) => matrix[N - j][i])
)
