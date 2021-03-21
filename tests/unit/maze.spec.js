import Maze from '@/maze';

describe('Maze', () => {
  it('can create a table', () => {
    const maze = new Maze();

    console.log(maze.table);

    expect(maze.table.length).toBe(10);
  });
});
