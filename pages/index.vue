<template>
  <div>
    <p-navbar></p-navbar>
    <div class="d-flex align-items-stretch">
      <p-sidebar></p-sidebar>
      <div class="page-content">
        <router-view></router-view>
        <p-footer></p-footer>
      </div>
    </div>
  </div>
</template>

<script>
import PNavbar from '~/components/PNavbar.vue'
import PSidebar from '~/components/PSidebar.vue'
import PFooter from '~/components/PFooter.vue'
const frontJQuery = require('~/static/js/front.js')

export default {
  components: {
    PNavbar,
    PSidebar,
    PFooter
  },
  mounted() {
    frontJQuery()
  }
}
</script>
<style>
</style>
