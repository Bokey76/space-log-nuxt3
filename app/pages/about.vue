<script setup>
import { onMounted } from 'vue';
const store = useNuxtStore()
definePageMeta({
  layout: 'classics'
})
useHead({
  script: [
    { type: "text/javascript", src: '/TagCanvas.js' }, // 引入TagCanvas
  ],
})
// #region 词云
const cloud = ref(null)
const cloudInit = () => { // 生成词云
  setTimeout(() => {
    try {
      TagCanvas.Start('cloud', 'cloud-tags', {
        textColour: '#777777',
        outlineColour: '#777777',
        dragControl: false, // 设置禁用鼠标拖动，跟着鼠标转动
        pinchZoom: true,// 设置为true通过捏合触摸屏设备来启用放大和缩小云
        reverse: true, // 设置为true以反转相对于鼠标位置的移动方向
        textHeight: 20, // 字体大小，单位px
        shape: "Sphere", //目前支持的是Sphere hcylinder vcylinder 分别是圆形，立着的卷发棒，躺着的卷发棒
        depth: 0.8, // 控制透视图(0.0-1.0)
        decel: 1, // 鼠标离开画布时的减速率，设置0，鼠标离开就停止，设置1，鼠标离开还一直转
        padding: 5, // 文本框的padding
        wheelZoom: true, // 使用鼠标滚轮或滚动手势可以放大和缩小云
        fadeIn: 3, // 标签淡入的时间
        freezeActive: false, // 设置为true以在突出显示标记时暂停移动，这个必须是在dragControl:false才有效
        outlineMethod: "outline",  // 鼠标指到的元素变化类型，outline:显示边框线(有深度)，classic:显示边框线，block:改变背景颜色为边框线颜色，colour:改变颜色，颜色属性为outlineColour:'#fff'，size:改变文本大小，大小属性为outlineIncrease:20，none:不突出显示
        outlineOffset: "5", // 轮廓与文本的距离，单位px
        outlineRadius: "10", // 轮廓框上的圆角半径，单位px
        outlineThickness: "3", // 轮廓的粗细，单位px
        txtOpt: true,// 文本优化,将文本标签转换为图像以获得更好的性能
        maxSpeed: 0.05, // 最大旋转速度，设置小一点，转的慢一点
        initial: [0.1, -0.2], // 初始旋转，水平和垂直为数组，这个是鼠标未进行操控时的旋转
        hideTags: true, // 隐藏基础标签
      })
    } catch (e) {
      cloud.value.style.display = "none";
    }
  }, 1000)
}
// #endregion
let thoughtsIndex = ref(0)
let thoughtsInterval = null
const getRandomIndex = (arr, excludeIndex, clearIntervalOrNot = false) => { // 取数组的随机索引，除了excludeIndex
  // 创建一个包含所有可能索引的数组（排除 excludeIndex）
  const indices = arr.map((_, i) => i).filter(i => i !== excludeIndex);
  // 如果没有可选索引，返回 null
  if (indices.length === 0) return null;
  // 从剩余索引中随机选择一个
  const randomIndex = Math.floor(Math.random() * indices.length);
  if (clearIntervalOrNot) {
    clearInterval(thoughtsInterval)
  }
  return indices[randomIndex];
}
const goTo = (url, event) => { // 跳转到新页面函数
  event.preventDefault()
  window.open(url, '_blank')
}
onMounted(() => {
  cloudInit()
  thoughtsInterval = setInterval(() => {
    thoughtsIndex.value = getRandomIndex(store.$state.config['final-thoughts']?.content, thoughtsIndex.value)
  }, 5000)
})

onBeforeUnmount(() => {
  clearInterval(thoughtsInterval)
})
</script>

