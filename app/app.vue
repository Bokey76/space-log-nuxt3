<script setup>
import { watch } from 'vue';
const router = useRouter()
import LightConfig from '@/assets/themeConfig/Light.json'
import DarkConfig from '@/assets/themeConfig/Dark.json'
const store = useNuxtStore()
// --rem设置--
// 重新设置根元素font-size
const reScreenSize = () => {
  const root = document.documentElement
  let w = root.clientWidth; // 获取设备的宽度
  if (w <= 786) {
    root.style.fontSize = '5px'
    return
  }
  let n =
    10 * (w / 1920) > 40
      ? 40
      : 10 * (w / 1920) >= 7.4
        ? 10 * (w / 1920)
        : 7.4;
  root.style.fontSize = n + 'px';
  store.setRem(n)
};
const resizeEvent = () => { // 窗口变化回调
  store.setWindowSize(window.innerWidth, window.innerHeight)
  reScreenSize()
}

// --主题/配置设置--
const setThemeMode = () => { // 获取缓存设置主题
  const theme = localStorage.getItem('theme')
  if (theme) store.setThemeMode(theme)
}
watch(() => store.themeMode, (newVal) => { // 监听store中主题变化，设置对应主题样式
  localStorage.setItem('theme', newVal) // 设置缓存
  const root = document.documentElement
  const config = newVal == 'Light' ? LightConfig : DarkConfig
  for (let attribute in config) {
    root.style.setProperty(attribute, config[attribute])
  }
})
const getGlobalCOnfig = async () => { // 获取并设置全局配置
  await api.getGlobalConfig().then(res => {
    store.setConfig(res)
    // 加载icon
    if (store.$state.config['icon-href']) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = store.$state.config['icon-href'].content
      document.head.appendChild(link);
    }
  })
}

// --基础SEO设置--
const seo = [
  {
    path: '/',
    title: 'Bokey Space',
    description: `Bokey Space📍，希望在世界留下我的痕迹。我是Bokey，一名深圳的前端程序员，
          在这里我会分享我的日常☕️、编程💻、成长✍🏻，我们都会成为自己想要的样子`
  },
  {
    path: '/about',
    title: '关于Bokey',
    description: '关于Bokey，这里是Bokey的简介，记录着我的成长🧩'
  },
  {
    path: '/log/article',
    title: 'Bokey的文章 【 Bokey Space 】',
    description: 'Bokey的文章详情📒'
  },
  {
    path: '/link',
    title: 'Bokey的朋友们',
    description: 'Bokey的友链，我们通过这种方式和世界链接，在浩瀚宇宙里，很高兴遇见你🪄'
  },
  {
    path: '/log/category',
    title: 'Bokey的文章类目列表',
    description: 'Bokey的文章类目，每个类下都是崭新的篇章📖'
  },
  {
    path: '/log/article',
    title: 'Bokey的文章列表',
    description: 'Bokey的文章列表，每一篇都是我的成长⭐️'
  },
  {
    path: '/message',
    title: '留言 【 Bokey Space 】',
    description: 'Bokey Space的留言板🌐，我们在这里畅所欲言，只为在这个世界留下属于自己的痕迹🌏'
  }
]
watch(() => router.currentRoute.value.path, (newVal) => {
  const seoItem = seo.find(item => item.path == newVal)
  if (seoItem) {
    const header = {
      title: seoItem.title,
      meta: []
    }
    if (seoItem.description) header.meta.push({
      name: 'description',
      content: seoItem.description
    })
    useHead(header)
  }
}, { immediate: true })

onMounted(async () => {
  window.addEventListener('resize', resizeEvent)
  resizeEvent()
  setThemeMode()
  await getGlobalCOnfig()
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeEvent)
})
</script>

<template>
  <NuxtLayout>
    <CommonInitialLoader></CommonInitialLoader>
    <NuxtPage />
  </NuxtLayout>
</template>

<style lang="scss"></style>