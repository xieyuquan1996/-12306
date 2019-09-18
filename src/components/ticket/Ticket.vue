<template>
  <div class="ticket">
    <div class="head">
      <span class="icon-left" @click="close"><i class="icon-back"></i></span>
      <span class="text">{{startPlace.stationName}}{{msg}}{{endPlace.stationName}}</span>
      <span class="icon-right" @click="showMore"><i class="icon-more"></i></span>
    </div>
    <Calendar></Calendar>
    <div class="content-wrapper" ref="contentWrapper">
      <ul>
        <li class="content" v-for="(ticket,index) in tickets" :key="index">
          <div v-if="ticket.remark!==SUSPENDED">
            <div class="content-top">
              <span class="trip-num" @click="placingOrder(ticket,index)">{{ticket.tripNum}}</span>
              <span class="ticket-info-start" @click="placingOrder(ticket,index)">
                <div>
                  <span class="station-title" :style="{background:showTitle(ticket.startStationStatus)}">{{ticket.startStationStatus}}</span>
                  <span class="station-name">{{ticket.startStation}}</span>
                </div>
                <div class="ticker-time">{{ticket.startStationTime}}</div>
              </span>
              <span class="icon" @click="placingOrder(ticket,index)">
                <img class="background" src="./arrow.jpg" height="12px">
                <i v-if="ticket.tripNum.indexOf('G')>-1" class="icon-identity"></i>
                <div class="text">{{ticket.travelTime}}</div>
              </span>
              <span class="ticket-info-end" @click="placingOrder(ticket,index)">
                <div>
                  <span class="station-title" :style="{background:showTitle(ticket.endStationStatus)}">{{ticket.endStationStatus}}</span>
                  <span class="station-name">{{ticket.endStation}}</span>
                </div>
                <span class="ticker-time">{{ticket.endStationTime}}</span>
                <span v-if="ticket.dateNum>0" class="ticket-time" style="color: rgb(213,75,75);">+{{ticket.dateNum}}</span>
              </span>
              <span class="show-info" @click="showStation(ticket,index)"><i :class="{'icon-arrow_down':!stopThroughInfo[index],'icon-arrow_up':stopThroughInfo[index]}"></i></span>
            </div>
            <div class="content-bottom" @click="placingOrder(ticket,index)">
              <ul>
                <li class="ticket-info" v-for="item in ticket.ticket" :key="item.ticketLevel" :class="{'without-ticket':isActive(item.ticketNum)}">
                  <span>{{item.ticketLevel}}：</span><span :class="{'enough-ticket':isEnough(item.ticketNum)}">{{item.ticketNum}}</span>
                </li>
              </ul>
            </div>
          </div>
          <div v-if="ticket.remark!==SUSPENDED&&ticket.remark!==BOOKING">
            <div class="start-up">
              <span>{{ticket.remark}}</span>
            </div>
          </div>
          <div v-if="ticket.remark===SUSPENDED" @click="placingOrder(ticket,index)">
            <div class="content-top">
              <span class="trip-num">{{ticket.tripNum}}</span>
              <span class="ticket-info-start">
              <div>
                <span class="station-title" :style="{background:showTitle(ticket.startStationStatus)}">{{ticket.startStationStatus}}</span>
                <span class="station-name">{{ticket.startStation}}</span>
              </div>
            </span>
              <span class="icon">
              <img class="background" src="./arrow.jpg" height="12px">
            </span>
              <span class="ticket-info-end">
              <div>
                <span class="station-title" :style="{background:showTitle(ticket.endStationStatus)}">{{ticket.endStationStatus}}</span>
                <span class="station-name">{{ticket.endStation}}</span>
              </div>
            </span>
            </div>
            <div class="content-bottom">
              <span style="font-size: 12px;color: rgb(255,132,28)">{{ticket.remark}}</span>
            </div>
          </div>
          <div v-if="stopThroughInfo[index]" class="stop-through">
            <div class="title">
              <span class="content" v-for="(title,tId) in titles" :key="tId">{{title}}</span>
            </div>
            <div class="station-title" v-for="val in ticket.stopThroughInfo" :key="val.station_no" :class="{highlight:(val.station_name===ticket.startStationTime)}">
              <span class="station-content">{{val.station_no}}</span>
              <span class="station-content">{{val.station_name}}</span>
              <span class="station-content">{{val.arrive_time}}</span>
              <span class="station-content">{{val.start_time}}</span>
              <span class="station-content">{{val.stopover_time}}</span>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="bottom-wrapper">
      <div class="content">
        <div v-for="(bl,index) in bottomList" :key="index" style="width: 50%;" :class="{'lineHeight': otherVal===index}" @click="selectOther(index)">
          <div class="icon"><i :class="bl.class"></i></div>
          <div class="text">{{bl.text}}</div>
        </div>
      </div>
    </div>
    <div v-if="isShowMore" class="more-wrapper">
      <ul>
        <li v-for="(data,index) in moreData" :key="index" class="more-content" @click="click(index)">
          <span><i :class="data.class" class="icon"></i><span class="text">{{data.text}}</span></span>
        </li>
      </ul>
    </div>
    <div v-if="showInfo" class="show-ticket-number">总共查询到{{tickets.length}}辆车</div>
  </div>
