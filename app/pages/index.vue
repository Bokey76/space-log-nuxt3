<script setup>
const router = useRouter()
const store = useNuxtStore()
definePageMeta({
  layout: 'classics'
})
const goTo = (url, $event) => { // 跳转到其他网站
  $event.stopPropagation();
  window.open(url, '_blank')
}
// 获取热门文章数据
const { data: articleData, error: articleError } = await useAsyncData('getArticleData', async () =>
  await api.getHottestArticleTen().then(res => {
    const hottestArticle = res.rows.shift()
    const hotArticleList = res.rows
    return {
      hottestArticle, hotArticleList
    }
  })
)
// 获取热门留言数据
const { data: hottestMessageList, error: hottestMessageError } = await useAsyncData('getMessageData', async () =>
  await api.getComment({
    currentPage: 1,
    pageSize: 20,
    userId: -1,
    order: '[["createTime", "DESC"]]'
  }).then(res => {
    return res.rows
  })
)
const likeMessage = (message) => { // 喜欢评论
  api.likeComment(message.id).then(res => {
    if (utils.analysisData(res)) {
      message.like += 1
    }
  })
}
</script>

<template>
  <div id="home" class="content-box">
    <a-card hoverable id="bokey" class="relative" @click="router.push('/about')">
      <img class="w-80 h-80 rounded-full mx-auto mb-6 mt-12 p-2" :src="store.$state.config['my-avatar']?.content"
        alt="BOKEY" v-motion-pop-visible-once>
      <h1 class="text-center text-6xl font-bold">Bokey</h1>
      <div class="mx-auto my-8 flex justify-center items-center gap-12">
        <div class="icon iconfont icon-github" @click="goTo('https://github.com/Bokey76', $event)" title="github"></div>
        <div class="icon iconfont icon-xiaohongshu"
          @click="goTo('https://www.xiaohongshu.com/user/profile/5c5858380000000018037278', $event)" title="小红书"></div>
        <div class="icon iconfont icon-xinlangweibo" @click="goTo('https://weibo.com/u/6209660620', $event)" title="微博">
        </div>
      </div>
    </a-card>
    <h1>🔥热门</h1>
    <RepeatEmptyPlaceholder :dataReady="Boolean(articleData)"
      :dataShow="!utils.isNullOrEmpty(articleData?.hottestArticle)">
      <RepeatDataCard id="topArticle" class="my-8" :data="articleData?.hottestArticle" :dataOption="{
        mainAttribute: 'topic',
        secondAttribute: 'introduction',
        additional: {
          icon: '🔥',
          attribute: 'popularity'
        }
      }" @click="router.push(`/log/article/detail/${articleData?.hottestArticle.id}`)" v-motion
        :initial="{ opacity: 0, y: 10 }" :visibleOnce="{
          opacity: 1, y: 0, transition: {
            duration: 300,
          },
        }" />
      <div class="columns-1 md:columns-2 lg:columns-3" id="article-bar">
        <div class="py-4" v-for="(item, index) in articleData?.hotArticleList" :key="index" v-motion
          :initial="{ opacity: 0, y: 10 }" :visibleOnce="{
            opacity: 1, y: 0, transition: {
              duration: 300,
            },
          }">
          <RepeatDataCard class="article-item" :column="true" :data="item"
            @click="router.push(`/log/article/detail/${item.id}`)" :dataOption="{
              mainAttribute: 'topic',
              secondAttribute: 'introduction',
              additional: {
                icon: '🔥',
                attribute: 'popularity'
              }
            }" />
        </div>
      </div>
      <RepeatMoreButton :clickEvent="() => router.push('/log/article')"></RepeatMoreButton>
    </RepeatEmptyPlaceholder>
    <h1>❤️‍🔥最近动态</h1>
    <RepeatEmptyPlaceholder :dataReady="Boolean(hottestMessageList)" :dataShow="hottestMessageList?.length > 0">
      <div class=" md:columns-2 lg:columns-3 gap-8">
        <div v-for="item in hottestMessageList" :key="item.id + 'massage'" class="py-4 overflow-hidden">
          <a-card class="massage-box" v-motion :initial="{ opacity: 0, y: 10 }" :visibleOnce="{
            opacity: 1, y: 0, transition: {
              duration: 300,
            },
          }">
            <a-tooltip :title="utils.formatDate(item.createTime, true)">
              {{ '🕘 ' + utils.formatDateSimple(item.createTime) }}
            </a-tooltip>
            <RepeatMdPreView :mdContent="item.content" class="child-md-view w-full">
            </RepeatMdPreView>
            <a-space :size="32">

            </a-space>
            <div class="flex justify-between mt-4">
              <div class="flex items-center cursor-point" @click="likeMessage(item)">
                <LikeOutlined />
                <span class="ml-4">{{ item.like > 0 ? item.like : '喜欢' }}</span>
              </div>
              <p class="mx-4">❤️{{ item.like }}</p>
            </div>
          </a-card>
        </div>
      </div>
      <RepeatMoreButton text="查看更多留言" :clickEvent="() => router.push('/message')"></RepeatMoreButton>
    </RepeatEmptyPlaceholder>
  </div>
</template>

<style lang="scss" scoped>
#home {

  h1 {
    color: $main-text-color;
  }

  #danmaku-container {
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    opacity: .4;
    overflow: hidden;
  }

  .danmaku {
    font-size: 100px;
  }

  img {
    background-color: $main-text-color;
  }

  img,
  .icon {
    transition: all .3s;
  }

  #bokey:hover img {
    width: 25rem;
    height: 25rem;
    padding: .2rem;
  }

  #description {
    color: $secondary-text-color;
  }

  .icon {
    font-size: $large-font-size;
    color: $main-text-color;
    border-radius: 50%;

    &:hover {
      font-size: $x-large-font-size;
    }

  }

  &>h1 {
    font-size: $large-font-size;
    font-weight: $large-font-weight;
    margin: 5rem auto;
  }

  #topArticle {
    height: 30rem;
  }

  @media (max-width:768px) {
    #topArticle {
      height: 40rem;
    }
  }

  #article-bar {
    gap: 2rem;

    .article-item {
      height: 40rem;
    }
  }

  .massage-box {
    color: $main-text-color;
  }

}
</style>