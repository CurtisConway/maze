import Maze from '@/maze';

describe('Maze', () => {
  it('can construct with a width and height', () => {
    const maze = new Maze();

    expect(maze.width).toBe(10);
    expect(maze.height).toBe(10);
  });

  it('can create a maze with a start and a solution', (done) => {
    const maze = new Maze();
    maze.createMaze()
      .then(() => {
        expect(maze.table[0][0].visited).toBe(true);
        expect(maze.table[maze.height - 1][maze.width - 1].visited).toBe(true);

        done();
      });
  });
});
