<script setup>
import { computed } from 'vue'
const router = useRouter()
const store = useNuxtStore()
const config = useRuntimeConfig();
const route = useRoute()

definePageMeta({
    layout: 'classics',
})

// 获取文章数据以及文章内容
const { data: articleData, error: articleError } = await useAsyncData('getArticleDetail', async () => {
    const id = route.params.id
    return await api.getArticleContentById(id).then(res => {
        return {
            mdContent: res.content, ...res.data
        }
    })
}
)
useHead({
    title: `${articleData.value?.topic} 【 Bokey Space 】`,
    meta: [
        {
            name: 'description',
            content: articleData.value?.introduction
        }
    ]
})
const getArticleType = (id) => { // 获取文章类别数据
    api.getArticleTypeById(id).then(res => {
        articleData.value.typeTheme = res?.theme
    })
}
watch(() => route.params.id, (newVal) => { // 监听路由中id参数的变化，变化就重新获取文章内容
    getArticleType(newVal)
    if (window) {
        window.scrollTo(0, 0); // 滚动到页面顶部
    }
}, {
    immediate: true
})
let headerTopicRef = ref(null)
let headerIntroductionRef = ref(null)
let showIntroductionOrNot = (showOrNot) => { // 控制文章标题和简介的显示/隐藏
    if (showOrNot) {
        headerTopicRef.value.style.opacity = '0'
        headerTopicRef.value.style.height = '0'
        headerTopicRef.value.classList.remove('flex-auto')
        headerTopicRef.value.classList.add('flex-none')
        headerIntroductionRef.value.style.opacity = '1'
        headerIntroductionRef.value.classList.remove('flex-none')
        headerIntroductionRef.value.classList.add('flex-auto')
    } else {
        headerTopicRef.value.style.opacity = '1'
        headerTopicRef.value.classList.remove('flex-none')
        headerTopicRef.value.classList.add('flex-auto')
        headerIntroductionRef.value.style.opacity = '0'
        headerIntroductionRef.value.classList.remove('flex-auto')
        headerIntroductionRef.value.classList.add('flex-none')
    }
}

// #region 版权模块
const statementData = ref([
    {
        name: '发布于',
        attribute: 'createTime',
        time: true
    },
    {
        name: '更新于',
        attribute: 'updatedTime',
        time: true
    },
    {
        name: '类目',
        attribute: 'typeTheme'
    },
])
const goTo = (url, $event) => { // 跳转到其他网站
    $event.stopPropagation();
    window.open(url, '_blank')
}
// #endregion

// #region 操作模块
let like = ref(false) // 标记是否喜欢
const likeEvent = () => { // 喜欢文章事件
    api.likeArticleById(articleData.value.id).then(res => {
        if (utils.analysisData(res)) {
            like.value = true
            articleData.value.like += 1
        }
    })
}
const shareEvent = () => { // 分享文章url事件
    const url = window.location.href;
    const prompt = () => { // 提示成功函数
        notification.open({
            message: '🔗复制连接成功',
            description: '分享给小伙伴叭，但请务必尊重本文的版权协议📍',
            placement: 'top',
            duration: 3,
        })
    }
    if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(() => {
            prompt()
        }).catch(err => {
            console.error('复制失败:', err);
        });
    } else {
        // 处理不支持 clipboard API 的情况
        const textarea = document.createElement('textarea');
        textarea.value = url;
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            prompt()
        } catch (err) {
            notification.open({
                message: '❗️提示',
                description: '复制连接失败，浏览器版本过低🔍',
                placement: 'top',
                duration: 3,
            })
        }
        document.body.removeChild(textarea);
    }
}
const showReward = () => { // 显示打赏事件
    notification.open({
        message: '📌提示',
        description: '打赏功能还在开发中，感谢支持😘',
        placement: 'top',
        duration: 3,
    })
}
// #endregion

