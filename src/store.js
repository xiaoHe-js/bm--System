import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userName: '', // 用户名称
    changedAsideActiveName: '' // 主页左侧边栏激活的tab名称
  },
  mutations: {
    setUserName(state, data) {
      state.userName = data
    },

    setChangedAsideActiveName(state, data) {
      state.changedAsideActiveName = data
    }
  },
  actions: {
    // 设置用户名称
    setUserName({ commit }, data) {
      commit('setUserName', data)
    },

    // 设置左侧边栏激活的tab值
    setChangedAsideActiveName({ commit }, data) {
      commit('setChangedAsideActiveName', data)
    }
  }
})
