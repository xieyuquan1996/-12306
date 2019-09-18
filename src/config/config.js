const axios = require('axios')
export default {
  install (Vue, options) {
    /**
     * 获取全国火车站字典
     * @returns {Promise<any>}
     */
    Vue.prototype.getStation = function () {
      let that = this
      return new Promise((resolve) => {
        let url = '/api/index/script/core/common/station_name_v10037.js'
        axios.get(url).then(function (response) {
          let stationNames = response.data.split('\'')[1]
          let data = stationNames.split('@')
          let station = []
          for (let i = 1; i < data.length; i++) {
            let temp = {}
            let t = data[i].split('|')
            temp.stationNum = t[0].toUpperCase()
            temp.stationName = t[1]
            temp.stationId = t[2]
            temp.station = t[3]
            station.push(temp)
          }
          station.sort(function (a, b) {
            if (a.stationNum > b.stationNum) {
              return 1
            }
            if (a.stationNum < b.stationNum) {
              return -1
            }
            if (a.station > b.station) {
              return 1
            }
            if (a.station < b.station) {
              return -1
            }
            return 0
          })
          let stationData = []
          stationData.push({}) // 向数组push一个对象，避免赋值的时候失败
          stationData[0].title = 'A'
          stationData[0].station = []
          let index = 0
          for (let i = 0; i < station.length; i++) {
            if (station[i].stationNum[0] === stationData[index].title) {
              stationData[index].station.push(station[i])
            } else {
              index += 1
              stationData.push({})// 向数组push一个对象，避免赋值的时候失败
              stationData[index].title = station[i].stationNum[0]
              stationData[index].station = []
            }
          }
          that.$store.commit('setStation', stationData)
        })
        resolve()
      })
    }
    /**
     *  查询车票，全局函数
     * @returns {Promise<any>}
     */
    Vue.prototype.getTicketByAxios = function () {
      let that = this
      return new Promise(function (resolve) {
        let trainDate = that.$store.state.travelDate.getFullYear() + '-' + (Array(2).join('0') + (that.$store.state.travelDate.getMonth() + 1)).slice(-2) + '-' + (Array(2).join('0') + (that.$store.state.travelDate.getDate())).slice(-2)
        let fromStation = that.$store.state.startPlace.stationId
        let toStation = that.$store.state.endPlace.stationId
        let url = '/api/otn/leftTicket/queryA?leftTicketDTO.train_date=' + trainDate + '&leftTicketDTO.from_station=' + fromStation + '&leftTicketDTO.to_station=' + toStation + '&purpose_codes=ADULT'
        axios.get(url).then(function (response) { // 从12306中获取数据，并解析
          let data = response.data.data
          let ticket = []
          for (let i = 0; i < data.result.length; i++) {
            let d = {}
            let str = data.result[i].split('|')
            if (that.$store.state.speedRailway) {
              if (str[3].indexOf('G') === -1 && str[3].indexOf('D') === -1) {
                continue
              }
            }
            d.remark = str[1] // 12306中的备注信息：预定、12点30分起售或10点起售和 列车运行图调整,暂停发售 等等
            d.trainNo = str[2] // 每天的航班号，不同日期这个航班号不一样
            d.tripNum = str[3] // 列车代号号
            d.startStation = data.map[str[6]] // 起始站
            d.stopThroughInfo = [] // 经停站信息
            d.startStationTime = str[8] // 起始站出发时间
            d.startStationNum = str[6] // 起始站的代号
            d.endStation = data.map[str[7]] // 终点站名称
            d.endStationTime = str[9] // 达到终点站的时间
            d.endStationNum = str[7] // 终点站的代号
            d.travelTime = parseInt(str[10].split(':')[0]) + '小时' + parseInt(str[10].split(':')[1]) + '分钟' // 耗时
            d.dateNum = Math.floor((parseInt(str[8].split(':')[0]) + parseInt(str[10].split(':')[0])) / 24) // 天数
            if (str[4] === str[6]) {
              d.startStationStatus = '始'
            } else {
              d.startStationStatus = '过'
            }
            if (str[5] === str[7]) {
              d.endStationStatus = '终'
            } else {
              d.endStationStatus = '过'
            }
            d.ticket = [] // 该航班的车票数据
            let ticketLevel = []
            let ticketLevelStatus = [] // 表示各个等级座位的优先级
            for (let j = 21; j < 33; j++) {
              // 在动车中一等卧、二等卧和无座分别对应这火车的软卧、硬卧和硬座。
              if (str[3].indexOf('D') > -1) {
                ticketLevel = ['高软', '其他1', '一等卧', '其他2', '特等', '二等卧', '软座', '无座', '无座', '二等', '一等', '商务'] // 其他1和其他2目前不知道对应着哪个等级的座位
                ticketLevelStatus = [9, 2, 7, 1, 11, 6, 5, 4, 3, 8, 10, 12]
              } else {
                ticketLevel = ['高软', '其他1', '软卧', '其他2', '特等', '硬卧', '软座', '硬座', '无座', '二等', '一等', '商务']
                ticketLevelStatus = [9, 2, 7, 1, 11, 6, 5, 4, 3, 8, 10, 12]
              }
              if (str[j] !== '') {
                let jTemp = j
                let ticketTem = {}
                ticketTem.ticketLevel = ticketLevel[jTemp - 21] // 座位的等级名称：一等座，二等座等待
                ticketTem.ticketLevelStatus = ticketLevelStatus[jTemp - 21] // 座位等级的优先级大小
                if (str[j] !== '有' && str[j] !== '无' && str[j] !== '*') { // 火车票的数量目前已知四个状态，10，有，无，*。10代表10张。有/无代表火车票有无。*代表还未发售
                  ticketTem.ticketNum = str[j] + '张' // 对应座位的剩余票数
                } else {
                  ticketTem.ticketNum = str[j]
                }
                ticketTem.price = 0 // 对应座位的价格
                d.ticket.push(ticketTem)
              }
            }
            // 对各个等级的座位进行排序
            d.ticket.sort(function (a, b) {
              if (a.ticketLevelStatus > b.ticketLevelStatus) {
                return -1
              }
              if (a.ticketLevelStatus < b.ticketLevelStatus) {
                return 1
              }
              return 0
            })
            ticket.push(d)
          }
          that.$store.commit('setTicket', ticket)
        })
        resolve()
      })
    }
    /**
     *  查询某个航班的经停站
     * @param val
     * @param index
     * @param otherVal
     * @returns {Promise<any>}
     */
    Vue.prototype.getTicketByTrainNo = function (val, index, otherVal) {
      let that = this
      return new Promise(function (resolve) {
        let trainDate = that.$store.state.travelDate.getFullYear() + '-' + (Array(2).join('0') + (that.$store.state.travelDate.getMonth() + 1)).slice(-2) + '-' + (Array(2).join('0') + (that.$store.state.travelDate.getDate())).slice(-2)
        let url = '/api/otn/czxx/queryByTrainNo?train_no=' + val.trainNo + '&from_station_telecode=' + val.startStationNum + '&to_station_telecode=' + val.endStationNum + '&depart_date=' + trainDate
        // console.log(url)
        axios.get(url).then(function (response) {
          let val = {}
          val.index = index // 对应所有航班中的某个所选航班的index
          val.data = response.data.data
          if (otherVal === 0) {
            that.$store.commit('setTicketDataStopThroughInfo', val)
          }
          if (otherVal === 1) {
            that.$store.commit('setSortTicketStopThroughInfo', val)
          }
          that.getTicketPrice()
        })
        resolve()
      })
    }
    /**
     *  查询某个航班座位的价格
     * @returns {Promise<any>}
     */
    Vue.prototype.getTicketPrice = function () {
      let that = this
      return new Promise(function (resolve) {
        // let level = {A1: '硬座', WZ: '无座', A3: '硬卧', A4: '软卧', A9: '商务', M: '一等', O: '二等', A6: '高软', P: '特等'}
        let ticket = that.$store.state.ticket
        let trainNo = ticket.trainNo
        let level = [
          {type: 'A1', name: '硬座'},
          {type: 'WZ', name: '无座'},
          {type: 'A3', name: '硬卧'},
          {type: 'A4', name: '软卧'},
          {type: 'A9', name: '商务'},
          {type: 'M', name: '一等'},
          {type: 'O', name: '二等'},
          {type: 'A6', name: '高软'},
          {type: 'AI', name: '一等卧'},
          {type: 'AJ', name: '二等卧'},
          {type: 'P', name: '特等'}
        ]
        let seatTypes = ''
        for (let i = 0; i < ticket.ticket.length; i++) {
          let str = ticket.ticket[i].ticketLevel
          if (str !== '无座') {
            let d = level.find(function (val) {
              return val.name === str
            })
            if (typeof (d) !== 'undefined') {
              seatTypes += d.type[d.type.length - 1]
            }
          }
        }
        let fromStation = ticket.stopThroughInfo.find(function (val) {
          return val.station_name === ticket.startStation
        }).station_no
        let toStation = ticket.stopThroughInfo.find(function (val) {
          return val.station_name === ticket.endStation
        }).station_no
        let trainDate = that.$store.state.travelDate.getFullYear() + '-' + (Array(2).join('0') + (that.$store.state.travelDate.getMonth() + 1)).slice(-2) + '-' + (Array(2).join('0') + (that.$store.state.travelDate.getDate())).slice(-2)
        let url = '/api/otn/leftTicket/queryTicketPrice?train_no=' + trainNo + '&from_station_no=' + fromStation + '&to_station_no=' + toStation + '&seat_types=' + seatTypes + '&train_date=' + trainDate
        axios.get(url).then(function (response) {
          let priceList = []
          for (let i = 0; i < ticket.ticket.length; i++) {
            let str = ticket.ticket[i].ticketLevel
            let d = level.find(function (val) {
              return val.name === str
            })
            if (typeof (d) !== 'undefined') {
              d = d.type
              priceList.push(response.data.data[d])
            }
          }
          that.$store.commit('setTicketPrice', priceList)
        })
        resolve()
      })
    }
  }
}
