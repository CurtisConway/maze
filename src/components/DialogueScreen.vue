<template>
  <div class="square">
    <div class="col absolute-center">
      <h1
        v-if="!playAgain"
        class="monospace"
        style="font-weight:300;text-transform:lowercase;">
        {{ text }}<span class="blinker">_</span>
      </h1>
      <button v-if="playAgain" @click="$emit('replay')">
        Play Again
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DialogueScreen',
  data() {
    return {
      text: '',
      typingInterval: 0,
      playAgain: false,
    };
  },
  methods: {
    changeTextAsync(text) {
      return new Promise((resolve) => {
        let i = 0;
        let currentText = '';
        this.typingInterval = setInterval(() => {
          currentText += text[i];
          i += 1;
          this.setText(currentText);
          if (i >= text.length) {
            clearInterval(this.typingInterval);
            setTimeout(() => {
              resolve();
            }, 1000);
          }
        }, 100);
      });
    },

    setText(text) {
      this.text = text;
    },

    playIntroduction() {
      this.playAgain = false;
      this.setText('');
      this.changeTextAsync('Manual signal override initiated...')
        .then(() => this.changeTextAsync('Re-route the power to the destination...'))
        .then(() => this.$emit('finish'));
    },

    playFailure() {
      this.setText('');
      this.changeTextAsync('Override failed...')
        .then(() => this.changeTextAsync('Shutting down...'))
        .then(() => { this.playAgain = true; });
    },

    playSuccess() {
      this.setText('');
      this.changeTextAsync('Manual signal override success...')
        .then(() => this.changeTextAsync('Shutting down...'))
        .then(() => { this.playAgain = true; });
    },
  },
};
</script>
