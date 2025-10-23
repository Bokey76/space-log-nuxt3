# Bokey Space Customer


项目为日常分享、文章展示类项目，基本功能模块：
- 博客模块
- 评论模块（ps: 代码中暂时注释，打开可用，因为我的站点备案问题，暂时关闭评论功能）
- 留言模块（实际和评论是同一模块）
- 友链模块
- 全局配置模块

项目使用技术说明：

| 技术                                                  | 说明                                        |
| ----------------------------------------------------- | ------------------------------------------- |
| [Nuxt 3](https://nuxt.com/)                           | Vue 3 的服务端渲染框架                      |
| [Ant Design Vue](https://www.antdv.com/)              | 企业级 UI 组件库                            |
| [Tailwind CSS](https://tailwindcss.com/)              | 实用类优先的 CSS 框架                       |
| [md-editor-v3](https://imzbf.github.io/md-editor-v3/) | Markdown 渲染与编辑组件（用于博客文章展示） |
| [@vueuse/motion](https://motion.vueuse.org/)          | Vue 动画库，支持流畅过渡与交互动效          |
| [PM2](https://pm2.keymetrics.io/)                     | Node 进程管理工具                           |
| [Docker Compose](https://docs.docker.com/compose/)    | 容器化部署支持                              |

### ⚙️ 环境要求

> Node.js：推荐 v20+（最低支持 v18）
> 可以使用 Docker / PM2 启动项目（注意请先根据.env.example 完善配置文件）
> 配置文件说明：
> .env 文件 - 定义各环境开发端口
> .env.xxx 文件 - 定义各环境的其他配置

### 项目启动 ✅

项目可以通过`npm run`,`docker compose`,`pm2`三种方式启动

#### `npm run`启动

首先保证当前处于项目`/app`文件夹下：

```shell
cd app
```

根据需求 npm script 来`run`项目：

```shell
npm run serve:dev # 开发环境，本地启动
npm run serve:beta # 测试环境，本地启动
npm run serve:pro # 生产环境，本地启动
npm run build:beta # 打包测试环境
npm run build:pro # 打包生产环境
```

#### `docker compose`启动

首先保证当前处于项目根目录`/`下
```shell
docker compose up -d --build nuxt3-dev # 启动docker容器，开发版本（热重载）
docker compose up -d --build nuxt3-beta-run # 启动docker容器，测试环境版本（热重载）
docker compose up -d --build nuxt3-beta # 启动docker容器，测试环境生产版本，build打包，无热重载
docker compose up -d --build nuxt3-pro-run # 启动docker容器，生产环境版本（热重载）
docker compose up -d --build nuxt3-pro # 启动docker容器，生产环境生产版本，build打包，无热重载
```

#### `pm2`启动
首先保证当前处于项目`/app`文件夹下：

```shell
cd app
```
根据`pm2`配置文件`ecosystem.config.cjs`来启动项目：

```shell
pm2 start ecosystem.config.js --update-env # 开发环境启动
pm2 start ecosystem.config.js --env beta --update-env # 测试环境启动
pm2 start ecosystem.config.js --env pro --update-env # 生产环境启动
```
ps: 我本人比较少用`pm2`来启动开发，不知道会不会遇到问题，`beta`环境和`pro`环境部署应该没什么问题，但热重载和开发就不知道会不会有问题

### ✍️ 项目会用到的数据库配置

本项目在访问前会调用接口读取数据库的配置存储在`store.config`中，不配置也不会报错，只是会缺少内容，建议在后台（后台、后端均已开源，具体查看我的github仓库）添加这些内容会比较方便一些，目前所需的配置项：

| 数据名称 | 数据接口字段 | 数据类型 | 数据格式示例 |
|---------|-------------|---------|-------------|
| 头像 | my-avatar | STRING | "https://bokey-space/my-avatar.png" |
| 职业成长线 | career-line | JSON | [{"icon": "🎓", "time": "2020-09-01", "label": "翻开崭新的篇章，第一次进入母校"},  ...] |
| 技能列表 | skill-item | JSON | [  { "type": "parting", "title": "Stack" },{"url": "https://vuejs.org/", "name": "Vue", "type": "tag", "color": "#42b983", "iconClass": "icon-vuejs"}, ...] |
| 默认图片 | not-found-image | STRING | "https://bokey-space/not-found.png" |
| 关于我的标签云 | about-me-cloud-tags | STRING | "<a href=\"#\">00后程序员💻</a>\n<a href=\"#\">INFJ🧩</a>\n<a href=\"#\">爱🐣</a>..." |
| 留言轮播 | message-slide | JSON | [{"text": ["常常记录，<span class=\"emphasize\">留下痕迹</span>", "Bokey正在<span class=\"emphasize\">努力进步中💪</span>"], "image": "https://bokey-space/grassland.png", "title": "我的日常痕迹📡"}] |
| 关于我轮播 | about-me-slide | JSON | [{"text": ["建立本站的初衷希望记录自己的成长🙂", "🌐同时认识更多志同道合的朋友..."], "image": "https://bokey-space.oss-cn-shenzhen.aliyuncs.com/pro/global/DesertQuest.jpg", "title": "设站目的"}, ...] |
| 我的名字 | my-name | STRING | "Bokey" |
| 表情列表 | emojis | JSON | ["😀", "😃", "😁", "🥳", "😆", ...] |
| 感想 | final-thoughts | JSON | ["希望我们都在这个世界<span class=\"emphasize\">留下属于自己的痕迹</span>🐾", "怎么样都会有遗憾<br/><span class=\"emphasize\">把决定权留给自己❤️‍🔥</span>", ...] |
| 图标样式链接 | icon-href | STRING | "https://at.alicdn.com/t/c/font_hopf.css" |

#### 🧩 动态图标样式链接说明

其中，**比较重要的是`图标样式链接`**，项目会在初始化的时候全局获取这个连接来加载他的图标，我用的是[阿里的图标库](https://www.iconfont.cn/)，把图标添加到项目里，然后使用font class的方式，可以生成得到类似：`//at.alicdn.com/t/c/font_66666_66666hopf.css`的字符串，加上`https:`前缀填入`icon-href`配置项的`content`就ok了。

我这样写的目的是为了我可以动态替换添加图标，如果你不需要，可以自行修改

#### 👀 感想配置说明

感想配置中添加`emphasize`类，客户端会添加一个下划线来重点标记

#### 表情列表说明

表情列表可以配置前台后台（好像都有动态获取，忘记了😅，有需要检查一下）的用户emoji列表

#### 技能列表说明

技能列表中`type`是`parting`会渲染一个分割线和`title`。`type`是`tag`会渲染一个可以点击跳转的技能小按钮，可配置颜色和icon

### ⚖️ 开源协议

本项目基于 MIT License 开源。
你可以自由地使用、修改和再发布此项目，但请在明显位置保留以下作者标注：
Powered by Peacock · https://github.com/Bokey76
若在网页底部、关于页面、README 或其他可见位置保留此标识，将是对作者的尊重与支持 ❤️，感谢。

### 🌟 支持与反馈

如果这个项目对你有帮助，期待你的 Star ⭐支持！感谢！
你的支持是我持续改进与开源更多项目的动力 🙌。
如果项目使用时有bug🐞，欢迎提issue，我看到后会尽快修改修复（ps: 尽快哈，尽快😁）
如果有什么问题，可以通过我的网站找到我（虽然现在留言功能关闭了，日后可能会再开启，但站点里有联系方式可以找到我）

### 🧑‍💻 关于作者

<div style="display:flex;flex-direction: column;align-items:center;padding:20px 0;">
<img src="./app/assets/images/bokey.png" alt="作者头像" width="200" style="border-radius: 50%;border: 10px solid #161616;" />
<h2 style="margin:10px 0 0">Bokey</h2>
<p style="font-weight:700;">在世界留下属于自己的痕迹🐾</p>
</div>

🌐 我的站点：[bokey space](https://bokey.space)

📧 联系方式：参考[bokey space](https://bokey.space)中提供的联系方式

💬 GitHub：https://github.com/Bokey76
