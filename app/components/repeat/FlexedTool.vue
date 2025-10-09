<script setup>
const router = useRouter()
const route = useRoute()
const store = useNuxtStore()
import { notification } from 'ant-design-vue'
import { MdCatalog } from 'md-editor-v3';
const toTop = () => { // 回到顶部事件
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}
let toTopRef = ref(null)
const toTopShow = () => { // 判断回到顶部按钮是否显示
  if (document.body.scrollTop > 700 || document.documentElement.scrollTop > 700) {
    toTopRef.value.style.height = '7rem'
    toTopRef.value.style.border = 'auto'
  } else {
    toTopRef.value.style.border = 'none'
    toTopRef.value.style.height = '0px'
  }
}
const randomArticle = () => { // 随机文章事件
  notification.open({
    message: '📌提示',
    description: '正在开往其他随机文章🎲',
    placement: 'top',
    duration: 3,
  })
  api.getRandomArticleId(route.params.id).then(res => {
    router.push(`/log/article/detail/${res.id}`)
  })
}
let laterFriendLinkId = ref(null) // 上一个随机友链的id
const randomFriend = () => { // 随机友链事件
  notification.open({
    message: '📌提示',
    description: '正在开往其他友链🎰',
    placement: 'top',
    duration: 3,
  })
  api.getRandomFriendLink(laterFriendLinkId.value).then(res => {
    laterFriendLinkId.value = res.id
    window.open(res.url, '_blank')
  })
}
let mdCatalogShow = ref(false) // 显示文章目录状态量
let catalogToolShow = ref(false) // 显示目录按钮状态量
const catalogClick = (MouseEvent, TocItem) => { // 目录的点击事件
  document.querySelectorAll('.md-editor-catalog-link').forEach(item => { // 移除其他目录高亮项
    item.classList.remove('md-editor-catalog-active');
  });
  const catalogTarget = document.querySelector(`div > span[title="${TocItem.text}"]`).parentElement // 获取目录高亮项
  catalogTarget.classList.add('md-editor-catalog-active'); // 添加高亮项
  const tocDom = document.getElementById(TocItem.text) // 获取dom
  if (tocDom) { // 若存在，滚动到相应位置
    window.scrollTo({
      top: tocDom.offsetTop,
      behavior: 'smooth'
    })
    // 若是手机端，收起目录
    if(store.$state.windowSize.width < 768) {
      mdCatalogShow.value = false
    }
  }
}
watch(() => router.currentRoute.value.path, (newVal) => { // 控制目录按钮的显示/隐藏
  if ( /^\/log\/article\/.*/.test(newVal)) { // 若是文章页面
    catalogToolShow.value = true
  } else {
    catalogToolShow.value = false
  }
}, { immediate: true })
onMounted(() => {
  window.addEventListener('scroll', toTopShow)
})
onUnmounted(() => {
  window.removeEventListener('scroll', toTopShow)
})
</script>

<template>
  <div id="flexed-tool" class="fixed bottom-24 right-16 ">
    <a-space size="middle" class="flex flex-col">
      <div v-if="catalogToolShow" class="tool-item iconfont icon-sort" title="目录" @click="mdCatalogShow = true"></div>
      <div class="tool-item iconfont icon-touzi" title="随便看看" @click="randomArticle"></div>
      <div class="tool-item iconfont icon-lieche-copy" title="开往友链" @click="randomFriend"></div>
      <div ref="toTopRef" class="tool-item iconfont icon-rocket" title="回到顶部" @click="toTop"></div>
    </a-space>
    <a-drawer class="article-catalog-bar" v-model:open="mdCatalogShow" title="🔖目录" placement="left" >
      <MdCatalog v-if="mdCatalogShow" editorId="preview" :onClick="catalogClick" />
    </a-drawer>
  </div>
</template>

<style lang="scss" scoped>
#flexed-tool {

  .tool-item {
    cursor: $hover-cursor;
    font-size: 3rem;
    background-color: $main-car-color;
    border: .3px solid $main-background-color;
    border-radius: 50%;
    height: 7rem;
    width: 7rem;
    text-align: center;
    line-height: 7rem;
    overflow: hidden;
    transition: all .5s;

    &:hover {
      color: $main-color;
    }

  }

}
</style>

<style lang="scss">
.article-catalog-bar {
  background: $main-background-color !important;
  color: $main-text-color;
  .ant-drawer-header {
    .ant-drawer-close,.ant-drawer-title {
      color: $main-text-color;
    }
  }
}
</style>