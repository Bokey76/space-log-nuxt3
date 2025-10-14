<script setup>
import { computed } from "vue"
const store = useNuxtStore()
const route = useRoute()
const config = useRuntimeConfig();
definePageMeta({
  layout: 'classics'
})
let editorOptions = reactive({
  theme: "dark", // 主题 dark | light
  toolbarsExclude: ["github"], // 不显示的tool
  showCodeRowNumber: true, // 显示代码块的行号
  autoFoldThreshold: 100, // 代码块，默认折叠代码的行数
  toolbars: [
    "revoke",
    "next",
    1,
    "image",
    "bold",
    "underline",
    "italic",
    "-",
    "title",
    "strikeThrough",
    "quote",
    "unorderedList",
    "orderedList",
    "task",
    "-",
    "codeRow",
    "code",
    "link",
    "table",
    "-",
    "=",
    "preview",
    "previewOnly",
    "catalog",
  ], // 工具bar内容
  footers: ["markdownTotal", 0, "=", "scrollSwitch"], // 页脚内容
}); // md编辑器组件配置
let editorPreview = ref(true)
watch(() => store.themeMode, (newVal => {
  if (!utils.isNullOrEmpty(newVal)) {
    editorOptions.theme = newVal == 'Light' ? 'light' : 'dark'
  }
}), { immediate: true })
const initEditorPreview = () => { // 初始化md编辑器是否预览
  if (store.windowSize.width < 1024) {
    editorPreview.value = false
  } else {
    editorPreview.value = true
  }
}
const total = useState('total', () => 0)
const currentPage = useState('currentPage', () => route.params.page)
const pageSize = useState('pageSize', () => 10)
// 服务端 - 获取留言
const { data: messageList, error: messageListError } = await useAsyncData('getMessageList', async () => {
  total.value = 0
  currentPage.value = route.params.page
  pageSize.value = 10
  return await api.getComment({
    entityType: "Message",
    currentPage: currentPage.value,
    pageSize: pageSize.value,
    order: '[["createTime","DESC"],["like","DESC"]]'
  }).then(res => {
    total.value = res.count
    return res.rows
  })
}
)
if (messageListError) {
  console.log(messageListError);
}
/**
 * 获取所有留言
 * @param  { Boolean } init 是否初始化(pageSize=10,currentPage=1)，默认false
 * @param { Object } options 传递给后端的其他配置项
 */
