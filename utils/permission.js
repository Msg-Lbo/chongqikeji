/**
 * 本模块封装了Android、iOS的应用权限判断、打开应用权限设置界面、以及位置系统服务是否开启
 */

var isIos
// #ifdef APP-PLUS    
isIos = (plus.os.name == "iOS")
// #endif   

var viewShow = true;
// 判断推送权限是否开启    
function judgeIosPermissionPush() {
    var result = false;
    var UIApplication = plus.ios.import("UIApplication");
    var app = UIApplication.sharedApplication();
    var enabledTypes = 0;
    if (app.currentUserNotificationSettings) {
        var settings = app.currentUserNotificationSettings();
        enabledTypes = settings.plusGetAttribute("types");
        if (enabledTypes == 0) {
            console.log("推送权限没有开启");
        } else {
            result = true;
            console.log("已经开启推送功能!")
        }
        plus.ios.deleteObject(settings);
    } else {
        enabledTypes = app.enabledRemoteNotificationTypes();
        if (enabledTypes == 0) {
            console.log("推送权限没有开启!");
        } else {
            result = true;
            console.log("已经开启推送功能!")
        }
    }
    plus.ios.deleteObject(app);
    plus.ios.deleteObject(UIApplication);
    return result;
}

// 判断定位权限是否开启    
function judgeIosPermissionLocation() {
    var result = false;
    var cllocationManger = plus.ios.import("CLLocationManager");
    var status = cllocationManger.authorizationStatus();
    result = (status != 2)
    console.log("定位权限开启：" + result);
    // 以下代码判断了手机设备的定位是否关闭，推荐另行使用方法 checkSystemEnableLocation    
    /* var enable = cllocationManger.locationServicesEnabled();    
    var status = cllocationManger.authorizationStatus();    
    console.log("enable:" + enable);    
    console.log("status:" + status);    
    if (enable && status != 2) {    
        result = true;    
        console.log("手机定位服务已开启且已授予定位权限");    
    } else {    
        console.log("手机系统的定位没有打开或未给予定位权限");    
    } */
    plus.ios.deleteObject(cllocationManger);
    return result;
}

// 判断麦克风权限是否开启    
function judgeIosPermissionRecord() {
    var result = false;
    var avaudiosession = plus.ios.import("AVAudioSession");
    var avaudio = avaudiosession.sharedInstance();
    var permissionStatus = avaudio.recordPermission();
    console.log("permissionStatus:" + permissionStatus);
    if (permissionStatus == 1684369017 || permissionStatus == 1970168948) {
        console.log("麦克风权限没有开启");
    } else {
        result = true;
        console.log("麦克风权限已经开启");
    }
    plus.ios.deleteObject(avaudiosession);
    return result;
}

// 判断相机权限是否开启    
function judgeIosPermissionCamera() {
    var result = false;
    var AVCaptureDevice = plus.ios.import("AVCaptureDevice");
    var authStatus = AVCaptureDevice.authorizationStatusForMediaType('vide');
    console.log("authStatus:" + authStatus);
    if (authStatus == 3) {
        result = true;
        console.log("相机权限已经开启");
    } else {
        console.log("相机权限没有开启");
    }
    plus.ios.deleteObject(AVCaptureDevice);
    return result;
}

// 判断相册权限是否开启    
function judgeIosPermissionPhotoLibrary() {
    var result = false;
    var PHPhotoLibrary = plus.ios.import("PHPhotoLibrary");
    var authStatus = PHPhotoLibrary.authorizationStatus();
    console.log("authStatus:" + authStatus);
    if (authStatus == 3) {
        result = true;
        console.log("相册权限已经开启");
    } else {
        console.log("相册权限没有开启");
    }
    plus.ios.deleteObject(PHPhotoLibrary);
    return result;
}

// 判断通讯录权限是否开启    
function judgeIosPermissionContact() {
    var result = false;
    var CNContactStore = plus.ios.import("CNContactStore");
    var cnAuthStatus = CNContactStore.authorizationStatusForEntityType(0);
    if (cnAuthStatus == 3) {
        result = true;
        console.log("通讯录权限已经开启");
    } else {
        console.log("通讯录权限没有开启");
    }
    plus.ios.deleteObject(CNContactStore);
    return result;
}

// 判断日历权限是否开启    
function judgeIosPermissionCalendar() {
    var result = false;
    var EKEventStore = plus.ios.import("EKEventStore");
    var ekAuthStatus = EKEventStore.authorizationStatusForEntityType(0);
    if (ekAuthStatus == 3) {
        result = true;
        console.log("日历权限已经开启");
    } else {
        console.log("日历权限没有开启");
    }
    plus.ios.deleteObject(EKEventStore);
    return result;
}

