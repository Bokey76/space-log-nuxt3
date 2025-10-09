module.exports = {
  apps: [
    {
      script: ".output/server/index.mjs", // 启动文件
      watch: false,
      // instances: "max",
      // exec_mode: "cluster",
      ignore_watch: ["node_modules", "logs", "temp"],
      error_file: "./logs/error.log",
      out_file: "./logs/out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      // 默认环境配置
      env: {
        NODE_ENV: "dev", // 该环境的NODE_ENV
        name: "spaceP_customer_dev", // 该环境下node进程的PM2名称
        NODE_APP_INSTANCE: "dev", // 指定该环境加载的config配置文件（默认加载default-0.json，若没有配置文件会在错误日志中报错）
        DOTENV: ".env.dev", // 指定配置文件
        PORT: process.env.NODE_PORT,
      },
      // beta环境
      env_beta: {
        NODE_ENV: "beta",
        name: "spaceP_customer_beta",
        NODE_APP_INSTANCE: "beta",
        DOTENV: ".env.beta",
        PORT: process.env.NODE_PORT,
      },
      // pro环境
      env_pro: {
        NODE_ENV: "pro",
        name: "spaceP_customer_pro",
        NODE_APP_INSTANCE: "pro",
        DOTENV: ".env.pro",
        PORT: process.env.NODE_PORT,
      },
    },
  ],
};
