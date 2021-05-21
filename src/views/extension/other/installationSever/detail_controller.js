import yzBlank from "components/ui_components/yz_blank";
import yz_uploader from "components/ui_components/yz_uploader";
import location from "components/ui_components/yz_addressList/location";
import { Toast, ImagePreview } from "vant";
export default {
  data() {
    return {
      plugin_name: "",
      info: {},
      location: {},

      fileList1: [],
      finishImgPop: false,
      codeShow: false, //取货码
      codetext: "取货码",
      codeImg: "",

      showLocation: false
    };
  },
  activated() {
    let that = this;
    Toast.loading({
      duration: 0, // 持续展示 toast
      message: "正在获取定位信息...",
      forbidClick: true
    });
    this.fun
      .getLocation()
      .then(function(res) {
        that.location = res;
        Toast.clear();
        that.getData();
      })
      .catch(function(err) {
        Toast.clear();
        Toast("定位失败,请手动选择地址！");
        that.showLocation = true;
        console.log(err);
      });
  },

  components: { yzBlank, yz_uploader, location },
  computed: {},
  methods: {
    getData() {
      $http
        .get("plugin.live-install.frontend.worker-order.orderDetail", { longitude: this.location.point.lng, latitude: this.location.point.lat, order_id: this.$route.params.id }, "加载中...")
        .then(res => {
          if (res.result == 1) {
            this.plugin_name = res.data.another_name.plugin_name || "安装服务";
            this.fun.setWXTitle(this.plugin_name);
            this.info = res.data;
          } else {
            Toast(res.msg);
            return;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    confirmLocation(data) {
      this.location = data;
      this.getData();
    },
    imgPreview(data) {
      ImagePreview(data);
    },
    clickBotton(item, order_id) {
      if (this.fun.isTextEmpty(item.api)) {
        return;
      }
      this.orderId = order_id;
      this.btnApi = item.api;
      if (item.code == "installFinish") {
        //完成安装，显示上传安装图片弹窗
        this.finishImgPop = true;
        return;
      }
      if (item.code == "takeCode" || item.code == "payCode") {
        //显示二维码图片
        this.codetext = item.code == "takeCode" ? "取货码" : "收款码";
        this.getCodeImg(item, order_id);
        return;
      }
      if (item.code == "goodsApplyRefund") {
        //申请售后
        this.$router.push(this.fun.getUrl("installationSeverAfterApply", { id: order_id }, { sn: this.info.order_sn }));
        return;
      }
      if (item.code == "getRefundList") {
        //查看售后
        this.$router.push(this.fun.getUrl("installationSeverAftersale", { oid: order_id }));
        return;
      }
      if (item.code == "comment") {
        //评价列表
        this.$router.push(this.fun.getUrl("myEvaluation", {}));
        return;
      }
      if (item.code == "orderApplyRefund") {
        //申请退款，order_type==1
        // order_type == 2 查看退款
        this.$router.push(this.fun.getUrl("refund", { order_id: order_id, order_type: 1 }, { refundType: "installationSever" }));
        return;
      }

      this.bottonRequest(item, order_id);
    },
    bottonRequest(item, order_id) {
      let _json = {
        order_id: order_id
      };

      if (item.code == "finishRefund" || item.code == "cancelRefundApply") {
        //退款记录id
        _json.refund_id = order_id;
        delete _json.order_id;
      }
      let _text = item.name == "我要抢单" ? "抢单" : item.name;
      this.$dialog
        .confirm({ message: `确定${_text}?` })
        .then(() => {
          var that = this;
          $http.get(item.api, _json).then(
            function(response) {
              if (response.result == 1) {
                that.getData();
                that.$notify({
                  background: "#f0f9eb",
                  message: `${_text}成功`,
                  color: "#67c23a"
                });
              } else {
                that.$dialog.alert({ message: response.msg });
              }
            },
            function(response) {
              console.log(response);
            }
          );
        })
        .catch(() => {});
    },
    getCodeImg(item) {
      this.codeImg = "";
      $http.post(item.api, { order_id: this.orderId, get_type: 1, source: 1 }, " ").then(
        response => {
          if (response.result === 1) {
            this.codeImg = response.data;
            this.codeShow = true;
          } else {
            Toast(response.msg);
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    finishInstall() {
      $http.post(this.btnApi, { order_id: this.orderId, image: this.fileList1 }, " ").then(
        response => {
          if (response.result === 1) {
            this.fileList1 = [];
            this.finishImgPop = false;
            this.getData();
          } else {
            Toast(response.msg);
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    goToAdress(latitude, longitude, names) {
      let target_namelist = names.split(/\*|\+|\s/);
      let target_names = target_namelist[target_namelist.length - 1];
      let point = this.fun.bd_decrypt(longitude, latitude);
      if (this.fun.isWeiXin()) {
        this.goToWXAdress(point, target_names);
      } else {
        window.location.href = `https://uri.amap.com/navigation?to=${point.lng},${point.lat},${target_names}&mode=car&policy=1&src=mypage&coordinate=gaode&callnative=0`;
      }
    },
    goToWXAdress(point, target_names) {
      $http
        .post(
          "member.member.wxJsSdkConfig",
          {
            url: this.fun.isIosOrAndroid() === "android" ? window.location.href : window.initUrl
          },
          " "
        )
        .then(
          response => {
            if (response.result === 1) {
              if (response.data.config) {
                wx.config({
                  debug: false,
                  appId: response.data.config.appId,
                  nonceStr: response.data.config.nonceStr,
                  timestamp: response.data.config.timestamp,
                  url: response.data.config.url,
                  signature: response.data.config.signature,
                  jsApiList: ["checkJsApi", "openLocation", "getLocation"]
                });

                wx.checkJsApi({
                  jsApiList: ["getLocation"],
                  success: function(res) {
                    if (res.checkResult.getLocation == false) {
                      alert("你的微信版本太低，不支持微信JS接口，请升级到最新的微信版本！");
                    }
                  }
                });
                wx.ready(function() {
                  wx.getLocation({
                    type: "gcj02", // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                    success: function(res) {
                      wx.openLocation({
                        latitude: point.lat, // 纬度，浮点数，范围为90 ~ -90
                        longitude: point.lng, // 经度，浮点数，范围为180 ~ -180。
                        name: target_names, // 位置名
                        address: target_names, // 地址详情说明
                        scale: 20 // 地图缩放级别,整形值,范围从1~28。默认为最大
                      });
                    },
                    cancel: function(res) {
                      alert("用户拒绝授权获取地理位置");
                    }
                  });
                });

                wx.error(function(response) {
                  console.log(response);
                  window.location.href = `https://uri.amap.com/navigation?to=${point.lng},${point.lat},${target_names}&mode=car&policy=1&src=mypage&coordinate=gaode&callnative=0`;
                });
              } else {
                window.location.href = `https://uri.amap.com/navigation?to=${point.lng},${point.lat},${target_names}&mode=car&policy=1&src=mypage&coordinate=gaode&callnative=0`;
              }
            } else {
              window.location.href = `https://uri.amap.com/navigation?to=${point.lng},${point.lat},${target_names}&mode=car&policy=1&src=mypage&coordinate=gaode&callnative=0`;
            }
          },
          function(response) {
            console.log(response);
            window.location.href = `https://uri.amap.com/navigation?to=${point.lng},${point.lat},${target_names}&mode=car&policy=1&src=mypage&coordinate=gaode&callnative=0`;
          }
        );
    }
  }
};
