<script setup>
const props = defineProps({
    text: {
        type: String,
        default: '查看更多'
    },
    clickEvent: {
        type: Function,
        default: () => { console.log('该组件使用clickEvent来绑定点击回调事件'); }
    },
})
</script>


<template>
    <a-button class="more w-4/5 h-20 my-8 mx-auto block flex justify-center items-center" @click="props.clickEvent" ghost>{{ props.text }}</a-button>
</template>

<style lang="scss" scoped>
.more {
    font-size: $small-font-size;
    border-color: $main-text-color;
    transition: all .5s;
}
</style>