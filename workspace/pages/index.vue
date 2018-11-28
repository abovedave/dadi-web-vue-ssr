<template>
  <div id="app">
    <h1>Hello {{ name }}</h1>
    <input
      autofocus
      placeholder="What is your name?"
      v-model="name">

    <button v-on:click="greet">Greet</button>
  </div>
</template>

<script>
module.exports = {
  name: 'app',
  data () {
    return {
      context: {},
      name: 'John'
    }
  },
  methods: {
    greet (event) {
      // `this` inside methods points to the Vue instance
      alert('Hello ' + this.name + '!')
      // `event` is the native DOM event
      if (event) {
        alert(event.target.tagName)
      }
    }
  }
}
</script>