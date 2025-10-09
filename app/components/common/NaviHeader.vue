<script setup>
import { notification, Modal, Upload } from 'ant-design-vue'
import { ExclamationCircleOutlined, UploadOutlined, MenuOutlined, BulbOutlined } from '@ant-design/icons-vue';
import { createVNode } from 'vue';
const router = useRouter()
const store = useNuxtStore()
const config = useRuntimeConfig();
// --主题切换模块--
const colorTheme = ref(['Light', 'Dark'])
let currentThemeIndex = ref(0)
let currentTheme = ref(colorTheme.value[0])
const themeChange = (newVal) => { // 改变主题事件
    currentTheme.value = newVal
    currentThemeIndex.value = colorTheme.value.findIndex(item => item == newVal)
    store.setThemeMode(newVal)
}
const getLocalTheme = () => { // 获取本地主题
    const theme = localStorage.getItem('theme')
    if (theme) {
        currentTheme.value = theme
        currentThemeIndex.value = colorTheme.value.findIndex(item => item == theme)
    } else {
        currentTheme.value = 'Dark'
        currentThemeIndex.value = 1
    }
}
// --导航模块--
const naviData = reactive([
    {
        title: '📚档案',
        label: '📚档案',
        key: 'root-document',
        children: [
            {
                title: '📋列表',
                label: '📋列表',
                path: '/log/article',
                key: "/log/article",
            },
            {
                title: '🗂类目',
                label: '🗂类目',
                path: '/log/category',
                key: '/log/category',
            }
        ],
    },
    {
        title: "✏️痕迹留言",
        label: "✏️痕迹留言",
        path: "/message",
        key: "/message",
    },
    {
        title: "🔮朋友们",
        label: "🔮朋友们",
        path: "/link",
        key: "/link",
    },
    {
        title: '❓关于我',
        label: '❓关于我',
        path: '/about',
        key: '/about',
    }
]) // 导航数据
let naviDrawer = ref(false)
const expandedKeys = ref([]);
const changePath = ([path]) => {
    if (!path) {
        expandedKeys.value = []
        return
    }
    const regex = /^root-/
    if (regex.test(path)) { // 根节点，展开
        if (!expandedKeys.value.includes(path)) {
            expandedKeys.value = [path]
        }
    } else { // 子节点
        router.push(path)
        naviDrawer.value = false
    }
}
// #region --用户模块--
let userImageStatus = ref(true) // 用户头像加载状态
let loginStatus = ref(false) // 用户登录状态
let userData = reactive({}) // 用户数据
let editUserMsgShow = ref(false) // 用户信息编辑框的显示/隐藏
let userUpdateData = reactive({}) // 编辑用户信息数据
let userUpdateLoading = ref(false) // 用户编辑加载
let imageFileList = ref([]) // 图片上传数组
const handleImageError = () => { // 头像加载失败回调
    userImageStatus.value = false
}
const getUserData = () => { // 获取用户数据
    const token = utils.getCookie('token')
    if (!utils.isNullOrEmpty(token)) { // 若登录了
        api.getUserDataByToken().then(res => {
            if (utils.analysisData(res, false)) { // 信息获取成功
                loginStatus.value = true
                Object.assign(userData, res.data)
            } else { // 信息获取失败
                utils.removeCookie('token') // 去除token
                loginStatus.value = false
                userData = {}
            }
        })
    }
}
let sendCodeRest = ref(0) // 发送验证码按钮的休息时长
const sendMailCode = () => { // 发送验证码
    if (utils.isNullOrEmpty(userData.mail) || !utils.isValidEmail(userData.mail)) { // 若为空或者不是邮箱格式
        notification.open({
            message: '⏰提示',
            description: '请输入有效的邮箱📨',
            placement: 'top',
            duration: 3,
        })
        return
    }
    sendCodeRest.value = 60 // 60秒的休息时间
    const sendCodeInterval = setInterval(() => {
        if (--sendCodeRest.value <= 0) {
            clearInterval(sendCodeInterval)
        }
    }, 1000);
    api.getLoginCode({ mail: userData.mail }).then(res => {
        utils.analysisData(res)
    })
}
const login = () => { // 登录
    api.login({
        mail: userData.mail,
        code: userData.code
    }).then(res => {
        if (utils.analysisData(res)) {
            loginStatus.value = true
            Object.assign(userData, res.data)
            utils.setCookie('token', userData.token)
            fileHeaders.authorization = `Bearer ${userData.token}`
        }
    })
}
const quit = () => { // 退出登录
    Modal.confirm({
        title: "确认退出吗",
        icon: createVNode(ExclamationCircleOutlined),
        content: '退出将清除您的个人数据在此电脑',
        okText: '退出',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
            utils.removeCookie('token') // 去除token
            utils.removeCookie('id') // 去除token
            utils.removeCookie('mail') // 去除token
            loginStatus.value = false
            userData = {}
            notification.open({
                message: '提示📢',
                description: '退出成功♻️等待你的再次到来',
                placement: 'top',
                duration: 3,
            })
            fileHeaders.authorization = `Bearer ${utils.getCookie("token")}`
        }
    })
}
const updateUserData = () => { // 更新用户信息
    if (utils.isNullOrEmpty(userUpdateData.mail) || !utils.isValidEmail(userUpdateData.mail)) { // 若为空或者不是邮箱格式
        notification.open({
            message: '⏰提示',
            description: '请输入有效的邮箱📨',
            placement: 'top',
            duration: 3,
        })
        return
    }
    userUpdateLoading.value = true
    api.updateUserData(Object.assign({}, userUpdateData)).then(res => {
        userUpdateLoading.value = false
        if (utils.analysisData(res)) {
            Object.assign(userData, userUpdateData)
        }
    })
}
let fileHeaders = reactive({
    authorization: `Bearer ${utils.getCookie("token")}`,
}); // 封面图片上传header
let avatarTimestamp = ref(null)
const beforeFileUpload = (file) => {
    if (file.size > 30 * 1024 * 1024) { // 若文件大小大于30MB 
        notification.open({
            message: '⚠️提示',
            description: '文件大小需小于30MB💾',
            placement: 'top',
            duration: 3,
        })
        return false || Upload.LIST_IGNORE;
    }
}
const handleUploadImageChange = (info) => { // 上传图片状态改变回调
    if (['done', 'error'].includes(info.file.status) && info.file.response) {
        if (utils.analysisData(info.file.response)) {
            avatarTimestamp.value = new Date()
        }
    }
}
// #endregion