const getMessageData = (init = false, options = { order: '[["createTime","DESC"],["like","DESC"]]' }) => {
  api.getComment({
    entityType: "Message",
    currentPage: init ? 1 : currentPage.value,
    pageSize: init ? 10 : pageSize.value,
    ...options
  }).then(res => {
    if (init) {
      messageList.value = res.rows
    } else {
      messageList.value.push(...res.rows)
    }
    total.value = res.count
  })
}
let actionBarShow = ref(false)
let messageSorting = ref(null) // 留言筛选器
const judgeMessageSortingGetMessageData = (init = false) => { // 判断当前messageSorting类型，请求对应数据
  switch (messageSorting.value) {
    case 'like':
      getMessageData(init, { order: '[["like", "DESC"]]' })
      break;
    case 'time':
      getMessageData(init, { order: '[["createTime", "DESC"]]' })
      break;
    case 'author':
      getMessageData(init, { userId: -1, order: '[["createTime", "DESC"]]' })
      break;
  }
}
watch(() => messageSorting.value, (newVal) => {
  if (!utils.isNullOrEmpty(newVal)) {
    currentPage.value = 2
    judgeMessageSortingGetMessageData(true)
  }
})
const getMoreMessage = () => { // 加载更多留言
  currentPage.value++
  if (utils.isNullOrEmpty(messageSorting.value)) {
    getMessageData()
  } else {
    judgeMessageSortingGetMessageData()
  }
}
let userData = reactive({}) // 登录用户数据
const getUserData = () => { // 获取用户数据
  const token = utils.getCookie('token')
  if (!utils.isNullOrEmpty(token)) { // 若登录了
    api.getUserDataByToken().then(res => {
      if (utils.analysisData(res, false)) { // 信息获取成功
        Object.assign(userData, res.data)
      } else { // 信息获取失败
        utils.removeCookie('token') // 去除token
        userData = {}
      }
    })
  }
}
const mdEditor = ref(null) // md编辑器实体
let currentMessage = reactive({
  entityType: "Message",
  entityId: -1,
})
const submitMessage = () => { // 提交留言
  api.addComment({
    content: mdEditor.value.mdContent, // 读取mdEditor组件的输入内容
    ...currentMessage
  }).then(res => {
    if (utils.analysisData(res)) {
      // pushNewDataInMessageList(res.data)
      mdEditor.value.mdContent = null // 清空内容
      currentMessage.parentId = null
      messageModelShow.value = false
      uploadUnSaveImagesPath.value = []; // 清空图片暂存
    }
  })
}
const pushNewDataInMessageList = async (newData) => { // 将新数据添加到list
  newData.childrenCount = 0
  newData.userId = userData.id
  newData.user = {
    id: userData.id,
    name: userData.name
  }
  if (!utils.isNullOrEmpty(newData.parentId)) { // 若是子级留言
    const parentMessage = messageList.value.find(message => message.id == newData.parentId)
    await switchChildMessage(parentMessage, true) // 获取所有子评论
    parentMessage.childMessageShowStatus = true
  } else { // 若是顶级留言
    messageList.value.unshift(newData)
  }
}
const likeMessage = (message) => { // 喜欢评论
  api.likeComment(message.id).then(res => {
    if (utils.analysisData(res)) {
      message.like += 1
    }
  })
}
let messageModelShow = ref(false)
// 在留言列表中查询留言的用户名
const currentParentMessageContent = computed(() => {
  if (utils.isNullOrEmpty(currentMessage.parentId)) return {
    userName: '未知用户',
    messageContent: null
  }
  let message = null
  messageFor:
  for (const item of messageList.value) {
    if (currentMessage.subUserId) { // 若找的是二级评论
      if (item.childMessageList && item.childMessageList.length > 0) {
        for (const childItem of item.childMessageList) {
          if (childItem.parentId == currentMessage.parentId && childItem.userId == currentMessage.subUserId) {
            message = childItem
            break messageFor // 跳出整个循环
          }
        }
      }
    } else { // 找的是一级评论
      if (item.id == currentMessage.parentId) {
        message = item
        break
      }
    }
  }
  if (message?.userId == -1) { // 管理员
    return {
      userName: store.$state.config['my-name']?.content,
      messageContent: message.content
    }
  } else {
    return {
      userName: message.user ? message.user?.name : '未知用户',
      messageContent: message.content
    }
  }
})
const ParsingReplyObject = (message) => { // 判断当前留言是否正在被回复
  if (currentMessage.subUserId) { // 若留言的是某评论的子评论
    return currentMessage.subUserId == message.userId && currentMessage.parentId == message.parentId
  } else { // 留言的是某留言
    return currentMessage.parentId == message.id
  }
}
/**
 * 获取所有子留言 or 展示/隐藏子留言
 * @param message 目标留言
 * @param { Boolean } refresh 是否强制刷新子留言，默认false
 */
const switchChildMessage = async (message, refresh = false) => {
  if (utils.isNullOrEmpty(message.childMessageList) || refresh) { // 第一次获取或者强制刷新
    await api.getSubComment({ id: message.id }).then(res => {
      message.childMessageList = res.rows
      message.childMessageShowStatus = true
    })
  } else { // 显示
    message.childMessageShowStatus = !message.childMessageShowStatus
  }
}
let uploadUnSaveImagesPath = ref([]); // 上传过未保存的图片路径
const messageImageUpload = async (files, callback) => { // 留言图片上传
  const res = await Promise.all( // 处理各个图片的上传
    files.map((file) => {
      return new Promise((rev, rej) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("path", `/image/messageImage/`); // 上传到oss的路径
        formData.append("uuidOrNot", true); // 上传到oss的路径
        api.uploadImage(formData).then((res) => { // 上传oss图片
          console.log(res);
          if (utils.analysisData(res)) {
            uploadUnSaveImagesPath.value.push(res.data.path); // 记录上传的未保存图片路径
            rev(res);
          } else {
            rej(res);
          }
        });
      });
    })
  );
  callback(res.map((item) => item.data.url)); // 执行回调，插入图片url
}
const deleteAllUploadImage = () => { // 删除所有上传到oss未保存的图片
  if (uploadUnSaveImagesPath.value.length > 0) {
    for (let path of uploadUnSaveImagesPath.value) {
      api.deleteImage({ path: path })
    }
    uploadUnSaveImagesPath.value = []; // 清空图片暂存
  }
}
const defaultUnSaveTip = () => { // 离开浏览器删除未保存的图片，用于浏览器的beforeUnload事件
  deleteAllUploadImage()
};
onBeforeRouteLeave(async (to, form, next) => { // 监听路由离开，删除未保存的图片
  await deleteAllUploadImage();
  next();
});
const phoneAdaptation = () => { // 手机端的留言工具栏适配
  // 等待 DOM 渲染完成后添加监听
  setTimeout(() => {
    const dropdowns = document.querySelectorAll('.md-editor-toolbar-wrapper')
    dropdowns.forEach((el) => {
      const scrollORClickEvent = () => {
        setTimeout(() => {
          const allDropdowns = document.querySelectorAll('.md-editor-dropdown')
          const hiddenDropdowns = document.querySelectorAll('.md-editor-dropdown-hidden')
          if (allDropdowns.length > hiddenDropdowns.length) { // 展示了
            el.style.overflow = 'visible'
          } else { // 隐藏了
            el.style.overflow = 'auto'
          }
        }, 100)
      }
      el.addEventListener('pointerdown', scrollORClickEvent)
    })
  }, 100)
}
onMounted(() => {
  getUserData()
  initEditorPreview()
  window.addEventListener("beforeunload", defaultUnSaveTip); // 监听浏览器关闭和刷新事件，提示还没保存
})
onBeforeUnmount(() => {
  window.removeEventListener("beforeunload", defaultUnSaveTip);
});
</script>

