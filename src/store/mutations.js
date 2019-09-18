export default {
  setTicketData (state, ticket) {
    state.ticket = ticket
  },
  setSpeedRailway (state, speedRailway) {
    state.speedRailway = speedRailway
  },
  changeStartPlace (state, startPlace) {
    state.startPlace = startPlace
  },
  changeEndPlace (state, endPlace) {
    state.endPlace = endPlace
  },
  changeTravelDate (state, travelDate) {
    state.travelDate = travelDate
  },
  setStation (state, station) {
    state.station = station
  },
  setTicket (state, ticket) {
    let dataTemp = ticket.concat() // 深拷贝
    state.ticketData = ticket.sort(function (a, b) {
      if (a.startStationTime > b.startStationTime) {
        return 1
      }
      if (a.startStationTime < b.startStationTime) {
        return -1
      }
      return 0
    })
    state.sortTicket = dataTemp.sort(function (a, b) { // 排序，按历时时间长短排
      if (a.travelTime > b.travelTime) {
        return 1
      }
      if (a.travelTime < b.travelTime) {
        return -1
      }
      if (a.startStationTime > b.startStationTime) {
        return 1
      }
      if (a.startStationTime < b.startStationTime) {
        return -1
      }
      return 0
    })
  },
  setTicketDataStopThroughInfo (state, val) {
    state.ticketData[val.index].stopThroughInfo = val.data.data
  },
  setSortTicketStopThroughInfo (state, val) {
    state.sortTicket[val.index].stopThroughInfo = val.data.data
  },
  setTicketPrice (state, val) {
    for (let i = 0; i < state.ticket.ticket.length; i++) {
      state.ticket.ticket[i].price = val[i]
    }
  },
  setPersonLists (state, val) {
    state.personLists = val
  }
}
