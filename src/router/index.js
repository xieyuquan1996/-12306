import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history', // 访问路径不带#号
  base: '/', // 默认URL为'/'
  routes: [
    {
      path: '/',
      redirect: '/index'
    },
    {
      path: '/index',
      name: 'index',
      component: () => import('../components/index/Index.vue') // 懒加载
    },
    {
      path: '/station/:stationStatus',
      name: 'station',
      component: () => import('../components/station/Station.vue')
    },
    {
      path: '/datePicker',
      name: 'datePicker',
      component: () => import('../components/datePicker/DatePicker.vue')
    },
    {
      path: '/ticket',
      name: 'ticket',
      component: () => import('../components/ticket/Ticket.vue')
    },
    {
      path: '/order',
      name: 'order',
      component: () => import('../components/order/Order.vue')
    },
    {
      path: '/passengers',
      name: 'passengers',
      component: () => import('../components/passengers/Passengers.vue')
    }
  ]
})
