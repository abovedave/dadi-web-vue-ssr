<template>
  <div id="app">
    <p>{{ context.page.name }}</p>
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
  },
  mounted () {
    axios
      .get('?json=true')
      .then(res => {
        this.context = res.data
      })
  }
}
</script>