// #region 评论
let commentList = ref([]) // 评论列表
let currentCommentPage = ref(2) // 当前评论页
let pageSize = ref(10) // 页大小
let commentTotal = ref(0) // 总数
let currentComment = reactive({
    entityType: "Article",
    content: null
}) // 当前评论
let imageFileList = ref([]) // 图片上传数组
let commentListReady = ref(false) // 拿到评论列表状态量
/**
 * 获取该文章所有评论
 * @param  { Boolean } init 是否是评论区初始化(pageSize=10,currentPage=1)，默认false
 */
const getCommentData = (init = false) => {
    api.getComment({
        entityType: "Article",
        entityId: router.currentRoute.value.query.id,
        currentPage: init ? 1 : currentCommentPage.value++,
        pageSize: init ? 10 : pageSize.value
    }).then(res => {
        if (init) {
            commentList.value = res.rows
        } else {
            commentList.value.push(...res.rows)
        }
        commentTotal.value = res.count
        commentListReady.value = true // 已获取内容
    })
}
const commentBar = ref(null)
const commentBarScroll = () => { // 评论区滚动的事件监听
    if (commentBar.value.scrollTop + commentBar.value.clientHeight >= commentBar.value.scrollHeight - 200 && commentList.value.length < commentTotal.value) {
        getCommentData()
    }
}
let submittingCommentLoading = ref(false) // 正在提交评论状态量
const submitComment = () => { // 提交评论
    submittingCommentLoading.value = true
    api.addComment({
        entityId: router.currentRoute.value.query.id,
        ...currentComment
    }).then(res => {
        if (utils.analysisData(res)) {
            currentComment.content = null
            currentComment.parentId = null
            pushNewDataInCommentList(res.data)
        }
        submittingCommentLoading.value = false
    })
    // TODO 评论上传图片相关逻辑
}
const pushNewDataInCommentList = async (newData) => { // 将新数据添加到list
    newData.childrenCount = 0
    newData.userId = userData.id
    newData.user = {
        id: userData.id,
        name: userData.name
    }
    if (!utils.isNullOrEmpty(newData.parentId)) { // 若是子级评论
        const parentComment = commentList.value.find(comment => comment.id == newData.parentId)
        await switchChildComment(parentComment, true) // 获取所有子评论
        if (parentComment.childrenCount <= 0) {
            parentComment.childrenCount = 1
        }
        parentComment.childCommentShowStatus = true
    } else { // 若是顶级评论
        commentList.value.unshift(newData)
    }
}
/**
 * 获取所有子评论 or 展示/隐藏子评论
 * @param comment 目标评论
 * @param {Boolean} refresh 是否刷新数据，默认false
 */
const switchChildComment = async (comment, refresh = false) => {
    if (utils.isNullOrEmpty(comment.childCommentList) || refresh) { // 第一次获取
        await api.getSubComment({ id: comment.id }).then(res => {
            comment.childCommentList = res.rows
            comment.childCommentShowStatus = true
        })
    } else { // 显示
        comment.childCommentShowStatus = !comment.childCommentShowStatus
    }
}
// 在评论列表中查询评论的用户名
const currentParentCommentContent = computed(() => {
    if (utils.isNullOrEmpty(currentComment.parentId)) return {
        userName: '未知用户',
        commentContent: null
    }
    let comment = null
    commentFor:
    for (const item of commentList.value) {
        if (currentComment.subUserId) { // 若找的是二级评论
            if (item.childCommentList && item.childCommentList.length > 0) {
                for (const childItem of item.childCommentList) {
                    if (childItem.parentId == currentComment.parentId && childItem.userId == currentComment.subUserId) {
                        comment = childItem
                        break commentFor // 跳出整个循环
                    }
                }
            }
        } else { // 找的是一级评论
            if (item.id == currentComment.parentId) {
                comment = item
                break
            }
        }
    }
    if (comment?.userId == -1) { // 管理员
        return {
            userName: store.$state.config['my-name']?.content,
            commentContent: comment.content
        }
    } else {
        return {
            userName: comment.user ? comment.user?.name : '未知用户',
            commentContent: comment.content
        }
    }
})
const addEmoji = (emoji) => {
    if (currentComment.content) {
        currentComment.content += emoji
    } else {
        currentComment.content = emoji
    }
}
const likeComment = (comment) => { // 喜欢评论
    api.likeComment(comment.id).then(res => {
        if (utils.analysisData(res)) {
            comment.like += 1
        }
    })
}
const getImageFileUrl = (fileObj) => { // 生成并得到文件URL
    let url = null
    if (fileObj?.originFileObj) {
        url = URL.createObjectURL(fileObj.originFileObj); // 创建临时 URL
    }
    return url
}
// #endregion

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
onMounted(() => {
    getUserData()
    getCommentData(true)
})
</script>

