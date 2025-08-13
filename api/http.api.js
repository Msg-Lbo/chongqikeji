const http = uni.$u.http;
const getApi = (params = {}, config) => http.get("/frontend/user/login", { params, ...config });
const driverInfoApi = (data = {}, config) => http.get("/app/driver/info", data, config);

//  ↑ get
//  ↓ post
const postApi = (data = {}, config) => http.post("/frontend/login/account-password", data, config);
const loginApi = (data = {}, config) => http.post("/app/driver/login", data, config);
const updateDriverApi = (data = {}, config) => http.post("/app/driver/update", data, config);

let apiList = {
    getApi, // get接口示例
    postApi, // post接口示例
    loginApi, // 登录
    driverInfoApi,//个人中心
    updateDriverApi,//修改个人信息
};
export default { ...apiList };
