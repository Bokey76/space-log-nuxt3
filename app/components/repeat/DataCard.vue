<script setup>
const config = useRuntimeConfig();
const store = useNuxtStore()
const props = defineProps({
    data: {
        type: Object,
        required: true
    }, // 文章数据
    column: {
        type: Boolean,
        default: false
    }, // 是否纵列
    dataOption: {
        type: Object,
        default: () => {
            return {
                mainAttribute: 'topic',
                secondAttribute: 'introduction',
                additional: {
                    icon: '🕘',
                    attribute: 'createTime'
                }
            }
        }
    }, // 数据选项，用于配置展示内容在数据中对应的字段，默认是按文章的配置，传入数据需对应字段！
    imagePath: {
        type: String,
        default: null
    }, // 图片路径，默认是 ${config.public.ossUrl}/image/articleCover/${props.articleData.id}.png
})
// 手机端自动横向展示
let phoneOrNot = ref(false)
watch(() => store.$state.windowSize.width, (newVal) => {
    if (newVal < 768) {
        phoneOrNot.value = true
    } else {
        phoneOrNot.value = false
    }
}, {
    immediate: true
})
</script>

<template>
    <div class="article-card flex overflow-hidden" :class="`${props.column || phoneOrNot ? 'flex-col ' : 'flex-row'}`">
        <div id="pic-box" :style="`${props.column || phoneOrNot ? 'flex: 2' : 'flex: 1.5'}`">
            <client-only>
                <a-image
                :src="props.imagePath ? props.imagePath : `${config.public.ossUrl}/image/articleCover/${props.data.id}.png`"
                alt="文章封面" :preview="false" style="height: 100%;width: 100%;object-fit: cover;"
                :fallback="store.$state.config['not-found-image']?.content"></a-image>
            </client-only>
        </div>
        <div id="info" :class="`px-12 flex flex-col justify-between ${props.column || phoneOrNot ? 'py-0' : 'py-6'}`">
            <div>
                <div :class="`limit-text-1 ${props.column || phoneOrNot ? 'medium-text mt-4' : 'big-text my-4 '}`">{{
                    props.data[props.dataOption.mainAttribute] }}
                </div>
                <div :class="`limit-text-2 ${props.column || phoneOrNot ? 'small-text' : 'medium-text my-4'}`">{{
                    props.data[props.dataOption.secondAttribute] }}
                </div>
            </div>
            <div class="small-text secend-color my-4 text-end">{{ props.dataOption.additional.icon }} {{
                (String(props.dataOption.additional.attribute).toLowerCase().includes('time') ||
                    String(props.dataOption.additional.attribute).toLowerCase().includes('date')) ?
                    utils.formatDate(props.data[props.dataOption.additional.attribute]) :
                    props.data[props.dataOption.additional.attribute] }}</div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.article-card {
    background-color: $main-car-color;
    border-radius: 20px;
    cursor: $hover-cursor;
    transition: all .3s;
    height: 40rem;

    &:hover {
        transform: scale(.95) !important;
        filter: drop-shadow(0 20px 13px rgb(0 0 0 / 0.03)) drop-shadow(0 8px 5px rgb(0 0 0 / 0.08));
    }

    #pic-box {
        overflow: hidden;
    }

    #info {
        flex: 1;
        overflow: hidden;

        .big-text {
            font-size: $large-font-size;
            font-weight: $large-font-weight;
        }

        .medium-text {
            font-size: $x-small-font-size;
            font-weight: $medium-font-weight;
        }

        .small-text {
            font-size: $xx-small-font-size;
            font-weight: $small-font-weight;
        }

        .secend-color {
            color: $secondary-text-color;
        }

        .limit-text-2 {
            display: -webkit-box;
            /* 设置盒子的方向为垂直 */
            -webkit-box-orient: vertical;
            /* 显示的行数 */
            -webkit-line-clamp: 2;
            /* 隐藏多余的内容 */
            overflow: hidden;
            /* 在溢出内容处显示省略号 */
            text-overflow: ellipsis;
        }

        .limit-text-1 {
            display: -webkit-box;
            /* 设置盒子的方向为垂直 */
            -webkit-box-orient: vertical;
            /* 显示的行数 */
            -webkit-line-clamp: 1;
            /* 隐藏多余的内容 */
            overflow: hidden;
            /* 在溢出内容处显示省略号 */
            text-overflow: ellipsis;
        }
    }

}

:deep(.ant-image) {
    height: 100%;
    width: 100%;
}
</style>