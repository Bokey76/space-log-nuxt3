<script setup>
/**
 * 组件描述：
 *   将滚动视差轮播图的逻辑处理抽离出来，会默认读取containerClass下的img标签来做滚动视差
 * 注意事项：
 *   需要添加一个空的div在滚动容器的外层，防止css污染(因为a-carousel会改变最外层的css)
 */
const store = useNuxtStore()
const props = defineProps({
    containerClass: {
        type: String,
        default: "container"
    }
})
const carouselVisualGap = () => { // 轮播图的滚动视差事件回调
    const parallaxContainer = document.querySelector(`.${props.containerClass}`); // 获取所有视差容器
    const parallaxImages = document.querySelectorAll(`.${props.containerClass} img`); // 获取对应的图片
    if (!parallaxContainer || !parallaxImages) return
    const containerRect = parallaxContainer.getBoundingClientRect(); // 获取容器相对于视口的位置
    const viewportHeight = window.innerHeight; // 视口高度
    if (store.windowSize.width > 1024) {
        // 判断容器在视口中是否可见
        if (containerRect.bottom > 0 && containerRect.top < viewportHeight) {
            // 当前滚动比率 = 容器进入视口的百分比
            const scrollRatio = (viewportHeight - containerRect.top) / (viewportHeight + containerRect.height);
            parallaxImages.forEach(parallaxImage => {
                // 计算图片偏移量
                const imageHeight = parallaxImage.offsetHeight;
                const maxOffset = imageHeight * 0.35; // 最大偏移量，限制为图片高度的25%
                const offset = (scrollRatio - 0.7) * maxOffset;

                // 更新图片 transform
                parallaxImage.style.transform = `translate(-50%, ${offset}px)`;
            })
        }
    } else {
        parallaxImages.forEach(parallaxImage => {
            parallaxImage.style.transform = `translate(-50%)`; // 设置每张图片的偏移
        })
    }
}
onMounted(() => {
    carouselVisualGap()
    window.addEventListener('scroll', carouselVisualGap);
})
onBeforeUnmount(() => {
    window.removeEventListener('scroll', carouselVisualGap)
})
</script>

<template>
    <div id="parallax-slide">
        <a-carousel autoplay>
            <slot></slot>
        </a-carousel>
    </div>
</template>

<style lang="scss">
#parallax-slide {
    img {
        left: 50%;
        transform: translateX(-50%);
        /* 居中图片 */
        will-change: transform;
        /* 提示浏览器优化性能 */
        transition: all .1s;
    }
}
</style>