<template>
  <div id="message-page">
    <div class="w-full">
      <RepeatParallaxSlide containerClass="slide-container">
        <div v-for="item in store.$state.config['message-slide']?.content" :key="item.title">
          <div class="slide-container w-full relative flex flex-col justify-center items-center">
            <img class="md:w-full absolute top-0" :src="item.image">
            <div class="title text-center mb-8">{{ item.title }}</div>
            <p class="w-4/5 text-center my-8" v-for="text in item.text" :key="text" v-html="text">
            </p>
          </div>
        </div>
      </RepeatParallaxSlide>
    </div>
    <div id="message-page-content" class="content-box max-w-screen-lg">
      <div class="flex justify-between items-center">
        <h1>留言<span>Leave A Message👀</span></h1>
        <a-space class="hidden md:flex">
          <a-space direction="vertical">
            <a-radio-group v-model:value="messageSorting">
              <a-radio-button value="like">❤️按热度</a-radio-button>
              <a-radio-button value="time">🕑按时间</a-radio-button>
              <a-radio-button value="author">🧩作者</a-radio-button>
            </a-radio-group>
          </a-space>
          <!-- TODO 公安备案注释TEMP -->
          <!-- <a-button @click="messageModelShow = true; phoneAdaptation()">
            <template #icon>
              <FormatPainterOutlined />
            </template>
