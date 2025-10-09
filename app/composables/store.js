export const useNuxtStore = defineStore('nuxtStore', {
  state: () => ({
    windowSize: {
      width: 0,
      height: 0,
    }, // 窗口大小数据
    rem: 0, // rem的值(px)
    themeMode: 'light', // 主题模式
    user: {
      token: '', // token信息
    }, // 用户信息
    config: {}, // 全局配置
  }),
  actions: {
    setWindowSize(width, height) {
      this.windowSize.width = width
      this.windowSize.height = height
    },
    setRem(rem) {
      this.rem = rem
    },
    setThemeMode(mode) {
      this.themeMode = mode
    },
    setConfig(config) {
      this.config = config
    }
  },
  getters: {
    phoneModelOrNot(state) {
      return state.windowSize.width < 768
    }    
  },
})