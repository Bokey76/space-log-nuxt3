<script setup>
import { MdPreview } from 'md-editor-v3';
// preview.css相比style.css少了编辑器那部分样式
import 'md-editor-v3/lib/preview.css';
const props = defineProps({
    mdContent: {
        type: String,
        default: ''
    }, // 文章的md内容
    onGetCatalog: {
        type: Function,
        default: () => { }
    }, // 获取目录的事件回调，返回数组[]，当前的preview的目录内容
    onHtmlChanged: {
        type: Function,
        default: () => { }
    }, // html内容变化的事件回调，返回string，当前的preview的html内容
})
</script>

<template>
    <MdPreview class="preview" editorId="preview" :modelValue="props.mdContent" @GetCatalog="props.onGetCatalog"
        @HtmlChanged="props.onHtmlChanged" />
</template>

<style lang="scss" scoped>
.preview {
    padding: 1rem 2rem;
}

:deep(.md-editor-preview-wrapper) {
    padding: 0;
}

:deep(#preview p, ::v-deep #preview span) {
    font-size: $x-small-font-size;
}

:deep(#preview figure) {
    max-width: 70%;
    margin: 0 auto;
    overflow: hidden;
}

:deep(#preview figure img) {
    max-width: 100%;
    width: auto;
    height: auto;
}
</style>