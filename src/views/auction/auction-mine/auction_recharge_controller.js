import cTitle from "components/title";
import { Toast } from 'vant';

const INFO_URL = "plugin.auction.api.prepayment.withdraw.page";
const LOVE_INDEX_URL = "plugin.auction.api.member-prepayment.recharge";

export default {
  data() {
    return {
      value: "",
      every_value: "",
      transform_value: "",
      title: "",
      recharge_value: "",
      pay_type: "",
      AlipayShow: true,
      weixinShow: false,
      // 控制第三方汇聚的显示与隐藏
      converge_alipay_pay: false,
      converge_wechat_pay: false,

      toi: this.fun.getKeyByI(),
      credit2: 0,
      typename: "",
      recharge: "",
      ordersn: "",
      money: null,

      buttons: [],
    };
  },
  methods: {
    getData() {
      $http
        .get(INFO_URL, {}, "加载中")
        .then(res => {
          if (res.result === 1) {
            this.value = res.data.balance;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    getTitle() {
      $http
        .get(LOVE_INDEX_URL, {}, "加载中")
        .then(response => {
          if (response.result === 1) {
            this.buttons = response.data.buttons;
            // if (response.data.alipay == 1) {
            //   this.AlipayShow = true;
            // }
            // if (response.data.weixin == 1 && that.fun.getTyep != "5") {
            //   this.weixinShow = true;
            // }
          } else {
            this.$dialog.alert({message:response.msg});
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    initData() {
      this.value = "";
      this.every_value = "";
      this.transform_value = "";
      this.title = "";
      this.recharge_value = "";
      this.pay_type = "";
      this.AlipayShow = false;
      this.weixinShow = false;
    },
    newWXPay(payParams) {
      var that = this;
      WeixinJSBridge.invoke(
        "getBrandWCPayRequest",
        {
          appId: payParams.appId, // 公众号名称，由商户传入
          timeStamp: payParams.timeStamp, // 时间戳，自1970年以来的秒数
          nonceStr: payParams.nonceStr, // 随机串
          package: payParams.package,
          signType: payParams.signType, // 微信签名方式：
          paySign: payParams.paySign // 微信签名
        },

        function(res) {
          // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
          if (res.err_msg == "get_brand_wcpay_request:ok") {
            that.$router.go(-1);
            that.$dialog.alert({message:"支付成功"});
          } else {
            that.$dialog.alert({message:"支付失败"});
          }
        }
      );
    },
    // 微信充值
    WXPay(payParams) {
      var that = this;
      if (window.isMiniprogram) {
        that.miniWxPay(payParams);
        return;
      }
      wx.chooseWXPay({
        appId: payParams.appId,
        timestamp: payParams.timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
        nonceStr: payParams.nonceStr, // 支付签名随机串，不长于 32 位
        package: payParams.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
        signType: payParams.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
        paySign: payParams.paySign, // 支付签名
        success: function(res) {
          // 支付成功后的回调函数

          if (res.errMsg == "chooseWXPay:ok") {
            that.$dialog.alert({message:"充值成功"});
            that.$router.go(-1);
          } else {
            that.$dialog.alert({message:"充值失败，请返回重试"});
          }
        },
        cancel: function(res) {
          // 支付取消
        },
        fail: function(res) {
          that.$dialog.alert({message:"充值失败，请返回重试"});
        }
      });
    },

    miniWxPay(payParams) {
      // alert(document.location.href)
      // console.log(""+
      var params =
        "?timestamp=" +
        payParams.timestamp +
        "&nonceStr=" +
        payParams.nonceStr +
        "&package=" +
        encodeURIComponent(payParams.package) +
        "&signType=" +
        payParams.signType +
        "&paySign=" +
        payParams.paySign;
      // 定义path 与小程序的支付页面的路径相对应
      var path = "/pages/pay/orderPay" + params;
      // 通过JSSDK的api使小程序跳转到指定的小程序页面
      wx.miniProgram.navigateTo({ url: path });
    },

    Alipay(order_id) {
      this.$router.push(
        this.fun.getUrl("love_alipay2", { status: "11", pay_id: order_id })
      );
    },
    appWeiPay() {
      var that = this;
      YDB.SetWxpayInfo(
        that.$store.state.temp.mailInfo.name,
        "订单号：" + that.ordersn,
        that.money,
        that.ordersn,
        that.fun.getKeyByI()
      );
    },
    // ==========================================
    btnclass(type) {
      if (
        type == 1 ||
        type == 6 ||
        type == 9 ||
        type == 12 ||
        type == 20 ||
        type == 22
      ) {
        return "icon-balance_i";
      } else if (type == 2 || type == 10) {
        return "icon-balance_j";
      } else if (type == 18) {
        return "icon-balance_d";
      } else if (type == 19) {
        return "icon-balance_g";
      } else {
        return "icon-balance_h";
      }
    },
    // 确认充值
    confirm(type) {
      var that = this;
      that.money = parseFloat(this.money);
      this.pay_type = type;
      if (that.money <= 0) {
        that.$dialog.alert({message:"金额不可低于0元"});
        return;
      }
      let url = "plugin.auction.api.member-prepayment.check-recharge"; // "&client_type=2&app_type=wechat"
      if (window.isMiniprogram) {
        url += "&client_type=2&app_type=wechat";
      }
      $http
        .get(
          url,
          { pay_way: this.pay_type, money: this.money },
          "正在充值"
        )
        .then(
          response => {
            if (response.result == 1) {

              if (that.fun.isTextEmpty(response.data.order_sn)) {
                that.$dialog.alert({message:"参数错误"});
                return false;
              }
              that.ordersn = response.data.order_sn;
              if (this.pay_type == 1) {
                // 微信充值
                wx.config(response.data.js);
                that.WXPay(response.data.config);
              }else if (this.pay_type == 3) {

                Toast(response.msg);
                that.$router.push(
                  that.fun.getUrl("auctionLove")
                );
              }
              else if (this.pay_type == 2) {
                that.$router.push(
                  that.fun.getUrl("love_alipay", {
                    status: "1",
                    recharge_money: that.money,
                    order_pay_id: that.ordersn,
                    uid: window.localStorage.uid,
                    pid: window.localStorage.uid,
                    tag: 'love'
                  })
                );
              } else if (this.pay_type == 6) {
                that.getWeChatPayParams2();
              } else if (this.pay_type == 9) {
                that.appWeiPay();
              } else if (this.pay_type == 10) {
                that.appAliPay(response.data.isnewalipay);
              } else if (this.pay_type == 12) {
                that.newWechatPay();
              } else if (this.pay_type == 7) {
                // 支付宝 第三发
                that.newAlipay(response.data.order_sn);
              } else if (this.pay_type == 19) {
                // eup支付
                that.eupPay(response.data.order_sn);
              } else if (this.pay_type == 28) {
                // 第三方支付汇聚  微信
                let data = response.data.data.rc_Result;
                data = JSON.parse(data);
                console.log(data, "999");
                that.newWXPay(data);
                // 第三方支付汇聚  支付宝
              } else if (this.pay_type == 29) {
                console.log(response, "返回");
                if (response.data.msg != "") {
                  that.$dialog.alert({message:response.data.msg});
                } else {
                  window.href = response.data.rc_Result;
                }
                // that.newAlipay(response.data.order_sn)
              } else if (this.pay_type == 23) {
                // 达人链
                that.talentPay(response.data.order_sn);
              } else if (this.pay_type == 33) {
                that.jueqiAlipay();
              }
            } else {
              that.$dialog.alert({message:response.msg});
            }
          },
          function(response) {
            // error callback
          }
        );
    },
    jueqiAlipay() {
      let that = this;
      $http
        .get("order.merge-pay.wechat-pay-jueqi", {
          order_pay_id: that.ordersn
        })
        .then(
          function(response) {
            if (response.result == 1) {
              window.location.href = response.data.url;
            } else {
              that.$dialog.alert({message:response.msg});
            }
          },
          function(response) {
            // error callback
          }
        );
    },
    // 达人链
    talentPay(val) {
      $http
        .get("plugin.pld-pay.api.pld-recharge.index", { order_sn: val }, " ")
        .then(res => {
          if (res.result == 1) {
            window.location.href = res.data.url;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    eupPay(val) {
      $http
        .get("plugin.eup-pay.api.eup-recharge.index", { order_sn: val }, " ")
        .then(res => {
          if (res.result == 1) {
            window.location.href = res.data.url;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 第三方支付宝
    newAlipay(ordersn) {
      var that = this;
      let json = { order_sn: ordersn };
      $http.get("finance.balance.alipay", json, "").then(
        function(response) {
          if (response.result === 1) {
            that.$router.push(
              that.fun.getUrl("alipayCloud", {
                status: "7",
                url: response.data
              })
            );
          } else {
            that.$dialog.alert({message:response.msg});

          }
        },
        function(response) {
          // error callback
        }
      );
    },
    // 新版微信
    newWechatPay() {
      var that = this;
      let json = { order_pay_id: that.ordersn };
      $http.get("order.merge-pay.yunPayWechat", json, "").then(
        function(response) {
          if (response.result === 1) {
            // wx.config(response.data.js)
            that.newWXPay(response.data);
          } else {
            that.$dialog.alert({message:response.msg});

          }
        },
        function(response) {
          // error callback
        }
      );
    },
    // 云微信充值方法
    getWeChatPayParams2() {
      var that = this;
      $http
        .get("finance.balance.cloudWechatPay", { ordersn: that.ordersn }, "")
        .then(
          response => {
            if (response.result == 1) {
              window.location.href = response.data;
            } else {
              that.$dialog.alert({message:response.msg});

            }
          },
          function(response) {
            that.$dialog.alert({message:response.msg});

          }
        );
    },
    appAliPay(isnewalipay) {
      var that = this;
      if (isnewalipay == 1) {
        YDB.SetRSA2AlipayInfo(
          that.$store.state.temp.mailInfo.name,
          that.fun.getKeyByI(),
          that.money,
          that.fun.getKeyByI() +'_'+that.ordersn
        );
      } else {
        YDB.SetAlipayInfo(
          that.$store.state.temp.mailInfo.name,
          that.fun.getKeyByI(),
          that.money,
          that.fun.getKeyByI() +'_'+that.ordersn
        );
      }
    }
  },
  activated() {
    if (window.isMiniprogram) {
      this.AlipayShow = false;
    }
    this.initData();
    this.getData();
    this.getTitle();
    // 判断是否显示汇聚
    // this.isShowHj();
  },
  components: { cTitle }
};
