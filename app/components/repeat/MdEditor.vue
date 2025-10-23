<script setup>
import { MdEditor } from "md-editor-v3";
const store = useNuxtStore()
import "md-editor-v3/lib/style.css";
import "@vavt/v3-extension/lib/asset/Emoji.css";
import { RedoOutlined } from '@ant-design/icons-vue';
import { useRouter } from "vue-router";
const router = useRouter()
let mdContent = ref("");
defineExpose({ mdContent }) // 暴露md编辑器内容给父组件，读取用这个读取
const emojis = store.$state.config['emojis']?.content
const props = defineProps({
    content: {
        type: String,
        default: "",
    }, // 父元素给予的md文档内容（初始化内容）
    options: {
        type: Object,
    }, // md编辑器的配置项
    save: {
        type: Function,
        default: () => { }, // 保存按钮的回调函数
    }, // 保存按钮的回调函数
    uploadImage: {
        type: Function,
        default: () => { },
    }, // 图片上传的回调函数
    editChange: {
        type: Function,
        default: () => { },
    }, // 内容改变的回调函数
    preview: {
        type: Boolean,
        default: true
    }
});
// 监听内容变化
watch(
    () => props.content,
    (newVal) => {
        mdContent.value = newVal;
    },
    { immediate: true }
);
</script>

<template>
    <div id="md" class="w-full">
        <MdEditor style="height: 100%;" v-model="mdContent" v-bind="props.options" :preview="props.preview" @onSave="save(mdContent)"
            @onUploadImg="props.uploadImage" @onChange="props.editChange()">
            <!-- 自定义工具栏插槽 -->
            <template #defToolbars>
                <div class="md-editor-toolbar-item" @click="router.back()" title="返回">
                    <RedoOutlined class="md-editor-icon" />
                </div>
                <Emoji title="表情" :emojis="emojis" :selectAfterInsert="false"></Emoji>
            </template>
            <!-- 自定义页脚插槽 -->
            <template #defFooters>
                <slot name="defFooters"></slot>
            </template>
        </MdEditor>
    </div>
</template>

<style lang="scss" scoped></style>