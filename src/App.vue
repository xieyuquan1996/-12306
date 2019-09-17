<template>
  <div id="app">
    <router-link to="/index"></router-link>
    <router-view></router-view>
    <!--<Ticket></Ticket>-->
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      station: {},
      ticketData: {}
    }
  },
  created () {
    this.getStation()
  }
}
</script>

<style scoped lang="stylus">

</style>
