import Maze from '@/maze';

describe('Maze', () => {
  it('can construct with a width and height', () => {
    const maze = new Maze();

    expect(maze.width).toBe(10);
    expect(maze.height).toBe(10);
  });

  it('can create a 3x3 maze with a start and a solution', (done) => {
    const maze = new Maze(3, 3);
    maze.createMaze()
      .then(() => {
        expect(maze.table[0][0].visited).toBe(true);
        expect(maze.table[maze.height - 1][maze.width - 1].visited).toBe(true);

        done();
      });
  });

  it('can create a 10x10 maze with a start and a solution', (done) => {
    const maze = new Maze();
    maze.createMaze()
      .then(() => {
        expect(maze.table[0][0].visited).toBe(true);
        expect(maze.table[maze.height - 1][maze.width - 1].visited).toBe(true);

        done();
      });
  });

  it('can create a 20x20 maze with a start and a solution', (done) => {
    const maze = new Maze(20, 20);
    maze.createMaze()
      .then(() => {
        expect(maze.table[0][0].visited).toBe(true);
        expect(maze.table[maze.height - 1][maze.width - 1].visited).toBe(true);

        done();
      });
  });

  it('can create a 100x100 maze with a start and a solution', (done) => {
    const maze = new Maze(100, 100);
    maze.createMaze()
      .then(() => {
        expect(maze.table[0][0].visited).toBe(true);
        expect(maze.table[maze.height - 1][maze.width - 1].visited).toBe(true);

        done();
      });
  });
});
