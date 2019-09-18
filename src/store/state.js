export default {
  station: {},
  startPlace: {'stationNum': 'BJI', 'stationName': '北京', 'stationId': 'BJP'}, // 起始火车站
  endPlace: {'stationNum': 'SHA', 'stationName': '上海', 'stationId': 'SHH'}, // 终点火车站
  travelDate: new Date(), // 出行时间
  afterDate: new Date((new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())).getTime() + 1000 * 60 * 60 * 24 * 29), // 30天后时间
  currentDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()), // 当前时间
  ticketData: {}, // 按时间排序的车票数据
  sortTicket: {}, // 按历时排序的车票数据
  speedRailway: false, // 是否只筛选高铁,
  ticket: {}, // 下单的火车票
  personLists: [
    {
      status: true,
      name: '小王1',
      type: '学生',
      identity: '1234************567'
    },
    {
      status: false,
      name: '小王2',
      type: '成人',
      identity: '1234************567'
    },
    {
      status: false,
      name: '小王3',
      type: '成人',
      identity: '1234************567'
    },
    {
      status: false,
      name: '小王4',
      type: '学生',
      identity: '1234************567'
    },
    {
      status: false,
      name: '小王',
      type: '成人',
      identity: '1234************567'
    },
    {
      status: false,
      name: '小王5',
      type: '学生',
      identity: '1234************567'
    },
    {
      status: false,
      name: '小王6',
      type: '学生',
      identity: '1234************567'
    },
    {
      status: false,
      name: '小王7',
      type: '成人',
      identity: '1234************567'
    }
  ] // 所有的乘客列表
}