<template>
  <div id="about-page" class="content-box overflow-hidden">
    <!-- bokey bar -->
    <a-card hoverable id="bokey" class="relative">
      <img class="w-80 h-80 rounded-full mx-auto mb-6 mt-12 p-2" :src="store.$state.config['my-avatar']?.content"
        alt="BOKEY" v-motion-pop-visible-once>
      <h1 class="text-center text-6xl font-bold">Bokey</h1>
      <p id="description" class="text-center text-2xl font-normal my-4">留下属于我的痕迹🐾</p>
      <div class="mx-auto my-8 flex justify-center items-center gap-12">
        <div class="icon iconfont icon-github" @click="goTo('https://github.com/Bokey76', $event)" title="github"></div>
        <div class="icon iconfont icon-xiaohongshu"
          @click="goTo('https://www.xiaohongshu.com/user/profile/5c5858380000000018037278', $event)" title="小红书"></div>
        <div class="icon iconfont icon-xinlangweibo" @click="goTo('https://weibo.com/u/6209660620', $event)" title="微博">
        </div>
      </div>
    </a-card>
    <!-- 关于本站 -->
    <h1>关于本站<span>About Web📍</span></h1>
    <a-card class="card about-web-card overflow-hidden  relative my-8" v-motion-fade-visible-once>
      <RepeatParallaxSlide :containerClass="'describe-card'">
        <div v-for="item in store.$state.config['about-me-slide']?.content" :key="item.title">
          <div class="describe-card relative card flex flex-col justify-center items-center">
            <img class="md:w-full absolute top-0" :src="item.image">
            <h3 class="card-title text-center mb-8">{{ item.title }}</h3>
            <p class="w-4/5 text-center my-8" v-for="text in item.text" :key="text" v-html="text">
            </p>
          </div>
        </div>
      </RepeatParallaxSlide>
    </a-card>
    <!-- about me -->
    <h1>关于我<span>About Me❓</span></h1>
    <!-- 渐变bar -->
    <a-card id="gradient-card" class="card my-8  p-8 relative" v-motion-slide-visible-top>
      <span class="card-title absolute top-8">Hi👏🏻</span>
      <div class="card-text"><span class="reverse-text">🎉</span>欢迎来到我的空间🎉</div>
      <div class="card-text">我是Bokey<span class="iconfont icon-infj mx-4"></span>一个绿老头前端开发</div>
      <div id="INFJ-bg" class="absolute text-9xl top-8 right-8">INFJ</div>
      <div id="INFJ-attach" class="absolute text-9xl left-8">提倡者</div>
    </a-card>
    <!-- 技能 / 生涯 -->
    <div class="flex flex-wrap">
      <div class="w-full lg:w-1/2 pr-0 lg:pr-4 my-4">
        <a-card class="card"  v-motion-slide-visible-left>
            <span class="card-title">技能</span>
            <div class="scroll-hidden w-full max-h-[50rem] my-8 flex flex-wrap justify-start content-start flex-1 overflow-y-scroll">
              <div v-for="item in store.$state.config['skill-item']?.content" :key="item.name"
                :class="item.type == 'parting' ? 'w-full' : ''">
                <a-tag class="tag py-4 mx-4 my-4 p-8 flex justify-center items-center" v-if="item.type == 'tag'"
                  @click="goTo(item.url, $event)" :color="item.color">
                  <template #icon>
                    <i class="mr-4 !text-4xl" :class="`iconfont ${item.iconClass}`"></i>
                  </template>
                  {{ item.name }}
                </a-tag>
                <div v-else-if="item.type == 'parting'" class="w-full">
                  <div class="skill-group-title relative my-6 py-2">
                    <span class="skill-group-title-text pl-8">{{ item.title }}</span>
                  </div>
                </div>
              </div>
            </div>
        </a-card>
      </div>
      <div class="w-full lg:w-1/2 pl-0 lg:pl-4 my-4">
        <a-card class="w-full card overflow-hidden flex" v-motion-slide-visible-right>
          <span class="card-title">生涯</span>
          <div
            class="scroll-hidden h-full w-full max-h-[50rem] my-8 flex gap-8 flex-wrap justify-start content-start flex-1 overflow-y-scroll">
            <a-timeline pending="加载中..." mode="alternate" reverse class="py-8">
              <a-timeline-item class="timeline-item"
                v-for="(item, index) in store.$state.config['career-line']?.content" :key="index">
                <template #dot>
                  <div class="dot">{{ item.icon }}</div>
                </template>
                <div class="line-info mx-4 flex flex-col items-center"
                  :class="(store.$state.config['career-line']?.content?.length - index - 1) % 2 == 0 ? 'text-right' : 'text-left'">
                  <div class="time mx-4 flex-1 w-full">{{ item.time }}</div>
                  <div class="w-full">{{ item.label }}</div>
                </div>
              </a-timeline-item>
            </a-timeline>
          </div>
        </a-card>
      </div>
    </div>
    <!-- 词云cloud -->
    <a-card class="card  relative my-8" v-motion-slide-visible-top>
      <span class="card-title">关键词🔑</span>
      <div id="word-cloud">
        <div class="flex justify-center items-center">
          <canvas width="600" height="350" id="cloud" ref="cloud"></canvas>
        </div>
        <div id="cloud-tags" class="hidden" v-html="store.$state.config['about-me-cloud-tags']?.content">
        </div>
        <div class="small-tips text-end">我的构成元素，对自己的探索希望能越来越多</div>
      </div>
    </a-card>
    <!-- 写在最后 -->
    <h1>写在最后<span>Final Thoughts💐</span></h1>
    <a-card class="card my-8 cursor-point"
      @click="thoughtsIndex = getRandomIndex(store.$state.config['final-thoughts']?.content, thoughtsIndex, true)"
      v-motion-slide-visible-top>
      <p class="card-title mt-4" v-for="(item, index) in store.$state.config['final-thoughts']?.content"
        :key="index + 'thoughts'" v-motion :initial="{ opacity: 0, y: 10 }" :visible="{
          opacity: 1, y: 0, transition: {
            duration: 300,
          },
        }" v-show="index == thoughtsIndex" v-html="item"></p>
      <div class="small-tips text-end">点一点有惊喜</div>
    </a-card>
  </div>
