export default class Maze {
  /**
   * Construct the maze
   * @param {number} height
   * @param {number} width
   */
  constructor(height = 10, width = 10) {
    this.height = height;
    this.width = width;
    this.table = [];

    return this;
  }

  /**
   * Create the maze
   *
   * @returns {Promise}
   */
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

  /**
   * Create the solution path to the maze
   *
   * @returns {Promise}
   */
  createSolutionPath() {
    let rowIndex = 0;
    let colIndex = 0;
    let iterationCount = 0;
    let maxIterationCount = Number.MAX_SAFE_INTEGER;
    let hasComplete = false;
    const instructions = [
      (row, column) => {
        if (this.table[row][column + 1] && !this.table[row][column + 1].visited) {
          this.table[row][column].right = true;
          this.table[row][column + 1].left = true;
          colIndex += 1;
        }
      },
      (row, column) => {
        if (this.table[row + 1] && !this.table[row + 1][column].visited) {
          this.table[row][column].bottom = true;
          this.table[row + 1][column].top = true;
          rowIndex += 1;
        }
      },
      (row, column) => {
        if (this.table[row][column - 1] && !this.table[row][column - 1].visited) {
          this.table[row][column].left = true;
          this.table[row][column - 1].right = true;
          colIndex -= 1;
        }
      },
      (row, column) => {
        if (this.table[row - 1] && !this.table[row - 1][column].visited) {
          this.table[row][column].top = true;
          this.table[row - 1][column].bottom = true;
          rowIndex -= 1;
        }
      },
    ];
    while (iterationCount < maxIterationCount) {
      const move = instructions[Math.floor(Math.random() * instructions.length)];
      if (this.isDeadEnd(rowIndex, colIndex)) {
        const newStartPoint = this.findNewStartPoint();
        rowIndex = newStartPoint.y;
        colIndex = newStartPoint.x;
      } else {
        move(rowIndex, colIndex);
      }
      this.table[rowIndex][colIndex].visited = true;
      iterationCount += 1;
      if (rowIndex === this.height - 1 && colIndex === this.width - 1 && !hasComplete) {
        hasComplete = true;
        maxIterationCount = iterationCount + (this.width * 50);
      }
    }
    return Promise.resolve();
  }

  /**
   * Check if the current position is a dead end
   *
   * @returns {boolean}
   */
  isDeadEnd(row, column) {
    const left = this.table[row][column - 1] && !this.table[row][column - 1].visited;
    const right = this.table[row][column + 1] && !this.table[row][column + 1].visited;
    const bottom = this.table[row + 1] && !this.table[row + 1][column].visited;
    const top = this.table[row - 1] && !this.table[row - 1][column].visited;

    return !left && !right && !bottom && !top;
  }

  /**
   * Find a new start point
   *
   * @returns {object} point
   */
  findNewStartPoint() {
    const y = Math.floor(Math.random() * this.height);
    const x = Math.floor(Math.random() * this.width);
    if (this.table[y][x] && this.table[y][x].visited) {
      return { y, x };
    }

    return this.findNewStartPoint();
  }
}