// 判断备忘录权限是否开启    
function judgeIosPermissionMemo() {
    var result = false;
    var EKEventStore = plus.ios.import("EKEventStore");
    var ekAuthStatus = EKEventStore.authorizationStatusForEntityType(1);
    if (ekAuthStatus == 3) {
        result = true;
        console.log("备忘录权限已经开启");
    } else {
        console.log("备忘录权限没有开启");
    }
    plus.ios.deleteObject(EKEventStore);
    return result;
}

// Android权限查询    
function requestAndroidPermission(permissionID) {
    return new Promise((resolve, reject) => {
        plus.android.requestPermissions(
            // [permissionID], // 理论上支持多个权限同时查询，但实际上本函数封装只处理了一个权限的情况。有需要的可自行扩展封装    
            permissionID.split(","),
            function (resultObj) {
                var result = 0;
                for (var i = 0; i < resultObj.granted.length; i++) {
                    var grantedPermission = resultObj.granted[i];
                    console.log('已获取的权限：' + grantedPermission);
                    result = 1
                }
                for (var i = 0; i < resultObj.deniedPresent.length; i++) {
                    var deniedPresentPermission = resultObj.deniedPresent[i];
                    console.log('拒绝本次申请的权限：' + deniedPresentPermission);
                    result = 0
                }
                for (var i = 0; i < resultObj.deniedAlways.length; i++) {
                    var deniedAlwaysPermission = resultObj.deniedAlways[i];
                    console.log('永久拒绝申请的权限：' + deniedAlwaysPermission);
                    result = -1
                }
                resolve(result);
                // 若所需权限被拒绝,则打开APP设置界面,可以在APP设置界面打开相应权限    
                // if (result != 1) {    
                // gotoAppPermissionSetting()    
                // }    
            },
            function (error) {
                console.log('申请权限错误：' + error.code + " = " + error.message);
                resolve({
                    code: error.code,
                    message: error.message
                });
            }
        );
    });
}

// 使用一个方法，根据参数判断权限    
function judgeIosPermission(permissionID) {
    if (permissionID == "location") {
        return judgeIosPermissionLocation()
    } else if (permissionID == "camera") {
        return judgeIosPermissionCamera()
    } else if (permissionID == "photoLibrary") {
        return judgeIosPermissionPhotoLibrary()
    } else if (permissionID == "record") {
        return judgeIosPermissionRecord()
    } else if (permissionID == "push") {
        return judgeIosPermissionPush()
    } else if (permissionID == "contact") {
        return judgeIosPermissionContact()
    } else if (permissionID == "calendar") {
        return judgeIosPermissionCalendar()
    } else if (permissionID == "memo") {
        return judgeIosPermissionMemo()
    }
    return false;
}

