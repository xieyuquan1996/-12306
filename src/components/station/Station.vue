<template>
  <div class="station">
    <div class="header"><span><i class="icon-back" @click="close"></i></span><span class="title">车站选择</span></div>
    <div class="searchStation">
      <el-input size="small" placeholder="请输入城市/车站名" prefix-icon="el-icon-search" class="stationInput" v-model="stationName">
      </el-input>
    </div>
    <div class="content-wrapper" ref="stationWrapper" v-if="inputIsNull">
      <ul>
        <li v-for="(st,stIndex) in station" :key="st.title" class="station-list-hook">
          <h2 class="title">{{st.title}}</h2>
          <ul :class="{'show-more':moreList[stIndex],'show-less':!moreList[stIndex]}">
            <li v-for="s in st.station" :key="s.stationId" class="station" @click="selectStation(s)">{{s.stationName}}</li>
          </ul>
          <div class="content-more" @click="clickMore(stIndex)">{{moreMsg[stIndex]}}</div>
        </li>
      </ul>
    </div>
    <div class="selectStationTitle" v-if="!inputIsNull" ref="stationWrapper">
      <ul>
        <li v-for="s in selectStationData" :key="s.stationId" class="station" @click="selectStation(s)">{{s.stationName}}</li>
      </ul>
    </div>
    <div class="stationTitle" v-if="inputIsNull">
      <ul>
        <li v-for="(s,index) in station" :key="s.title" class="text" @click="selectMenu(index)">{{s.title}}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import BScroll from '@better-scroll/core'
const START_STATION = 1
export default {
  name: 'Station',
  data () {
    return {
      moreMsg: [], // 表示是查看更多还是收起更多
      moreList: [], // 表示查看更多各个标题的状态moreList[0]表示A是否点击了查看更多
      stationData: {}, // 表示返回给父组件的数据
      stationName: '', // 输入框填入的城市名
      selectStationData: [], // 根据输入的城市名查到的城市数据
      status: this.$route.params.stationStatus, // status'：是起始火车站还是终点火车站
      scrollY: 0 // 储存每次滚动，滚动到的坐标
    }
  },
  computed: {
    // 判断输入框输入的数据是否为空
    // 计算属性，只要当对象变的时候才会调用该计算属性
    inputIsNull () {
      if (this.stationName !== '') {
        this.searchStation()
        return false
      }
      return true
    },
    station () {
      return this.$store.state.station // 'station'：全国火车站字典；
    }
  },
  updated () {
    this.stationScroll.refresh() // 当DOM树变化是重新刷新bscroll
  },
  created () {
    // 初始化moreList，默认都没有点击查看更多
    for (let i = 0; i < this.station.length; i++) {
      this.moreList.push(false)
      this.moreMsg.push('查看更多车站')
    }
    // 初始化better-scroll
    this.$nextTick(() => {
      this._initScroll()
    })
  },
  methods: {
    // 点击查看更多
    clickMore (val) {
      // 不能使用this.moreList[val]=!this.moreList[val]
      // 因为在Vue中以上方式不是相应式的
      // 故只能使用Vue.set(this.moreList, val, !this.moreList[val])
      // 并导入import Vue from 'vue'
      Vue.set(this.moreList, val, !this.moreList[val])
      this.stationScroll.refresh()
      if (this.moreList[val]) {
        Vue.set(this.moreMsg, val, '收起更多车站')
      } else {
        Vue.set(this.moreMsg, val, '查看更多车站')
        this.selectMenu(val)
      }
    },
    // 选择右边的导航栏，就是那个A,B,C...。然后跳转到相应的位置
    selectMenu (index) {
      let stationList = this.$refs.stationWrapper.getElementsByClassName('station-list-hook')
      let el = stationList[index]
      this.stationScroll.scrollToElement(el, 200)
    },
    // 选择某个火车站
    selectStation (value) {
      this.stationData = value
      if (this.status === START_STATION) {
        this.$store.commit('changeStartPlace', value)
      } else {
        this.$store.commit('changeEndPlace', value)
      }
      this.close()
    },
    // 点击返回上一层
    close () {
      this.$router.go(-1)
    },
    _initScroll () {
      this.stationScroll = new BScroll(this.$refs.stationWrapper, {
        click: true
      })
    },
    // 根据输入的城市名查询符合的火车站列表
    searchStation () {
      this.selectStationData = []
      this.station.forEach(value => {
        value.station.forEach(v => {
          if (v.stationName.includes(this.stationName)) {
            this.selectStationData.push(v)
          }
        })
      })
    }
  }
}
</script>

<style scoped lang="stylus">
@import "./station.styl"
</style>
