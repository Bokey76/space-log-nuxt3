<script setup>
import { computed, useSlots } from "vue";
const slots = useSlots();
const hasEmptyIcon = computed(() => !!slots.emptyIcon);
const hasLoadingIcon = computed(() => !!slots.loadingIcon);
const props = defineProps({
  dataReady: {
    type: Boolean,
    default: false
  },
  dataShow: {
    type: Boolean,
    default: true
  },
  emptyText: {
    type: String,
    default: "暂时没有内容🙌"
  },
  loadingText: {
    type: String,
    default: "内容正在加载中，请稍后"
  },
})
</script>

<template>
  <div id="empty-state-box">
    <div v-if="dataShow">
      <slot></slot>
    </div>
    <div v-else-if="dataReady" class="py-16">
      <div class="flex flex-col my-24">
        <template v-if="!hasEmptyIcon">
          <InboxOutlined class="text-9xl flex justify-center" />
        </template>
        <slot v-else name="emptyIcon"></slot>
        <p class="mt-4 text-4xl text-center">{{ props.emptyText }}</p>
      </div>
    </div>
    <div id="loading" class="flex flex-col justify-center items-center w-full p-36" v-else>
      <template  v-if="!hasLoadingIcon">
        <span class="iconfont icon-diqiu"></span>
      </template>
      <slot v-else name="loadingIcon"></slot>
      <p class="text-8xl m-16">{{ props.loadingText }}</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#empty-state-box {
  .iconfont {
    font-size: 10rem;
  }

  #loading {
    span {
      animation: rotateAnimation 2s linear infinite;
    }

    p {
      animation: gradientAnimation 2s linear infinite;
    }
  }
}

// loading旋转动画
@keyframes rotateAnimation {
  0% {
    transform: rotate(0deg);
    opacity: .3;
  }

  50% {
    transform: rotate(180deg);
    opacity: 1;
  }

  100% {
    transform: rotate(360deg);
    opacity: .3;
  }
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