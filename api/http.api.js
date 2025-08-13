const http = uni.$u.http;
const getApi = (params = {}, config) => http.get("/frontend/user/login", { params, ...config });
const driverInfoApi = (data = {}, config) => http.get("/app/driver/info", data, config);

//  ↑ get
//  ↓ post
const postApi = (data = {}, config) => http.post("/frontend/login/account-password", data, config);
const loginApi = (data = {}, config) => http.post("/app/driver/login", data, config);
const updateDriverApi = (data = {}, config) => http.post("/app/driver/update", data, config);
const updatePasswordApi = (data = {}, config) => http.post("/app/driver/updatePassword", data, config);
const orderListApi = (data = {}, config) => http.post("/app/driver/order/list", data, config);

const driverOrderDetailApi = (data = {}, config) => http.post("/app/driver/order/detail", data, config);


let apiList = {
    getApi, // get接口示例
    postApi, // post接口示例
    loginApi, // 登录
    driverInfoApi,//个人中心
    updateDriverApi,//修改个人信息,
    updatePasswordApi,//修改密码
    orderListApi, //订单列表
    driverOrderDetailApi,//订单详情
};
export default { ...apiList };