onMounted(() => {
    getLocalTheme()
    getUserData()
})
</script>

<template>
    <a-affix :offset-top="0" id="affix" class="border-b-2">
        <div id="navi-header">
            <div id="navi-content" class="hidden xl:flex justify-between items-center h-28 my-0 mx-auto px-8">
                <a-space :size="25">
                    <h1 class="cursor-point" @click="router.push('/')">BOKEY'S SPASE</h1>
                    <a-dropdown v-for="naviFirst in naviData" :key="naviFirst.label">
                        <div>
                            <a href="javascript:;" v-if="naviFirst.children">{{ naviFirst.label }}</a>
                            <a href="javascript:;" v-else @click="router.push(naviFirst.path)">{{ naviFirst.label }}</a>
                        </div>
                        <template v-if="naviFirst.children" #overlay>
                            <a-menu>
                                <a-menu-item v-for="naviSecond in naviFirst.children" :key="naviSecond.path">
                                    <a href="javascript:;" class="text-3xl p-8" @click="router.push(naviSecond.path)">{{
                                        naviSecond.label }}</a>
                                </a-menu-item>
                            </a-menu>
                        </template>
                    </a-dropdown>
                </a-space>
                <a-space :size="25">
                    <a-segmented v-model:value="currentTheme" @change="themeChange" :options="colorTheme" />
                    <!-- TODO 公安备案注释TEMP -->
                    <!-- <ClientOnly>
                        <!== 用户 ==>
                        <a-popover :title="loginStatus ? userData.name : '登录'" trigger="click" placement="bottomRight">
                            <!== 已登录页面 ==>
                            <template v-if="loginStatus" #content>
                                <a-space size="middle" direction="vertical" class="items-center w-full">
                                    <a-button class="w-96"
                                        @click="editUserMsgShow = true; Object.assign(userUpdateData, userData)">编辑信息</a-button>
                                    <a-modal v-model:open="editUserMsgShow" title="信息编辑" @ok="updateUserData">
                                        <a-space size="small" direction="vertical" class="px-16 py-8 w-full">
                                            <div class="flex flex-col items-center">
                                                <a-avatar class="avatar mb-4" :size="200"
                                                    :src="`${config.public.ossUrl}/image/userAvatar/${userData.id}.png?timestamp=${avatarTimestamp}`"
                                                    :loadError="handleImageError">
                                                    <template v-if="!userImageStatus">
                                                        <span>
                                                            {{ loginStatus ? userData.name : 'User' }}
                                                        </span>
                                                    </template>
                                                </a-avatar>
                                                <a-upload v-model:file-list="imageFileList" name="file"
                                                    :action="config.public.apiUrl + '/user/uploadUserAvatar?id=' + userData.id"
                                                    :max-count="1" accept="image/*" :headers="fileHeaders" :before-upload="beforeFileUpload"
                                                    @change="handleUploadImageChange">
                                                    <a-button>
                                                        <upload-outlined></upload-outlined>
                                                        上传头像
                                                    </a-button>
                                                </a-upload>
                                            </div>

                                            <span class="label px-4">用户名</span>
                                            <a-input class="text-center" v-model:value="userUpdateData.name"
                                                placeholder="请输入用户名" />
                                        </a-space>
                                        <template #footer>
                                            <a-button @click="editUserMsgShow = false">取消</a-button>
                                            <a-button :loading="userUpdateLoading" @click="updateUserData">提交</a-button>
                                        </template>
                                    </a-modal>
                                    <a-button class="w-96" @click="quit">退出登录</a-button>
                                </a-space>
                            </template>
                            <!== 未登录页面 ==>
                            <template v-else #content>
                                <a-space size="middle" direction="vertical" class="items-center w-full">
                                    <a-input class="w-96 text-center" v-model:value="userData.mail"
                                        placeholder="请输入邮箱" />
                                    <a-button class="w-96" v-if="sendCodeRest <= 0"
                                        @click="sendMailCode">发送验证码</a-button>
                                    <a-button class="w-96" v-else :disabled="true">请 {{ sendCodeRest }} 秒后重试</a-button>
                                    <a-input class="w-96 text-center" v-model:value="userData.code"
                                        placeholder="请输入验证码" />
                                    <a-button class="w-96" @click="login">登录</a-button>
                                </a-space>
                            </template>
                            <a-avatar class="avatar" size="large"
                                :src="`${config.public.ossUrl}/image/userAvatar/${userData.id}.png?timestamp=${avatarTimestamp}`"
                                :loadError="handleImageError">
                                <template v-if="!userImageStatus">
                                    <span>
                                        {{ loginStatus ? userData.name : '登录' }}
                                    </span>
                                </template>
                            </a-avatar>
                        </a-popover>
                    </ClientOnly> -->
                </a-space>
            </div>
            <div id="navi-content-phone" class="flex xl:hidden justify-between items-center py-8 px-16">
                <h1 class="cursor-point" @click="router.push('/')">BOKEY'S SPASE</h1>
                <a-space :size="12">
                    <a-button class="button flex justify-center items-center h-full"
                        @click="currentThemeIndex ? currentThemeIndex = 0 : currentThemeIndex = 1; themeChange(colorTheme[currentThemeIndex])">
                        <BulbOutlined />{{ colorTheme[currentThemeIndex ? 0 : 1] }}
                    </a-button>
                    <a-button class="button flex justify-center items-center h-full" :icon="h(MenuOutlined)"
                        @click="naviDrawer = !naviDrawer" />
                    <!-- TODO 公安备案注释TEMP -->
                    <!-- <ClientOnly>
                        <!== 用户 ==>
                        <a-popover :title="loginStatus ? userData.name : '登录'" trigger="click" placement="bottomRight">
                            <!== 已登录页面 ==>
                            <template v-if="loginStatus" #content>
                                <a-space size="middle" direction="vertical" class="items-center w-full">
                                    <a-button class="w-96"
                                        @click="editUserMsgShow = true; Object.assign(userUpdateData, userData)">编辑信息</a-button>
                                    <a-modal v-model:open="editUserMsgShow" title="信息编辑" @ok="updateUserData">
                                        <a-space size="small" direction="vertical" class="px-16 py-8 w-full">
                                            <div class="flex flex-col items-center">
                                                <a-avatar class="avatar mb-4" :size="200"
                                                    :src="`${config.public.ossUrl}/image/userAvatar/${userData.id}.png?timestamp=${avatarTimestamp}`"
                                                    :loadError="handleImageError">
                                                    <template v-if="!userImageStatus">
                                                        <span>
                                                            {{ loginStatus ? userData.name : 'User' }}
                                                        </span>
                                                    </template>
                                                </a-avatar>
                                                <a-upload v-model:file-list="imageFileList" name="file"
                                                    :action="config.public.apiUrl + '/user/uploadUserAvatar?id=' + userData.id"
                                                    :max-count="1" accept="image/*" :headers="fileHeaders" :before-upload="beforeFileUpload"
                                                    @change="handleUploadImageChange">
                                                    <a-button>
                                                        <upload-outlined></upload-outlined>
                                                        上传头像
                                                    </a-button>
                                                </a-upload>
                                            </div>
                                            <span class="label px-4">用户名</span>
                                            <a-input class="text-center" v-model:value="userUpdateData.name"
                                                placeholder="请输入用户名" />
                                        </a-space>
                                        <template #footer>
                                            <a-button @click="editUserMsgShow = false">取消</a-button>
                                            <a-button :loading="userUpdateLoading" @click="updateUserData">提交</a-button>
                                        </template>
                                    </a-modal>
                                    <a-button class="w-96" @click="quit">退出登录</a-button>
                                </a-space>
                            </template>
                            <!== 未登录页面 ==>
                            <template v-else #content>
                                <a-space size="middle" direction="vertical" class="items-center w-full">
                                    <a-input class="w-96 text-center" v-model:value="userData.mail"
                                        placeholder="请输入邮箱" />
                                    <a-button class="w-96" v-if="sendCodeRest <= 0"
                                        @click="sendMailCode">发送验证码</a-button>
                                    <a-button class="w-96" v-else :disabled="true">请 {{ sendCodeRest }} 秒后重试</a-button>
                                    <a-input class="w-96 text-center" v-model:value="userData.code"
                                        placeholder="请输入验证码" />
                                    <a-button class="w-96" @click="login">登录</a-button>
                                </a-space>
                            </template>
                            <a-avatar class="avatar"
                                :src="`${config.public.ossUrl}/image/userAvatar/${userData.id}.png?timestamp=${avatarTimestamp}`"
                                :loadError="handleImageError">
                                <template v-if="!userImageStatus">
                                    <span>
                                        {{ loginStatus ? userData.name : '登录' }}
                                    </span>
                                </template>
                            </a-avatar>
                        </a-popover>
                    </ClientOnly>  -->
                </a-space>
            </div>
        </div>
        <a-drawer v-model:open="naviDrawer" class="navi-top-drawer" title="BOKEY'S SPASE" placement="top" height="auto">
            <a-tree @select="changePath" v-model:expandedKeys="expandedKeys" :tree-data="naviData">
            </a-tree>
        </a-drawer>
    </a-affix>
