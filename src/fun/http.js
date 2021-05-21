/**
 *
 * 调用示例：
 * let formData = new FormData()
 *formData.append("id",1060)
 *
 *$http.post(url,formData,headers).then((json) => {
 * //处理 请求success
 *  	if(json.code === 0 ){
 *          //我们假设业务定义code为0时，数据正常
 *      }else{
 *           //处理自定义异常
 *          console.log(json.msg);
 *      }
 * },(json)=>{
 *   //处理请求fail
 *
 * })
 */
import Fun from "./index";
import base64_encode from "../utils/base64_encode";
import { Toast } from 'vant';
// var heads = { 'Content-Type': 'application/json' };
// import store from "../store/index";
import storeOption from "../store";

axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded";
window.yzFirstlogin = 1;
window.yzValidate_page = 0;
//以下是不需要登录的页面
// "#/diyform/", 自定义表单页注释删除原因：没登录获取不到会员id提交不了表单[44944]
const passList = [
  "#/login?",
  "#/register?",
  "#/findpwd?",
  "#/category?",
  "#/user_agreement?",
  '#/member/editmobile/',
  '#/registerAgreement?'
];

// 创建一个 store 对象用于管理应用状态
const store = new Vuex.Store(storeOption);

function isPassUrl() {
  for (let i = 0; i < passList.length; i++) {
    // 编程式
    if (window.location.href.indexOf(passList[i]) > -1) {
      return true;
    }
  }

  return false;
}

