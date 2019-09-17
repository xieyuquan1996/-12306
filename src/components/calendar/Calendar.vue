<template>
  <div class="calendar">
    <span :style="{color:showPrevious}" class="date-content" @click="selectDate(previous)">前一天</span>
    <div class="calendar" @click="changeTime">
      <div class="content">
        <span class="text">{{getFormatDate(travelTime.getMonth()+1)}}月{{getFormatDate(travelTime.getDate())}}日 周{{weekList[travelTime.getDay()]}}</span><span class="icon"><i class="icon-calendar"></i></span>
      </div>
    </div>
    <span :style="{color:showAfter}" class="date-content" @click="selectDate(after)">后一天</span>
  </div>
</template>

<script>
export default {
  name: 'Calendar',
  data () {
    return {
      weekList: ['日', '一', '二', '三', '四', '五', '六'],
      previous: -1, // 前一天
      after: 1 // 后一天
    }
  },
  computed: {
    // 表示当前日期的后一天文字的颜色的样式
    showAfter () {
      if (this.travelTime <= new Date(this.$store.state.afterDate.getTime() - 24 * 60 * 60 * 1000)) {
        return 'rgb(255, 255, 255)'
      }
      return 'rgb(157, 157, 157)'
    },
    // 表示当前日期的前一天文字的颜色的样式
    showPrevious () {
      if (this.travelTime >= new Date(this.$store.state.currentDate.getTime() + 24 * 60 * 60 * 1000)) {
        return 'rgb(255, 255, 255)'
      }
      return 'rgb(157, 157, 157)'
    },
    // 出行时间
    travelTime () {
      return this.$store.state.travelDate
    }
  },
  methods: {
    // 将日期中的月份或日数，转成两位数的字符串，不足补零
    getFormatDate (val) {
      return (Array(2).join('0') + val).slice(-2)
    },
    // 选择出行的时间
    selectDate (val) {
      if (val === this.after) {
        if (this.travelTime <= new Date(this.$store.state.afterDate.getTime() - 24 * 60 * 60 * 1000)) {
          let date = new Date(this.travelTime.getTime() + val * 24 * 60 * 60 * 1000)
          this.$store.commit('changeTravelDate', date)
        }
      } else {
        if (this.travelTime >= new Date(this.$store.state.currentDate.getTime() + 24 * 60 * 60 * 1000)) {
          let date = new Date(this.travelTime.getTime() + val * 24 * 60 * 60 * 1000)
          this.$store.commit('changeTravelDate', date)
        }
      }
      this.getTicketByAxios() // 查询车票
    },
    // 点击时间，跳转到时间的页面，并选择出发时间
    changeTime () {
      this.$router.push({name: 'datePicker'})
    }
  }
}
</script>

<style scoped lang="stylus">
@import "./calendar.styl"
</style>
