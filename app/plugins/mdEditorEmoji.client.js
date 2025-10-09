import { Emoji } from '@vavt/v3-extension'
/**
 * @description: MdEditorEmoji 插件，需要在服务端渲染
 * @param {*}
 * @return {*}
 */
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('Emoji',Emoji) // 使用component注册Vue的组件
})