function jumpH5() {
  // 跳转PC端路由
  const PCNotrouter = [
    { h5: "/member", pc: "/order" },
    { h5: "/member/orderList/0", pc: "/order" },
    { h5: "/member/orderdetail/", pc: "/order" }
  ];

  const PCrouter = [
    "/login", "/register", "/findpwd", "/home", "/category", "/category_child/", "/search",
    "/goods/", "/cart", "/goodsorder", "/supplier_shop2/", "/coupon/coupon_index", "/coupon/coupon_store",
    "/member/integral_v2", "/member/balance", "/member/address", "/member/extension", "/member/workerApply",
    "/member/workerOrderlist", "/member/workerOrderDetail/", "member/userOrderlist", "/member/userOrderDetail/",
    "/catelist/", "/application_market", "/member/collection", "/notice", "/articleContent/", "/member/coursedetail/",
    "/goodsGroup/"
  ];

  // 不需要跳转但是匹配的H5路由
  const notMatch = ['/o2o/home','/entry_orders/home','/microShop/home','/o2o/category/'];

  let path = "/" + window.location.href.match(/#\/(\S*)\?/)[1];
  let fullPath = window.location.href.match(/#\/(\S*)?/)[1];
  let isPCrouter = false;

  PCrouter.map((item) => {
    if (path.indexOf(item) > -1 && notMatch.indexOf(path) == -1) {
      isPCrouter = true;
    }
  });

  // 移动端跳转PC端
  if (isPCrouter) {
    Fun.browserRedirect(`${Fun.getSiteRoot()}/plugins/shop_server/${fullPath}`);
  } else {
    let notFlag = "";
    PCNotrouter.map((item) => {
      // 只能这样匹配  否则包含/member的都会跳转
      if (item.h5.indexOf(path) > -1) {
        notFlag = item.pc;
      }
    });

    if (notFlag) {
      // http://localhost:82
      Fun.browserRedirect(`${Fun.getSiteRoot()}/plugins/shop_server${notFlag}?i=${Fun.getKeyByI()}&mid=${Fun.getKeyByMid()}`);
    }
  }

}

function tempInfo(data) {
  // let isLocation = false;
  if (!data) return;

  if (data.memberinfo) {
    //可用爱心值
    window.localStorage.setItem("usable", data.memberinfo.usable);
    window.localStorage.setItem("uid", data.memberinfo.uid);
  }

  if (!data.default) {
    // 新装修
    if (data.item.is_decorate === 1) {
      window.isDecorate = true;
      // store.commit("setNewDiyData", data.item);
      // if (data.item.page_info && data.item.page_info.page_title) {
      //   data.item.janst = data.item.page_info.page_title;
      // }else {
      //   data.item.janst = "";
      // }
    } else {
      window.isDecorate = false;
      // for (let j of data.item.data) {
      //   j.temp = "show" + j.temp;
      //   if (
      //     j.temp == "showlocation" ||
      //     j.temp == "showstore" ||
      //     j.temp == "showbusiness"
      //   ) {
      //     isLocation = true;
      //   }
      // }
      // 设置的标题（装修）
      // if (data.item.pageinfo) {
      //   data.item.janst = data.item.pageinfo.params.title;
      // }
    }
  } else {
    // 设置的标题（默认）
  }
  data.item.janst = data.mailInfo.name;

  // if (isLocation) {
  //   if (window.location.href.indexOf("/home?") > 0) {
  //     getLocation();
  //   }
  // }

  window.localStorage.setItem("integral", "积分");
  if(data.mailInfo && data.mailInfo.credit1) {
    //积分值
    window.localStorage.setItem("integral", data.mailInfo.credit1);
  }

  if (data.plugin && data.plugin.new_member_prize && data.plugin.new_member_prize.prize) {
    //满足新人奖，显示弹窗
    // store.commit("setNewcomerAward", true);
    window.localStorage.setItem("new_member_prize", JSON.stringify(data.plugin.new_member_prize));
  }

  store.commit("tempIndex", data);
  // if (data.item.pageinfo) {
  //   store.commit("setWatchDiypage", data.item.pageinfo.params.allowauth);
  // }
  // window.localStorage.setItem("tempIndex", JSON.stringify(data));  存vuex里不存localStorage
}

// function getLocation() {
//   var myLocation = store.state.o2oLocation;
//
//   if (!myLocation.point) {
//     var mapObj = new AMap.Map("iCenter");
//     mapObj.plugin("AMap.Geolocation", function () {
//       var geolocation = new AMap.Geolocation({
//         enableHighAccuracy: true, // 是否使用高精度定位，默认:true
//         timeout: 10000, // 超过10秒后停止定位，默认：无穷大
//         maximumAge: 0, // 定位结果缓存0毫秒，默认：0
//         convert: true, // 自动偏移坐标，偏移后的坐标为高德坐标，默认：true
//         showButton: true, // 显示定位按钮，默认：true
//         buttonPosition: "LB", // 定位按钮停靠位置，默认：'LB'，左下角
//         buttonOffset: new AMap.Pixel(10, 20), // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
//         showMarker: true, // 定位成功后在定位到的位置显示点标记，默认：true
//         showCircle: true, // 定位成功后用圆圈表示定位精度范围，默认：true
//         panToLocation: true, // 定位成功后将定位到的位置作为地图中心点，默认：true
//         zoomToAccuracy: true // 定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
//       });
//       mapObj.addControl(geolocation);
//       geolocation.getCurrentPosition();
//       AMap.event.addListener(geolocation, "complete", onComplete); // 返回定位信息
//       AMap.event.addListener(geolocation, "error", onError); // 返回定位出错信息
//     });
//   }
// }

// function onComplete(obj) {
//   console.log("objjjjj", obj);
//   // var res =
//   //   "经纬度：" +
//   //   obj.position +
//   //   "\n精度范围：" +
//   //   obj.accuracy +
//   //   "米\n定位结果的来源：" +
//   //   obj.location_type +
//   //   "\n状态信息：" +
//   //   obj.info +
//   //   "\n地址：" +
//   //   obj.formattedAddress +
//   //   "\n地址信息：" +
//   //   JSON.stringify(obj.addressComponent, null, 4);
//   //alert(JSON.stringify(obj.addressComponent, null, 4));
//   let position = obj.position.toString().split(",");
//   let point = {
//     lat: position[1],
//     lng: position[0]
//   };
//   // let address = obj.formattedAddress;
//   // let title = obj.formattedAddress;
//   let city = !Fun.isTextEmpty(obj.addressComponent.city)
//     ? obj.addressComponent.city
//     : obj.addressComponent.province;
//
//   let pos = {
//     address: obj.formattedAddress,
//     city: city,
//     title: obj.formattedAddress,
//     point: point
//   };
//   console.log("test pos", pos);
//   store.commit("updateLocation", pos);
//   store.commit("setLocation", pos);
// }
//
// function onError(obj) {
//   Toast("定位失败,请手动切换位置");
// }

function getInvite(data) {
  // if (this.is_Inviter !== 1 || this.invite_mobile !== 1) {
  //   $http.get("member.member.isValidatePage").then(res => {
  //     if (res.result === 1) {
  if (data.is_invite === 1 || data.invite_mobile === 1) {
    window.yzValidate_page = 1;
  }

  if (data.is_bind_mobile !== 0) {
    bindMobile(data.is_bind_mobile);
  } else {
    if (data.is_login === 1) {
      //登录
      if (data.is_invite !== 1) {
        //没有填写过邀请人
        if (data.invite_page === 1) {
          //开启了邀请页面
          if (store.state.is_Inviter) {
            //不是第一次进入商城  点击了确认邀请人
          } else {
            if (
              window.location.href.indexOf("input_visit") > 0 ||
              window.location.href.indexOf("member/editmobile") > 0
            ) {
              //是在这两个页面do nothing
            } else if (
              window.location.href.indexOf("input_visit") < 0 ||
              window.location.href.indexOf("member/editmobile") < 0
            ) {
              window.location.href =
                Fun.getSiteRoot() +
                "/addons/yun_shop/" +
                "?menu#" +
                "/Inviter?i=" +
                Fun.getKeyByI() +
                "&type=" +
                Fun.getTyep() +
                "&mid=" +
                Fun.getKeyByMid();
            }
          }
        }
      } else {
        //已经填写过邀请人
        if (data.invite_mobile !== 1 && data.invite_page === 1) {
          //没有绑定手机而且开启了邀请页面
          if (
            window.location.href.indexOf("input_visit") > 0 ||
            window.location.href.indexOf("member/editmobile") > 0
          ) {
            console.log("nothing");
          } else if (
            window.location.href.indexOf("input_visit") < 0 ||
            window.location.href.indexOf("member/editmobile") < 0
          ) {
            window.location.href =
              Fun.getSiteRoot() +
              "/addons/yun_shop/" +
              "?menu#" +
              "/Inviter?i=" +
              Fun.getKeyByI() +
              "&type=" +
              Fun.getTyep() +
              "&mid=" +
              Fun.getKeyByMid();
          }
        }
      }
    }
  }
  // }
  // });
  // }
}

function bindMobile(e) {
  if (e == 1) {
    //跳转绑定手机页面
    //判断是否是app分享扫码进入商城
    if (window.location.href.indexOf("/member/scaneditmobile") >= 0) {
      window.localStorage.setItem("is_force_mobile", 999);
      window.location.href =
        Fun.getSiteRoot() +
        "/addons/yun_shop/" +
        "?menu#" +
        "/member/editmobile?i=" +
        Fun.getKeyByI() +
        "&type=" +
        Fun.getTyep() +
        "&mid=" +
        Fun.getKeyByMid();
    } else {
      window.location.href =
        Fun.getSiteRoot() +
        "/addons/yun_shop/" +
        "?menu#" +
        "/member/editmobile?i=" +
        Fun.getKeyByI() +
        "&type=" +
        Fun.getTyep() +
        "&mid=" +
        Fun.getKeyByMid();
    }
  } else if (e == 2) {
    if (window.location.href.indexOf("/member?") > -1) {
      window.location.href =
        Fun.getSiteRoot() +
        "/addons/yun_shop/" +
        "?menu#" +
        "/member/editmobile?i=" +
        Fun.getKeyByI() +
        "&type=" +
        Fun.getTyep() +
        "&mid=" +
        Fun.getKeyByMid();
    }
  } else if (e == 3) {
    if (window.location.href.indexOf("/goods/") > -1 || window.location.href.indexOf("/groups/") > -1) {
      window.location.href =
        Fun.getSiteRoot() +
        "/addons/yun_shop/" +
        "?menu#" +
        "/member/editmobile?i=" +
        Fun.getKeyByI() +
        "&type=" +
        Fun.getTyep() +
        "&mid=" +
        Fun.getKeyByMid();
    }
  } else if (e == 4) {
    if (window.location.href.indexOf("/member/extension?") > -1) {
      window.location.href =
        Fun.getSiteRoot() +
        "/addons/yun_shop/" +
        "?menu#" +
        "/member/editmobile?i=" +
        Fun.getKeyByI() +
        "&type=" +
        Fun.getTyep() +
        "&mid=" +
        Fun.getKeyByMid();
    }
  } else {
    if (window.location.href.indexOf("/signPage/") >= 0) {
      window.location.href =
        Fun.getSiteRoot() +
        "/addons/yun_shop/" +
        "?menu#" +
        "/member/editmobile?i=" +
        Fun.getKeyByI() +
        "&type=" +
        Fun.getTyep() +
        "&mid=" +
        Fun.getKeyByMid() + '&from=signPage';
    }
  }

}
let abortSignalControllers = [];
export default {
  // 封装axios的post请求
  fetch(url, params) {
    return new Promise((resolve, reject) => {
      axios
        .get(url, params)
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  // 封装的 GET请求
  get(url, params, message) {
    if(!url) {
      console.log("输入url为空");
      return;
    }
    let i = Fun.getKeyByI();
    let mid = Fun.getKeyByMid();
    let type = Fun.getTyep();
    let shop_id = Fun.getKeyByMicroShopId();
    let v_id = window.localStorage.getItem("vid");
    let cicleInvitationId=window.localStorage.getItem("circle_invitation_id");
    let sessionid = Fun.getSession();
    let token = Fun.getToken();
    let webToken = localStorage.getItem("token");
    let uid = localStorage.getItem("loginUid");
    let uuid = window.localStorage.uuid;
    if (!uuid) {
      uuid = 0;
    }

    let baseUrl = "/addons/yun_shop/api.php?i=" +  i + "&uuid=" + uuid + "&type=" + type;
    if (mid) {
      baseUrl += "&mid=" + mid;
    }
    if(shop_id) {
      baseUrl += "&shop_id=" + shop_id;
    }

    baseUrl += "&version=v1.1.084";

    if (window.yzFirstlogin === 0 && window.yzValidate_page === 0 && url.indexOf("shop.FrontendError.do-log") < 0 &&
      url.indexOf("member.login.index") < 0 &&
      url.indexOf("member.member.wxJsSdkConfig") < 0 &&
      url.indexOf("member.login.login-mode") < 0 && url.indexOf("home-page.getCaptcha") < 0
      && url.indexOf("member.register.sendCodeV2") < 0  && url.indexOf("member.member.prepBind") < 0
      && url.indexOf("member.member.bindMobile") < 0) {
      baseUrl = baseUrl + "&validate_page=1";
    }

    if (
      (window.yzFirstlogin === 1 && url.indexOf("shop.FrontendError.do-log") < 0 &&
        url.indexOf("member.login.index") < 0 &&
        url.indexOf("member.member.wxJsSdkConfig") < 0 &&
        url.indexOf("member.login.login-mode") < 0 && url.indexOf("home-page.getCaptcha") < 0
        && url.indexOf("member.register.sendCodeV2") < 0  && url.indexOf("member.member.prepBind") < 0
        && url.indexOf("member.member.bindMobile") < 0
      ) ||
      url.indexOf("finance.income-page.index") >= 0
    ) {
      window.yzFirstlogin = 0;
      baseUrl = baseUrl + "&basic_info=1&validate_page=1";
    }

    if (v_id) {
      baseUrl = baseUrl + "&vid=" + v_id;
    }
    if(cicleInvitationId){
      baseUrl += "&circle_invitation_id=" + cicleInvitationId;
    }

    if (message == null || message == undefined) {
      storeOption.state.isloadding = false;
    } else {
      storeOption.state.isloadding = true;
    }

    if ((window.location.href.indexOf("scope") > -1 && window.location.href.indexOf("appid") > -1 && window.location.href.indexOf("mob_user") > -1 && window.location.href.indexOf("timestamp") > -1 && window.location.href.indexOf("sign") > -1)) {
      baseUrl += "&scope=" + Fun.getKey('scope') + "&appid=" + Fun.getKey('appid') + "&mob_user=" + Fun.getKey('mob_user') + "&timestamp=" + Fun.getKey('timestamp') + "&sign=" + Fun.getKey('sign') + "&route=";
      if (!window.localStorage.getItem("mob_user") && Fun.getKey('mob_user') != 0 ) {
        window.localStorage.setItem("scope", Fun.getKey('scope'));
        window.localStorage.setItem("appid", Fun.getKey('appid'));
        window.localStorage.setItem("mob_user", Fun.getKey('mob_user'));
        window.localStorage.setItem("timestamp", Fun.getKey('timestamp'));
        window.localStorage.setItem("sign", Fun.getKey('sign'));
      }
      console.log("freeLogin");
    } else if ((window.localStorage.getItem("scope") && window.localStorage.getItem("appid") && window.localStorage.getItem("mob_user") && window.localStorage.getItem("timestamp") && window.localStorage.getItem("sign"))) {
      baseUrl += "&scope=" + window.localStorage.getItem("scope") + "&appid=" + window.localStorage.getItem("appid") + "&mob_user=" + window.localStorage.getItem("mob_user") + "&timestamp=" + window.localStorage.getItem("timestamp") + "&sign=" + window.localStorage.getItem("sign") + "&route=";
      console.log("freeLogin2");
    } else if ((window.location.href.indexOf("scope") > -1 && window.location.href.indexOf("appid") > -1 && window.location.href.indexOf("mob_parent") > -1 && window.location.href.indexOf("mob_user") > -1 && window.location.href.indexOf("timetamp") > -1 && window.location.href.indexOf("sign") > -1)) {
      baseUrl += "&scope=" + Fun.getKey('scope') + "&appid=" + Fun.getKey('appid') + "&mob_parent=" + Fun.getKey('mob_parent') + "&mob_user=" + Fun.getKey('mob_user') + "&timetamp=" + Fun.getKey('timetamp') + "&sign=" + Fun.getKey('sign') + "&route=";
      if (!window.localStorage.getItem("mob_user") && Fun.getKey('mob_user') != 0 ) {
        window.localStorage.setItem("scope", Fun.getKey('scope'));
        window.localStorage.setItem("appid", Fun.getKey('appid'));
        window.localStorage.setItem("mob_parent", Fun.getKey('mob_parent'));
        window.localStorage.setItem("mob_user", Fun.getKey('mob_user'));
        window.localStorage.setItem("timetamp", Fun.getKey('timetamp'));
        window.localStorage.setItem("sign", Fun.getKey('sign'));
      }
      console.log("haifen");
    } else if ((window.localStorage.getItem("scope") && window.localStorage.getItem("appid") && window.localStorage.getItem("mob_parent") && window.localStorage.getItem("mob_user") && window.localStorage.getItem("timetamp") && window.localStorage.getItem("sign"))) {
      baseUrl += "&scope=" + window.localStorage.getItem("scope") + "&appid=" + window.localStorage.getItem("appid") + "&mob_parent=" + window.localStorage.getItem("mob_parent") + "&mob_user=" + window.localStorage.getItem("mob_user") + "&timetamp=" + window.localStorage.getItem("timetamp") + "&sign=" + window.localStorage.getItem("sign") + "&route=";
      console.log("haifen2");
    } else if (window.location.href.indexOf("#/cashier_pay/") > -1 && url.indexOf("member.login.check-login") < 0) {
      baseUrl += "&scope=base&route=";
    } else if (window.location.href.indexOf("#/home?") > -1 && url.indexOf("member.login.check-login") < 0) {
      baseUrl += "&scope=home&route=";
    } else if (window.location.href.indexOf("#/newDiy?") > -1 && url.indexOf("member.login.check-login") < 0) {
      baseUrl += "&scope=home&route=";
    } else if (isPassUrl() == true && url.indexOf("member.login.check-login") < 0 && url.indexOf("member.member-cart.store") < 0 || url.indexOf("shop.FrontendError.do-log") > 0) {
      baseUrl += "&scope=pass&route=";
    } else {
      baseUrl += "&route=";
    }

    if (params) {
      let paramsArray = [];
      Object.keys(params).forEach(key =>
        paramsArray.push(key + "=" + params[key])
      );
      url += "&" + paramsArray.join("&");
      url = baseUrl + url;
    } else {
      url = baseUrl + url;
    }

    if (token) {
      url = url + "&client_type=2&app_type=wechat" + "&3rd_session=" + sessionid + "&session_id=" + token;
    }

    console.log("===test url====", url);

    // Authorization要删
    let headers = {
      "Content-Type": "application/json",
      Authorization: "Basic " + base64_encode(uid + ":" + webToken)
    };

    if(window.new_page_comeIn != 2) {
      // 浏览足迹  new_page_comeIn == 2为页面第一个请求接口
      headers['local-url'] = `/${window.location.href.match(/\#\/(\S*)\?/)[1]}`;
      headers['full-url'] = `${window.location.href}`;
      window.new_page_comeIn = 2;
    }

    return new Promise(function (resolve, reject) {
      fetch(url, {
        method: "GET",
        headers: headers,
        credentials: "include"
      })
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            reject({ status: response.status });
          }
          storeOption.state.isloadding = false;
        })
        .then(response => {
          storeOption.state.isloadding = false;

          if (
            response.result == 0 &&
            !Fun.isTextEmpty(response.data) &&
            response.data.status == "number"
          ) {
            window.location.href =
              Fun.getSiteRoot() +
              "/addons/yun_shop/" +
              "?menu#" +
              "/member?i=" +
              Fun.getKeyByI() +
              "&type=" +
              Fun.getTyep() +
              "&mid=" +
              Fun.getKeyByMid();
            Toast(response.msg);
            return;
          }
          if (
            response.result == 0 &&
            !Fun.isTextEmpty(response.data) &&
            response.data.status == -3
          ) {
            window.location.href =
              Fun.getSiteRoot() +
              "/addons/yun_shop/" +
              "?menu#" +
              "/member/mandate";
            return;
          }
          if (
            response.result == 0 &&
            !Fun.isTextEmpty(response.data) &&
            response.data.status == -2
          ) {
            window.location.href =
              Fun.getSiteRoot() + "/addons/yun_shop/" + "?menu#" + "/404";
            return;
          }
          if (response.result == 0 && !Fun.isTextEmpty(response.data) && response.data.login_status != undefined && response.data.login_status == 0) {
            window.firstLogin = 1;
            window.yzFirstlogin = 1;
            window.localStorage.setItem("isWxLogin", 1);
            window.location.href =
              response.data.login_url +
              "&yz_redirect=" +
              base64_encode(document.location.href);
            console.log("微信登录");
            return response;
          } else if (response.result == 0 && !Fun.isTextEmpty(response.data) && response.data.login_status != undefined && response.data.login_status == 1) {
            window.firstLogin = 1;
            window.yzFirstlogin = 1;
            window.localStorage.setItem("isWxLogin", -1);
            console.log("跳入登录入口");
            if (document.location.href.indexOf('/login?') == -1) {
              sessionStorage.setItem("yz_redirect", base64_encode(document.location.href));
            }

            if (response.data && response.data.extra && response.data.extra.hflive && response.data.extra.hflive.status == 1) {
              window.location.href = Fun.getSiteRoot() + "/addons/yun_shop/" + "?menu#" + "/haifen_register?i=" + response.data.i + "&type=" + Fun.getTyep() + "&mid=" + response.data.mid;
              window.localStorage.setItem("appid", response.data.extra.hflive.appid);
            }else if(Fun.isCPS()) {
              if(Fun.isIosOrAndroid() === 'ios') {
                callIOS({body:'callIOS'});
              }else {
                callAndroid();
              }
            } else {
              window.location.href = Fun.getSiteRoot() + "/addons/yun_shop/" + "?menu#" + "/login?i=" + +response.data.i + "&type=" + Fun.getTyep() + "&mid=" + response.data.mid;
            }
            return response;
          } else {
            if (response.basic_info) {

              // 跳转PC端代码
              if (response.basic_info.plugin_setting &&
                response.basic_info.plugin_setting.pc_terminal &&
                response.basic_info.plugin_setting.pc_terminal.enable == 1
              ) {

                jumpH5();

              }
              // 跳转PC端代码end

              localStorage.setItem(
                "mailLanguage",
                JSON.stringify(response.basic_info.lang)
              );
              localStorage.setItem(
                "balanceLang",
                JSON.stringify(response.basic_info.balance)
              );

              tempInfo(response.basic_info.home);
              if (response.basic_info.lang) {
                store.commit("setShopLanguage", response.basic_info.lang);
              }
              if (response.basic_info.home && response.basic_info.home != null && response.basic_info.home.memberinfo && response.basic_info.home.memberinfo != null) {
                window.localStorage.uid =
                  response.basic_info.home.memberinfo.uid;
              }
              localStorage.setItem(
                "globalParameter",
                JSON.stringify(response.basic_info.globalParameter)
              );

              window.popularizeYZ = response.basic_info.popularize_page;
              window.yz_bd = window.popularizeYZ.baidu;

              if (window.popularizeYZ) {
                if (Fun.getTyep() == "5") {
                  if (
                    window.popularizeYZ.wap.vue_route.indexOf(
                      window.__lendApp__.$route.name
                    ) >= 0
                  ) {
                    if (Fun.isTextEmpty(window.popularizeYZ.wap.url)) {
                      window.location.href =
                        Fun.getSiteRoot() +
                        "/addons/yun_shop/" +
                        "?menu#" +
                        "/404?i=" +
                        Fun.getKeyByI() +
                        "&type=" +
                        Fun.getTyep() +
                        "&mid=" +
                        Fun.getKeyByMid();
                    } else {
                      window.location.href = window.popularizeYZ.wap.url;
                    }
                  }
                } else if (Fun.getTyep() == "1") {
                  if (
                    window.popularizeYZ.wechat.vue_route.indexOf(
                      window.__lendApp__.$route.name
                    ) >= 0
                  ) {
                    if (Fun.isTextEmpty(window.popularizeYZ.wechat.url)) {
                      window.location.href =
                        Fun.getSiteRoot() +
                        "/addons/yun_shop/" +
                        "?menu#" +
                        "/404?i=" +
                        Fun.getKeyByI() +
                        "&type=" +
                        Fun.getTyep() +
                        "&mid=" +
                        Fun.getKeyByMid();
                    } else {
                      window.location.href = window.popularizeYZ.wechat.url;
                    }
                  }
                } else if (Fun.getTyep() == "2") {
                  if (
                    window.popularizeYZ.mini.vue_route.indexOf(
                      window.__lendApp__.$route.name
                    ) >= 0
                  ) {
                    if (Fun.isTextEmpty(window.popularizeYZ.mini.url)) {
                      window.location.href =
                        Fun.getSiteRoot() +
                        "/addons/yun_shop/" +
                        "?menu#" +
                        "/404?i=" +
                        Fun.getKeyByI() +
                        "&type=" +
                        Fun.getTyep() +
                        "&mid=" +
                        Fun.getKeyByMid();
                    } else {
                      wx.miniProgram.navigateTo({
                        url: window.popularizeYZ.mini.url
                      });
                    }
                  }
                } else if (Fun.getTyep() == "7") {
                  if (
                    window.popularizeYZ.app.vue_route.indexOf(
                      window.__lendApp__.$route.name
                    ) >= 0
                  ) {
                    if (Fun.isTextEmpty(window.popularizeYZ.app.url)) {
                      window.location.href =
                        Fun.getSiteRoot() +
                        "/addons/yun_shop/" +
                        "?menu#" +
                        "/404?i=" +
                        Fun.getKeyByI() +
                        "&type=" +
                        Fun.getTyep() +
                        "&mid=" +
                        Fun.getKeyByMid();
                    } else {
                      window.location.href = window.popularizeYZ.app.url;
                    }
                  }
                } else if (Fun.getTyep() == "8") {
                  if (
                    window.popularizeYZ.alipay.vue_route.indexOf(
                      window.__lendApp__.$route.name
                    ) >= 0
                  ) {
                    if (Fun.isTextEmpty(window.popularizeYZ.alipay.url)) {
                      window.location.href =
                        Fun.getSiteRoot() +
                        "/addons/yun_shop/" +
                        "?menu#" +
                        "/404?i=" +
                        Fun.getKeyByI() +
                        "&type=" +
                        Fun.getTyep() +
                        "&mid=" +
                        Fun.getKeyByMid();
                    } else {
                      window.location.href = window.popularizeYZ.alipay.url;
                    }
                  }
                }
              }
            }

            if (response.validate_page) {
              getInvite(response.validate_page);
            }
            return JSON.parse(JSON.stringify(response));
          }
        })
        .then(response => {
          resolve(response);
        })
        .catch(err => {
          storeOption.state.isloadding = false;
          console.log(err, '网络请求，无响应！');
          //   reject({ status: "网络请求，无响应" });
        });
    });
  },
  // POST请求  FormData 表单数据

  post(url, formData, message, flag, pc_type) {
    if(!url) {
      console.log("输入url为空");
      return;
    }
    try {
      const controller = new AbortController();
      var { signal } = controller;
      if (abortSignalControllers.length > 0 && flag) {
        const oldcontroller = abortSignalControllers[abortSignalControllers.length - 1];
        oldcontroller.abort();
      }
      abortSignalControllers.push(controller);
    } catch (error) {
      console.log("该浏览器暂不支持 AbortController ！");
    }

    let level = window.localStorage.getItem("level");
    let i = Fun.getKeyByI();
    let mid = Fun.getKeyByMid();
    let type = pc_type || Fun.getTyep();
    let shop_id = Fun.getKeyByMicroShopId();
    let v_id = window.localStorage.getItem("vid");
    let cicleInvitationId=window.localStorage.getItem("circle_invitation_id");
    let sessionid = Fun.getSession();
    let token = Fun.getToken();
    let webToken = localStorage.getItem("token");
    let uid = localStorage.getItem("loginUid");
    let uuid = window.localStorage.uuid;
    if (!uuid) {
      uuid = 0;
    }

    let baseUrl = "/addons/yun_shop/api.php?i=" +  i + "&uuid=" + uuid + "&type=" + type;
    if (mid) {
      baseUrl += "&mid=" + mid;
    }
    if(shop_id) {
      baseUrl += "&shop_id=" + shop_id;
    }

    baseUrl += "&version=v1.1.084";

    if (window.yzFirstlogin === 0 && window.yzValidate_page === 0 && url.indexOf("shop.FrontendError.do-log") < 0 &&
      url.indexOf("member.login.index") < 0 &&
      url.indexOf("member.member.wxJsSdkConfig") < 0 &&
      url.indexOf("member.login.login-mode") < 0 && url.indexOf("home-page.getCaptcha") < 0
      && url.indexOf("member.register.sendCodeV2") < 0  && url.indexOf("member.member.prepBind") < 0
      && url.indexOf("member.member.bindMobile") < 0) {
      baseUrl = baseUrl + "&validate_page=1";
    }

    if (
      (window.yzFirstlogin === 1 && url.indexOf("shop.FrontendError.do-log") < 0 &&
        url.indexOf("member.login.index") < 0 &&
        url.indexOf("member.member.wxJsSdkConfig") < 0 &&
        url.indexOf("member.login.login-mode") < 0 && url.indexOf("home-page.getCaptcha") < 0
        && url.indexOf("member.register.sendCodeV2") < 0  && url.indexOf("member.member.prepBind") < 0
        && url.indexOf("member.member.bindMobile") < 0
      ) ||
      url.indexOf("finance.income-page.index") >= 0
    ) {
      window.yzFirstlogin = 0;
      baseUrl = baseUrl + "&basic_info=1&validate_page=1";
    }

    if (v_id) {
      baseUrl = baseUrl + "&vid=" + v_id;
    }
    if(cicleInvitationId){
      baseUrl += "&circle_invitation_id=" + cicleInvitationId;
    }
    if (level) {
      baseUrl += "&level=" + level;
      let province_id = window.localStorage.getItem("province_id");
      let city_id = window.localStorage.getItem("city_id");
      let district_id = window.localStorage.getItem("district_id");
      let street_id = window.localStorage.getItem("street_id");
      if (province_id) {
        baseUrl += "&province_id=" + province_id;
      }
      if (city_id) {
        baseUrl += "&city_id=" + city_id;
      }
      if (district_id) {
        baseUrl += "&district_id=" + district_id;
      }
      if (street_id) {
        baseUrl += "&street_id=" + street_id;
      }
    }

    if (message == null || message == undefined) {
      store.state.isloadding = false;
    } else {
      storeOption.state.isloadding = true;
    }

    if ((window.location.href.indexOf("scope") > -1 && window.location.href.indexOf("appid") > -1 && window.location.href.indexOf("mob_user") > -1 && window.location.href.indexOf("timestamp") > -1 && window.location.href.indexOf("sign") > -1)) {
      baseUrl += "&scope=" + Fun.getKey('scope') + "&appid=" + Fun.getKey('appid') + "&mob_user=" + Fun.getKey('mob_user') + "&timestamp=" + Fun.getKey('timestamp') + "&sign=" + Fun.getKey('sign') + "&route=";
      if (!window.localStorage.getItem("mob_user") && Fun.getKey('mob_user') != 0 ) {
        window.localStorage.setItem("scope", Fun.getKey('scope'));
        window.localStorage.setItem("appid", Fun.getKey('appid'));
        window.localStorage.setItem("mob_user", Fun.getKey('mob_user'));
        window.localStorage.setItem("timestamp", Fun.getKey('timestamp'));
        window.localStorage.setItem("sign", Fun.getKey('sign'));
      }
      console.log("freeLogin");
    } else if ((window.localStorage.getItem("scope") && window.localStorage.getItem("appid") && window.localStorage.getItem("mob_user") && window.localStorage.getItem("timestamp") && window.localStorage.getItem("sign"))) {
      baseUrl += "&scope=" + window.localStorage.getItem("scope") + "&appid=" + window.localStorage.getItem("appid") + "&mob_user=" + window.localStorage.getItem("mob_user") + "&timestamp=" + window.localStorage.getItem("timestamp") + "&sign=" + window.localStorage.getItem("sign") + "&route=";
      console.log("freeLogin2");
    } else if ((window.location.href.indexOf("scope") > -1 && window.location.href.indexOf("appid") > -1 && window.location.href.indexOf("mob_parent") > -1 && window.location.href.indexOf("mob_user") > -1 && window.location.href.indexOf("timetamp") > -1 && window.location.href.indexOf("sign") > -1)) {
      baseUrl += "&scope=" + Fun.getKey('scope') + "&appid=" + Fun.getKey('appid') + "&mob_parent=" + Fun.getKey('mob_parent') + "&mob_user=" + Fun.getKey('mob_user') + "&timetamp=" + Fun.getKey('timetamp') + "&sign=" + Fun.getKey('sign') + "&route=";
      if (!window.localStorage.getItem("mob_user") && Fun.getKey('mob_user') != 0 ) {
        window.localStorage.setItem("scope", Fun.getKey('scope'));
        window.localStorage.setItem("appid", Fun.getKey('appid'));
        window.localStorage.setItem("mob_parent", Fun.getKey('mob_parent'));
        window.localStorage.setItem("mob_user", Fun.getKey('mob_user'));
        window.localStorage.setItem("timetamp", Fun.getKey('timetamp'));
        window.localStorage.setItem("sign", Fun.getKey('sign'));
      }
      console.log("haifen");
    } else if ((window.localStorage.getItem("scope") && window.localStorage.getItem("appid") && window.localStorage.getItem("mob_parent") && window.localStorage.getItem("mob_user") && window.localStorage.getItem("timetamp") && window.localStorage.getItem("sign"))) {
      baseUrl += "&scope=" + window.localStorage.getItem("scope") + "&appid=" + window.localStorage.getItem("appid") + "&mob_parent=" + window.localStorage.getItem("mob_parent") + "&mob_user=" + window.localStorage.getItem("mob_user") + "&timetamp=" + window.localStorage.getItem("timetamp") + "&sign=" + window.localStorage.getItem("sign") + "&route=";
      console.log("haifen2");
    } else if (window.location.href.indexOf("#/cashier_pay/") > -1 && url.indexOf("member.login.check-login") < 0) {
      baseUrl += "&scope=base&route=";
    } else if (window.location.href.indexOf("#/home?") > 0 && url.indexOf("member.login.check-login") < 0) {
      baseUrl += "&scope=home&route=";
    } else if (window.location.href.indexOf("#/newDiy?") > 0 && url.indexOf("member.login.check-login") < 0) {
      baseUrl += "&scope=home&route=";
    } else if (isPassUrl() == true && url.indexOf("member.login.check-login") < 0 && url.indexOf("member.member-cart.store") < 0 || url.indexOf("shop.FrontendError.do-log") > 0) {
      baseUrl += "&scope=pass&route=";
    } else {
      baseUrl += "&route=";
    }

    return new Promise(function (resolve, reject) {
      url = baseUrl + url;

      if (token) {
        url = url + "&app_type=wechat" + "&3rd_session=" + sessionid + "&session_id=" + token;
      }

      // Authorization要删
      let headers = {
        "Content-Type": "application/json",
        Authorization: "Basic " + base64_encode(uid + ":" + webToken)
      };

      if(window.new_page_comeIn != 2) {
        // 浏览足迹  new_page_comeIn == 2为页面第一个请求接口
        headers['local-url'] = `/${window.location.href.match(/\#\/(\S*)\?/)[1]}`;
        headers['full-url'] = `${window.location.href}`;
        window.new_page_comeIn = 2;
      }

      fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(formData),
        credentials: "include",
        signal: signal && !signal.aborted ? signal : null
      })
        .then(response => {

          if (response.ok) {

            return response.json();
          } else {
            reject({ status: response.status });
          }

          storeOption.state.isloadding = false;
        })
        .then(response => {
          storeOption.state.isloadding = false;
          if (
            response.result == 0 &&
            !Fun.isTextEmpty(response.data) &&
            response.data.status == "number"
          ) {
            window.location.href =
              Fun.getSiteRoot() +
              "/addons/yun_shop/" +
              "?menu#" +
              "/member?i=" +
              Fun.getKeyByI() +
              "&type=" +
              Fun.getTyep() +
              "&mid=" +
              Fun.getKeyByMid();
            Toast(response.msg);
            return;
          }
          if (
            response.result == 0 &&
            !Fun.isTextEmpty(response.data) &&
            response.data.login_status == -1
          ) {
            window.location.href =
              Fun.getSiteRoot() +
              "/addons/yun_shop/" +
              "?menu#" +
              "/member/blacklist?i=" +
              Fun.getKeyByI();
            return;
          }
          if (
            response.result == 0 &&
            !Fun.isTextEmpty(response.data) &&
            response.data.status == -3
          ) {
            window.location.href =
              Fun.getSiteRoot() +
              "/addons/yun_shop/" +
              "?menu#" +
              "/member/mandate?i=" +
              Fun.getKeyByI();
            return;
          }

          if (response.result == 0 && response.data == -1) {
            window.location.href =
              Fun.getSiteRoot() +
              "/addons/yun_shop/" +
              "?menu#" +
              "/CloseSite?i=" +
              Fun.getKeyByI();
            return;
          }
          if (
            response.result == 0 &&
            !Fun.isTextEmpty(response.data) &&
            response.data.status == -2
          ) {
            window.location.href =
              Fun.getSiteRoot() + "/addons/yun_shop/" + "?menu#" + "/404?i=" + Fun.getKeyByI();
            return;
          }
          if (response.result == 0 && !Fun.isTextEmpty(response.data) && response.data.login_status != undefined && response.data.login_status == 0) {
            // response.result = 1;
            window.firstLogin = 1;
            window.yzFirstlogin = 1;
            console.log("微信登录");
            window.localStorage.setItem("isWxLogin", 1);
            window.location.href =
              response.data.login_url +
              "&yz_redirect=" +
              base64_encode(document.location.href);
            return response;
          } else if (response.result == 0 && !Fun.isTextEmpty(response.data) && response.data.login_status != undefined && response.data.login_status == 1) {
            window.firstLogin = 1;
            window.yzFirstlogin = 1;
            console.log("登录");
            window.localStorage.setItem("isWxLogin", -1);
            if (document.location.href.indexOf('/login?') == -1) {
              sessionStorage.setItem("yz_redirect", base64_encode(document.location.href));
            }

            if (response.data && response.data.extra && response.data.extra.hflive && response.data.extra.hflive.status == 1) {
              window.location.href = Fun.getSiteRoot() + "/addons/yun_shop/" + "?menu#" + "/haifen_register?i=" + response.data.i + "&type=" + Fun.getTyep() + "&mid=" + response.data.mid;
              window.localStorage.setItem("appid", response.data.extra.hflive.appid);
            }else if(Fun.isCPS()) {
              if(Fun.isIosOrAndroid() === 'ios') {
                callIOS({body:'callIOS'});
              }else {
                callAndroid();
              }
            } else {
              window.location.href = Fun.getSiteRoot() + "/addons/yun_shop/" + "?menu#" + "/login?i=" + +response.data.i + "&type=" + Fun.getTyep() + "&mid=" + response.data.mid;
            }
            return response;
          } else {
            if (response.basic_info) {

              // 跳转PC端代码
              if (response.basic_info.plugin_setting &&
                response.basic_info.plugin_setting.pc_terminal &&
                response.basic_info.plugin_setting.pc_terminal.enable == 1
              ) {

                jumpH5();

              }
              // 跳转PC端代码end

              localStorage.setItem(
                "mailLanguage",
                JSON.stringify(response.basic_info.lang)
              );
              localStorage.setItem(
                "balanceLang",
                JSON.stringify(response.basic_info.balance)
              );
              tempInfo(response.basic_info.home);
              if (response.basic_info.lang) {
                store.commit("setShopLanguage", response.basic_info.lang);
              }
              if (response.basic_info.home.memberinfo) {
                window.localStorage.uid =
                  response.basic_info.home.memberinfo.uid;
              }
              localStorage.setItem(
                "globalParameter",
                JSON.stringify(response.basic_info.globalParameter)
              );

              window.popularizeYZ = response.basic_info.popularize_page;
              window.yz_bd = window.popularizeYZ.baidu;

              if (window.popularizeYZ) {
                if (Fun.getTyep() == "5") {
                  if (
                    window.popularizeYZ.wap.vue_route.indexOf(
                      window.__lendApp__.$route.name
                    ) >= 0
                  ) {
                    if (Fun.isTextEmpty(window.popularizeYZ.wap.url)) {
                      window.location.href =
                        Fun.getSiteRoot() +
                        "/addons/yun_shop/" +
                        "?menu#" +
                        "/404?i=" +
                        Fun.getKeyByI() +
                        "&type=" +
                        Fun.getTyep() +
                        "&mid=" +
                        Fun.getKeyByMid();
                    } else {
                      window.location.href = window.popularizeYZ.wap.url;
                    }
                  }
                } else if (Fun.getTyep() == "1") {
                  if (
                    window.popularizeYZ.wechat.vue_route.indexOf(
                      window.__lendApp__.$route.name
                    ) >= 0
                  ) {
                    if (Fun.isTextEmpty(window.popularizeYZ.wechat.url)) {
                      window.location.href =
                        Fun.getSiteRoot() +
                        "/addons/yun_shop/" +
                        "?menu#" +
                        "/404?i=" +
                        Fun.getKeyByI() +
                        "&type=" +
                        Fun.getTyep() +
                        "&mid=" +
                        Fun.getKeyByMid();
                    } else {
                      window.location.href = window.popularizeYZ.wechat.url;
                    }
                  }
                } else if (Fun.getTyep() == "2") {
                  if (
                    window.popularizeYZ.mini.vue_route.indexOf(
                      window.__lendApp__.$route.name
                    ) >= 0
                  ) {
                    if (Fun.isTextEmpty(window.popularizeYZ.mini.url)) {
                      window.location.href =
                        Fun.getSiteRoot() +
                        "/addons/yun_shop/" +
                        "?menu#" +
                        "/404?i=" +
                        Fun.getKeyByI() +
                        "&type=" +
                        Fun.getTyep() +
                        "&mid=" +
                        Fun.getKeyByMid();
                    } else {
                      wx.miniProgram.navigateTo({
                        url: window.popularizeYZ.mini.url
                      });
                    }
                  }
                } else if (Fun.getTyep() == "7") {
                  if (
                    window.popularizeYZ.app.vue_route.indexOf(
                      window.__lendApp__.$route.name
                    ) >= 0
                  ) {
                    if (Fun.isTextEmpty(window.popularizeYZ.app.url)) {
                      window.location.href =
                        Fun.getSiteRoot() +
                        "/addons/yun_shop/" +
                        "?menu#" +
                        "/404?i=" +
                        Fun.getKeyByI() +
                        "&type=" +
                        Fun.getTyep() +
                        "&mid=" +
                        Fun.getKeyByMid();
                    } else {
                      window.location.href = window.popularizeYZ.app.url;
                    }
                  }
                } else if (Fun.getTyep() == "8") {
                  if (
                    window.popularizeYZ.alipay.vue_route.indexOf(
                      window.__lendApp__.$route.name
                    ) >= 0
                  ) {
                    if (Fun.isTextEmpty(window.popularizeYZ.alipay.url)) {
                      window.location.href =
                        Fun.getSiteRoot() +
                        "/addons/yun_shop/" +
                        "?menu#" +
                        "/404?i=" +
                        Fun.getKeyByI() +
                        "&type=" +
                        Fun.getTyep() +
                        "&mid=" +
                        Fun.getKeyByMid();
                    } else {
                      window.location.href = window.popularizeYZ.alipay.url;
                    }
                  }
                }
              }
            }
            if (response.validate_page) {
              getInvite(response.validate_page);
            }

            return response;
          }
        })
        .then(response => {
          resolve(response);
        })
        .catch(err => {
          if (err.name === 'AbortError') {
            console.log('手动中止请求接口');
          } else {
            console.log('网络请求，无响应！', err);
            //   reject({ status: "网络请求，无响应！" });
          }
          //   reject({ status: "网络请求，无响应！" });
        });
    });
  }
};
