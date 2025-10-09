import { config } from 'dotenv'

console.log('config',process.env.NUXT_PUBLIC_ENV);

config({ path: `../.env.${process.env.NUXT_PUBLIC_ENV}` })

export default defineNuxtConfig({
  // 局域网其他设备可查看
  devServer: {
    host: "0.0.0.0",
    // port: 8500
  },
  ssr: true,
  compatibilityDate: "2025-10-06",
  app: {
    head: {
      title: "Bokey Space",
      meta: [
        {
          name: "description",
          content: `Bokey Space📍，希望在世界留下我的痕迹。我是Bokey，一名深圳的前端程序员，
          在这里我会分享我的日常☕️、编程💻、成长✍🏻，我们都会成为自己想要的样子`,
        },
      ],
    },
  },
  devtools: { enabled: true },
  runtimeConfig: {
    // 运行时配置项（全局变量）
    public: {
      apiUrl: "", // 后台url
      ossUrl: "", // oss的url
      baseUrl: "", // 本站地址
    },
  },
  modules: [
    "@pinia/nuxt",
    "@nuxtjs/sitemap",
    "@nuxtjs/robots",
    "@nuxtjs/tailwindcss",
    "@ant-design-vue/nuxt",
    "@vueuse/motion/nuxt",
  ],
  sitemap: {
    siteUrl: "https://bokey.space",
    defaults: {
      changefreq: "weekly",
      priority: 0.7,
    },
    urls: async () => {
      const { getSitemapUrls } = await import("./server/utils/sitemap-urls");
      return await getSitemapUrls();
    },
  },
  robots: {
    rules: [
      {
        UserAgent: "*",
        Allow: "/",
        Disallow: [],
      },
    ],
    sitemap: `${process.env.NUXT_PUBLIC_BASE_URL}/sitemap.xml`,
  },
  css: [
    "@/assets/scss/index.scss", // 引入 SCSS 入口文件
  ],
  plugins: [{ src: "@/plugins/mdEditorEmoji.client.js", mode: "client" }],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/assets/scss/variables.scss" as *;', // 在所有 SCSS 文件中引入变量文件
        },
      },
    },
    server: {
      watch: {
        usePolling: true,
        interval: 1000, // 轮询间隔 ms
      },
    },
  },
  hooks: {
    "build:before": () => {
      console.log(
        "-----process.env.NUXT_PUBLIC_ENV-----\n",
        process.env.NUXT_PUBLIC_ENV
      ); // 打印环境
      console.log(
        "-----process.env.NUXT_PUBLIC_API_URL-----\n",
        process.env.NUXT_PUBLIC_API_URL
      ); // 打印环境
    },
  },
});