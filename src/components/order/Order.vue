<template>
  <div class="order">
    <div class="head">
      <span class="icon-left" @click="close"><i class="icon-back"></i></span>
      <span class="text">确认订单</span>
    </div>
    <Calendar></Calendar>
    <div class="total-wrapper">
      <div class="ticket-wrapper">
        <div class="ticket-header">
        <span class="ticket-start">
          <div class="title">{{ticket.startStation}}</div>
          <div class="time">{{ticket.startStationTime}}</div>
          <div v-if="ticket.startStationStatus!=='始'" class="showStation"><span style="background: rgb(255,132,28);color: #ffffff;border-radius: 3px;">始</span>{{ticket.stopThroughInfo[0].start_station_name}}</div>
        </span>
          <span class="ticket-icon">
            <span><i v-if="ticket.tripNum.indexOf('G')>-1" class="icon-identity"></i> {{ticket.tripNum}}</span>
            <img class="background" src="./arrow.jpg" height="12px">
            <div class="text">{{ticket.travelTime}}</div>
          </span>
          <span class="ticket-end">
            <div class="title">{{ticket.endStation}}</div>
            <div class="time">{{ticket.endStationTime}}<span v-if="ticket.dateNum>0" class="ticket-time">+{{ticket.dateNum}}</span></div>
            <div v-if="ticket.endStationStatus!=='终'" class="showStation"><span style="background: rgb(56,157,65);color: #ffffff;border-radius: 3px;">终</span>{{ticket.stopThroughInfo[0].end_station_name}}</div>
          </span>
        </div>
        <div class="ticket-bottom">
        <span v-for="(t,tIndex) in ticket.ticket" :key="tIndex" class="ticket-content" :class="{selectTicket: tIndex===selectTicketLevel}" @click="selectLevel(tIndex)">
          <div class="ticket-level">{{t.ticketLevel}}</div>
          <div class="ticket-num">{{t.ticketNum}}</div>
          <div class="ticket-price">{{t.price}}</div>
        </span>
        </div>
      </div>
      <div class="traveler-wrapper">
        <div class="person-wrapper" v-for="(person,pIndex) in personLists" :key="pIndex">
          <span class="name">{{person.name}}</span>
          <span class="identity">{{person.identity}}</span>
          <span class="type">{{person.type}}</span>
          <span class="type">{{ticketType}}</span>
          <span class="icon" @click="deletePerson(pIndex)"><i class="icon-delete"></i></span>
        </div>
        <div class="addPerson" @click="addPassernger">
          <span><i class="icon-increase icon"></i>选择乘客</span>
        </div>
      </div>
      <div class="seat-wrapper"></div>
      <el-button class="placing-order" type="primary" size="small" @click="placingOrder">提交订单</el-button>
    </div>
  </div>
</template>

<script>
import Calendar from '../calendar/Calendar'
export default {
  name: 'Order',
  data () {
    return {
      selectTicketLevel: -1,
      ticketType: '',
      personLists: []
    }
  },
  computed: {
    ticket () {
      return this.$store.state.ticket
    }
  },
  created () {
    for (let i = 0; i < this.ticket.ticket.length; i++) {
      if (this.ticket.ticket[i].ticketNum !== '无') {
        this.selectTicketLevel = i
        this.ticketType = this.ticket.ticket[i].ticketLevel
        break
      }
    }
    let personList = this.$store.state.personLists
    for (let i = 0; i < personList.length; i++) {
      if (personList[i].status) {
        this.personLists.push(personList[i])
      }
    }
  },
  components: {Calendar},
  methods: {
    addPassernger () {
      this.$router.push({name: 'passengers'})
    },
    // 下单
    placingOrder () {
      alert('下单成功！')
    },
    // 删除一个乘客
    deletePerson (index) {
      this.personLists.splice(index, 1)
    },
    // 选择火车票的等级: 一等座，二等座等等
    selectLevel (index) {
      if (this.ticket.ticket[index].ticketNum !== '无') {
        this.selectTicketLevel = index
        this.ticketType = this.ticket.ticket[index].ticketLevel
      }
    },
    // 返回上一层
    close () {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped lang="stylus">
@import "./order.styl"
</style>