留下痕迹
</a-button> -->
        </a-space>
        <a-space class="flex md:hidden">
          <a-button class="flex justify-center items-center" @click="messageModelShow = true; phoneAdaptation()">
            <FormatPainterOutlined />
          </a-button>
          <a-button class="flex justify-center items-center" @click="actionBarShow = true">
            <EllipsisOutlined />
          </a-button>
        </a-space>
      </div>
      <div class="message-card mb-16">
        <RepeatEmptyPlaceholder :dataReady="Boolean(messageList)" :dataShow="messageList?.length > 0">
          <!-- 父评论 -->
          <div v-for="(message, index) in messageList" :key="message.id" v-motion-fade-visible-once>
            <div class="flex flex-row">
              <a-avatar
                :src="message.userId == -1 ? store.$state.config['my-avatar']?.content : `${config.public.ossUrl}/image/userAvatar/${message.user?.id}.png`"
                :alt="message.user?.name + '头像'" :size="store.phoneModelOrNot ? 32 : 64">
                <template #icon>
                  <UserOutlined class="flex justify-center items-center w-full h-full user-outlined" />
                </template>
              </a-avatar>
              <div class="md-view-box ml-8 pt-0 flex-1 overflow-hidden">
                <div class="view-box-top-bar flex items-center justify-between py-4 px-8">
                  <div class="flex items-center message-text">
                    <h4>{{ message.userId == -1 ? store.$state.config['my-name']?.content : message.user?.name }}</h4>
                    <a-tooltip :title="utils.formatDate(message.createTime, true)">
                      <p class="ml-4 cursor-point">{{ utils.formatDateSimple(message.createTime, true) }}</p>
                    </a-tooltip>
                  </div>
                  <a-dropdown>
                    <EllipsisOutlined class="cursor-point text-5xl" />
                    <template #overlay>
                      <a-menu>
                        <a-menu-item @click="likeMessage(message)">
                          ❤️喜欢
                        </a-menu-item>
                        <a-menu-item v-if="message.childrenCount > 0" @click="switchChildMessage(message)">
                          👀{{ message.childMessageShowStatus ? '收起' : '展开' }}所有留言
                        </a-menu-item>
                        <!-- <a-menu-item
                          @click="currentMessage.parentId = message.id; currentMessage.subUserId = null; messageModelShow = true">
                          ✏️{{ (ParsingReplyObject(message) ? "回复中" : "回复") }}
                        </a-menu-item> -->
                      </a-menu>
                    </template>
                  </a-dropdown>
                </div>
                <RepeatMdPreView :mdContent="message.content" class="w-full">
                </RepeatMdPreView>
                <div class="flex justify-end p-8 pt-0" v-if="message.childrenCount > 0 || message.like > 0">
                  <p class="mx-4">💭{{ message.childrenCount }}</p>
                  <p class="mx-4">❤️{{ message.like }}</p>
                </div>
              </div>
            </div>
            <div class="message-parting ml-64 h-16">
            </div>
            <!-- 子评论 -->
            <div class="child-message-box relative pl-48 pb-16"
              v-if="message.childMessageShowStatus && message.childMessageList.length > 0">
              <div class="pl-16 z-20 relative" style="transform: translateX(-16px);"
                v-for="childMessage in message.childMessageList" :key="childMessage.id">
                <a-comment>
                  <template #actions>
                    <a-space :size="32">
                      <div class="actions flex items-center" @click="likeMessage(childMessage)">
                        <LikeOutlined />
                        <span class="ml-4">{{ childMessage.like > 0 ? childMessage.like : '喜欢' }}</span>
                      </div>
                      <!-- <div class="actions flex items-center"
                        @click="currentMessage.parentId = childMessage.parentId; currentMessage.subUserId = childMessage.userId; messageModelShow = true">
                        <MessageOutlined />
                        <span class="ml-4">回复</span>
                      </div> -->
                    </a-space>
                  </template>
                  <template #author>
                    <h4 class="username">{{ childMessage.userId == -1 ? store.$state.config['my-name']?.content :
                      childMessage.user?.name }}</h4>
                  </template>
                  <template #avatar>
                    <a-avatar class="cursor-default"
                      :src="childMessage.userId == -1 ? store.$state.config['my-avatar']?.content : `${config.public.ossUrl}/image/userAvatar/${childMessage.user?.id}.png`"
                      :alt="childMessage.user?.name + '头像'">
                      <template #icon>
                        <UserOutlined class="flex justify-center items-center w-full h-full user-outlined" />
                      </template>
                    </a-avatar>
                  </template>
                  <template #content>
                    <RepeatMdPreView :mdContent="childMessage.content" class="child-md-view w-full">
                    </RepeatMdPreView>
                  </template>
                  <template #datetime>
                    <span class="mr-2" v-if="!utils.isNullOrEmpty(childMessage.subUserId)">{{
                      `@${childMessage.subUserId == -1 ? store.$state.config['my-name']?.content :
                        childMessage.subUser?.name}` }}</span>
                    <a-tooltip :title="utils.formatDate(childMessage.createTime, true)">
                      <span class="cursor-point">{{ utils.formatDateSimple(childMessage.createTime, true) }}</span>
                    </a-tooltip>
                  </template>
                </a-comment>
              </div>
              <div class="child-message-parting z-10 absolute h-full top-0 left-64"></div>
            </div>
            <div class="relative ml-64"
              v-if="(index >= (messageList?.length - 1) && index < (total - 1)) && (messageList?.length < total - ((route.params.page - 1) * pageSize))">
              <a :href="`/message/${Number(currentPage) + 1}`" @click.prevent="getMoreMessage">
                <a-button class="add-more-btn absolute flex items-center" shape="round" size="large">
                  ➕加载更多
                </a-button>
              </a>
              <!-- 撑开宽度的假按钮 -->
              <a-button class="invisible" size="large">加载更多</a-button>
            </div>
            <div class="no-more-line pl-44 pt-4" v-else-if="index >= (messageList?.length - 1)">到底线啦🌼一起留下痕迹叭</div>
          </div>
        </RepeatEmptyPlaceholder>
      </div>
      <a-modal v-model:open="messageModelShow" class="addMessageModal" title="留言" ok-text="提交" cancel-text="取消"
        :width="store.$state.windowSize.width < 768 ? '100vw' : '60vw'" @ok="submitMessage">
        <div class="model-content flex flex-col">
          <p class="mt-4 mb-4">⚠️限制1500字（Tips:该工具栏可以拖动）</p>
          <div v-if="currentMessage.parentId" id="replyObj" class="py-2 flex items-center">
            <p>回复@{{ currentParentMessageContent.userName }}:{{
              currentParentMessageContent.messageContent }}</p>
            <CloseOutlined class="p-2 ml-4" @click="currentMessage.parentId = null; currentMessage.subUserId = null;" />
          </div>
          <client-only>
            <RepeatMdEditor ref="mdEditor" class="grow h-3/5" :options="editorOptions" :preview="editorPreview"
              :uploadImage="messageImageUpload">
            </RepeatMdEditor>
          </client-only>
        </div>
      </a-modal>
    </div>
    <a-drawer v-model:open="actionBarShow" title="ACTION" width="70vw">
      <a-radio-group v-model:value="messageSorting" class="flex flex-col">
        <a-radio value="like" class="mb-4">❤️按热度</a-radio>
        <a-radio value="time" class="mb-4">🕑按时间</a-radio>
        <a-radio value="author" class="mb-4">🧩作者</a-radio>
      </a-radio-group>
    </a-drawer>
  </div>
