<script setup>
const router = useRouter()
let amount = ref(0)
let enterAmount = ref(true)
let msg = ref('')
let showName = ref(true)
const reward = () => { // 赞赏
    let money = amount.value
    money = parseFloat(money).toFixed(2) // 小数点后保留两位
    // TODO 调用微信支付流程...
}
onMounted(() => {
    if (router.currentRoute.value.query.amount) {
        enterAmount.value = false
        amount.value = router.currentRoute.value.query.amount
    }
})
</script>

<template>
    <div id="docking-page">
        <div class="flex flex-col justify-center items-center pt-24 gap-y-6">
            <img src="@/assets/images/bokey.png" class="w-1/4 rounded-3xl">
            <p>如果愿意，留下你的痕迹</p>
            <div class="msg rounded-md p-2 px-4 flex justify-between items-center" v-if="enterAmount">
                <p class="small-fs">金额</p>
                <div class="flex items-center">
                    <a-input-number class="input-text-r" :step="0.1" string-mode keyboard v-model:value="amount"
                        :bordered="false" />
                    <p class="small-fs">元</p>
                </div>
            </div>
            <h2 v-else>💲{{ amount }}</h2>
        </div>
        <div class="flex flex-col pt-12 px-8">
            <div class=" msg rounded-md h-32 p-2 ">
                <a-textarea v-model:value="msg" class="w-full" :bordered="false" placeholder="留下你的痕迹叭" />
            </div>
            <div class="flex mt-8 ml-4">
                <a-radio v-model:checked="showName"></a-radio>
                <p class="small-fs">向对方展示我的名字</p>
            </div>
            <div class="submit-reward w-full mt-24 p-8 text-center rounded-md" @click="reward">赞赏</div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
#docking-page {
    color: $main-text-color;
    font-size: $small-font-size;

    h2 {
        font-size: $medium-font-size;
    }

    p {
        color: $secondary-text-color;
    }

    .msg {
        background-color: $main-car-color;
    }

    .small-fs {
        font-size: $xx-small-font-size;
    }

    .submit-reward {
        border: 1px solid $secondary-text-color;
        cursor: $hover-cursor;
    }


}
</style>

<style lang="scss">
#docking-page {
    .input-text-r {
        input {
            text-align: right !important;
        }
    }
}
</style>