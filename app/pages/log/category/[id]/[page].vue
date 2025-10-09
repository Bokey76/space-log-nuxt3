<script setup>
const route = useRoute()
definePageMeta({
    layout: 'classics'
})
const config = useRuntimeConfig();
const total = useState('total', () => 0)
const currentPage = useState('currentPage', () => route.params.page)
const pageSize = useState('pageSize', () => 10)
// 服务端 - 获取文章列表
const { data: articleList, error: getArticleListError } = await useAsyncData(`getArticleList-page-${route.params.id}-${route.params.page}`, async () =>
    await api.getArticleByTypeId(route.params.id, currentPage.value, pageSize.value).then(res => {
        total.value = res.count
        return res.rows
    })
)
// 服务端 - 获取类目数据
const { data: category, error: getCategoryError } = await useAsyncData(`getCategory-page-${route.params.id}-${route.params.page}`, async () =>
    await api.getArticleTypeById(route.params.id).then(res => {
        return res
    })
)
useHead({
    title: category.value ? `${category.value?.theme}类文章 【 Bokey Space 】` : '文章类目【 Bokey Space 】'
})
const getArticleByTypeId = () => { // 通过typeId获取该类别下的文章
    api.getArticleByTypeId(route.params.id, currentPage.value, pageSize.value).then(res => {
        total.value = res.count
        articleList.value.push(...res.rows)
    })
}
const getMore = () => { // 获取更多该typeId类别下的文章
    currentPage.value++
    getArticleByTypeId()
}

</script>

<template>
    <div id="log-category" class="content-box">
        <div class="flex my-8 justify-between items-center">
            <h2 id="title" class="mx-8">{{ `📂${category ? category.theme : '文章列表加载中...'}` }}</h2>
        </div>
        <RepeatEmptyPlaceholder :dataReady="Boolean(articleList)" :dataShow="articleList?.length > 0">
            <nuxt-link class="w-full" v-for="item in articleList" :key="item.id" :to="`/log/article/detail/${item.id}`">
                <RepeatDataCard class="m-6 w-full h-96 overflow-hidden"
                    :imagePath="`${config.public.ossUrl}/image/articleCover/${item.id}.png`" :data="item" :dataOption="{
                        mainAttribute: 'topic',
                        secondAttribute: 'introduction',
                        additional: {
                            icon: '🕘',
                            attribute: 'createTime'
                        }
                    }" v-motion :initial="{ opacity: 0, x: 100 }" :visibleOnce="{
                        opacity: 1, x: 0, transition: {
                            duration: 300,
                        },
                    }" />
            </nuxt-link>
            <a class="w-full" :href="`/log/category/detail/${Number(currentPage) + 1}`"
                v-if="articleList?.length < total - ((route.params.page - 1) * pageSize)" @click.prevent="getMore">
                <RepeatMoreButton style="width: 100%;">
                </RepeatMoreButton>
            </a>
        </RepeatEmptyPlaceholder>
    </div>
</template>

<style lang="scss" scoped>
#log-category {

    #title {
        font-size: $x-large-font-size;
        font-weight: $large-font-weight;
    }
}
</style>