import Vue from 'vue'
import App from './App'
import eruda from 'eruda'
eruda.init()

/* eslint-disable no-new */
new Vue({
  el: 'body',
  components: { App }
})
