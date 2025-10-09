<template>
    <Transition name="fade">
        <div v-if="visible" id="loading"
            class="loader-page fixed h-[100vh] w-[100vw] inset-0 z-[9999] flex flex-col items-center justify-center">
            <div class="rotate-box rounded-full overflow-hidden ">
                <img class="h-[120px] w-[120px] " src="@/assets/images/bokey.png">
            </div>
            <p class="my-[10px] text-[20px]">欢迎来到Bokey的空间🌼</p>
            <p class="text-[10px]">加载中...</p>
        </div>
    </Transition>
</template>

<script setup>
const visible = ref(true)

// SSR 阶段（服务端）默认显示
if (import.meta.client) {
    // 客户端渲染完成后再隐藏
    onMounted(() => {
        requestAnimationFrame(() => {
            visible.value = false
        })
    })
}
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.6s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.loader-page {
    background-color: $main-background-color;
}

#loading {
    .rotate-box {
        animation: rotateAnimation 2s linear infinite;
    }

    p,
    i {
        animation: gradientAnimation 2s linear infinite;
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
