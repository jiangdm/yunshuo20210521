import cTitle from "components/title";
export default {
  data() {
    return {
      toi: this.fun.getKeyByI(),
      credit2: 0,
      buttons: [],
      typename: "",
      recharge: "",
      ordersn: "",
      money: "",

      // 选择的充值方式
      pay_type: "",
      // 余额字样
      balanceLang: this.fun.getBalanceLang(),

      isOpenCmc: false //首次需要验证是否开启cmc
    };
  },
  methods: {
    // 初始化参数
    getData() {
      var that = this;
      $http.get("finance.balance.balance").then(
        function(response) {
          if (response.result == 1) {
            that.credit2 = response.data.credit2;
            that.buttons = response.data.buttons;
            that.typename = response.data.typename;
            that.recharge = response.data.recharge;
          } else {
            that.$dialog.alert({ message: response.msg });
          }
        },
        function(response) {
          that.$dialog.alert({ message: response.msg });
        }
      );
    },
    getQuick(ordersn) {
      var that = this;
      $http.get("plugin.converge_pay.frontend.controllers.quick-pay.show-recharge", { ordersn: ordersn }).then(
        function(response) {
          if (response.result == 1) {
            if (response.data.have_bank_card == 0) {
              that.$router.push(that.fun.getUrl("addBankFirst", { order_pay_id: ordersn, status: 2 }));
            } else {
              that.$router.push(that.fun.getUrl("chooseBank", { order_pay_id: ordersn, status: 2 }));
            }
          } else {
            if (response.msg != "不存在的接口") {
              that.$dialog.alert({ message: response.msg });

              return;
            }
            console.log(response.msg);
          }
        },
        function(response) {
          that.$dialog.alert({ message: response.msg });
        }
      );
    },
    // 确认充值
    confirm(type) {
      var that = this;
      this.pay_type = type;
      console.log(that.money <= 0);
      if (!that.money || that.money <= 0) {
        that.$dialog.alert({ message: "输入值不能小于0" });
        return;
      }
      if (type == 202006 && !this.isOpenCmc) {
        this.isHaveCmcInfo();
        return;
      }
      that.money = parseFloat(this.money);
      let url = "finance.balance.recharge"; // "&client_type=2&app_type=wechat"
      if (window.isMiniprogram) {
        url += "&client_type=2&app_type=wechat";
      }
      $http.get(url, { pay_type: this.pay_type, recharge_money: this.money }, "正在充值").then(
        response => {
          if (response.result == 1) {
            if (that.fun.isTextEmpty(response.data.ordersn)) {
              that.$dialog.alert({ message: "参数错误" });

              return false;
            }
            that.ordersn = response.data.ordersn;
            if (that.pay_type == 59) {
              that.getQuick(response.data.ordersn);
            }
            if (this.pay_type == 1) {
              // 微信充值
              wx.config(response.data.js);
              that.WXPay(response.data.config);
            } else if (this.pay_type == 2) {
              that.$router.push(
                that.fun.getUrl("alipay", {
                  status: "1",
                  recharge_money: that.money,
                  order_pay_id: that.ordersn,
                  uid: window.localStorage.uid,
                  pid: window.localStorage.uid
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
              that.newAlipay(response.data.ordersn);
            } else if (this.pay_type == 19) {
              // eup支付
              that.eupPay(response.data.ordersn);
            } else if (this.pay_type == 28) {
              let data = response.data.data.rc_Result;
              data = JSON.parse(data);
              console.log(data, "999");

              // let json = {
              //   appId: data.appId,
              //   timeStamp: data.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
              //   nonceStr: data.nonceStr, // 支付签名随机串，不长于 32 位
              //   package: data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
              //   signType: data.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
              //   paySign: data.paySign, // 支付签名
              // }
              that.newWXPay(data);
              // 第三方支付汇聚  支付宝
            } else if (this.pay_type == 29) {
              that.$router.push(that.fun.getUrl("alipayCloud", { status: "hj_url", url: response.data.data.rc_Result }));
              // that.newAlipay(response.data.ordersn)
            } else if (this.pay_type == 23) {
              // 达人链
              that.talentPay(response.data.ordersn);
            } else if (this.pay_type == 33) {
              that.jueqiAlipay(response.data.url);
            } else if (this.pay_type == 202006) {
              that.cmcPay(response.data.ordersn);
            }
          } else {
            that.$dialog.alert({ message: response.msg });
          }
        },
        function(response) {
          // error callback
        }
      );
    },
    cmcPay(_orderSn) {
      let that = this;
      $http.get("plugin.cmc-pay.frontend.cmc-recharge.index", { order_sn: _orderSn }, "").then(
        function(response) {
          if (response.result === 1) {
            that.money = null;
            that.$dialog.alert({ message: response.msg });
            that.getData();
          } else {
            that.$dialog.alert({ message: response.msg });
          }
        },
        function(response) {
          // error callback
        }
      );
    },
    isHaveCmcInfo() {
      let that = this;
      $http.get("plugin.cmc-pay.frontend.account.get-cmc-account", {}, "").then(
        function(response) {
          if (response.result === 1) {
            that.isOpenCmc = true;
            that.confirm(202006);
          } else {
            that.$dialog.alert({ message: "没有CMC账号！" });

            that.$router.push(that.fun.getUrl("cmcPayInfo", {}));
          }
        },
        function(response) {
          // error callback
        }
      );
    },
    jueqiAlipay(url) {
      // let that = this;
      window.location.href = url;
      // $http.get("finance.balance.wechat-pay-jueqi", {
      //   order_pay_id:that.ordersn
      // })
      //     .then(
      //         function(response) {
      //           if (response.result == 1) {
      //             window.location.href = response.data.url;
      //           } else {
      //
      //           }
      //         },
      //         function(response) {
      //           // error callback
      //         }
      //     );
    },
    // 第三方支付微信 汇聚
    // WXPayHJ(payParams) {
    //   var that = this
    //   if (window.isMiniprogram) {
    //     that.miniWxPay(payParams)
    //     return
    //   }
    //   wx.chooseWXPay({
    //     appId: payParams.appId,
    //     timeStamp: payParams.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
    //     nonceStr: payParams.nonceStr, // 支付签名随机串，不长于 32 位
    //     package: payParams.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
    //     signType: payParams.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
    //     paySign: payParams.paySign, // 支付签名
    //     success: function (res) {
    //       // 支付成功后的回调函数

    //       if (res.errMsg == 'chooseWXPay:ok') {
    //
    //         that.$router.go(-1)
    //       } else {
    //         console.log(payParams, '打印失败原因')

    //
    //       }
    //     },
    //     cancel: function (res) {
    //       // 支付取消
    //     },
    //     fail: function (res) {
    //       console.log(payParams, '打印失败原因')
    //
    //     }
    //   })
    // },
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
            that.$dialog.alert({ message: response.msg });
          }
        },
        function(response) {
          // error callback
        }
      );
    },
    // 第三方支付宝 汇聚
    newAlipayHj(data) {
      console.log(data, "支付");
      const that = this;
      that.$router.push(
        that.fun.getUrl("HJalipay", {
          status: 29,
          order_pay_id: data.ordersn
        })
      );
      // let json = { order_pay_id: data.ordersn }
      // $http.get('order.merge-pay.alipay-pay-hj', json, '').then(
      //   function (response) {
      //     if (response.result === 1) {
      //     } else {
      //
      //     }
      //   },
      //   function (response) {
      //     // error callback
      //   }
      // )
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
            that.$dialog.alert({ message: response.msg });
          }
        },
        function(response) {
          // error callback
        }
      );
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
            that.$dialog.alert({ message: "支付成功" }).then(() => {
              that.$router.go(-1);
            });
          } else {
            that.$dialog.alert({ message: "支付失败" });
          }
        }
      );
    },

    // 云微信充值方法
    getWeChatPayParams2() {
      var that = this;
      $http.get("finance.balance.cloudWechatPay", { ordersn: that.ordersn }, "").then(
        response => {
          if (response.result == 1) {
            window.location.href = response.data;
          } else {
            that.$dialog.alert({ message: response.msg });
          }
        },
        function(response) {
          that.$dialog.alert({ message: response.msg });
        }
      );
    },

    miniWxPay(payParams) {
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
            that.$dialog.alert({ message: "充值成功" }).then(() => {
              that.$router.go(-1);
            });
          } else {
            that.$dialog.alert({ message: "充值失败，请返回重试" });
          }
        },
        cancel: function(res) {
          // 支付取消
        },
        fail: function(res) {
          that.$dialog.alert({ message: "充值失败，请返回重试" });
        }
      });
    },
    appWeiPay() {
      var that = this;
      YDB.SetWxpayInfo(that.$store.state.temp.mailInfo.name, "订单号：" + that.ordersn, that.money, that.ordersn, that.fun.getKeyByI());
    },
    appAliPay(isnewalipay) {
      var that = this;
      if (isnewalipay == 1) {
        YDB.SetRSA2AlipayInfo(that.$store.state.temp.mailInfo.name, that.fun.getKeyByI(), that.money, that.fun.getKeyByI() + "_" + that.ordersn);
      } else {
        YDB.SetAlipayInfo(that.$store.state.temp.mailInfo.name, that.fun.getKeyByI(), that.money, that.fun.getKeyByI() + "_" + that.ordersn);
      }
    },
    btnclass(type) {
      if (type == 1 || type == 6 || type == 9 || type == 12 || type == 20 || type == 22) {
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
    }
  },
  activated() {
    this.toi = this.fun.getKeyByI();
    window.scrollTo(0, 0);
    this.pay_type = "";
    this.money = "";
    if (this.$route.params.num) {
      this.money = this.$route.params.num;
    }
    this.getData(); // 初始化参数
  },
  components: { cTitle }
};