</template>

<style lang="scss" scoped>
#affix {

    #navi-header {
        background-color: $main-car-color;

        #navi-content {

            h1 {
                font-size: $small-font-size;
                font-weight: $large-font-weight;
            }

            a {
                font-size: $x-small-font-size;
                font-weight: $small-font-weight;

                &:hover {
                    cursor: $hover-cursor;
                }
            }

        }

        .avatar {
            cursor: $hover-cursor;
        }

    }

    #navi-content-phone {
        h1 {
            font-size: $medium-font-size;
            font-weight: $medium-font-weight;
        }

        .button {
            font-size: $xx-small-font-size;
            height: 100%;
            padding: 1rem;
            background-color: $main-background-color !important;
            color: $main-text-color !important;

            * {
                line-height: normal;
            }
        }

        button {
            height: 32px !important;
        }
    }

    .label {
        color: $main-text-color;
    }
}

:deep(#affix .css-dev-only-do-not-override-19iuou) {
    height: 100% !important;
}

:deep(.ant-affix) {
    border-bottom-width: 2px
}
</style>
<style lang="scss">
.navi-top-drawer {
    width: 100vw !important;

    .ant-drawer-header {
        border-bottom: none;
    }

    .ant-drawer-header-title {
        flex-direction: row-reverse;
    }

    .ant-drawer-body {
        padding-top: 0px;
    }

    .ant-tree-list-holder-inner {
        align-items: flex-end;
    }
}
</style>