<template>
    <div id="log-page" class="content-box">
        <!-- 顶部文章卡片 -->
        <a-card id="log-header" class="my-8 rounded-2xl relative" hoverable @mouseenter="showIntroductionOrNot(true)"
            @mouseleave="showIntroductionOrNot(false)">
            <div class="header h-full w-full bg-contain flex flex-col">
                <div class="z1 text-right">
                    <span class="mx-4 text-lg">💓 {{ articleData?.like }}</span>
                    <span class="mx-4 text-lg">🔥 {{ articleData?.popularity }}</span>
                </div>
                <h1 ref="headerTopicRef" class="topic flex flex-auto justify-center z1 items-center text-center">{{
                    articleData?.topic
                }}</h1>
                <h2 ref="headerIntroductionRef"
                    class="introduction z1 flex flex-auto justify-center items-center text-center">{{
                        articleData?.introduction
                    }}</h2>
                <div class="z1 text-lg">🕘 {{ utils.formatDate(articleData?.createTime) }}</div>
            </div>
            <div id="image-box" class="absolute top-0 left-0 w-full h-full rounded-2xl overflow-hidden">
                <img :src="`${config.public.ossUrl}/image/articleCover/${articleData?.id}.png`" class="h-full w-full"
                    :preview="false" />
                <div id="inner" class="absolute top-0 left-0 w-full h-full"></div>
            </div>
        </a-card>
        <!-- 文章内容 -->
        <div id="log-content" class="flex my-8">
            <RepeatEmptyPlaceholder :dataShow="articleData?.mdContent.length > 0" class="w-full">
                <RepeatMdPreView :mdContent="articleData?.mdContent">
                </RepeatMdPreView>
            </RepeatEmptyPlaceholder>
        </div>
        <!-- 版权 -->
        <div id="statement-bar" class="my-8 mx-auto p-8 flex flex-col relative overflow-hidden">
            <div class="my-4 mx-4">{{ articleData?.topic }}</div>
            <ul class="flex flex-row flex-wrap">
                <li v-for="item in statementData" :key="item.name" class="m-4">
                    <p>{{ item.name }}</p>
                    <p>{{ item.time ? utils.formatDate(articleData?.[item.attribute]) : articleData?.[item.attribute] }}
                    </p>
                </li>
                <li class="m-4">
                    <p>作者</p>
                    <p>Bokey</p>
                </li>
                <li class="m-4">
                    <p>版权协议</p>
                    <div id="copyright" class="flex flex-row">
                        <p class="iconfont icon-creativecommonssharealike" title="Creative Commons"
                            @click="goTo('https://creativecommons.org/', $event)"></p>
                        <p class="iconfont icon-attribute1" title="Attribution"
                            @click="goTo('https://creativecommons.org/licenses/by/4.0/', $event)"></p>
                        <p class="iconfont icon-creative-commons-noncommercial-us" title="NonCommercial"
                            @click="goTo('https://creativecommons.org/licenses/by-nc/4.0/', $event)"></p>
                        <p class="iconfont icon-creativecommonssharealike" title="ShareAlike"
                            @click="goTo('https://creativecommons.org/licenses/by-nc-sa/4.0/', $event)"></p>
                    </div>
                </li>
            </ul>
            <div id="statement-bgc" class="rounded-full absolute flex justify-center items-center"><span>cc</span></div>
        </div>
        <!-- 操作 -->
        <div id="action-bar" class="flex justify-center items-center my-32">
            <a-tooltip placement="bottom" title="🍬点个赞鼓励一下">
                <p :id="like ? 'active' : ''" class="icon iconfont icon-dianzan rounded-full mx-8 text-center"
                    title="点赞" @click="likeEvent"></p>
            </a-tooltip>
            <a-tooltip placement="bottom" title="🍻给隔壁老铁看看">
                <p class="icon iconfont icon-fenxiang rounded-full mx-8 text-center" title="分享" @click="shareEvent"></p>
            </a-tooltip>
            <a-tooltip placement="bottom" title="🍭打赏功能开发中~感谢好意">
                <p class="icon iconfont icon-liwu rounded-full mx-8 text-center" title="打赏" @click="showReward"></p>
            </a-tooltip>
            <!-- <a-popover :overlay-inner-style="{ padding: 0 }">
                <template #content>
                    <div>
                        <a-qrcode :value="config.public.baseUrl + '/reward'" :bordered="false" />
                    </div>
                </template>
