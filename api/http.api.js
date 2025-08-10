const http = uni.$u.http;
const getApi = (params = {}, config) => http.get("/frontend/user/login", { params, ...config });
//  ↑ get
//  ↓ post
const postApi = (data = {}, config) => http.post("/frontend/login/account-password", data, config);
const loginApi = (data = {}, config) => http.post("/app/driver/login", data, config);
let apiList = {
    getApi, // get接口示例
    postApi, // post接口示例
    loginApi, // 登录
};
export default { ...apiList };
