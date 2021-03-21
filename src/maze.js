export default class Maze {
  constructor(height = 10, width = 10) {
    this.height = height;
    this.width = width;
    this.table = [];

    // this.createMaze();

    return this;
  }

  createMaze() {
    for (let y = 0; y < this.height; y += 1) {
      const row = [];
      for (let x = 0; x < this.width; x += 1) {
        row.push({
          left: false,
          top: false,
          right: false,
          bottom: false,
          visited: false,
          active: false,
        });
      }
      this.table.push(row);
    }

    this.table[0][0].visited = true;
    return this.createSolutionPath();
  }

  createSolutionPath() {
    let rowIndex = 0;
    let colIndex = 0;
    let iterationCount = 0;
    let maxIterationCount = this.width * 100;
    const validMoves = ['left', 'top', 'right', 'bottom'];
    const instructions = {
      right: (row, column) => {
        if (this.table[row][column + 1] && !this.table[row][column + 1].visited) {
          this.table[row][column].right = true;
          this.table[row][column + 1].left = true;
          colIndex += 1;
        }
      },
      bottom: (row, column) => {
        if (this.table[row + 1] && !this.table[row + 1][column].visited) {
          this.table[row][column].bottom = true;
          this.table[row + 1][column].top = true;
          rowIndex += 1;
        }
      },
      left: (row, column) => {
        if (this.table[row][column - 1] && !this.table[row][column - 1].visited) {
          this.table[row][column].left = true;
          this.table[row][column - 1].right = true;
          colIndex -= 1;
        }
      },
      top: (row, column) => {
        if (this.table[row - 1] && !this.table[row - 1][column].visited) {
          this.table[row][column].top = true;
          this.table[row - 1][column].bottom = true;
          rowIndex -= 1;
        }
      },
    };
    let interval = 0;
    return new Promise((resolve) => {
      interval = setInterval(() => {
        const move = validMoves[Math.floor(Math.random() * validMoves.length)];
        if (this.isDeadEnd(rowIndex, colIndex)) {
          const newStartPoint = this.findNewStartPoint();
          rowIndex = newStartPoint.y;
          colIndex = newStartPoint.x;
        } else {
          instructions[move](rowIndex, colIndex);
        }
        this.table[rowIndex][colIndex].visited = true;
        iterationCount += 1;
        if (rowIndex === this.height - 1 && colIndex === this.width - 1) {
          maxIterationCount = Math.min(maxIterationCount, iterationCount + (this.width * 50));
        }
        if (iterationCount >= maxIterationCount) {
          clearInterval(interval);
          resolve();
        }
      }, 0);
    });
  }

  isDeadEnd(row, column) {
    const left = this.table[row][column - 1] && !this.table[row][column - 1].visited;
    const right = this.table[row][column + 1] && !this.table[row][column + 1].visited;
    const bottom = this.table[row + 1] && !this.table[row + 1][column].visited;
    const top = this.table[row - 1] && !this.table[row - 1][column].visited;

    return !left && !right && !bottom && !top;
  }

  findNewStartPoint() {
    const y = Math.floor(Math.random() * this.height);
    const x = Math.floor(Math.random() * this.width);
    if (this.table[y][x] && this.table[y][x].visited) {
      return { y, x };
    }

    return this.findNewStartPoint();
  }
}