</template>

<style lang="scss" scoped>
#message-page {

  .slide-container {
    min-height: 45rem;

    img {
      z-index: 1;
      opacity: .8;
    }

    .title {
      font-weight: $large-font-weight;
      font-size: $large-font-size;
    }

    div,
    p {
      z-index: 2;
      color: $main-text-color;
    }

    p {
      font-size: $small-font-size;
      margin: 1rem auto;
    }

  }

  #message-page-content {

    h1 {
      font-size: $large-font-size;
      font-weight: $large-font-weight;
      color: $main-text-color;
      margin: 2rem 0;

      span {
        font-size: $x-small-font-size;
        font-weight: $small-font-weight;
        color: $secondary-text-color;
        margin-left: 1rem;
      }
    }

    .message-card {
      font-size: $small-font-size;
      min-height: 30vh;
      color: $main-text-color;

      .card-title {
        font-size: $small-font-size;
        transition: all .3s;
      }

      &:hover .card-title {
        font-size: $medium-font-size;
      }

    }

    .message-parting {
      border-left: 2px solid $secondary-text-color;
    }

    .add-more-btn {
      transform: translateX(-50%);
    }

    .no-more-line {
      border-top: solid 1px $main-text-color;
      font-size: $small-font-size;
    }

    .md-view-box {
      border-radius: 5px;
      border: 1px solid $secondary-text-color;
      background-color: $main-car-color;

      .view-box-top-bar {
        border-bottom: 1px solid $secondary-text-color;
        background-color: $main-background-color;

        .message-text {
          p {
            color: $secondary-text-color;
          }
        }

      }

    }

    .child-message-box {

      .child-md-view {
        padding: 1rem 2rem;
        background-color: $main-background-color !important;
      }

      .username {
        color: $main-text-color;
        font-size: $small-font-size;
      }

      .actions {
        cursor: $hover-cursor;
        color: $main-text-color;

        &:hover {
          color: $main-text-color;
        }
      }

      .child-message-parting {
        border-left: 2px solid $secondary-text-color;
      }

    }

  }

}

.model-content {
  color: $main-text-color;
  height: 60vh;

  #replyObj {
    font-size: $x-small-font-size;

    p {
      color: $secondary-text-color;
      /* 禁止换行 */
      white-space: nowrap;
      /* 隐藏超出部分 */
      overflow: hidden;
      /* 使用省略号表示超出部分 */
      text-overflow: ellipsis;
    }

    // 回复相关评论的关闭按钮
    .anticon-close {
      background-color: $main-background-color;
      color: $main-text-color;
      border-radius: 50%;
      cursor: $hover-cursor;
    }

  }
}

.user-outlined {
  background-color: #585858;
}
</style>
<style>
.md-editor-toolbar-wrapper {
  overflow: auto;
}

.md-editor-dropdown {
  /* position: fixed; */
}

/* .md-editor-toolbar-wrapper .md-editor-toolbar-left, .md-editor-toolbar-wrapper .md-editor-toolbar-right {
    flex-wrap: wrap;
    padding: 0;
} */
</style>