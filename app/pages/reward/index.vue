<script setup>
import { ref } from "vue"
const router = useRouter()
const rewardArr = ref([
    {
        key: "1",
        label: "1元🍦"
    },
    {
        key: "5",
        label: "5元🍟"
    },
    {
        key: "10",
        label: "10元🧋"
    },
    {
        key: "20",
        label: "20元🍕"
    },
    {
        key: "50",
        label: "50元🥩"
    },
    {
        key: "100",
        label: "100元🎁"
    },
])
const goToReward = (amount) => {
    let option = {
        path: "/reward/docking",
    }
    if(amount) {
        option.query = {
            amount:amount
        }
    }
    router.push(option)
}
</script>

<template>
    <div id="reward-page">
        <div class="flex flex-col justify-center items-center pt-24 gap-y-6">
            <img src="@/assets/images/bokey.png" class="w-1/4 rounded-3xl">
            <h2>谢谢老板，老板大气</h2>
            <div class="flex">
                <p>🌈小弟会努力更新的</p><p class="reverse">🌈</p>
            </div>
        </div>
        <div class="flex flex-col justify-center items-center mt-32">
            <p>赞赏金额</p>
            <div class="reward-bar grid gap-x-8 gap-y-4 grid-cols-3 w-full mt-4 px-4">
                <div class="reward-item rounded-xl py-16 text-center" v-for="item in rewardArr" :key="item.key + 'reward'"
                @click="goToReward(item.key)">
                    {{ item.label }}
                </div>
            </div>
        </div>
        <div class="flex justify-center items-center my-16">
            <a-button @click="goToReward()">自选金额</a-button>
        </div>
    </div>
</template>

<style lang="scss" scoped>
#reward-page {
    color: $main-text-color;
    font-size: $small-font-size;

    h2 {
        font-size: $medium-font-size;
    }

    p {
        color: $secondary-text-color;
    }

    .reward-bar {

        .reward-item {
            border: 1px solid $secondary-text-color;
            color: $main-text-color;
            font-size: $medium-font-size;
            margin-top: 1rem;
        }

    }

    .reverse {
        transform: rotate(90deg);
    }
}
</style>