// 跳转到**应用**的权限页面    
function gotoAppPermissionSetting() {
    if (isIos) {
        var UIApplication = plus.ios.import("UIApplication");
        var application2 = UIApplication.sharedApplication();
        var NSURL2 = plus.ios.import("NSURL");
        var setting2 = NSURL2.URLWithString("app-settings:");
        application2.openURL(setting2);

        plus.ios.deleteObject(setting2);
        plus.ios.deleteObject(NSURL2);
        plus.ios.deleteObject(application2);
    } else {
        // console.log(plus.device.vendor);    
        var Intent = plus.android.importClass("android.content.Intent");
        var Settings = plus.android.importClass("android.provider.Settings");
        var Uri = plus.android.importClass("android.net.Uri");
        var mainActivity = plus.android.runtimeMainActivity();
        var intent = new Intent();
        intent.setAction(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
        var uri = Uri.fromParts("package", mainActivity.getPackageName(), null);
        intent.setData(uri);
        mainActivity.startActivity(intent);
    }
}

// 检查系统的GPS设备服务是否开启
// var checkSystemEnableLocation = async function () {    
function checkSystemEnableLocation() {
    if (isIos) {
        var result = false;
        var cllocationManger = plus.ios.import("CLLocationManager");
        var result = cllocationManger.locationServicesEnabled();
        console.log("系统定位开启:" + result);
        plus.ios.deleteObject(cllocationManger);
        return result;
    } else {
        var context = plus.android.importClass("android.content.Context");
        var locationManager = plus.android.importClass("android.location.LocationManager");
        var main = plus.android.runtimeMainActivity();
        var mainSvr = main.getSystemService(context.LOCATION_SERVICE);
        var result = mainSvr.isProviderEnabled(locationManager.GPS_PROVIDER);
        console.log("系统定位开启:" + result);
        return result
    }
}

let permissionMap = {
    "android": {
        "CAMERA_EXTERNAL_STORAGE": {
            "name": "android.permission.READ_EXTERNAL_STORAGE,android.permission.WRITE_EXTERNAL_STORAGE,android.permission.CAMERA",
            "title": "相机/相册权限说明",
            "content": "便于您使用该功能上传您的照片/图片/视频及用于更换头像、拍照等场景中读取和写入相册和文件内容"
        },
        "CAMERA": {
            "name": "android.permission.CAMERA",
            "title": "相机权限说明",
            "content": "授权摄像头以便于拍摄上传图片"
        },
        "EXTERNAL_STORAGE": {
            "name": "android.permission.READ_EXTERNAL_STORAGE,android.permission.WRITE_EXTERNAL_STORAGE",
            "title": "相册权限说明",
            "content": "便于您使用该功能上传您的照片/图片/视频及用于更换头像、打卡拍照等场景中读取和写入相册和文件内容"
        },
        "LOCATION": {
            "name": "android.permission.ACCESS_COARSE_LOCATION,android.permission.ACCESS_FINE_LOCATION",
            "title": "定位权限说明",
            "content": "便于您使用该功能确认当前位置，进行用户定位"
        },

    },
    "ios": {}
}

let view = null;

function showViewDesc(permission) {
    let plat = isIos ? "ios" : "android";
    view = new plus.nativeObj.View('per-modal', {
        top: '0px',
        left: '0px',
        width: '100%',
        backgroundColor: 'rgba(0,0,0,0.2)',
        //opacity: '.9'       
    })
    view.drawRect({
        color: '#fff',
        radius: '5px'
    }, {
        top: '30px',
        left: '5%',
        width: '90%',
        height: "100px",
    })
    view.drawText(permissionMap[plat][permission]["title"], {
        top: '40px',
        left: "8%",
        height: "30px"
    }, {
        align: "left",
        color: "#000",
    }, {
        onClick: function (e) {
            console.log(e);
        }
    })
    view.drawText(permissionMap[plat][permission]["content"], {
        top: '65px',
        height: "60px",
        left: "8%",
        width: "84%"
    }, {
        whiteSpace: 'normal',
        size: "14px",
        align: "left",
        color: "#656563"
    })
    setTimeout(() => {
        if (viewShow) view.show()
    }, 200)
}

function premissionCheck(permission) {
    return new Promise(async (resolve, reject) => {
        let plat = isIos ? "ios" : "android";
        // #ifdef H5
        resolve(1)
        // #endif
        // #ifdef APP-PLUS
        if (isIos) { // ios    
            // const camera = permission.judgeIosPermission("camera");//判断ios是否给予摄像头权限    
            // //ios相册没权限，系统会自动弹出授权框    
            // //let photoLibrary = permission.judgeIosPermission("photoLibrary");//判断ios是否给予相册权限    
            // if(camera){    
            //     resolve();    
            // }else{    
            //     reject('需要开启相机使用权限');    
            // }    
            resolve(1)
        } else { // android    
            let permission_arr = permissionMap[plat][permission]["name"].split(",");
            let flag = true;
            for (let i = 0; i < permission_arr.length; i++) {
                let status = plus.navigator.checkPermission(permission_arr[i]);
                if (status == "undetermined") {
                    flag = false;
                }
            }
            if (flag == false) { // 未完全授权    
                showViewDesc(permission);
                requestAndroidPermission(permissionMap[plat][permission]["name"]).then((res) => {
                    viewShow = false;
                    setTimeout(() => {
                        viewShow = true;
                    }, 120)
                    view.close();
                    if (res == -1) {
                        // 您已禁止授权本应用的相机权限，如需使用请在设置中授权
                        uni.showModal({
                            title: '提示',
                            content: '操作权限已被拒绝，请手动前往设置',
                            confirmText: "立即设置",
                            success: (res) => {
                                if (res.confirm) {
                                    gotoAppPermissionSetting()
                                }
                            }
                        })
                    }
                    resolve(res)
                })
            } else {
                resolve(1)
            }
        }
        // #endif
    })
}

module.exports = {
    judgeIosPermission: judgeIosPermission,
    requestAndroidPermission: requestAndroidPermission,
    checkSystemEnableLocation: checkSystemEnableLocation,
    gotoAppPermissionSetting: gotoAppPermissionSetting,
    premissionCheck: premissionCheck
}