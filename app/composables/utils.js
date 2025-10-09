import { useCookie } from "nuxt/app";

export const utils = {
  /**
   * 解析返回数据的合法性，自动提示错误
   * @param {Object} res 后端返回数据，一般结构：{code,msg: ''|{message,description},data}，code<0时错误提示
   * @param {Boolean} tipOrNot 成功（code=200）是否进行notification提示，默认是true
   * @returns true / false 返回操作是否成功的boolean
   */
  analysisData: (res, tipOrNot = true) => {
    if (tipOrNot || res.code != 200) {
      notification.open({
        message: typeof res.msg === "string" ? "提示💡" : res.msg.message,
        description:
          typeof res.msg === "string" ? res.msg : res.msg.description,
        placement: "top",
        duration: 3,
      });
    }
    if (res.code < 0) {
      return false;
    }
    return true;
  },
  /**
   * 格式化时间为YYYY-MM-DD 或 YYYY-MM-DD HH:MM:SS
   * @param {*} date 时间，可自动转化为date对象
   * @param {*} detail 是否需要详细到时分秒的格式
   * @returns
   */
  formatDate: (date = new Date(), detail = false) => {
    if (typeof date !== Date) {
      // 格式转化
      date = new Date(date);
    }
    let year = date.getFullYear(); //获取完整的年份(4位)
    let month = date.getMonth() + 1; //获取当前月份(0-11,0代表1月)
    let strDate = date.getDate(); // 获取当前日(1-31)
    if (month < 10) month = `0${month}`; // 如果月份是个位数，在前面补0
    if (strDate < 10) strDate = `0${strDate}`; // 如果日是个位数，在前面补0
    if (detail) {
      // 若为需要详细到时分秒的格式
      return `${year}-${month}-${strDate} ${String(
        date.getHours() + 1
      ).padStart(2, "0")}:${String(date.getMinutes()).padStart(
        2,
        "0"
      )}:${String(date.getSeconds()).padStart(2, "0")}`;
    }
    return `${year}-${month}-${strDate}`;
  },
  /**
   * 判断是否为空
   * @param {*} obj 需要判断的对象
   * @returns {boolean} 是否为空
   *  */
  isNullOrEmpty(obj) {
    // 检查是否为null或undefined
    if (obj === null || obj === undefined) {
      return true;
    }
    // 检查是否为空对象
    if (typeof obj === "object" && Object.keys(obj).length === 0) {
      return true;
    }
    // 检查是否为空字符串
    if (typeof obj === "string" && obj.trim() === "") {
      return true;
    }
    // 如果以上条件都不满足，则认为不是null、undefined或空对象
    return false;
  },
  /**
   * 检查数据是否为邮箱格式
   * @param {String} data 数据内容
   * @returns {boolean} 是否为邮箱格式
   */
  isValidEmail(email) {
    const emailPattern =
      /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    return emailPattern.test(email);
  },
  /**
   * 设置cookie
   * @param {String} key cookie的key
   * @param {*} data cookie的数据
   * @param {Object} options cookie的配置项，默认maxAge为10天
   */
  setCookie(
    key,
    data,
    options = {
      maxAge: 60 * 60 * 24 * 10,
    }
  ) {
    const cookie = useCookie(key);
    cookie.value = data;
    cookie.options = { ...options }; // 合并传入的选项
  },
  /**
   * 获取cookie内容
   * @param {String} key cookie的key
   * @returns cookie的数据
   */
  getCookie(key) {
    return useCookie(key).value;
  },
  /**
   * 删除cookie
   * @param {String} key
   */
  removeCookie(key) {
    return (useCookie(key).value = null);
  },
  /**
   * 格式化时间函数，简化时间
   * @param {*} date 时间对象
   * @returns { String } 格式化字符串
   */
  formatDateSimple(date) {
    const now = new Date();
    const targetDate = new Date(date);

    const nowYear = now.getFullYear();
    const nowMonth = now.getMonth();
    const nowDay = now.getDate();

    const targetYear = targetDate.getFullYear();
    const targetMonth = targetDate.getMonth();
    const targetDay = targetDate.getDate();

    // 判断是否同一天
    if (
      nowYear === targetYear &&
      nowMonth === targetMonth &&
      nowDay === targetDay
    ) {
      return `今天 ${targetDate.getHours()}:${targetDate
        .getMinutes()
        .toString()
        .padStart(2, "0")}`;
    }

    // 判断是否昨天
    const yesterday = new Date(nowYear, nowMonth, nowDay - 1);
    if (
      targetYear === yesterday.getFullYear() &&
      targetMonth === yesterday.getMonth() &&
      targetDay === yesterday.getDate()
    ) {
      return `昨天 ${targetDate.getHours()}:${targetDate
        .getMinutes()
        .toString()
        .padStart(2, "0")}`;
    }

    // 一个月内（基于天数差）
    const timeDiff = now - targetDate;
    const oneDay = 24 * 60 * 60 * 1000;
    const daysDiff = Math.floor(timeDiff / oneDay);

    if (daysDiff < 30) {
      return `${daysDiff}天前`;
    }

    // 今年
    if (targetYear === nowYear) {
      const month = (targetDate.getMonth() + 1).toString().padStart(2, "0");
      const day = targetDate.getDate().toString().padStart(2, "0");
      return `${month}-${day}`;
    }

    // 其他情况
    const year = targetDate.getFullYear();
    const month = (targetDate.getMonth() + 1).toString().padStart(2, "0");
    const day = targetDate.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  },
};
