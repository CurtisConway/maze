<template>
  <div>
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

    <div class="timer-bar">
      <div class="timer" :style="{'animation-duration': `${timer}s`}"></div>
    </div>

    <ArrowKeys @move="handleMove" />
  </div>
</template>

<script>
import Maze from '@/maze';
import { GAME_STATES, KEYBOARD_DIRECTIONS } from '@/constants';
import ArrowKeys from '@/components/ArrowKeys.vue';

export default {
  name: 'Maze',
  components: { ArrowKeys },
  props: {
    size: {
      type: Number,
      default: () => 3,
    },

    gameState: {
      type: Number,
      default: () => GAME_STATES.waiting,
    },

    timer: {
      type: Number,
      default: () => 20,
    },
  },
  data() {
    return {
      maze: null,
      currentX: 0,
      currentY: 0,
      success: false,
      failure: false,
      timerTimeout: 0,
    };
  },
  computed: {
    currentPosition() {
      if (this.maze) {
        return this.maze.table[this.currentY][this.currentX];
      }
      return null;
    },

    isPlaying() {
      return this.gameState === GAME_STATES.playing;
    },
  },
  methods: {
    startGame() {
      this.currentX = 0;
      this.currentY = 0;
      this.maze = new Maze(this.size, this.size);
      this.maze.createMaze()
        .then(() => {
          this.movePosition(0, 0);
          clearTimeout(this.timerTimeout);
          this.timerTimeout = setTimeout(() => {
            this.$emit('failure');
          }, this.timer * 1000);
        });
    },

    handleMove(direction) {
      switch (direction) {
        case KEYBOARD_DIRECTIONS.up:
          if (this.currentPosition.top) this.movePosition(this.currentX, this.currentY - 1);
          break;
        case KEYBOARD_DIRECTIONS.down:
          if (this.currentPosition.bottom) this.movePosition(this.currentX, this.currentY + 1);
          break;
        case KEYBOARD_DIRECTIONS.left:
          if (this.currentPosition.left) this.movePosition(this.currentX - 1, this.currentY);
          break;
        case KEYBOARD_DIRECTIONS.right:
          if (this.currentPosition.right) this.movePosition(this.currentX + 1, this.currentY);
          break;
        default:
          break;
      }
    },

    movePosition(x, y) {
      if (this.isPlaying) {
        this.currentX = x;
        this.currentY = y;
        if (this.currentPosition.active) {
          this.$emit('failure');
        } else {
          this.currentPosition.active = true;
        }

        if (this.currentX === (this.maze.width - 1) && this.currentY === (this.maze.height - 1)) {
          clearTimeout(this.timerTimeout);
          this.$emit('success');
        }
      }
    },
  },
  mounted() {
    this.startGame();
  },
};
</script>
