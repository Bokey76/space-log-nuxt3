export default defineNitroPlugin((nitroApp) => {
  // 1. Nitro 内置错误钩子（所有 API、渲染错误都会进来）
  // nitroApp.hooks.hook("error", (err, { event }) => {
  //   console.error("❌ [Nitro error] ", {
  //     message: err.message,
  //     stack: err.stack,
  //     url: event?.path,
  //     method: event?.method,
  //   });
  // });

  // 2. Node.js 全局兜底
  process.on("uncaughtException", (err) => {
    console.error("❌ [Uncaught Exception] ", err);
  });

  process.on("unhandledRejection", (reason, promise) => {
    console.error("❌ [Unhandled Rejection] ", {
      reason,
      promise,
    });
  });
});

