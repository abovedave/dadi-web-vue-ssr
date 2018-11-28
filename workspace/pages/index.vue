<template>
  <div id="app">
    <h1>Hello {{ name }}</h1>
    <input
      autofocus
      placeholder="What is your name?"
      v-model="name">
  </div>
</template>

<script>
const axios = require('axios')

module.exports = {
  name: 'index',
  data () {
    return {
      context: {},
      name: 'John'
    }
  }
}
</script>