</template>

<style lang="scss" scoped>
#about-page {

  // bokey bar
  #bokey {

    &:hover img {
      width: 25rem;
      height: 25rem;
      padding: .2rem;
    }

    img {
      background-color: $main-text-color;
    }

    img,
    .icon {
      transition: all .3s;
    }

    #description {
      color: $secondary-text-color;
    }

    .icon {
      font-size: $large-font-size;
      color: $main-text-color;
      border-radius: 50%;

      &:hover {
        font-size: $x-large-font-size;
      }

    }
  }

  h1 {
    font-size: $large-font-size;
    font-weight: $large-font-weight;
    color: $main-text-color;
    margin: 2rem 5rem;

    span {
      font-size: $x-small-font-size;
      font-weight: $small-font-weight;
      color: $secondary-text-color;
      margin-left: 1rem;
    }

  }

  // 渐变card
  #gradient-card {
    background-image: linear-gradient(109.6deg, rgba(96, 221, 142, 1) 11.2%, rgba(24, 138, 141, 1) 60.1%);
    overflow: hidden;
    font-size: $x-small-font-size;
    color: $main-background-color;
    -webkit-box-shadow: inset 0px 0px 20px 1px $main-background-color;
    -moz-box-shadow: inset 0px 0px 20px 1px $main-background-color;
    box-shadow: inset 0px 0px 20px 1px $main-background-color;

    &>* {
      opacity: .7;
    }

    // 字体反向
    .reverse-text {
      transform: scaleX(-1);
      display: inline-block;
      /* 确保反向显示在块级或行内级元素中都生效 */
    }

    .card-text {
      text-align: center;
      opacity: 1;
      color: $main-text-color;
    }

    &:hover #INFJ-bg {
      font-size: 10rem;
    }

    &:hover #INFJ-attach {
      top: -100%;
      opacity: 0;
    }

    #INFJ-bg,
    #INFJ-attach {
      z-index: -1;
      transition: all .5s;
      font-size: 20rem;
      opacity: .1;
    }

    #INFJ-attach {
      top: -20%;
      font-size: 15rem;
    }

    @media (max-width:1020px) {
      #INFJ-bg {
        font-size: 10rem;
      }

      #INFJ-attach {
        top: -100%;
        opacity: 0;
      }
    }

  }

  .about-web-card {
    font-weight: $large-font-weight;

    .describe-card {
      height: 40rem;

      &:hover .card-title::after {
        width: 100%;
      }

      .card-title {
        color: $main-text-color;
        font-size: $small-font-size;
        position: relative;

        &::after {
          content: "";
          position: absolute;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, $main-text-color, $secondary-text-color);
          bottom: 0;
          left: 0;
          border-radius: 20px;
          transition: width 0.5s ease;
        }
      }

      .card-title,
      p {
        z-index: 2;
        opacity: 1;
      }

      p {
        font-size: $small-font-size;
        margin: 1rem auto;
      }

      * {
        z-index: 1;
        opacity: .8;
      }
    }
  }

  .card-title {
    font-size: $small-font-size;
    transition: all .3s;
  }

  .card {
    color: $main-text-color;

    :deep(.ant-card-body) {
      width: 100%;
    }

    .tag {
      font-size: $small-font-size;
      cursor: $hover-cursor;

      &:hover {
        transform: scale(1.1);
      }
    }

    &:hover .card-title {
      font-size: $medium-font-size;
    }

    // 生涯item
    .timeline-item {
      cursor: $hover-cursor;

      &:hover .dot,
      &:hover .line-info .time {
        font-size: $large-font-size;
        font-weight: $large-font-weight;
      }

      .dot {
        font-size: $medium-font-size;
        transition: all .5s;
      }

      .line-info {
        font-size: $xx-small-font-size;
        width: 90%;

        .time {
          font-size: $x-small-font-size;
          transition: all .5s;
        }

      }


    }

    .small-tips {
      color: $secondary-text-color;
    }

  }

  // 隐藏滚动条
  .scroll-hidden {
    scrollbar-width: none;
    /* Firefox */
    -ms-overflow-style: none;
    /* Internet Explorer 和 Edge */

    &::-webkit-scrollbar {
      display: none;
      /* Chrome, Safari, Opera */
    }
  }

  // 技能分组标题（不走 divider / 不走拉线）
  .skill-group-title::before {
    content: "";
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 8px;
    height: 100%;
    border-radius: 999px;
    background: linear-gradient(180deg, rgba(96, 221, 142, 0.95), rgb(36 111 52 / 55%));
  }

  .skill-group-title-text {
    font-size: $x-small-font-size;
  }

}
</style>
<style lang="scss">
.about-web-card {
  .ant-card-body {
    padding: 0 !important;
  }
}
</style>