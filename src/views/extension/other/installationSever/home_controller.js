import { Toast } from "vant";
import { scrollMixin } from "utils/mixin";
import yzBlank from "components/ui_components/yz_blank";
import location from "components/ui_components/yz_addressList/location";
import yz_uploader from "components/ui_components/yz_uploader";
var fromMember = true; //解决从会员中心进入列表位置问题；
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      plugin_name: "安装服务",
      activeName: 0,
      dataList: [],
      titleArr: [],
      isLoadMore: true,
      orderId: null,
      btnApi: null,
      routeName: null,

      fileList1: [],
      finishImgPop: false,
      location: {},
      showLocation: false,
      codeShow: false, //取货码/收款码
      codetext: "取货码",
      codeImg: ""
    };
  },
  activated() {
    this.fun.setWXTitle(this.plugin_name);
    if (this.fun.isTextEmpty(this.dataList) || fromMember) {
      this.init();
    }
  },
  beforeRouteEnter(to, from, next) {
    fromMember = from.name == null || from.name == "member" ? true : false;
    next();
  },
  created() {
    // this.init();
  },

  components: { yzBlank, location, yz_uploader },
  computed: {},
  methods: {
    init() {
      this.dataList = [];
      let worker = [
        {
          code: "waitWorker",
          name: "抢单大厅"
        },
        {
          code: "all",
          name: "全部订单"
        },
        {
          code: "waitTake",
          name: "待取货订单"
        },
        {
          code: "waitDeliveryPay",
          name: "待到付订单"
        },
        {
          code: "waitInstall",
          name: "待安装订单"
        },
        {
          code: "isFinish",
          name: "已完成订单"
        },
        {
          code: "refund",
          name: "售后订单"
        }
      ];
      let user = [
        {
          code: "all",
          name: "全部订单"
        },
        {
          code: "waitPay",
          name: "待支付"
        },
        {
          code: "waitWorker",
          name: "待分配"
        },
        {
          code: "waitTake",
          name: "待取货订单"
        },
        {
          code: "waitDeliveryPay",
          name: "待到付订单"
        },
        {
          code: "waitInstall",
          name: "待安装订单"
        },
        {
          code: "isFinish",
          name: "已完成订单"
        },
        {
          code: "refund",
          name: "售后订单"
        }
      ];
      console.log("this.$router.name:::::::", this.$route);
      this.routeName = this.$route.name;
      this.titleArr = this.routeName == "installationSeverHome" ? worker : user;
      this.isLoadMore = true;
      this.titleArr.forEach((val, index) => {
        this.dataList.push({
          isLoadMore: true,
          page: 1,
          total_page: 0,
          list: []
        });
      });
      console.log("dataList:::", this.dataList);
      if (this.routeName == "installationSeverHome") {
        this.getConfigs();
      } else {
        this.handleClick();
      }
    },
    getConfigs() {
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
          that.handleClick();
        })
        .catch(function(err) {
          Toast.clear();
          Toast("定位失败,请重新刷新页面");
          console.log(err);
        });
    },
    handleClick() {
      let that = this;
      // if (!this.fun.isTextEmpty(this.dataList[that.activeName].list)) {
      //   that.isLoadMore = this.dataList[that.activeName].isLoadMore;
      //   return;
      // }
      if (this.routeName == "installationSeverHome" && !this.location.point) {
        Toast("缺少定位信息！");
        return;
      }
      let _url = this.routeName == "installationSeverHome" ? "plugin.live-install.frontend.worker-order.orderList" : "plugin.live-install.frontend.order.orderList";
      let _json = { code: this.titleArr[this.activeName].code, page: 1 };
      if (this.routeName == "installationSeverHome") {
        _json.longitude = this.location.point.lng;
        _json.latitude = this.location.point.lat;
      }
      $http
        .post(_url, _json, "")
        .then(response => {
          if (response.result === 1) {
            that.isLoadMore = true;
            that.plugin_name = this.routeName == "installationSeverHome" ? response.data.another_name.worker_name : response.data.another_name.plugin_name;
            that.fun.setWXTitle(that.plugin_name);
            that.$set(this.dataList[that.activeName], "isLoadMore", true);
            that.$set(this.dataList[that.activeName], "total_page", response.data.last_page);
            if (!this.dataList[that.activeName].total_page) {
              that.$set(this.dataList[that.activeName], "total_page", 0);
              this.dataList[that.activeName].total_page = 0;
            }
            that.$set(this.dataList[that.activeName], "list", response.data.data);
          } else {
            that.$dialog.alert({ message: response.msg }).then(() => {
              that.$router.push(that.fun.getUrl("home", {}));
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    clickBotton(item, order_id) {
      this.orderId = order_id;
      this.btnApi = item.api;
      if (this.fun.isTextEmpty(item.api)) {
        return;
      }
      if (item.code == "installFinish") {
        //完成安装，显示上传安装图片弹窗
        this.finishImgPop = true;
        return;
      }
      if (item.code == "takeCode" || item.code == "payCode") {
        //显示二维码图片
        this.codetext = item.code == "takeCode" ? "取货码" : "收款码";
        this.getCodeImg(item);
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
      if (item.code == "orderPay") {
        //去支付
        this.$router.push(this.fun.getUrl("orderpay", { order_ids: order_id }));
        return;
      }

      this.bottonRequest(item);
    },
    bottonRequest(item) {
      let _json = {
        order_id: this.orderId
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
                that.handleClick();

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
            this.handleClick();
          } else {
            Toast(response.msg);
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    confirmLocation(data) {
      this.location = data;
      this.handleClick();
    },
    gotoDetail(order_id) {
      if (this.routeName == "installationSeverHome") {
        this.$router.push(this.fun.getUrl("installationSeverDetail", { id: order_id }));
        return;
      }
      this.$router.push(this.fun.getUrl("installationSeverRefund", { id: order_id }));
    },
    goToAdress(latitude, longitude, names) {
      let target_namelist = names.split(/\*|\-|\+|\s/);
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
    },
    //获取更多数据
    getMoreData() {
      const that = this;
      that.dataList[that.activeName].isLoadMore = false;
      that.isLoadMore = false; // 防止多次请求分页数据
      if (that.dataList[that.activeName].page >= that.dataList[that.activeName].total_page) {
        return;
      } else {
        let _json = { code: this.titleArr[this.activeName].code };
        that.dataList[that.activeName].page = that.dataList[that.activeName].page + 1;
        _json.page = that.dataList[that.activeName].page;
        if (this.routeName == "installationSeverHome") {
          _json.longitude = this.location.point.lng;
          _json.latitude = this.location.point.lat;
        }
        let _url = this.routeName == "installationSeverHome" ? "plugin.live-install.frontend.worker-order.orderList" : "plugin.live-install.frontend.order.orderList";
        $http.get(_url, _json, "加载中").then(
          response => {
            that.isLoadMore = true;
            that.dataList[that.activeName].isLoadMore = true;
            if (response.result === 1) {
              var myData = response.data.data;
              that.dataList[that.activeName].list = that.dataList[that.activeName].list.concat(myData); //数组拼接
            } else {
              that.dataList[that.activeName].page = that.dataList[that.activeName].page - 1;
              that.dataList[that.activeName].isLoadMore = false;
              that.isLoadMore = false;
            }
          },
          function(response) {
            // error callback
          }
        );
      }
    }
  }
};
