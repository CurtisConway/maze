<template>
  <div>
    <h1>Current Level: {{ currentLevel }}</h1>
    <table v-if="maze">
      <tr v-for="(row, y) in maze.table" :key="`row-${y}`">
        <td v-for="(column, x) in row" :key="`column-${y}-${x}`" :class="column">
          <span v-if="y === 0 && x === 0
                || column === currentPosition
                || x === maze.height - 1 && y === maze.width - 1">
            <svg viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg" style="z-index:10;">
              <circle cx="15" cy="15" r="7.5" fill="currentColor"></circle>
            </svg>
          </span>

          <span v-show="column.active">
            <svg viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
              <rect
                v-show="column.right && row[x + 1].active"
                x="20" y="20" height="10" width="30" fill="currentColor"></rect>
              <rect
                v-show="column.left && row[x - 1].active"
                x="0" y="20" height="10" width="30" fill="currentColor"></rect>
              <rect
                v-show="column.top && maze.table[y - 1] && maze.table[y - 1][x].active"
                x="20" y="0" height="30" width="10" fill="currentColor"></rect>
              <rect
                v-show="column.bottom && maze.table[y + 1] && maze.table[y + 1][x].active"
                x="20" y="20" height="30" width="10" fill="currentColor"></rect>
            </svg>
          </span>
        </td>
      </tr>
    </table>
    <h1 v-if="success">YOU WIN!</h1>
    <h1 v-if="failure">YOU LOSE!</h1>
    <button v-if="success || failure" @click="resetGame">
      {{ resetButtonText }}
    </button>
  </div>
</template>

<script>
import Maze from '@/maze';

export default {
  name: 'Maze',
  data() {
    return {
      maze: null,
      size: 3,
      currentLevel: 1,
      currentX: 0,
      currentY: 0,
      success: false,
      failure: false,
    };
  },
  computed: {
    currentPosition() {
      if (this.maze) {
        return this.maze.table[this.currentY][this.currentX];
      }
      return null;
    },
    resetButtonText() {
      return this.success ? 'Next Level' : 'Try Again';
    },
  },
  mounted() {
    this.startGame();
  },
  beforeDestroy() {
    this.endGame();
  },
  methods: {
    startGame() {
      this.maze = new Maze(this.size, this.size);
      this.currentLevel = this.size - 2;
      this.maze.createMaze()
        .then(() => {
          this.movePosition(0, 0);
          document.addEventListener('keyup', this.keyboardHandler);
        });
    },
    endGame() {
      document.removeEventListener('keyup', this.keyboardHandler);
    },
    resetGame() {
      this.failure = false;
      this.success = false;
      this.currentX = 0;
      this.currentY = 0;
      this.startGame();
    },
    keyboardHandler(event) {
      const actions = {
        up: () => {
          if (this.currentPosition.top) this.movePosition(this.currentX, this.currentY - 1);
        },
        left: () => {
          if (this.currentPosition.left) this.movePosition(this.currentX - 1, this.currentY);
        },
        down: () => {
          if (this.currentPosition.bottom) this.movePosition(this.currentX, this.currentY + 1);
        },
        right: () => {
          if (this.currentPosition.right) this.movePosition(this.currentX + 1, this.currentY);
        },
      };
      const handlers = {
        w: actions.up,
        a: actions.left,
        s: actions.down,
        d: actions.right,
        ArrowUp: actions.up,
        ArrowLeft: actions.left,
        ArrowDown: actions.down,
        ArrowRight: actions.right,
      };
      if (handlers[event.key]) {
        handlers[event.key]();
      }
    },
    movePosition(x, y) {
      this.currentX = x;
      this.currentY = y;
      if (this.currentPosition.active) {
        this.endGame();
        this.failure = true;
        this.size = 3;
      } else {
        this.currentPosition.active = true;
      }

      if (this.currentX === (this.maze.width - 1) && this.currentY === (this.maze.height - 1)) {
        this.endGame();
        this.success = true;
        this.size += 1;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
table {
  margin:0 auto;
  border-spacing:0;
  border:5px double rgba(255, 255, 0, 0.75);
  background-image: url('../assets/circuit.png');
  background-color: #006600;
  background-size:cover;
  box-shadow:10px 10px 5px rgba(0,0,0,.8);
}
h1 {
  color: rgba(255, 255, 0, 0.75);
}
button {
  background-color: rgba(255, 255, 0, 0.75);
  color:#242424;
  padding:10px 20px;
  font-size:20px;
  text-transform:uppercase;
  border:none;
  border-radius:5px;
  cursor:pointer;
  margin-top:20px;
}
td {
  border:5px double rgba(255, 255, 0, 0.95);
  height:75px;
  width:75px;
  box-sizing:border-box;
  position:relative;
  transition:border .5s ease-in-out;

  &.left {
    border-left-color:transparent;
  }
  &.top {
    border-top-color:transparent;
  }
  &.right {
    border-right-color:transparent;
  }
  &.bottom {
    border-bottom-color:transparent;
  }

  svg {
    position:absolute;
    width:calc(100% + 10px);
    height:calc(100% + 10px);
    top:50%;
    left:50%;
    transform: translate(-50%, -50%);
    color:rgba(255, 255, 0, 1);
    filter: drop-shadow(0 0 5px rgb(229, 167, 10));
    animation-name: fadeScaleIn;
    animation-iteration-count: 1;
    animation-duration: .25s;
    opacity:1;
  }
}

@keyframes fadeScaleIn {
  from {
    opacity:.75;
    transform:translate(-50%, -50%) scale(1.15);
  }

  to {
    opacity:1;
    transform:translate(-50%, -50%) scale(1);
  }
}
</style>
