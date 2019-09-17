<template>
  <div class="date-picker">
    <div class="header">
      <span><i class="icon-back" @click="close"></i></span><span class="title">日期选择</span>
    </div>
    <div class="week-wrapper">
      <div class="week-content" v-for="(week,index) in weekList" :key="index">{{week}}</div>
    </div>
    <div class="date-wrapper" v-for="num in mouthList" :key="num.getMonth()">
      <div class="date-title">{{num.getFullYear()}}年{{num.getMonth()+1}}月</div>
      <div class="date-content">
        <div class="date" v-for="emptyListDate in getDate(num.getMonth()).emptyList" :key="emptyListDate.id"></div>
        <div class="date" v-for="date in getDate(num.getMonth()).dateList" :key="getFormatDateByMouthAndDate(num,date)" @click="chooseDate(getFormatDateByMouthAndDate(num,date))">
          <div class="text-content">
            <div class="text" :style="{color:isSelect(getFormatDateByMouthAndDate(num,date))}" :class="{back:getFormatDateByMouthAndDate(num,date)===selectDate}">
              {{date}}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DatePicker',
  data () {
    return {
      weekList: ['日', '一', '二', '三', '四', '五', '六'],
      mouthList: [] // 表示当前时间和30天后的时间
    }
  },
  computed: {
    selectDate () { // 月份是从0-11
      return this.getFormatDate(this.$store.state.travelDate)
    },
    currentDate () { // 当前日期
      return this.$store.state.currentDate
    },
    afterDate () { // 30天后的日期
      return this.$store.state.afterDate
    }
  },
  created () {
    this.mouthList.push(this.currentDate)
    this.mouthList.push(this.afterDate)
  },
  methods: {
    // 选择某个日期
    chooseDate (val) {
      if (val >= this.getFormatDate(this.currentDate)) {
        if (val <= this.getFormatDate(this.afterDate)) {
          let date = new Date(this.currentDate.getFullYear(), parseInt(val.substring(0, 2)), parseInt(val.substring(2, 4)))
          this.$store.commit('changeTravelDate', date)
          this.getTicketByAxios()
          this.close()
        }
      }
    },
    getFormatDate (val) {
      return (Array(4).join('0') + (val.getMonth() + (Array(2).join('0') + val.getDate()).slice(-2))).slice(-4)
    },
    getFormatDateByMouthAndDate (month, date) {
      return (Array(4).join('0') + (month.getMonth() + (Array(2).join('0') + date).slice(-2))).slice(-4)
    },
    // 判断时间是否在30天内
    isSelect (val) {
      if (val >= this.getFormatDate(this.currentDate)) {
        if (val <= this.getFormatDate(this.afterDate)) {
          return '#000'
        }
      }
      return 'rgb(157,157,157)'
    },
    // 获取到val月的日期情况
    getDate (val) {
      let dateList = []
      dateList.emptyList = []
      dateList.dateList = []
      for (let i = 0; i < new Date(this.currentDate.getFullYear(), val, 1).getDay(); i++) {
        dateList.emptyList.push('')
      }
      let maxDate = new Date(this.currentDate.getFullYear(), val + 1, 0).getDate()
      for (let i = 1; i <= maxDate; i++) {
        dateList.dateList.push(i.toString())
      }
      return dateList
    },
    // 返回上一页
    close () {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped lang="stylus">
@import "./datePicker.styl"
</style>
