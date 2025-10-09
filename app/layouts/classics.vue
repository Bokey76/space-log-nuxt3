<!-- 经典布局，头部，内容区，底部 -->
<script setup>

</script>

<template>
    <div id="classics-layout" >
        <CommonNaviHeader></CommonNaviHeader>
        <div id="content">
            <slot></slot>
        </div>
        <CommonBottomContent></CommonBottomContent>
        <RepeatFlexedTool></RepeatFlexedTool>
    </div>
</template>

<style lang="scss" scoped>
#classics-layout {
    background-color: $main-background-color;
    color: $main-text-color;

    #content {
        min-height: 85vh;
    }

}
</style>