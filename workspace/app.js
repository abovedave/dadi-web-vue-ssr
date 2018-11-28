// Define Vue
import Vue from 'vue'

// Pages
import index from './pages/index.vue'
import about from './pages/about.vue'

const routes = {
  index: index,
  about: about
}

new Vue({
  el: '#app',
  data: {
    currentPage: currentPage
  },
  computed: {
    ViewComponent () {
      return routes[this.currentPage] || NotFound
    }
  },
  render (h) { return h(this.ViewComponent) }
})