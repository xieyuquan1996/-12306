<template>
  <div class="passenger">
    <div class="head">
      <span class="icon-left" @click="close"><i class="icon-back"></i></span>
      <span class="text">选择乘客</span>
      <span class="icon-right" @click="finish">完成</span>
    </div>
    <div class="content" ref="contentWrapper">
      <div class="add-person">
        <span class="person"><i class="icon-increase icon"></i><span>添加乘客</span></span>
        <span class="child"><i class="icon-baby"></i><span>添加随行儿童</span></span>
      </div>
      <div class="person-list">
        <div v-for="(person,index) in personLists" :key="index" class="person" @click="selectPerson(index)">
          <span class="select"><i :class="{'icon-selected':person.status,'icon-unchecked':!person.status}"></i></span>
          <span class="name">{{person.name}}</span>
          <span class="type">{{person.type}}</span>
          <span class="identity">{{person.identity}}</span>
          <span class="change"><i class="icon-change"></i></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BScroll from '@better-scroll/core'
import Vue from 'vue'
export default {
  name: 'Passengers',
  data () {
    return {
      personLists: this.$store.state.personLists,
      count: 1 // 记录选中的人数
    }
  },
  created () {
    this.$nextTick(() => {
      this._initScroll()
    })
    for (let i = 1; i < this.personLists.length; i++) {
      let tem = this.personLists[i]
      tem.status = false
      Vue.set(this.personLists, i, tem)
    }
  },
  updated () {
    this.contentScroll.refresh() // 当DOM变化时，重新刷新BScroll
  },
  methods: {
    selectPerson (index) {
      let tem = this.personLists[index]
      if (this.count < 5) {
        tem.status = !tem.status
        if (tem.status) {
          this.count += 1
        } else {
          this.count -= 1
        }
        Vue.set(this.personLists, index, tem)
        return
      }
      if (tem.status) {
        this.count -= 1
        tem.status = !tem.status
        Vue.set(this.personLists, index, tem)
        return
      }
      alert('最多只能选择5位乘客')
    },
    finish () {
      this.$store.commit('setPersonLists', this.personLists)
      this.close()
    },
    close () {
      this.$router.go(-1)
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
@import "./passengers.styl"
</style>