<a-tooltip placement="bottom" title="🍭赏点银子，拿去恰饭">
    <p class="icon iconfont icon-liwu rounded-full mx-8 text-center" title="打赏" @click="showReward"></p>
</a-tooltip>
</a-popover> -->
        </div>
        <!-- TODO 公安备案注释TEMP -->
        <!-- 评论 -->
        <!-- <div id="comment-bar" ref="comment-bar" class="mb-36 p-16">
            <h2>评论列表☁️</h2>
            <RepeatEmptyPlaceholder :dataReady="commentListReady" :dataShow="commentList.length > 0">
                <div @scroll="commentBarScroll" ref="commentBar" class="overflow-y-auto comment-list">
                    <a-comment v-for="comment in commentList" :key="comment.id + 'comment'">
                        <template #actions>
                            <a-space>
                                <template #split>
                                    <a-divider type="vertical" />
                                </template>
                                <a-button type="text"
                                    @click="currentComment.parentId = comment.id; currentComment.subUserId = null;">
                                    回复
                                </a-button>
                                <a-button type="text" @click="likeComment(comment)">
                                    点赞
                                </a-button>
                                <a-button type="text" v-if="comment.childrenCount > 0"
                                    @click="switchChildComment(comment)">{{
                                        (comment.childCommentShowStatus ? '收起' : '展开') + comment.childrenCount
                                    }}条评论</a-button>
                            </a-space>
                        </template>
                        <template #author>
                            <p>{{ comment.userId == -1 ? store.$state.config['my-name']?.content : comment.user?.name }}
                            </p>
                        </template>
                        <template #avatar>
                            <a-avatar
                                :src="comment.userId == -1 ? store.$state.config['my-avatar']?.content : `${config.public.ossUrl}/image/userAvatar/${comment.user?.id}.png`"
                                :alt="comment.user?.name + '头像'">
                                <template #icon>
                                    <UserOutlined class="flex justify-center items-center w-full h-full" />
                                </template>
                            </a-avatar>
                        </template>
                        <template #content>
                            <p class="comment-content">
                                {{ comment.content }}
                            </p>
                            <div class="flex items-center justify-between pt-4">
                                <a-tooltip :title="utils.formatDate(comment.createTime, true)">
                                    <p class="comment-time">{{ utils.formatDateSimple(comment.createTime) }}</p>
                                </a-tooltip>
                                <span>
                                    {{ '❤️' + comment.like }}
                                </span>
                            </div>
                        </template>
                        <template v-if="comment.childCommentShowStatus">
                            <a-comment v-for="childComment in comment.childCommentList"
                                :key="childComment.id + 'childComment'">
                                <template #actions>
                                    <a-space>
                                        <template #split>
                                            <a-divider type="vertical" />
                                        </template>
                                        <a-button type="text"
                                            @click="currentComment.parentId = childComment.parentId; currentComment.subUserId = childComment.userId;">
                                            回复
                                        </a-button>
                                        <a-button type="text" @click="likeComment(childComment)">
                                            点赞
                                        </a-button>
                                    </a-space>
                                </template>
                                <template #author>
                                    <p>{{ childComment.userId == -1 ? store.$state.config['my-name']?.content :
                                        childComment.user?.name }}</p>
                                </template>
                                <template #avatar>
                                    <a-avatar
                                        :src="childComment.userId == -1 ? store.$state.config['my-avatar']?.content : `${config.public.ossUrl}/image/userAvatar/${childComment.user?.id}.png`"
                                        :alt="childComment.user?.name + '头像'">
                                        <template #icon>
                                            <UserOutlined class="flex justify-center items-center w-full h-full" />
                                        </template>
                                    </a-avatar>
                                </template>
                                <template #content>
                                    <p class="comment-content">
                                        <span v-if="childComment.subUserId">
                                            <span>回复</span>
                                            <span class="reply-user-span mx-4 h-full p-1">{{
                                                `@${childComment.subUserId == -1 ?
                                                    store.$state.config['my-name']?.content : childComment.subUser?.name}:`
                                            }}</span>
                                        </span>
                                        <span>{{ childComment.content }}</span>
                                    </p>
                                    <div class="flex items-center justify-between pt-4">
                                        <a-tooltip :title="utils.formatDate(childComment.createTime, true)">
                                            <p class="comment-time">{{ utils.formatDateSimple(childComment.createTime)
                                                }}
                                            </p>
                                        </a-tooltip>
                                        <span>
                                            {{ '❤️' + childComment.like }}
                                        </span>
                                    </div>
                                </template>
                            </a-comment>
                        </template>
                    </a-comment>
                    <div class="text-center my-16 text-3xl">- 这是我的底线了 -</div>
                </div>
            </RepeatEmptyPlaceholder>
            <!== 新增评论 ==>
            <hr>
            <a-comment>
                <template #content>
                    <div v-if="currentComment.parentId" id="replyObj" class="px-8 py-2 flex items-center">
                        <p>回复@{{ currentParentCommentContent.userName }}:{{
                            currentParentCommentContent.commentContent }}</p>
                        <CloseOutlined class="p-2 ml-4"
                            @click="currentComment.parentId = null; currentComment.subUserId = null;" />
                    </div>
                    <div class="submit-comment-bar min-h-24 flex flex-col justify-end items-end gap-4 p-4">
                        <a-textarea :bordered="false" v-model:value="currentComment.content" :rows="2"
                            placeholder="留下你的痕迹叭" />
                        <div class="flex w-full px-4 items-start" v-if="imageFileList.length > 0">
                            <a-image class="max-h-60 min-h-80" :src="getImageFileUrl(imageFileList[0])"></a-image>
                            <CloseOutlined class="p-2 ml-4" @click="imageFileList.splice(0, imageFileList.length)" />
                        </div>
                        <div id="submit-bar" class="flex gap-x-4">
                            <a-upload v-model:file-list="imageFileList" name="file" class="hidden mx-4" :max-count="1"
                                accept="image/*" :showUploadList="false">
                                <FileImageOutlined class="font-size-medium" title="上传图片" />
                            </a-upload>
                            <a-dropdown :placement="'top'">
                                <SmileOutlined class="mx-4" />
                                <template #overlay>
                                    <div title="表情"
                                        class="emoji-bar flex flex-wrap max-w-screen-sm md:max-w-screen-md border-2 p-4 justify-center">
                                        <div class="emoji"
                                            v-for="(emoji, index) in store.$state.config['emojis']?.content"
                                            :key="index + 'emoji'" @click="addEmoji(emoji)">
                                            {{ emoji }}
                                        </div>
                                    </div>
                                </template>
                            </a-dropdown>
                            <SendOutlined class="mx-4" @click="submitComment" title="发送评论"
                                v-if="!submittingCommentLoading" />
                            <sync-outlined class="mx-4" spin v-else />
                        </div>
                    </div>
                </template>
            </a-comment>
        </div> -->
    </div>