</template>

<script>
import Vue from 'vue'
import Calendar from '../calendar/Calendar'
import BScroll from '@better-scroll/core'
export default {
  name: 'Ticket',
  components: {Calendar},
  data () {
    return {
      SUSPENDED: '列车运行图调整,暂停发售',
      NO_ENOUGH: '无',
      BOOKING: '预订',
      titles: ['站序', '站名', '到时', '发时', '时长'],
      otherVal: 0, // 就是页脚的四个选项的id值（发时最早，耗时最短）
      moreData: [
        {
          class: 'icon-refresh',
          text: '刷新'
        },
        {
          class: 'icon-filter',
          text: '筛选'
        },
        {
          class: 'icon-save',
          text: '保存本地'
        },
        {
          class: 'icon-share',
          text: '分享好友'
        }
      ],
      isShowMore: false,
      bottomList: [
        {
          class: 'icon-earliest',
          text: '发时最早'
        },
        {
          class: 'icon-shortest',
          text: '耗时最短'
        }
      ],
      weekList: ['日', '一', '二', '三', '四', '五', '六'],
      startPlace: this.$store.state.startPlace,
      endPlace: this.$store.state.endPlace,
      msg: '<>',
      showInfo: true,
      stopThroughInfo: [] // 经停信息
    }
  },
  updated () {
    this.contentScroll.refresh() // 当DOM变化时，重新刷新BScroll
  },
  created () {
    this.$nextTick(() => {
      this._initScroll()
    })
    setTimeout(() => {
      this.showInfo = false
    }, 2000)
    for (let i = 0; i < this.$store.state.ticketData.length; i++) {
      this.stopThroughInfo.push(false)
    }
  },
  computed: {
    // 获取车票数据
    tickets () {
      let that = this
      for (let i = 0; i < this.$store.state.ticketData.length; i++) {
        that.stopThroughInfo.push(false)
      }
      if (this.otherVal === 0) {
        return this.$store.state.ticketData // 车票的（按出发时间先后）数据
      }
      if (this.otherVal === 1) {
        return this.$store.state.sortTicket // 车票的排序（按历时）数据
      }
    }
  },
  methods: {
    // 查询n某个航班的经停信息
    showStation (val, index) {
      if (!this.stopThroughInfo[index]) {
        let info = {}
        info.clickStatus = true
        let otherVal = this.otherVal
        this.getTicketByTrainNo(val, index, otherVal)
      }
      Vue.set(this.stopThroughInfo, index, !this.stopThroughInfo[index])
    },
    // 下单
    placingOrder (val, index) {
      if (val.remark === this.BOOKING) {
        for (let i = 0; i < val.ticket.length; i++) {
          if (val.ticket[i].ticketNum !== this.NO_ENOUGH) {
            this.$store.commit('setTicketData', val)
            this.showStation(val, index)
            this.$router.push({name: 'order'})
            return
          }
        }
        alert('很抱歉，当日该车次票已售完')
        return
      }
      alert(val.remark)
    },
    showTitle (val) {
      if (val === '始') {
        return 'rgb(255,132,28)'
      }
      if (val === '过') {
        return 'rgb(59, 153,252)'
      }
      return 'rgb(56,157,65)'
    },
    // 车票数量为‘有’时，车票数量的样式
    isEnough (val) {
      if (val === '有') {
        return true
      }
      return false
    },
    // 当车票没有的时候的样式
    isActive (val) {
      if (val === '无') {
        return true
      }
      return false
    },
    // 返回上一层
    close () {
      this.$router.go(-1)
    },
    // 显示更多，就是那个右上角那三个点
    showMore () {
      this.isShowMore = !this.isShowMore
    },
    click (val) {
      this.isShowMore = false
      alert('操作成功！' + val)
    },
    // 选择页脚的两个选项，发车最早和耗时最短
    selectOther (val) {
      this.otherVal = val
    },
    // 初始化BScroll
    _initScroll () {
      this.contentScroll = new BScroll(this.$refs.contentWrapper, {
        click: true
      })
    }
  }
}
</script>

<style scoped lang="stylus">
@import "./ticket.styl"
</style>
