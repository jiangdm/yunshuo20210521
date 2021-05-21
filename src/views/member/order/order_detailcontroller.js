import cTitle from "components/title";
import cDyPopup from "../../goods/diyFormPopup";
export default {
  data() {
    return {
      regional: "请选择快递公司",
      dateshow_1: false,
      columns: [],
      order_id: "",
      order_data: "",
      bottomStatus: "",
      selected: "1",
      allLoaded: false,
      isVirtual: false,
      receiver: "",
      mobile: "",
      address: "",
      pay_type_id: "",
      orderType: "shop",
      order_pay_id: "",
      dispatch_type_id: "",
      qrcode: "",
      showQrcode: false,
      // 确认发货
      dialogVisible: false,
      expressName: "",
      numberName: "",
      addresseeInfo: "",
      options: [],

      hotel_start: "",
      hotel_end: "",
      night_day: "",
      hotel_name: "",

      showBarter: false,
      showBarter_value: null,

      jurisdiction_set: "", //供应商订单是否显示会员信息

      showDFData: false, //商品自定义表单
      dfData: {},

      showPhotoGoodsArr: false, //显示相册商品图片预览
      PhotoGoodsArr: [],

      service_station: {}, // 服务站信息
      package_deliver: {}, //自提点（杨朗）

      // 是否使用权益标识
      // isRight:false
      showID: "",
      hasPacket: false,
      showPacket: false,
      timer: null,
      shrinkPacket: false,

      showKefu: false,
      cservice: '',
      service_QRcode: '',
      service_mobile: '',


      blindBoxInfo: {
        show: false,
        goods: [],
        //盲盒相关数据
      },
      // 话费慢充
      phone_bill: {}
    };
  },
  methods: {
    showMore(order_sn) {
      if (this.showID == order_sn) {
        this.showID = "";
      } else {
        this.showID = order_sn;
      }
    },
    // 初始化
    init() {
      this.order_id = "";
      this.order_data = "";
      this.bottomStatus = "";
      this.selected = "1";
      this.allLoaded = false;
      this.isVirtual = false;
      this.receiver = "";
      this.mobile = "";
      this.address = "";
      this.qrcode = "";
      this.showQrcode = false;
      this.dialogVisible = false;
      this.options = [];
      this.regional = "请选择快递公司";
      this.dateshow_1 = false;
      this.columns = [];
      this.hotel_start = "";
      this.hotel_end = "";
      this.night_day = "";
      this.hotel_name = "";
      this.service_station = "";
      this.showDFData = false;
      this.dfData = {};
      this.jurisdiction_set = "";

      this.showPacket = false;
      this.hasPacket = false;
    },

    operation(btn, order) {
      try {
        this.orderPayId = order.id;
      } catch (error) {
        console.log(error);
      }
      // this.actions=[{name:"无理由",method:"sheetAction"},{name:"不退了",method:"sheetAction"}]
      if (btn.value == 8 || btn.value == "snatch_regiment_express") {
        this.checklogistics(order, btn);
      } else if (btn.value == 12) {
        this.deleteOrder(order, btn);
      } else if (btn.value == 10) {
        // 评价订单
        this.$router.push(this.fun.getUrl("comment", { order: order }));
      } else if (btn.value == 1 || btn.value == "snatch_regiment_pay" || btn.value === "together_purchase_pay") {
        this.toPay(order, btn);
      } else if (btn.value == 13 || btn.value == 54 || btn.value == 'snatch_regiment_refund') {
        // 退款
        this.toRefund(order, btn);
      } else if (btn.value == 9) {
        // 取消订单
        this.cancleOrder(order, btn);
      } else if (btn.value == 5) {
        // 确认订单
        this.confirmOrder(order, btn);
      } else if (btn.value == 18) {
        // 退款中
        this.toRefundDetail(order, btn);
      } else if (btn.value == "cashierPay") {
        // 退款中
        this.cashPayOrder(order, btn);
      } else if (btn.value == 101) {
        this.applyRefund(order, btn);
      } else if (btn.value == "verification_code") {
        // 验证核销
        this.verification(order, btn);
      } else if (btn.value == 20) {
        console.log("现金支付");
        // 现金付款
        this.verificationCash(order, btn);
      } else if (btn.value == 3) {
        this.gotoRefund(order.id);
      } else if (btn.value == 40) {
        this.gotoRefundCheck(order.id);
      } else if (btn.value == 4) {
        this.gotoMakeSure(order.id);
      } else if (btn.value == 21) {
        this.shopRecord();
      } else if (btn.value == 22) {
        // 确认支付
        this.payMoney(order, btn);
      } else if (btn.value == 23 || btn.value == 60) {
        // 确认发货
        this.orderPayId = order.id;
        if (order.dispatch_type_id == 3) {
          this.sendGoogs();
        } else {
          this.getCompany();
          this.dialogVisible = true;
        }
        this.expressName = "";
        this.numberName = "";
      } else if (btn.value == 24 || btn.value == 61) {
        // 取消发货
        this.deliverGoodsCancel(order, btn);
      } else if (btn.value == 25) {
        // 确认收货
        this.collectGoods(order, btn);
      } else if (btn.value == 26) {
        // 关闭订单
        this.closeOrderPay(order, btn);
      } else if (btn.value == 27) {
        this.evaluate(btn, order);
      } else if (btn.value == 28) {
        // 卡密
        this.truckList(btn, order);
      } else if (btn.value == 41) {
        // 398售后
        window.location.href = btn.api;
      } else if (btn.value == 50) {
        // 发票
        this.checkInvoice(btn, order);
      } else if (btn.value == 11) {
        // 酒店确认下单
        this.confirmHotelOrder(btn.api, order.id);
      } else if (btn.value == "coupon") {
        // 分享优惠券
        this.$router.push(this.fun.getUrl("couponShare", { order_id: order.id }));
      } else if (btn.value === "check_out") {
        this.sureOut(order, btn);
      } else if (btn.value === "clerk_code" || btn.value === "package_deliver") {
        // 确认核销
        this.orderPayId = order.id;
        this.confirmWriteOff(order, btn);
      } else if (btn.value === "service_station_pay") {
        // 服务站的确认支付serviceReplenish
        this.orderPayId = order.id;
        this.payMoney(order, btn);
      } else if (btn.value === "service_station_send") {
        // 服务站的确认发货
        this.orderPayId = order.id;
        this.getCompany();
        this.dialogVisible = true;
        this.expressName = "";
        this.numberName = "";
      } else if (btn.value === "service_station_cancel_send") {
        // 服务站的取消发货
        this.orderPayId = order.id;
        this.deliverGoodsCancel(order, btn);
      } else if (btn.value === "service_station_complete") {
        // 服务站的确认收货
        this.orderPayId = order.id;
        this.collectGoods(order, btn);
      } else if (btn.value === "service_station_close") {
        // 服务站的关闭订单
        this.orderPayId = order.id;
        this.closeOrderPay(order, btn);
      } else if (btn.value == "lease_toy_refund" || btn.value == "package_deliver_clerk") {
        // 申请归还and 确认完成（自提点核销）
        this.getReturn(btn, order);
      } else if (btn.value == "lease_toy_apply_adopt") {
        // 填写归还
        this.$router.push(this.fun.getUrl("OrderReturn", { id: order.id }));
      } else if (btn.value == "lease_toy_return_info") {
        // 归还详情
        this.$router.push(this.fun.getUrl("orderruturninfo", { id: order.id }));
      } else if (btn.value == "expediting_delivery") {
        this.publicMessage(order, btn, "提醒商家发货");
      } else if (btn.value == "snatch_regiment_barter") {
        // 抢团易货兑换
        this.showBarter = true;
        this.showBarter_value = this.order_data.barter;
      } else if (btn.value == 53) {
        this.getBlindBoxGoods(order.id);
      } else if (btn.value == 51) {
        // 查看卡券
        this.$router.push(this.fun.getUrl("cpsPwd", {order_id:order.id}));
      } else {
        this.publicMessage(order, btn, btn.name);
      }
    },

    applyRefund(item, btn) {
      this.$router.push(
        this.fun.getUrl("pickUpCardReimburse", {
          order_id: item.id,
          type: 1
        })
      );
    },
    confirmBarter() {
      let that = this;
      $http.get("plugin.snatch-regiment.api.order.barter", { order_id: that.orderPayId }).then(
        function(response) {
          if (response.result == 1) {
            that.$notify({
              background: "#f0f9eb",
              message: `易货兑换成功`,
              color: "#67c23a"
            });
            that.getNetData();
          } else {
            that.$dialog.alert({ message: response.msg });
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    getKefu() {
      let goods_id;
      if (this.order_data.has_many_order_goods.length > 0) {
        goods_id = this.order_data.has_many_order_goods[0].goods_id;
      }
      $http.get("goods.customer-service.index", { goods_id: goods_id }).then(
        response => {
          if (response.result == 1) {
            this.cservice = response.data.cservice;
            this.service_QRcode = response.data.service_QRcode;
            this.service_mobile = response.data.service_mobile;
            this.showKefu = true;
          } else {
            this.$dialog.alert({ message: response.msg });
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    cancelBarter() {
      this.showBarter = false;
      this.showBarter_value = null;
    },
    publicMessage(order, btn, text) {
      // order订单, btn点击的按钮, text提示的文字
      let _text = text || "";
      if (!btn.api) {
        return;
      }
      this.$dialog
        .confirm({ message: `确定${_text}?` })
        .then(() => {
          var that = this;
          let json = {
            order_id: that.orderPayId
          };
          let urls = btn.api || "";
          if (that.noMoreClick) {
            return;
          }
          that.noMoreClick = true;
          $http.get(urls, json).then(
            function(response) {
              that.noMoreClick = false;
              if (response.result == 1) {
                that.$emit("ConfrimOrderNotification", "pay");
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
              that.noMoreClick = false;
              console.log(response);
            }
          );
        })
        .catch(() => {});
    },
    // 申请归还的操作and 确认完成（自提点核销）
    getReturn(btn, order) {
      $http.get(btn.api, { order_id: order.id }).then(res => {
        if (res.result == 1) {
          this.$dialog.alert({ message: res.msg });
          this.getNetData();
        } else {
          this.$dialog.alert({ message: res.msg });
        }
      });
    },
    // 确认接单
    orderReceiving(order, btn) {
      this.$dialog
        .confirm({ message: "确定接收此单配送任务?" })
        .then(() => {
          var that = this;
          let json = {
            order_id: that.orderPayId
          };
          $http.get(btn.api, json).then(
            function(response) {
              if (response.result == 1) {
                that.$emit("ConfrimOrderNotification", "pay");
                // that.$message({
                //   message: '关闭订单成功',
                //   type: 'success'
                // })
                that.$notify({
                  background: "#f0f9eb",
                  message: "接单成功",
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
    confirmWriteOff(order, btn) {
      let that = this;
      let url = "";
      if (btn.value == "clerk_code") {
        url = "plugin.delivery-station.frontend.order.detail.qr-code-url";
      } else if (btn.value == "package_deliver") {
        url = btn.api;
      }
      $http.get(url, { order_id: order.id }, "正在获取核销码").then(
        function(response) {
          if (response.result == 1) {
            if (btn.value == "clerk_code") {
              that.qrcode = response.data.qrcode_url;
            } else if (btn.value == "package_deliver") {
              that.qrcode = response.data.qr_code_url;
            }
            that.showQrcode = true;
          } else {
            that.$dialog.alert({ message: response.msg });
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    confirmDelivery(order, btn) {
      this.$dialog
        .confirm({ message: "确定配送此单?" })
        .then(() => {
          let that = this;
          let json = {
            order_id: that.orderPayId
          };
          $http.get(btn.api, json).then(
            function(response) {
              if (response.result == 1) {
                that.$emit("ConfrimOrderNotification", "pay");
                that.$notify({
                  background: "#f0f9eb",
                  message: "配送成功",
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
    cancelDelivery(order, btn) {
      this.$dialog
        .confirm({ message: "确定取消配送此单?" })
        .then(() => {
          var that = this;
          let json = {
            order_id: that.orderPayId
          };
          let urls = btn.api;
          $http.get(urls, json).then(
            function(response) {
              if (response.result == 1) {
                that.$emit("ConfrimOrderNotification", "pay");
                that.$notify({
                  background: "#f0f9eb",
                  message: "取消配送成功",
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
    // 查看发票
    checkInvoice(btn, order) {
      this.$router.push(this.fun.getUrl("Invoice", { order_id: order.id }));
    },
    // 卡密
    truckList(btn, order) {
      this.$router.push(this.fun.getUrl("TruckList", { order_id: order.id }));
    },
    // 评价
    evaluate(btn, order) {
      this.$router.push(
        this.fun.getUrl("DeliveryEvaluate", {
          order_id: order.id,
          api: btn.api,
          name: "distributor"
        })
      );
    },
    // 确认支付
    payMoney(order, btn) {
      this.$dialog
        .confirm({ message: "确认支付该订单?" })
        .then(() => {
          var that = this;
          let json = {
            order_id: that.$route.params.order_id
          };
          let urls = "";
          if (this.orderType == "supplier") {
            urls = btn.api;
          } else if (this.orderType == "serviceReplenish") {
            urls = btn.api;
          } else if (this.orderType == "DeliveryS") {
            urls = btn.api;
          } else {
            urls = "plugin.store-cashier.frontend.store.center.order-operation.pay";
          }
          $http.get(urls, json).then(
            function(response) {
              if (response.result == 1) {
                that.getNetData();
                that.$notify({
                  background: "#f0f9eb",
                  message: "支付成功",
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
    // 关闭订单
    closeOrderPay(order, btn) {
      this.$dialog
        .confirm({ message: "确定关闭订单?" })
        .then(() => {
          var that = this;
          let json = {
            order_id: that.$route.params.order_id
          };
          $http.get(btn.api, json).then(
            function(response) {
              if (response.result == 1) {
                if (that.orderType == "supplier") {
                  that.$router.go(-1);
                } else {
                  that.$router.push(
                    that.fun.getUrl("storeOrderlist", {
                      status: "0",
                      orderType: "store"
                    })
                  );
                }
                that.$notify({
                  background: "#f0f9eb",
                  message: "关闭订单成功",
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
    // 取消发货
    deliverGoodsCancel(order, btn) {
      this.$dialog
        .confirm({ message: "确定取消发货?" })
        .then(() => {
          var that = this;
          let json = {
            order_id: that.$route.params.order_id
          };
          $http.get(btn.api, json).then(
            function(response) {
              if (response.result == 1) {
                that.getNetData();
                that.$notify({
                  background: "#f0f9eb",
                  message: "取消发货成功",
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
    // 获取快递公司
    getCompany() {
      var that = this;
      var urls = "";
      if (this.orderType == "supplier") {
        urls = "plugin.supplier.frontend.order.express-company";
      } else if (this.orderType == "serviceReplenish") {
        urls = "plugin.service-station.frontend.order-list.express";
      } else if (this.orderType == "subsidiary") {
        urls = "plugin.subsidiary.frontend.order.express-company";
      } else {
        urls = "plugin.store-cashier.frontend.store.center.sendOrder";
      }
      $http
        .get(urls, {
          order_id: that.$route.params.order_id
        })
        .then(
          function(response) {
            if (response.result === 1) {
              that.options = [];
              that.options = response.data.express_companies;
              var arrayOfSquares = that.options.map(function(item) {
                return item.name;
              });
              that.columns = arrayOfSquares;
              that.addresseeInfo = response.data.address;
              that.address = response.data.address.address;
              that.mobile = response.data.address.mobile;
              that.receiver = response.data.address.realname;
            } else {
              that.$dialog.alert({ message: response.msg });
            }
          },
          function(response) {
            console.log(response);
          }
        );
    },
    // 选择快递公司监听
    selectCompany(value) {
      console.log(value, this.expressName);
    },
    // 确认退房
    sureOut(order, btn) {
      this.$dialog
        .confirm({ message: "确认退房?" })
        .then(() => {
          var that = this;
          let json = {
            order_id: that.$route.params.order_id
          };
          $http.get(btn.api, json).then(
            function(response) {
              if (response.result === 1) {
                that.getNetData();
                that.$notify({
                  background: "#f0f9eb",
                  message: "退房成功",
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
    // 确认收货
    collectGoods(order, btn) {
      this.$dialog
        .confirm({ message: "确认收货?" })
        .then(() => {
          var that = this;
          let json = {
            order_id: that.$route.params.order_id
          };
          let urls = "";
          if (this.orderType == "supplier") {
            urls = btn.api;
          } else if (this.orderType == "serviceReplenish") {
            urls = btn.api;
          } else if (this.orderType == "DeliveryS") {
            urls = btn.api;
          } else if (this.orderType == "pickup_card") {
            urls = btn.api;
          } else {
            urls = "plugin.store-cashier.frontend.store.center.order-operation.receive";
          }
          $http.get(urls, json).then(
            function(response) {
              if (response.result === 1) {
                that.getNetData();
                that.$notify({
                  background: "#f0f9eb",
                  message: "收货成功",
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
    // 确认发货取消
    sendCancel() {
      this.dialogVisible = false;
    },
    // 确认发货
    sendGoogs() {
      let that = this;
      // if (that.expressName == "" && that.numberName == "") {
      //   that.$notify("请选择快递公司和输入快递单号")
      //   return
      // } else if (that.expressName == "") {
      //   that.$notify("请选择快递公司")
      //   return
      // } else if (that.numberName == "") {
      //   that.$notify("请输入快递单号")
      //   return
      // }

      let json = {
        order_id: that.$route.params.order_id,
        express_code: that.expressName,
        express_sn: that.numberName
      };
      if (this.orderType == "store" || this.orderType == "cashier") {
        json.express_company_name = that.expressName.name;
      }
      let _urls = "";
      if (this.orderType == "supplier") {
        _urls = "plugin.supplier.frontend.order.send";
      } else if (this.orderType == "serviceReplenish") {
        _urls = "plugin.service-station.frontend.order.order-operation.send";
      } else if (this.orderType == "subsidiary") {
        _urls = "plugin.subsidiary.frontend.order.send";
      } else {
        _urls = "plugin.store-cashier.frontend.store.center.order-operation.send";
      }
      $http.get(_urls, json).then(
        function(response) {
          if (response.result == 1) {
            that.dialogVisible = false;
            that.getNetData();
            that.$notify({
              background: "#f0f9eb",
              message: "发货成功",
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
    },
    handleClose(done) {
      this.$dialog
        .confirm({
          title: "提示",
          message: "确认关闭？"
        })
        .then(() => {
          // on confirm
          done();
        })
        .catch(() => {
          // on cancel
        });
    },
    checklogistics(item, btn) {
      if (item.dispatch_type_id == 7 && JSON.parse(window.localStorage.getItem("globalParameter")).delivery_driver_open == "1") {
        this.$router.push(
          this.fun.getUrl("track", {
            id: item.id
          })
        );
      }
      if(item.is_all_send_goods == 0){
        this.$router.push(
          this.fun.getUrl("logistics", {
            id: item.id,
            fromGrab: 1,
            api: btn.api
          })
        );
      }else{
        //跳转多包裹路由
        // item.is_all_send_goods == 1 || item.is_all_send_goods == 2
        this.$router.push(
          this.fun.getUrl("multiplePackages", {
            order_id: item.id //传送订单id到多包裹页面
          })
        );
      }
    },
    cashPayOrder(item, btn) {
      this.$dialog
        .confirm({ message: "确定此订单已付款?" })
        .then(() => {
          this.sentRequest(
            btn.api,
            {
              order_id: item.id,
              order_pay_id: this.order_pay_id
            },
            false
          );
        })
        .catch(() => {});
    },

    verification(item, btn) {
      this.$router.push(
        this.fun.getUrl("orderVerification", {
          order_id: item.id,
          api: btn.api
        })
      );
    },

    verificationCash(item, btn) {
      this.$dialog
        .confirm({ message: "确定此订单已付款?" })
        .then(() => {
          this.sentRequest(
            "plugin.store-cashier.frontend.store.order-operation.pay",
            {
              order_id: item.id,
              order_pay_id: this.order_pay_id
            },
            false
          );
        })
        .catch(() => {});
    },

    cancleOrder(item, btn) {
      this.$dialog
        .confirm({ message: "确定取消此订单?" })
        .then(() => {
          // 删除当前选中的地址
          this.sentRequest(
            btn.api,
            {
              order_id: item.id
            },
            false
          );
        })
        .catch(() => {});
    },
    // 删除订单
    deleteOrder(item, btn) {
      this.$dialog
        .confirm({ message: "确定删除此订单?" })
        .then(() => {
          // 删除当前选中的地址
          this.sentRequest(
            btn.api,
            {
              order_id: item.id
            },
            false
          );
        })
        .catch(() => {});
    },
    toPay(item, btn) {
      // type-2合并支付 type-1订单支付
      this.$router.push(
        this.fun.getUrl(
          "orderpay",
          {
            status: 1,
            order_ids: item.id
          },
          { api: btn.api }
        )
      );
    },
    confirmOrder(item, btn) {
      this.$dialog
        .confirm({ message: "您确定" + btn.name + "?" })
        .then(() => {
          var that = this;
          // this.$emit('ConfrimOrderNotification', item)
          // 调用接口通知服务器收到货物请求
          $http
            .get(
              btn.api,
              {
                order_id: item.id
              },
              "正在处理订单..."
            )
            .then(
              function(response) {
                if (response.result == 1) {
                  that.getNetData();
                  that.$dialog.alert({ message: response.msg });
                } else {
                  that.$dialog.alert({ message: response.msg });
                }
              },
              function(response) {
                that.$dialog.alert({ message: response.msg });
                that.$router.push(that.fun.getUrl("home", {}));
              }
            );
        })
        .catch(() => {});
    },

    toRefundDetail(item, btn) {
      this.$router.push(
        this.fun.getUrl("aftersales", {
          refund_id: item.refund_id
        })
      );
    },
    // 退款
    toRefund(item, btn) {
      // refund
      if (btn.value == "snatch_regiment_refund") {
        this.$router.push(
          this.fun.getUrl("refund", {
            order: item,
            order_type: 3
          },{value:btn.value})
        );
      } else {
        this.$router.push(
          this.fun.getUrl("refund", {
            order: item,
            order_type: 1
          },{
            value:btn.value
          })
        );
      }
    },
    // 跳转商品详情页面
    toGoodsDetail(goods, isshow, showCourse) {
      if(this.order_data.plugin_id == 107){		//盲盒商品不能跳转
        return;
      }
      if (this.orderType == "lease_toy") {
        this.$router.push(
          this.fun.getUrl("goods", {
            id: goods.goods_id
          })
        );
        return;
      }
      if (isshow == 0) {
        if (showCourse == 1) {
          this.$router.push(
            this.fun.getUrl("CourseDetail", {
              id: goods.goods_id
            })
          );
        } else if (showCourse == 0) {
          if (this.order_data.plugin_id == 32) {
            this.$router.push(
              this.fun.getUrl("goodsO2O", {
                id: goods.goods_id,
                tag: "o2o",
                store_id: goods.store_id
              })
            );
          } else if (this.order_data.plugin_id == 54) {
            this.$router.push(
              this.fun.getUrl(
                "GroupGoods",
                {
                  id: "0", //活动id
                  store_id: goods.store_id || 0
                },
                { fight_groups: goods.goods_id }
              )
            );
          } else {
            this.$router.push(
              this.fun.getUrl("goods", {
                id: goods.goods_id
              })
            );
          }
        }
      }
    },

    sentRequest(action, params, isIndicator) {
      var that = this;
      $http.get(action, params, "").then(
        function(response) {
          if (response.result == 1) {
            that.$dialog.alert({ message: response.msg });
            if (window.history.length <= 1) {
              that.$router.push(that.fun.getUrl("home", {}));
            } else {
              that.$router.go(-1);
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
    // 发起http请求

    getNetData(order_id) {
      var that = this;

      let json = {};
      if (that.fun.getKey("is_clerk")) {
        json = {
          order_id: that.$route.params.order_id,
          is_clerk: that.fun.getKey("is_clerk")
        };
      } else if (this.orderType == "commission_activity") {
        json = {
          activity_id: that.$route.params.order_id
        };
      } else {
        json = {
          order_id: that.$route.params.order_id
        };
      }

      console.log(this.orderType);
      var url = "";
      if (this.orderType == "cashier") {
        url = "plugin.store-cashier.frontend.Order.detail";
      } else if (this.orderType == "store") {
        url = "plugin.store-cashier.frontend.store.order-detail";
      } else if (this.orderType == "supplier") {
        url = "plugin.supplier.frontend.order.detail";
      } else if (this.orderType == "hotel") {
        url = "plugin.hotel.frontend.hotel.detail";
      } else if (this.orderType == "onlineCar") {
        url = "plugin.net-car.frontend.order-detail.index";
      } else if (this.orderType == "hotel_center") {
        url = "plugin.hotel.frontend.hotel.center.order-detail";
      } else if (this.orderType == "hotelcashier") {
        url = "plugin.hotel.frontend.Order.detail";
      } else if (this.orderType == "lease_toy") {
        url = "plugin.lease-toy.api.order.order-detail.index";
      } else if (this.orderType == "serviceReplenish") {
        url = "plugin.service-station.frontend.order-detail.index";
      } else if (this.orderType == "groups") {
        //拼团
        url = "plugin.fight-groups.frontend.controllers.detail.index";
      } else if (this.orderType == "verifier") {
        //自提点核销员
        url = "plugin.package-deliver.frontend.clerk-order-detail.index";
      } else if (this.orderType == "auction") {
        //拍卖
        url = "plugin.auction.api.order-detail";
      } else if (this.orderType == "auctioneer") {
        //拍卖
        url = "plugin.auction.api.order-detail";
      } else if (this.orderType == "subsidiary") {
        url = "plugin.subsidiary.frontend.order.detail";
      } else if (this.orderType == "commission_activity") {
        url = "plugin.commission-activity.api.activity-inquire.order-detail";
      } else if (this.orderType == "pickup_card") {
        url = "plugin.picking-card.frontend.detail";
      } else if (this.orderType == "groupsBuy") {
        url = "plugin.together-purchase.api.index.getTogetherData";
        json.art = "orderDetail";
      } else if (this.orderType == "grabGroup") {
        url = "plugin.snatch-regiment.api.index.getSnatchData";
        json.art = "orderDetail";
      } else if (this.orderType == "communityBuy") {
        url = "plugin.package-deliver.frontend.order.detail.index";
      } else if (this.orderType == "luck-draw") {
        url = "plugin.luck-draw.frontend.index.myPrizeDetail";
      } else {
        url = "order.detail";
      }

      $http.get(url, json, "正在获取订单").then(
        response => {
          if (response.result === 1) {
            let myData = {};
            if (that.orderType == "groupsBuy" || that.orderType == "grabGroup") {
              myData = response.data.orderDetail;
            } else {
              myData = response.data;
            }

            that.order_data = myData;
            that.order_pay_id = myData.order_pay_id;
            that.dispatch_type_id = myData.dispatch_type_id;
            // 话费慢充
            if (myData.phone_bill) {
              this.phone_bill = myData.phone_bill;
            }
            // 供应商
            if (that.orderType == "supplier") {
              console.log(myData.jurisdiction_set);
              that.jurisdiction_set = myData.jurisdiction_set;
            }
            if (myData.address) {
              // 供应商
              that.address = myData.address.address;
              that.mobile = myData.address.mobile;
              that.receiver = myData.address.realname;
            } else if (myData.address_info && !myData.address_info.address) {
              that.address = myData.address_info.store_address;
              that.mobile = myData.address_info.member_mobile;
              that.receiver = myData.address_info.member_realname;
            } else {
              that.address = myData.address_info.address;
              that.mobile = myData.address_info.mobile;
              that.receiver = myData.address_info.realname;
            }

            that.pay_type_id = myData.pay_type_id;
            if (that.orderType == "hotel") {
              that.hotel_start = myData.hotel_order.enter_at.split(" ")[0];
              that.hotel_end = myData.hotel_order.leave_at.split(" ")[0];
              that.hotel_name = myData.hotel_order.has_one_hotel.hotel_name;
              that.getDays(that.hotel_start, that.hotel_end);
            }

            if (that.orderType == "DeliveryReplenish") {
              that.service_station = myData.service_station;
            }
            if (myData.dispatch_type_id == 8) {
              that.package_deliver = myData.package_deliver;
            }

            if (!that.fun.isTextEmpty(myData.photo_order_thumbs)) {
              that.PhotoGoodsArr = myData.photo_order_thumbs;
            }
          } else {
            that.$dialog.alert({ message: response.msg }).then(() => {
              that.$router.go(-1);
            });
          }
        },
        response => {
          this.$dialog.alert({ message: response.msg });
        }
      );
    },

    lookDFData(_data) {
      console.log(_data);
      this.dfData = _data;
      this.$nextTick(() => {
        this.showDFData = true;
      });
    },

    // 退还跳转
    gotoRefund(val) {
      this.$router.push(
        this.fun.getUrl("OrderReturn", {
          id: val
        })
      );
    },

    // 退还跳转
    gotoRefundCheck(val) {
      this.$router.push(
        this.fun.getUrl("OrderReturnCheck", {
          id: val
        })
      );
    },

    // 待确定
    gotoMakeSure(val) {
      this.$router.push(
        this.fun.getUrl("OrderReturnSure", {
          id: val
        })
      );
    },
    // setting sun
    // 汇款记录
    shopRecord() {
      this.$router.push(
        this.fun.getUrl("OrderRecord", {
          order_id: this.$route.params.order_id
        })
      );
    },
    /*以下四个都是下拉快递选择相关方法*/
    seleRegional: function() {
      this.dateshow_1 = true;
    },
    onChange(picker, value, index) {},
    onCancelbtn: function(val, index) {
      this.dateshow_1 = false;
    },
    onConfirmbtn: function(val, index) {
      this.dateshow_1 = false;
      this.regional = val;
      var array = this.options;
      this.expressName = array[index];
    },

    // 时间日期
    getDays(strDateStart, strDateEnd) {
      let strSeparator = "-"; // 日期分隔符
      let oDate1, oDate2, iDays;
      oDate1 = strDateStart.split(strSeparator);
      oDate2 = strDateEnd.split(strSeparator);
      let strDateS = new Date(oDate1[0], oDate1[1] - 1, oDate1[2]);
      let strDateE = new Date(oDate2[0], oDate2[1] - 1, oDate2[2]);
      iDays = parseInt(Math.abs(strDateS - strDateE) / 1000 / 60 / 60 / 24); // 把相差的毫秒数转换为天数
      this.night_day = iDays;
    },

    // value 11 酒店确认下单
    confirmHotelOrder(api, id) {
      $http
        .get(api, { order_id: id }, "处理中...")
        .then(res => {
          if (res.result == 1) {
            that.$dialog.alert({ message: "确认下单成功" });
          } else {
            that.$dialog.alert({ message: res.msg });
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    toPacket() {
      this.$router.push(this.fun.getUrl("ConsumePacketSuccess", {}, { order_id: this.order_id }));
    },
    startRotate() {
      if (this.timer) {
        clearInterval(this.timer);
      }
      this.timer = setInterval(() => {
        this.shrinkPacket = !this.shrinkPacket;
      }, 150);
    },
    checkoutConsumePacket() {
      let order_id = this.order_id.toString().split(",");
      $http
        .post(
          "plugin.consume-red-packet.Frontend.Modules.Packet.Controllers.has.index",
          {
            order_id: order_id
          },
          "loading"
        )
        .then(
          response => {
            if (response.result == 1) {
              this.hasPacket = true;
              this.startRotate();
            }
          },
          function(response) {
            // error callback
          }
        );
    },
    //value 53 获取盲盒商品
    getBlindBoxGoods(id) {
      $http
        .get(
          "plugin.blind-box.api.index.blind-box-goods",
          {
            order_id: id
          },
          ""
        )
        .then(res => {
          console.log(res);
          if (res.result == 1) {
            this.blindBoxInfo.show=true;
            this.blindBoxInfo.goods = res.data.order;
          }
        });
    },

    goToAdress() {
      let point = this.fun.bd_decrypt(this.package_deliver.lng, this.package_deliver.lat);
      this.fun.goToWXAdress(point, this.package_deliver.deliver_name, "详细地址");
      // if (this.fun.isWeiXin()) {
      //   this.goToWXAdress(point, this.package_deliver);
      // } else {
      //   window.location.href = `https://uri.amap.com/navigation?to=${point.lng},${point.lat},${this.package_deliver.deliver_name}&mode=car&policy=1&src=mypage&coordinate=gaode&callnative=0`;
      // }
    },
    goToWXAdress(point, store) {
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
                        name: store.deliver_name, // 位置名
                        address: "详细地址", // 地址详情说明
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
                  window.location.href = `https://uri.amap.com/navigation?to=${point.lng},${point.lat},${store.deliver_name}&mode=car&policy=1&src=mypage&coordinate=gaode&callnative=0`;
                });
              } else {
                window.location.href = `https://uri.amap.com/navigation?to=${point.lng},${point.lat},${store.deliver_name}&mode=car&policy=1&src=mypage&coordinate=gaode&callnative=0`;
              }
            } else {
              window.location.href = `https://uri.amap.com/navigation?to=${point.lng},${point.lat},${store.deliver_name}&mode=car&policy=1&src=mypage&coordinate=gaode&callnative=0`;
            }
          },
          function(response) {
            console.log(response);
            window.location.href = `https://uri.amap.com/navigation?to=${point.lng},${point.lat},${store.deliver_name}&mode=car&policy=1&src=mypage&coordinate=gaode&callnative=0`;
          }
        );
    }
  },

  activated() {
    if (this.$route.params.orderType) {
      this.orderType = this.$route.params.orderType;
    } else {
      this.orderType = "shop";
    }

    this.init();
    this.getNetData(this.order_id);
    if (JSON.parse(window.localStorage.getItem("globalParameter")).consume_red_packet_status == 1) {
      // 判断消费红包开启再请求
      this.checkoutConsumePacket();
    }
  },
  components: {
    cTitle,
    cDyPopup
  }
};
