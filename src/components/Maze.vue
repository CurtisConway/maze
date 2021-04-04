<template>
  <div>
    <h1>Level {{ currentLevel }}</h1>
    <div class="container">
      <div class="square">
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
      </div>

      <div class="row">
        <div class="col" style="padding:30px 10px;">
          <div class="row">
            <button class="btn-sq" @click="keyboardActions.up">
              <svg height="20" width="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                <path
                  fill="currentColor"
                  d="M177 159.7l136 136c9.4 9.4 9.4 24.6 0 33.9l-22.6 22.6c-9.4 9.4-24.6 9.4-33.9 0L160
            255.9l-96.4 96.4c-9.4 9.4-24.6 9.4-33.9 0L7 329.7c-9.4-9.4-9.4-24.6
            0-33.9l136-136c9.4-9.5 24.6-9.5 34-.1z"></path>
              </svg>
            </button>
          </div>
          <div class="row">
            <button class="btn-sq" @click="keyboardActions.left">
              <svg height="20" width="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                <path fill="currentColor" d="M31.7 239l136-136c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9L127.9 256l96.4 96.4c9.4 9.4 9.4 24.6 0 33.9L201.7 409c-9.4 9.4-24.6 9.4-33.9 0l-136-136c-9.5-9.4-9.5-24.6-.1-34z" class=""></path>
              </svg>
            </button>
            <button class="btn-sq" @click="keyboardActions.down">
              <svg height="20" width="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                <path fill="currentColor" d="M143 352.3L7 216.3c-9.4-9.4-9.4-24.6 0-33.9l22.6-22.6c9.4-9.4 24.6-9.4 33.9 0l96.4 96.4 96.4-96.4c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9l-136 136c-9.2 9.4-24.4 9.4-33.8 0z" class=""></path></path>
              </svg>
            </button>
            <button class="btn-sq" @click="keyboardActions.right">
              <svg height="20" width="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                <path fill="currentColor" d="M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z" class=""></path></path>
              </svg>
            </button>
          </div>
        </div>
        <div class="col">
          <h1 v-if="success">YOU WIN!</h1>
          <h1 v-if="failure">YOU LOSE!</h1>
          <button v-if="success || failure" @click="resetGame">
            {{ resetButtonText }}
          </button>
        </div>
      </div>
    </div>
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
    gameOver() {
      return this.success || this.failure;
    },
    keyboardActions() {
      return {
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
        reset: () => {
          if (this.gameOver) this.resetGame();
        },
      };
    },
  },
  mounted() {
    this.startGame();
    document.addEventListener('keyup', this.keyboardHandler);
  },
  beforeDestroy() {
    document.removeEventListener('keyup', this.keyboardHandler);
  },
  methods: {
    startGame() {
      this.maze = new Maze(this.size, this.size);
      this.currentLevel = this.size - 2;
      this.maze.createMaze()
        .then(() => {
          this.movePosition(0, 0);
        });
    },
    resetGame() {
      this.failure = false;
      this.success = false;
      this.currentX = 0;
      this.currentY = 0;
      this.startGame();
    },
    keyboardHandler(event) {
      const handlers = {
        w: this.keyboardActions.up,
        a: this.keyboardActions.left,
        s: this.keyboardActions.down,
        d: this.keyboardActions.right,
        ArrowUp: this.keyboardActions.up,
        ArrowLeft: this.keyboardActions.left,
        ArrowDown: this.keyboardActions.down,
        ArrowRight: this.keyboardActions.right,
        Enter: this.keyboardActions.reset,
        ' ': this.keyboardActions.reset,
      };
      if (handlers[event.key]) {
        event.preventDefault();
        event.stopPropagation();
        handlers[event.key]();
      }
    },
    movePosition(x, y) {
      if (!this.gameOver) {
        this.currentX = x;
        this.currentY = y;
        if (this.currentPosition.active) {
          this.failure = true;
          this.size = 3;
        } else {
          this.currentPosition.active = true;
        }

        if (this.currentX === (this.maze.width - 1) && this.currentY === (this.maze.height - 1)) {
          this.success = true;
          this.size += 1;
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
table {
  margin:0 auto;
  border-spacing:0;
  border:thick double rgba(255, 255, 0, 0.75);
  background-image: url('../assets/circuit.png');
  background-color: black;
  background-size:cover;
  box-shadow:10px 10px 5px rgba(0,0,0,.8);
  width:100%;
  height:100%;
  position:absolute;
  top:0;
  left:0;
}
.container {
  width:640px;
  max-width:100%;
  margin:0 auto;
}
.square {
  width:100%;
  height:0;
  padding-bottom:100%;
  position:relative;
  margin:0 auto;
}
h1 {
  color: rgba(255, 255, 0, 0.75);
  text-align: center;
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
  margin:5px;

  &.btn-sq {
    width:50px;
    height:50px;
    padding:0;
  }
}
td {
  border:thick double rgba(255, 255, 0, 0.95);
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
.row {
  display:flex;
  flex-direction:row;
  justify-content:center;
  align-items:flex-start;
  flex-wrap:wrap;
}
.col {
  display:flex;
  flex-direction:column;
  justify-content:center;
  align-items:center;
  flex:1 1 0;
  padding:10px;
  min-width:50%;
  box-sizing:border-box;
}
@media screen and (max-width:640px) {
  .col {
    min-width:100%;
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
