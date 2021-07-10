import Maze from '@/maze';

describe('Maze', () => {
  let maze;
  let height = 0;
  let width = 0;

  function createMaze(done) {
    maze = new Maze(height, width);
    maze.createMaze()
      .then(() => {
        expect(maze.width).toBe(height);
        expect(maze.height).toBe(width);
        expect(maze.start.visited).toBe(true);
        expect(maze.end.visited).toBe(true);

        done();
      });
  }

  it('can create a 3x3 maze with a start and a solution', (done) => {
    height = 3;
    width = 3;
    createMaze(done);
  });

  it('can create a 10x10 maze with a start and a solution', (done) => {
    height = 10;
    width = 10;
    createMaze(done);
  });

  it('can create a 20x20 maze with a start and a solution', (done) => {
    height = 20;
    width = 20;
    createMaze(done);
  });

  it('can create a 100x100 maze with a start and a solution', (done) => {
    height = 100;
    width = 100;
    createMaze(done);
  });
});
