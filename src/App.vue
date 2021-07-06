<template>
  <div id="app">
    <div class="container">
      <DialogueScreen
        ref="dialogueScreen"
        v-show="!isPlaying"
        @finish="startGame"
        @replay="startWaiting"
      />

      <Maze
        v-if="isPlaying"
        :size="size"
        :gameState="gameState"
        :timer="settings.timeLimitSeconds"
        @success="handleSuccess"
        @failure="handleFailure"
      />
    </div>

    <GameSettings
      v-show="canReplay"
      :settings="settings"
      @updateSetting="updateSettings"
    />

    <a href="https://gitfront.io/r/user-5087757/ec7d111abb1072299d4ecfdc8c79241971d7ebba/maze/"
       class="git-link">
      Download the repo
    </a>
  </div>
</template>

<script>
import Maze from '@/components/Maze.vue';
import { GAME_STATES } from '@/constants';
import DialogueScreen from '@/components/DialogueScreen.vue';
import GameSettings from '@/components/GameSettings.vue';

export default {
  name: 'App',
  components: {
    GameSettings,
    DialogueScreen,
    Maze,
  },
  data() {
    return {
      settings: {
        timeLimitSeconds: 5,
        totalLevels: 5,
        startingSize: 3,
      },
      size: 3,
      levelsCompleted: 0,
      gameState: GAME_STATES.waiting,
    };
  },
  computed: {
    isWaiting() {
      return this.gameState === GAME_STATES.waiting;
    },

    isPlaying() {
      return this.gameState === GAME_STATES.playing;
    },

    isSuccess() {
      return this.gameState === GAME_STATES.success;
    },

    isFailure() {
      return this.gameState === GAME_STATES.failure;
    },

    canReplay() {
      return this.isSuccess || this.isFailure;
    },

    validSettings() {
      return this.timeLimitSeconds > 0 && this.totalLevels > 0 && this.startingSize >= 3;
    },
  },
  methods: {
    startWaiting() {
      this.gameState = GAME_STATES.waiting;
      this.size = this.settings.startingSize;
      this.levelsCompleted = 0;
      this.$refs.dialogueScreen.playIntroduction();
    },

    startGame() {
      this.gameState = GAME_STATES.playing;
    },

    handleSuccess() {
      this.gameState = GAME_STATES.waiting;
      this.size += 1;
      this.levelsCompleted += 1;

      this.$nextTick(() => {
        if (this.levelsCompleted === this.settings.totalLevels) {
          this.finishGame();
        } else {
          this.startGame();
        }
      });
    },

    handleFailure() {
      this.gameState = GAME_STATES.failure;
      this.$nextTick(() => {
        this.$refs.dialogueScreen.playFailure();
      });
    },

    finishGame() {
      this.gameState = GAME_STATES.success;
      this.$refs.dialogueScreen.playSuccess();
    },

    updateSettings({ key, value }) {
      this.$set(this.settings, key, value);
    },
  },
  mounted() {
    this.startWaiting();
  },
};
</script>

<style lang="scss">

</style>
