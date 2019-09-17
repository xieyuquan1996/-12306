<template>
    <div class="index">
      <div class="ticker">
        <div class="place">
          <span class="station" @click="selectStation(START_STATION)">{{startStation.stationName}}</span>
          <span class="icon" @click="exchangeStation"><i class="icon-transformation"></i></span>
          <span class="station" @click="selectStation(END_STATION)">{{endStation.stationName}}</span>
        </div>
        <div class="date-wrapper" @click="changeTime">
          <span class="date-title">出发日期</span>
          <span class="date-month">{{travelTime.getMonth()+1}}月{{travelTime.getDate()}}日</span>
          <span class="date-week">周{{weekList[travelTime.getDay()]}}</span>
        </div>
        <div class="speedRailway">
          <span class="title">只看高铁/动车</span>
          <span class="icon" @click="selectSpeedRailway"><i :class="showSpeedRailway?classYes:classNo"></i></span>
        </div>
        <div class="searchTicker" @click="searchTicker">查询车票</div>
      </div>
    </div>
</template>

<script>
export default {
  name: 'Index',
  data () {
    return {
      START_STATION: 1, // 起始火车站
      END_STATION: 2, // 终点火车站
      weekList: ['日', '一', '二', '三', '四', '五', '六'],
      classYes: 'icon-yes', // 表示只看高铁/动车的class样式
      classNo: 'icon-no' // // 表示不只看高铁/动车的class样式
    }
  },
  computed: {
    showSpeedRailway () { // 是否只看高铁/动车
      return this.$store.state.speedRailway
    },
    startStation () {
      return this.$store.state.startPlace // 起始火车站
    },
    endStation () {
      return this.$store.state.endPlace // 终点火车站
    },
    travelTime () {
      return this.$store.state.travelDate // 出发时间
    }
  },
  methods: {
    // 起始火车站与终点火车站交换
    exchangeStation () {
      let stationTemp = this.startStation
      this.$store.commit('changeStartPlace', this.endStation)
      this.$store.commit('changeEndPlace', stationTemp)
    },
    // 点击时间，跳转到时间的页面，并选择出发时间
    changeTime () {
      this.$router.push({name: 'datePicker'})
    },
    // 跳转到车票的页面
    searchTicker () {
      this.getTicketByAxios()
      this.$router.push({name: 'ticket'})
    },
    // 点击火车站，跳转至火车站的页面，并选择火车站。
    // val=1表示为起始火车站
    // val=2表示为终点火车站
    selectStation (val) {
      this.$router.push({name: 'station', params: { stationStatus: val }})
    },
    // 是否只看高铁/动车
    selectSpeedRailway () {
      let status = this.showSpeedRailway
      this.$store.commit('setSpeedRailway', !status)
    }
  }
}
</script>

<style scoped lang="stylus">
@import "Index.styl"
</style>
