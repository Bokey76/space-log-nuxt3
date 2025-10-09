export const api = {
  // --全局api--
  getGlobalConfig: () => {
    return http.get("/configuration/reception/getConfig");
  },
  // #region 文章api
  // 获取最热门的10篇文章
  getHottestArticleTen: () => {
    return http.post("/article/reception/searchArticle", {
      data: { popularity: true },
      currentPage: 1,
      pageSize: 10,
    });
  },
  /**
   * 获取文章列表，按时间排序
   * @param {*} currentPage 当前页
   * @param {*} pageSize 页大小
   */
  getArticleListOrderByTime: (data) => {
    return http.post("/article/reception/searchArticle", {
      data: { orderByTime: true },
      currentPage: data.currentPage,
      pageSize: data.pageSize,
    });
  },
  /**
   * 搜索文章
   * @param {*} searchContent 搜索内容
   * @param {*} currentPage 当前页
   * @param {*} pageSize 页大小
   */
  searchArticle: (data) => {
    return http.post("/article/reception/searchArticle", {
      data: { topic: data.searchContent, orderByTime: true },
      currentPage: data.currentPage,
      pageSize: data.pageSize,
    });
  },
  // 获取文章内容
  getArticleContentById: (id) => {
    return http.get(`/article/reception/getArticleContent/${id}`);
  },
  // 获取所有文章类别
  getAllArticleTypes: () => {
    return http.get(`/article/reception/getAllArticleTypes`);
  },
  // 通过id获取文章类别
  getArticleTypeById: (id) => {
    return http.get(`/article/reception/getArticleTypeById/${id}`);
  },
  // 通过id点赞文章
  likeArticleById: (id) => {
    return http.post(`/article/reception/likeArticle`, { id: id });
  },
  // 通过typeId获取文章列表
  getArticleByTypeId: (typeId, currentPage, pageSize) => {
    return http.get(
      `/article/reception/getArticleByTypeId/${typeId}/${currentPage}/${pageSize}`
    );
  },
  getRandomArticleId: (exceptId) => {
    return http.get(`/article/reception/getRandomArticleId/${exceptId}`);
  },
  // #endregion

  // #region 用户api
  // 获取登录验证码
  getLoginCode: (data) => {
    return http.post(`/user/reception/getLoginCode`, data);
  },
  // 登录接口
  login: (data) => {
    return http.post(`/user/reception/login`, data);
  },
  // 通过token获取用户信息
  getUserDataByToken: () => {
    return http.get(`/user/getUserDataByToken`, {});
  },
  // 更新用户信息
  updateUserData: (data) => {
    return http.post(`/user/updateUser`, data);
  },
  // #endregion

  // #region 评论api
  // 获取评论 分页
  getComment: (data) => {
    const path = `/comment/reception/customerGetComment/${data.currentPage}/${data.pageSize}`;
    delete data.currentPage;
    delete data.pageSize;
    return http.getQueryIn(path, data);
  },
  // 获取所有子评论
  getSubComment: async (data) => {
    return await http.getQueryIn(
      "/comment/reception/customerGetSubComment",
      data
    );
  },
  // 添加评论
  addComment: async (data) => {
    return await http.post("/comment/addComment", data);
  },
  // 喜欢评论
  likeComment: async (id) => {
    return await http.post("/comment/reception/likeComment", { id });
  },
  // #endregion

  // #region 友链
  // 获取所有友链
  getAllFriendLink: async () => {
    return await http.get("/friendLink/reception/getAllFriendLink");
  },
  // 随机获取一个友链
  getRandomFriendLink: async (exceptId) => {
    return await http.get(
      `/friendLInk/reception/getRandomFriendLink/${exceptId}`
    );
  },
  // 提交友链申请
  submitFriendLink: async (data) => {
    return await http.post("/friendLink/reception/addFriendLink", data);
  },
  // #endregion

  // #region oss
  /**
   * 上传oss图片
   * @param {*} data 格式：{file: 文件二进制 , path: 上传到oss的路径（若uuidOrNot为false，需要包括文件名和文件后缀）,uuidOrNot: 是否生成uuid }
   */
  uploadImage: async (data) => {
    return await http.post("/oss/customer/uploadImage", data, null, {
      // "Content-Type": "multipart/form-data",
    });
  },
  // 删除图片
  deleteImage: async (data) => {
    return http.delete(`/oss/customer/deleteImage?path=${data.path}`);
  },
  // #endregion
};
