import { Toast } from "vant";
export default {
  // beforeRouteLeave: function(to, from, next) {
  //   if (to.name == "HotelGoodsOrder") {
  //     this.$dialog
  //       .confirm({ message: "您还没完成支付，确认离开?" })
  //       .then(() => {
  //         self.$router.push(self.fun.getUrl("home", {}));
  //         next();
  //       })
  //       .catch(() => {
  //         next(false);
  //       });
  //   } else {
  //     next();
  //   }
  // },
  data() {
    return {
      balance: 0,
      info_form: {},
      passwordInfo: {},
      order_sn: "",
      money: "",
      buttons: [],
      typename: "",
      pay_sn: "订单编号",
      order_pay_id: "",
      uid: "",
      popupSpecs: false,
      pageUrl: "",
      // 余额字样
      balanceLang: this.fun.getBalanceLang(),

      redirectData: {},
      cbHref: {},
      payarr: ""
    };
  },
  methods: {
    getData() {
      let that = this;
      //获取支付方式
      $http.get("plugin.luck-draw.frontend.team.getPayType", {}, "获取中").then(
        function(response) {
          if (response.result === 1) {
            that.buttons = response.data.buttons;
          } else {
            Toast(response.msg);
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    confirm(data, pwd) {
      //选择了支付方式
      let that = this;
      if (data.need_password && !pwd) {
        this.passwordInfo = data;
        this.showPwdPop();
        return;
      }

      let json = {
        activity_id: this.info_form.activity_id,
        total: this.info_form.total,
        pay_id: data.value,
        money: this.info_form.money * this.info_form.total,
        pid: this.info_form.pid || 0,
        address: this.info_form.address
      };
      $http
        .get("plugin.luck-draw.frontend.team.payJoinActivity", json, "支付中...")
        .then(response => {
          if (response.result == 1) {
            switch (data.value) {
            case 1: //微信
              wx.config(response.data.js);
              that.WXPay(response.data.config);
              break;
            case 2: //支付宝
              that.$router.push(
                that.fun.getUrl("alipayCourse", {
                  status: "9",
                  url: response.data
                })
              );
              break;
            case 3: //余额
              that.$dialog.alert({ message: response.msg });
              if (window.history.length <= 1) {
                that.$router.push(that.fun.getUrl("newDrawIndex", { id: that.info_form.activity_id }));
              } else {
                that.$router.go(-1);
              }
              break;
            case 6: //新版微信 link
              window.location.href = response.data;
              break;
            case 12: //芸支付 微信
              that.newWXPay(response.data.config);
              break;
            case 7: //云收银支付宝
              that.$router.push(
                that.fun.getUrl("alipayCourse", {
                  status: "9",
                  url: response.data
                })
              );
              break;
            case 9: //微信app
              console.log(that.$store.state.temp.mailInfo.name, "订单号：" + response.data.order_sn, response.data.amount, response.data.order_sn, that.fun.getKeyByI());
              try {
                console.log("微信支付：：：", response.data);
                YDB.SetWxpayInfo(that.$store.state.temp.mailInfo.name, "订单号：" + response.data.order_sn, response.data.amount, response.data.order_sn, that.fun.getKeyByI());
              } catch (error) {
                console.log("微信app:::error", error);
              }

              break;
            case 28: //汇聚 微信
              that.newWXPay(JSON.parse(response.data.data.rc_Result));
              break;
            case 29: //汇聚 支付宝
              that.HJToappliy(response.data);
              break;
            default:
              break;
            }
          } else {
            that.$dialog.alert({ message: response.msg });
          }
        })
        .catch(error => {
          that.$dialog.alert({ message: error });
        });
    },
    WXPay(payParams, cbHref) {
      // alert(document.location.href)
      // console.log(""+payParams.timestamp)
      var that = this;
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
            that.$router.go(-1);
          } else {
            that.$dialog.alert({
              message: "支付失败"
            });
            console.log(payParams, "支付失败参数缺失");
          }
        },
        cancel: function(res) {
          // 支付取消
        },
        fail: function(res) {
          that.$dialog.alert({
            message: "支付失败，请返回重试"
          });
        }
      });
    },
    newWXPay(payParams, cbHref) {
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
          } else {
            that.$dialog.alert({
              message: "支付失败"
            });
          }
        }
      );
    },
    // 汇聚支付跳转
    HJToappliy(data) {
      if (data.msg != "") {
        this.$dialog.alert({ message: data.msg });
      } else {
        window.href = data.data.rc_Result;
      }
    },
    onInput(e) {
      if (this.payarr.length < 6) {
        this.payarr = `${this.payarr}${e}`;
        if (this.payarr.length == 6) {
          this.keyboardDone(this.payarr);
        }
      }
    },
    onDelete(e) {
      if (this.payarr.length > 0) {
        this.payarr = this.payarr.substr(0, this.payarr.length - 1);
      }
    },

    getIconUrl(item) {
      let icon_url = "";
      switch (item.code) {
      case "wechatPay":
      case "cloudPayWechat":
      case "wechatApp":
      case "yunPayWechat":
      case "wftPay":
      case "yop":
      case "convergePayWechat":
      case "WechatScan":
      case "WechatFace":
      case "WechatJsapi":
      case "wechatAggregatePay":
        icon_url = "icon-pay_wechat";
        break;
      case "alipay":
      case "cloudPayAlipay":
      case "alipayApp":
      case "yunPayAlipay":
      case "wftAlipay":
      case "convergePayAlipay":
      case "yopAlipay":
      case "AlipayScan":
      case "AlipayFace":
      case "AlipayJsapi":
      case "alipayAggregatePay":
        icon_url = "icon-pay_alipay";
        break;
      case "balance":
      case "MemberCard":
        icon_url = "icon-pay_yue";
        break;
      case "remittance":
        icon_url = "icon-pay_remittance";
        break;
      case "anotherPay":
        icon_url = "icon-pay_otherpay";
        break;
      case "UsdtPay":
        icon_url = "icon-pay_utsd";
        break;
      case "DepositPay":
        icon_url = "icon-pay_prepay";
        break;
      case "convergeQuickPay":
        icon_url = "icon-pay_quick";
        break;
      case "COD":
        icon_url = "icon-pay_cashondelivery";
        break;
      default:
        icon_url = "icon-pay_default";
        break;
      }
      return icon_url;
    },

    btnclass(type) {
      if (type == 1 || type == 6 || type == 9 || type == 20 || type == 22 || type == 60 || type == 56) {
        return "bg_wechat";
      } else if (type == 2 || type == 10 || type == 7 || type == 21 || type == 61) {
        return "bg_ali";
      } else if (type == 14) {
        return "bg_payanother";
      } else if (type == 18 || type == 24) {
        return "bg_quick";
      } else {
        return "bg_alipay";
      }
    },

    showPwdPop() {
      this.popupSpecs = true;
      this.payarr = "";
    },

    hidePwdPop() {
      this.popupSpecs = false;
    },

    keyboardDone(val) {
      this.hidePwdPop();
      this.getVerifyPassword(val);
    },

    // 验证密码
    getVerifyPassword(pwd) {
      // order.pay.wechatPay
      var that = this;
      $http.get("payment.password.check", { password: pwd }, "").then(
        function(response) {
          if (response.result == 1) {
            that.confirm(that.passwordInfo, true);
          } else {
            that.$dialog
              .confirm({ message: response.msg })
              .then(() => {
                if (response.data.code == 2001) {
                  // 商城支付密码设置未开启
                  // that.$router.go(-1)
                } else if (response.data.code == 2002) {
                  // 用户未设置支付密码
                  // 去设置密码
                  that.$router.push(that.fun.getUrl("set_balance_password", {}));
                } else if (response.data.code == 2003) {
                  // 支付密码错误
                }
              })
              .catch(() => {
                if (response.data.code == 2001) {
                  // 商城支付密码设置未开启
                } else if (response.data.code == 2002) {
                  // 用户未设置支付密码
                } else if (response.data.code == 2003) {
                  // 支付密码错误
                }
              });
          }
        },
        function(response) {
          that.$dialog.alert({
            message: response.msg
          });
        }
      );
    }
  },
  activated() {
    if (this.$route.params.datas) {
      this.info_form = JSON.parse(this.$route.params.datas);
    } else {
      Toast("缺少支付参数");
      if (window.history.length <= 1) {
        this.$router.push(this.fun.getUrl("home", {}));
      } else {
        this.$router.go(-1);
      }
    }
    this.getData();
  },
  components: {}
};
