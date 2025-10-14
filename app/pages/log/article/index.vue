<script setup>
const router = useRouter()
definePageMeta({
    layout: 'classics'
})
// --搜索模块--
let searchContent = ref('')
let searchOrNot = ref(false) // 是否搜索标记量
let lastSearchContent = ref('') // 上次搜索内容
const search = () => { // 搜索事件
    if (!searchOrNot.value || lastSearchContent.value != searchContent.value) { // 第一次搜索或者搜索不同内容，初始化搜索量
        searchOrNot.value = true // 标记搜索
        currentPage.value = 1
        articleList.value = []
    }
    lastSearchContent.value = searchContent.value // 同步上次搜索
    api.searchArticle({
        searchContent: searchContent.value,
        currentPage: currentPage.value,
        pageSize: pageSize.value
    }).then(res => {
        total.value = res.count
        for (let row of res.rows) {
            row.createTime = utils.formatDate(row.createTime)
        }
        articleList.value.push(...res.rows)
    })
}

// --列表模块--
const total = useState('total', () => 0)
const currentPage = useState('currentPage', () => 1)
const pageSize = useState('pageSize', () => 10)
// 服务端 - 获取文章列表
const { data: articleList, error: articleListError } = await useAsyncData('getArticleList', async () => {
    total.value = 0
    currentPage.value = 1
    pageSize.value = 10
    return await api.getArticleListOrderByTime({
        currentPage: currentPage.value,
        pageSize: pageSize.value
    }).then(res => {
        total.value = res.count
        for (let row of res.rows) {
            row.createTime = utils.formatDate(row.createTime)
        }
        return res.rows
    })
}
)
const getArticleList = () => { // 获取文章列表
    api.getArticleListOrderByTime({
        currentPage: currentPage.value,
        pageSize: pageSize.value
    }).then(res => {
        total.value = res.count
        for (let row of res.rows) {
            row.createTime = utils.formatDate(row.createTime)
        }
        articleList.value.push(...res.rows)
    })
}
const getMore = () => { // 获取更多文章
    currentPage.value++
    if (searchOrNot.value) { // 判断是否搜索
        search() // 继续搜索更多文章
    } else {
        getArticleList() // 查看更多默认文章
    }
}

</script>

<template>
    <div id="log-list" class="content-box">
        <div class="flex flex-col md:flex-row my-8 justify-between items-center">
            <h2 id="title" class="mx-8">📋文章列表</h2>
            <a-input-search v-model:value="searchContent" class="text-center mt-4 md:mt-0 md:w-1/3 block"
                placeholder="搜 索" size="large" @search="search">
                <template #enterButton>
                    <a-button>搜索</a-button>
                </template>
            </a-input-search>
        </div>
        <RepeatEmptyPlaceholder :dataReady="Boolean(articleList)" :dataShow="articleList?.length > 0">
            <div id="list" class="flex flex-col justify-center items-center">
                <nuxt-link class="w-full m-6 " v-for="item in articleList" :key="item.id"
                    :to="`/log/article/detail/${item.id}`">
                    <RepeatDataCard class="w-full h-96 overflow-hidden" :data="item" v-motion
                        :initial="{ opacity: 0, x: 100 }" :visibleOnce="{
                            opacity: 1, x: 0, transition: {
                                duration: 300,
                            },
                        }" />
                </nuxt-link>
                <a class="w-full" v-if="articleList?.length < total" :href="`/log/article/${Number(currentPage) + 1}`"
                    @click.prevent="getMore">
                    <RepeatMoreButton style="width: 100%;">
                    </RepeatMoreButton>
                </a>
            </div>
        </RepeatEmptyPlaceholder>
    </div>
</template>


<style lang="scss" scoped>
#log-list {

    #title {
        font-size: $x-large-font-size;
        font-weight: $large-font-weight;
    }
}
</style>