FROM node:20-alpine

WORKDIR /app
# 先复制依赖配置文件（利用 Docker 缓存）
COPY ./app/package*.json ./
COPY ./.env.* /

RUN npm install -g pm2 && npm install

COPY ./app ./

# 两个构建配置参数
ARG NUXT_ENV=dev
ARG SKIP_BUILD=false
ENV NUXT_ENV=$NUXT_ENV
ENV SKIP_BUILD=$SKIP_BUILD

RUN if [ "$SKIP_BUILD" != "true" ]; then \
      if [ "$NUXT_ENV" = "beta" ]; then npm run build:beta; \
      elif [ "$NUXT_ENV" = "pro" ]; then npm run build:pro; \
      else echo "Skip build for dev"; \
      fi \
    else echo "Skip build as requested"; fi

CMD ["pm2-runtime", "ecosystem.config.js", "--env", "dev"]
