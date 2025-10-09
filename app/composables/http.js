// 请求封装
const request = async (url, options, headers) => {
  try {
    const token = utils.getCookie("token");
    let baseUrl = useRuntimeConfig().public.apiUrl;
    // 解决win客户端和服务端差异（只有服务端能使用host.docker.internal）
    if (import.meta.client && baseUrl.includes("host.docker.internal")) {
      baseUrl = baseUrl.replace("host.docker.internal", "localhost");
    }
    const reqUrl = baseUrl + url;
    const customHeaders = {
      Authorization: `Bearer ${token}`, // 添加权限，从store中获取token
      ...headers,
    };
    // 删除 undefined key
    Object.keys(customHeaders).forEach(
      (key) => customHeaders[key] === undefined && delete customHeaders[key]
    );
    const res = await $fetch(reqUrl, { ...options, headers: customHeaders });
    return res;
  } catch (e) {
    console.log("fetch error:", e);
    const errorData = e?.response?._data || {
      code: -1,
      msg: {
        message: "请求错误❌",
        description: `${e}`,
      },
    };
    // 统一抛出错误，让调用方处理
    throw errorData;
  }
};
export const http = {
  /**
   * 发送get请求
   * @param {*} url 请求url(已包含前缀config.public.apiUrl)
   * @param {*} options 其他选项
   * @param {*} headers 请求头
   * @returns
   */
  get: (url, options, headers) =>
    request(url, { method: "get", ...options }, headers),
  /**
   * 发送get请求，携带query形式
   * @param {*} url 请求url(已包含前缀config.public.apiUrl)
   * @param {Object} data query数据，要求可遍历
   * @param {*} options 其他选项
   * @param {*} headers 请求头
   */
  getQueryIn: (url, data, options, headers) => {
    let first = true; // 第一个参数
    for (let key in data) {
      url = url + (first ? "?" : "&") + key + "=" + data[key];
      first = false;
    }
    return request(url, { method: "get", ...options }, headers);
  },
  /**
   * 发送post请求
   * @param {*} url 请求url(已包含前缀config.public.apiUrl)
   * @param {*} body 请求体
   * @param {*} options 其他选项
   * @param {*} headers 请求头
   * @returns
   */
  post: (url, body, options, headers) =>
    request(url, { method: "post", body: body, ...options }, headers),
  /**
   * 发送delete请求
   * @param {*} url 请求url(已包含前缀config.public.apiUrl)
   * @param {*} options 其他选项
   * @param {*} headers 请求头
   * @returns
   */
  delete: (url, options, headers) =>
    request(url, { method: "delete", ...options }, headers),
};
