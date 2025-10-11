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
<img src="https://bokey-space.oss-cn-shenzhen.aliyuncs.com/pro/global/my-avatar.png" alt="作者头像" width="200" style="border-radius: 50%;border: 10px solid #161616;" />
<h2 style="margin:10px 0 0">Bokey</h2>
<p style="font-weight:700;">在世界留下属于自己的痕迹🐾</p>
</div>

🌐 我的站点：[bokey space](https://bokey.space)
📧 联系方式：参考[bokey space](https://bokey.space)中提供的联系方式
💬 GitHub：https://github.com/Bokey76
