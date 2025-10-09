<script setup>
definePageMeta({
  layout: 'classics'
})
const config = useRuntimeConfig();
// 获取所有文章类别
const { data: dataList, error: getCategoriesError } = await useAsyncData('getCategories', async () =>
  await api.getAllArticleTypes().then(res => {
    return res
  })
)
</script>

<template>
  <div id="log-category" class="content-box">
    <div class="flex my-8 justify-between items-center">
      <h2 id="title" class="mx-8">{{ '📁文章类目' }}</h2>
    </div>
    <RepeatEmptyPlaceholder :dataReady="Boolean(dataList)" :dataShow="dataList?.length > 0">
      <nuxt-link class="w-full" :to="`/log/category/${item.id}`" v-for="item in dataList" :key="item.id">
        <RepeatDataCard class="m-6 w-full h-96 overflow-hidden"
          :imagePath="`${config.public.ossUrl}/image/articleTypeCover/${item.id}.png`" :data="item" :dataOption="{
            mainAttribute: 'theme',
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