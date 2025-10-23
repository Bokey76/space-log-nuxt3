<script setup>
const store = useNuxtStore()
definePageMeta({
  layout: 'classics'
})
// 服务端 - 获取友链数据
const { data: linkData, error: getLinkDataError } = await useAsyncData('getLinkData', async () =>
  await api.getAllFriendLink().then(res => {
    const shuffleArray = (array) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // 生成随机索引
        [array[i], array[j]] = [array[j], array[i]]; // 交换元素
      }
      return array;
    }
    return {
      active: shuffleArray(res.rows.filter(item => item.status == 'active')),
      inactive: shuffleArray(res.rows.filter(item => item.status == 'inactive'))
    }
  })
)
let collapseInactiveKey = ref([])
let friendMsg = reactive({}) // 朋友信息
let addFriendLinkShow = ref(false)
const submitFriendMsg = () => { // 提交朋友信息
  api.submitFriendLink(friendMsg).then(res => {
    utils.analysisData(res)
  })
}
</script>

<template>
  <div id="link-page" class="content-box">
    <h1>朋友们<span>About Friend📍</span></h1>
    <a-card class="card" v-motion-fade-visible-once>
      <div class="flex justify-between">
        <div>
          <div class="card-title">友链🔮</div>
          <p class="pl-4 py-4">从这里通向其他的世界</p>
        </div>
        <a-button @click="addFriendLinkShow = true">申请友链</a-button>
      </div>
      <RepeatEmptyPlaceholder :dataReady="Boolean(linkData)" :dataShow="linkData?.active?.length > 0">
        <div class="active-box flex flex-wrap">
          <div class="p-4 w-full md:w-1/2 lg:w-1/3" v-for="item in linkData?.active" :key="item.id + 'activeLink'">
            <nuxt-link :to="item.url" target="_blank">
              <div class="w-full active-item relative flex p-8 overflow-hidden">
                <client-only>
                  <a-avatar :src="item.coverLink" :alt="item.id + '头像'" :size="64">
                    <template #icon>
                      <UserOutlined class="flex justify-center items-center w-full h-full" />
                    </template>
                  </a-avatar>
                </client-only>
                <div class="ml-4 flex flex-col justify-center flex-1">
                  <h3>{{ item.friendName }}</h3>
                  <span class="text-truncation text-lg">{{ item.description }}</span>
                </div>
                <img class=" friend-img absolute top-1/2 right-0" :src="item.coverLink"
                  onerror="this.style.display='none';">
              </div>
            </nuxt-link>
          </div>
        </div>
      </RepeatEmptyPlaceholder>
      <div class="p-4">
        <a-alert class="my-4 w-full" message="友链申请说明" type="info" show-icon>
          <template #description>
            <p class="py-1">🔒 请确保全站使用https</p>
            <p class="py-1">🍻 在友链中添加了Bokey Space</p>
            <p class="py-1">🔖 原创的博客内容</p>
          </template>
          <template #icon>
            <PushpinOutlined />
          </template>
        </a-alert>
      </div>
    </a-card>
    <a-card class="card my-8" v-motion-fade-visible-once>
      <div class="card-title my-8">失效友链📡</div>
      <a-collapse v-model:activeKey="collapseInactiveKey" ghost>
        <a-collapse-panel key="1" header="这些友链已经失效，如果恢复了请留言联系我⚠️">
          <div class="active-box flex flex-wrap">
            <div class="p-4 flex w-full md:w-1/2 lg:w-1/3" v-for="item in linkData?.inactive"
              :key="item.id + 'activeLink'">
              <div class="cursor-default w-full active-item relative flex p-8 overflow-hidden">
                <client-only>
                  <a-avatar :src="item.coverLink" :alt="item.id + '头像'" :size="64">
                    <template #icon>
                      <UserOutlined class="flex justify-center items-center w-full h-full" />
                    </template>
                  </a-avatar>
                </client-only>
                <div class="ml-4 flex flex-col justify-center flex-1">
                  <h3>{{ item.friendName }}</h3>
                  <span class="text-truncation text-lg">{{ item.description }}</span>
                </div>
                <img class=" friend-img absolute top-1/2 right-0" :src="item.coverLink"
                  onerror="this.style.display='none';">
              </div>
            </div>
          </div>
        </a-collapse-panel>
      </a-collapse>
    </a-card>
    <a-modal v-model:open="addFriendLinkShow" title="添加友链🌐" width="700px" @ok="submitFriendMsg" cancelText="取消"
      okText="提交">
      <div class="friend-input-box rounded p-4 flex flex-col items-center my-4 m-auto">
        <p class="pl-4 py-4">欢迎各位博主添加友链</p>
        <div class="md:columns-2 lg:columns-3 w-full">
          <div class="flex flex-col overflow-hidden">
            <div class="flex flex-col py-4">
              <span>名称</span>
              <a-input v-model:value="friendMsg.friendName" placeholder="请输入您的名称"></a-input>
            </div>
          </div>
          <div class="flex flex-col overflow-hidden">
            <div class="flex flex-col py-4">
              <span>网站链接</span>
              <a-input v-model:value="friendMsg.url" placeholder="请输入您的网站链接"></a-input>
            </div>
          </div>
          <div class="flex flex-col overflow-hidden">
            <div class="flex flex-col py-4">
              <span>头像链接</span>
              <a-input v-model:value="friendMsg.coverLink" placeholder="请输入您的头像链接"></a-input>
            </div>
          </div>
        </div>
        <div class="columns-1 w-full">
          <div class="flex flex-col py-4">
            <span>描述</span>
            <a-textarea v-model:value="friendMsg.description" placeholder="请输入您的描述" :rows="2" />
          </div>
        </div>
        <a-alert class="my-4 w-full" message="我的网站信息" type="info" show-icon>
          <template #description>
            <p class="py-1">📍名称：Bokey Space</p>
            <p class="py-1">👀简介：留下自己的痕迹</p>
            <p class="py-1">🔗链接：https://bokey.space/</p>
            <p class="py-1">📌头像：{{ store.$state.config['my-avatar']?.content }}</p>
          </template>
          <template #icon>
            <ApiOutlined />
          </template>
        </a-alert>
      </div>
    </a-modal>
  </div>
</template>

<style lang="scss" scoped>
#link-page {

  h1 {
    font-size: $large-font-size;
    font-weight: $large-font-weight;
    color: $main-text-color;
    margin: 2rem 5rem;

    span {
      font-size: $x-small-font-size;
      font-weight: $small-font-weight;
      color: $secondary-text-color;
      margin-left: 1rem;
    }

  }

  .card {
    color: $main-text-color;

    .card-title {
      transition: all .3s;
      font-size: $small-font-size;
    }

    &:hover .card-title {
      font-size: $medium-font-size;
    }

  }

  .active-box {

    .active-item {
      border: solid 1px $main-text-color;
      border-radius: 20px;
      cursor: $hover-cursor;

      h3 {
        transition: all .3s;
        font-size: $small-font-size;
      }

      &:hover h3 {
        font-size: $medium-font-size;
      }

      *:not(.img) {
        z-index: 5;
      }

      .friend-img {
        z-index: 1;
        opacity: .7;
        transform: translateY(-50%) translateX(20%);
        mask-image: linear-gradient(to right, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, .6) 90%, rgba(0, 0, 0, 1) 100%);
        -webkit-mask-image: linear-gradient(to right, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, .6) 90%, rgba(0, 0, 0, 1) 100%);
      }

      .text-truncation {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        /* 显示2行 */
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

  }
}
</style>