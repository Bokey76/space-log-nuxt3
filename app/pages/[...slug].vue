<script setup>
</script>

<template>
  <div  class="h-[100vh] w-[100vw] gap-4 flex flex-col justify-center items-center">
    <i  class="!text-[20rem] iconfont icon-icon-test"></i>
    <p class="text-8xl">没有找到这个页面<span id="loading">📡</span></p>
    <nuxt-link to="/">
      <a-button class="mt-16" type="primary" shape="round" size="large">返回首页</a-button>
    </nuxt-link>
  </div>
</template>

<style lang="scss" scoped>
#loading {
  animation: gradientAnimation 1.5s linear infinite;
}

// loading渐变动画
@keyframes gradientAnimation {
  0% {
    opacity: .3;
  }

  50% {
    opacity: 1;
  }

  100% {
    opacity: .3;
  }
}
</style>