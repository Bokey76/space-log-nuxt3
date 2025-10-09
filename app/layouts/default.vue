<!-- 默认布局，自适应100%宽高 -->
<script setup>
const store = useNuxtStore()
</script>

<template>
    <div id="default-layout" class="overflow-x-hidden overflow-y-auto" :style="`height: ${store.windowSize.height + 'px'};width:${store.windowSize.width + 'px'};`">
        <slot></slot>
    </div>
</template>

<style lang="scss" scoped>
#default-layout {
    background-color: $main-background-color;
    color: $main-text-color;
}
</style>