</template>

<style lang="scss" scoped>
#log-page {

    // 文章头部
    #log-header {
        height: 30rem;
        background-color: $main-car-color;
        color: #fff;

        .header {
            .z1 {
                z-index: 2;
            }

            .topic,
            .introduction {
                font-size: $medium-font-size;
                transition: all .5s;
                overflow: hidden;
            }

            .topic {
                opacity: 1;
                height: auto;
            }

            .introduction {
                opacity: 0;
                height: 0;
            }
        }

        #image-box {
            z-index: 1;
            background-color: $main-background-color;

            img {
                object-fit: cover;
            }

            #inner {
                background: rgba(0, 0, 0, 0.5);
                backdrop-filter: blur(5px);
            }
        }
    }

    // 文章内容
    #log-content,
    #comment-bar {
        background-color: $main-car-color;
        border-radius: 10px;

        .comment-time {
            font-size: $xx-small-font-size;
            color: $secondary-text-color;
        }

        .reply-user-span {
            color: $secondary-text-color;
        }

    }

    // 版权声明
    #statement-bar {
        border-radius: 10px;
        border: 1px solid $secondary-text-color;
        background-color: $main-car-color;

        div {
            font-size: $small-font-size;
        }

        ul {
            font-size: $xx-small-font-size;
        }

        #copyright p {
            cursor: $hover-cursor;
            margin: 5px;
        }

        #statement-bgc {
            height: 30rem;
            width: 30rem;
            border: 3rem solid $secondary-text-color;
            right: -5rem;
            top: -7rem;
            opacity: .4;
            animation: gradientAnimation 5s linear infinite;

            span {
                font-size: 15rem;
                font-weight: $large-font-weight;
            }

        }
    }

    // 操作
    #action-bar {
        .icon {
            font-size: $medium-font-size;
            color: $main-text-color;
            border: 1px solid $main-text-color;
            height: 5rem;
            width: 5rem;
            line-height: 5rem;
            cursor: $hover-cursor;
            transition: all .3s;

            &:hover {
                color: $main-color;
                border-color: $main-color;
            }
        }

        #active {
            color: $main-color;
            border-color: $main-color;
        }
    }

    // # 评论区
    #comment-bar {
        font-size: $medium-font-size;

        .comment-list {
            max-height: 70vh;

            /* 定义滚动条整体样式 */
            &::-webkit-scrollbar {
                display: none;
            }

        }

        .comment-content {
            font-size: $small-font-size;
        }
    }

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

    .submit-comment-bar {
        border-radius: 20px;
        border: 1px solid $secondary-text-color;

        #submit-bar {
            font-size: $medium-font-size;

            * {
                cursor: $hover-cursor;
            }

            .font-size-medium {
                font-size: $medium-font-size;
                color: $main-text-color;
            }

        }

    }

}

.emoji-bar {
    border-color: $secondary-text-color;
    background-color: $secondary-car-color;
    border-radius: 20px;
    max-height: 30rem;
    max-width: 60rem;
    overflow-y: scroll;

    /* 定义滚动条整体样式 */
    &::-webkit-scrollbar {
        display: none;
    }

    .emoji {
        font-size: $medium-font-size;
        cursor: $hover-cursor;
    }
}

:deep(#preview) {
    border-radius: 20px;
}

:deep(.ant-card-body) {
    height: 100%;
}
</style>