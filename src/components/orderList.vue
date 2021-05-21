<template>
  <div id="orderList">
    <van-checkbox-group v-model="checkList" @change="multiplePayChange">
      <div
        v-for="(order, index) in datasource"
        :class="orderType == 'lease_toy' && index == datasource.length - 1 ? 'Margintop shop' : 'shop'"
        :key="index"
      >
        <div class="title">
          <van-checkbox
            checked-color="#f15353"
            :name="order.id"
            v-if="status == 1 && !notShowCheck"
          >&nbsp;</van-checkbox>
          <h4 style="display: flex; word-break: keep-all;">
            <em>订单号：{{ order.order_sn }}</em>
            <span
              style="text-align: left; margin-left: 5px; align-self: center;"
              v-if="order.dispatch_type_name"
            >
              <em class="tags">{{ order.dispatch_type_name }}</em>
            </span>
          </h4>
          <span>{{ order.status_name }}</span>
        </div>
        <div
          class="shop-box"
          @click="toStore(order)"
          v-if="order.shop_name && (order.plugin_id == 0 || order.plugin_id == 92 || order.plugin_id == 31 || order.plugin_id == 32 || order.plugin_id == 44 || order.plugin_id == 54)"
        >
          <div class="shop-box-left">
            <i class="iconfont icon-fontclass-dianpu"></i>
            <p>{{ order.shop_name }}</p>
          </div>
          <i class="iconfont icon-advertise-next"></i>
        </div>
        <router-link
          :to="
            fun.getUrl(detailUrl == 'HotelOrderDetail' ? 'HotelOrderDetail' : detailUrl, {
              order_id: order.id,
              orderType: orderType
            })
          "
          v-for="(good, i) in order.has_many_order_goods"
          :key="i"
        >
          <div class="goods">
            <div class="img"><img :src="good.thumb" /></div>
            <div class="warp">
              <div class="inner">
                <div
                  class="name"
                  style="-webkit-box-orient: vertical;"
                >{{ good.title | escapeTitle }}</div>
                <div class="option">
                  <p
                    v-if="good.goods_option_title"
                    style="margin-right: 5px;"
                  >规格: {{ good.goods_option_title }}</p>
                  <div class="num" v-if="detailUrl != 'HotelOrderDetail'">×{{ good.total }}</div>
                  <div
                    class="num"
                    v-if="detailUrl == 'HotelOrderDetail'"
                  >{{ getDays(order.hotel_order.enter_at, order.hotel_order.leave_at) }}晚{{ good.total }}间</div>
                </div>
              </div>
            </div>
            <div class="price">
              <div class="money">
                <small>{{ $i18n.t("money") }}</small>
                {{ orderType == "lease_toy" ? good.price / order.has_one_lease_toy_order.return_days / good.total : good.price }}
                <span
                  v-if="order.plugin_id == 40 ? true : false"
                >/天</span>
              </div>
            </div>
          </div>
        </router-link>
        <div class="address-box" v-if="order.address && order.address.address">
          <p>{{ order.address.realname }} （{{ order.address.mobile }}）</p>
          <p>{{ order.address.address }}</p>
        </div>
        <div class="title">
          <h4 style="text-align: right;">
            共 {{ order.goods_total }}
            {{ detailUrl == "HotelOrderDetail" ? "个房间" : "件商品" }}
            实付：{{ $i18n.t("money") }}
            <b>{{ order.price }}</b>
          </h4>
        </div>
        <div class="allbt" v-if="order.button_models.length > 0">
          <template v-for="(item, i) in order.button_models">
            <span
              :key="i"
              v-if="i < 2"
              @click="operation(item, order, order.barter)"
              :class="[!item.api ? 'noClickBG' : '', item.value == 1 ? 'red-button' : '']"
            >{{ item.name }}</span>
            <span
              :key="i"
              v-if="i == 2 && order.button_models.length > 2"
              class="red-button"
              @click.stop="showMore(order.order_sn)"
            >更多</span>
            <div class="trans" :key="i" v-if="i == 2 && showID == order.order_sn"></div>
            <div class="more-button" :key="i" v-if="i == 2 && showID == order.order_sn">
              <p
                v-for="(item, i) in order.button_models"
                :key="i"
                v-if="i >= 2"
                @click="operation(item, order, order.barter)"
                :class="[!item.api ? 'noClickBG' : '']"
              >{{ item.name }}</p>
            </div>
          </template>
        </div>
      </div>
    </van-checkbox-group>

    <div class="qrcode">
      <van-popup v-model="showQrcode" position="right" modal="false">
        <div>
          <img :src="qrcode" style="width: 100%;" />
          <div style="height: 1.875rem;">请核销员扫码</div>
        </div>
      </van-popup>
    </div>

    <van-dialog
      @touchmove.native="stopmove"
      @mousemove.native="stopmove"
      v-model="dialogVisible"
      :showConfirmButton="false"
    >
      <div class="title">确认发货</div>
      <van-tabs v-model="activeName">
        <van-tab name="first" title="快递配送"></van-tab>
        <van-tab name="second" v-if="isShowDri" title="司机配送"></van-tab>
      </van-tabs>
      <div>
        <div v-show="activeName == 'first'">
          <section
            style="width: 100%; text-align: left; padding-bottom: 2.5rem; padding-top: 0.625rem;"
          >
            <div style="width: 100%;" v-if="addresseeInfo && jurisdiction_set != 1">
              <div class="addressee">收件人信息:</div>
              <div>
                <div class="user_name">
                  <span>{{ addresseeInfo.realname }}</span>
                  <span>({{ addresseeInfo.mobile }})</span>
                </div>
                <div class="user_city">{{ addresseeInfo.address }}</div>
              </div>
            </div>
            <div class="select_company">
              <div style="font-weight: bold; font-size: 15px;">快递公司:</div>
              <div class="company_right">
                <van-button plain type="primary" @click="seleRegional">{{ regional }}</van-button>
              </div>
            </div>
            <div class="input_number">
              <div style="font-weight: bold; font-size: 15px;">快递单号:</div>
              <div class="number_right">
                <van-cell-group>
                  <van-field v-model="numberName" placeholder="请输入快递单号" />
                </van-cell-group>
              </div>
            </div>
          </section>
        </div>
        <div v-show="activeName == 'second'">
          <section
            style="width: 100%; text-align: left; padding-bottom: 2.5rem; padding-top: 0.625rem;"
          >
            <div style="width: 100%;" v-if="addresseeInfo">
              <div class="addressee">收件人信息:</div>
              <div>
                <div class="user_name">
                  <span>{{ addresseeInfo.realname }}</span>
                  <span>({{ addresseeInfo.mobile }})</span>
                </div>
                <div class="user_city">{{ addresseeInfo.address }}</div>
              </div>
            </div>
            <div class="select_company" style="justify-content: flex-start;">
              <div style="font-weight: bold; font-size: 15px; width: 5rem;">配送司机:</div>
              <div class="company_right" style="text-align: left; margin-left: 0.5rem;">
                <van-button
                  style="text-align: left;"
                  plain
                  type="primary"
                  @click="driverSeleRegional"
                >{{ driverRegional }}</van-button>
              </div>
            </div>
            <div class="select_company" style="justify-content: flex-start;">
              <div style="font-weight: bold; font-size: 15px; width: 5rem;">车牌号:</div>
              <div
                class="company_right"
                style="text-align: left; margin-left: 0.5rem;"
              >{{ driverNumber }}</div>
            </div>
          </section>
        </div>
      </div>
      <div class="store_foot">
        <van-button type="default" class="btn_a" @click="sendCancel">取 消</van-button>
        <van-button type="primary" class="btn_b" @click="sendGoogs">确 定</van-button>
      </div>
    </van-dialog>
    <van-popup v-model="dateshow_1" position="bottom" :overlay="true">
      <van-search
        class="express-select-search"
        placeholder="请输入快递公司名称"
        clearable
        v-model="inputExpressCompanyName"
        v-show="columns.length > 0"
      ></van-search>
      <van-picker
        @touchmove.native="stoppao"
        @mousemove.native="stoppao"
        :columns="filterExpressCompanys"
        @change="onChange"
        @cancel="onCancelbtn"
        @confirm="onConfirmbtn"
        show-toolbar
      ></van-picker>
    </van-popup>
    <van-popup v-model="driverDateshow_1" position="bottom" :overlay="true">
      <van-picker
        @touchmove.native="stoppao"
        @mousemove.native="stoppao"
        :columns="driverColumns"
        @change="onDriverChange"
        @cancel="onDriverCancelbtn"
        @confirm="onDriverConfirmbtn"
        show-toolbar
      />
    </van-popup>
    <!-- 配送站的确认核销按钮 -->
    <van-popup v-model="showWriteOff" position="center" :overlay="true" round>
      <img :src="writeOffQR" style="width: 11.25rem; height: 11.25rem; margin: 1rem;" />
      <div style="font-size: 18px; font-weight: bold; margin-bottom: 1rem; color: #f15353;">
        请核销员扫码
      </div>
    </van-popup>
    <div class="blank" v-if="datasource.length <= 0">
      <img src="../assets/images/blank.png" />
      <span>还没有订单记录哦</span>
    </div>
    <van-dialog
      v-model="showBarter"
      title="易货兑换"
      show-cancel-button
      class="barter_dialog"
      @confirm="confirmBarter"
      @cancel="cancelBarter"
    >
      <div class="barter_dialog_1">是否确认易货兑换</div>
      <div class="barter_dialog_2">该商品可兑换易货值为{{ showBarter_value }}</div>
    </van-dialog>

		<van-overlay :show="blindBoxInfo.show" z-index="99">
      <div style="display: flex; align-items: center; justify-content: center; height: 100%;">
        <transition name="van-fade">
					<div class="blindBoxInfo" v-if="blindBoxInfo.show">
						<div class="multipleWrapper">
							<div class="desc">盲盒商品</div>
							<div class="goodsWrapper" @touchmove.stop>
                <router-link
									:to="
										fun.getUrl(detailUrl == 'HotelOrderDetail' ? 'HotelOrderDetail' : detailUrl, {
											order_id: item.id,
											orderType: orderType
										})
									"
									v-for="item in blindBoxInfo.goods"
									:key="item.id"
								>
									<div class="goodsItem">
										<div class="goodInfo">
											<div class="c1">{{item.order_sn}}</div>
											<div class="c2">{{item.status_name}}</div>
										</div>
										<div class="goodContent" v-for="item1 in item.has_many_order_goods" :key="item1.id">
											<div class="goods_img">
												<img :src="item1.thumb" alt="" />
											</div>
											<div class="content">
												<div class="name">{{item1.title}}</div>
												<div class="price">{{item1.goods_option_title}}</div>
											</div>
										</div>
									</div>
								</router-link>

							</div>
						</div>

						<div class="close">
							<i class="iconfont icon-adsystem_icon_cancle" @click="blindBoxInfo.show = false"></i>
						</div>
					</div>
        </transition>
      </div>
    </van-overlay>

  </div>
</template>
<script>
import { Toast, Search } from "vant";

export default {
  //select_inde-当前选择行,datasource-数据源,currentdata-当前选择的数据
  props: ["datasource", "status", "getAllLoaded", "orderType", "detailUrl", "notShowCheck"],
  data() {
    return {
      regional: "请选择快递公司",
      dateshow_1: false,
      columns: [],
      isShow: false,
      toi: this.fun.getKeyByI(),
      checkList: [],
      loading: false,
      allLoaded: false,
      goload: true,
      qrcode: "",
      showQrcode: false,
      //确认发货
      dialogVisible: false,
      expressName: "",
      numberName: "",
      addresseeInfo: "",
      options: [],
      orderPayId: "",
      showWriteOff: false,
      writeOffQR: "", //配送站订单确认核销 按钮展示的二维码
      //   actions:[],
      //   sheetVisible:''
      //司机配送确认发货
      isShowDri: false, //确认按钮是否显示司机配送
      driverDialogVisible: false,
      driverId: "",
      driverOptions: [],
      driverColumns: [],
      driverRegional: "请选择配送司机",
      driverDateshow_1: false,
      driverApi: "",
      driverNumber: "",
      activeName: "first",
      jurisdiction_set: "", //供应商订单是否显示会员信息
      showBarter: false,
      showBarter_value: null,
      noMoreClick: false, //防止快速点击重复触发

      showID: "",

      blindBoxInfo: {
        show: false,
        goods: [],
        //盲盒相关数据
      },
      filterExpressCompanys: [],
      inputExpressCompanyName: ""
    };
  },
  mounted() {
    console.log(this.orderType, "参数", this.datasource);
  },
  methods: {
    toStore(order) {
      if (order.plugin_id == 92) {
        this.$router.push(this.fun.getUrl("SupplierShop", { id: order.id, fromHome: 1 }, { fromOrder: 1 }));
      } else if (order.plugin_id == 31 || order.plugin_id == 32) {
        this.$router.push(this.fun.getUrl("o2oStore_v2", { store_id: order.id, fromHome: 1 }, { fromOrder: 1 }));
      } else if (order.plugin_id == 54 && order.has_one_team_member.store_id) {
        this.$router.push(this.fun.getUrl("o2oStore_v2", { store_id: order.has_one_team_member.store_id, fromHome: 1 }));
      } else if (order.plugin_id == 0) {
        this.$router.push(this.fun.getUrl("home"));
      }
    },
    showMore(order_sn) {
      if (this.showID == order_sn) {
        this.showID = "";
      } else {
        this.showID = order_sn;
      }
    },
    setCheckList() {
      this.checkList = [];
    },
    operation(btn, order, barter) {
      // btn = {name: "确认发货", value: 24, api: "plugin.supplier.frontend.order.cancel-send"};

      if (!btn.api) {
        if (btn.value == "expediting_delivery") {
          Toast("已提醒过商家");
        } else {
          //接口没有返回按钮点击请求的地址
          Toast("error:错误4008820");
        }
        return;
      }

      this.orderPayId = order.id;
      if (btn.value == 8 || btn.value == "snatch_regiment_express") {
        this.checklogistics(order, btn);
      } else if (btn.value == 51) {
        // 查看卡券
        this.$router.push(this.fun.getUrl("cpsPwd", {order_id:order.id}));
      } else if (btn.value == 12) {
        this.deleteOrder(order, btn);
      } else if (btn.value == 10) {
        this.comment(order, btn);
      } else if (btn.value == 1 || btn.value == "snatch_regiment_pay") {
        this.toPay(order, btn);
      } else if (btn.value == 13 || btn.value == 54 || btn.value == "snatch_regiment_refund") {
        //退款
        this.toRefund(order, btn);
      } else if (btn.value == 101) {
        this.applyRefund(order, btn);
      } else if (btn.value == 9) {
        //取消订单
        this.cancleOrder(order, btn);
      } else if (btn.value == 5) {
        //确认订单
        this.confirmOrder(order, btn);
      } else if (btn.value == 99) {
        this.confirmOrder_dragon(order, btn);
      } else if (btn.value == 18) {
        //退款中
        this.toRefundDetail(order, btn);
      } else if (btn.value == "cashierPay") {
        //退款中
        this.cashPayOrder(order, btn);
      } else if (btn.value == "verification_code") {
        this.verification(order, btn);
      } else if (btn.value == 20) {
        this.verificationCash(order, btn);
      } else if (btn.value == 21) {
        // console.log('转账信息',order);
        this.$router.push(
          this.fun.getUrl("OrderRecord", {
            order_id: order.id
          })
        );
      } else if (btn.value == 22 || btn.value === "delivery_station_pay" || btn.value === "service_station_pay") {
        // 确认支付
        this.publicMessage(order, btn, "支付");
      } else if (btn.value == 23 || btn.value == 60) {
        // 确认发货
        if (order.dispatch_type_id == 3) {
          this.sendGoogs();
        } else {
          this.getCompany();
          this.dialogVisible = true;
        }
        this.expressName = "";
        this.numberName = "";
        if (JSON.parse(window.localStorage.getItem("globalParameter")).delivery_driver_open == "1" && (this.orderType == "supplier" || this.orderType == "store")) {
          this.isShowDri = true;
          this.driverId = "";
          this.driverNumber = "";
          this.driverRegional = "请选择配送司机";
          this.driverApi = btn.api;
          this.supplierDriverSend();
          // this.driverDialogVisible = true;
        }
      } else if (btn.value == 24 || btn.value == 61 || btn.value === "service_station_cancel_send") {
        //取消发货
        this.publicMessage(order, btn, "取消发货");
      } else if (btn.value == 25 || btn.value === "delivery_station_complete" || btn.value === "service_station_complete") {
        //确认收货
        this.publicMessage(order, btn, "收货");
      } else if (btn.value == 26 || btn.value === "delivery_station_close" || btn.value === "service_station_close") {
        //关闭订单
        this.publicMessage(order, btn, "关闭");
      } else if (btn.value == 27) {
        this.evaluate(order, btn);
      } else if (btn.value == 28) {
        //卡密
        this.truckList(btn, order);
      } else if (btn.value == 41) {
        //398售后
        window.location.href = btn.api;
      } else if (btn.value == 50) {
        //查看发票
        this.checkInvoice(btn, order);
      } else if (btn.value == 11) {
        //酒店确认下单
        this.confirmHotelOrder(btn.api, order.id);
      } else if (btn.value == "coupon") {
        //分享优惠券
        this.$router.push(this.fun.getUrl("couponShare", { order_id: order.id }));
      } else if (btn.value === "check_out") {
        this.publicMessage(order, btn, "退房");
      } else if (btn.value === "clerk_code" || btn.value === "package_deliver") {
        //确认核销
        this.confirmWriteOff(order, btn);
      } else if (btn.value === "service_station_send") {
        //服务站的确认发货
        this.getCompany();
        this.dialogVisible = true;
        this.expressName = "";
        this.numberName = "";
      } else if (btn.value == "lease_toy_refund" || btn.value == "package_deliver_clerk") {
        // 申请退还
        this.getReturn(btn, order);
      } else if (btn.value == "lease_toy_apply_adopt") {
        // 填写归还
        console.log("填写归还啊啊啊啊");
        this.$router.push(this.fun.getUrl("OrderReturn", { id: order.id }));
      } else if (btn.value == "lease_toy_return_info") {
        // 归还详情
        this.$router.push(this.fun.getUrl("orderruturninfo", { id: order.id }));
      } else if (btn.value == "hotel_supply") {
        this.$router.push(this.fun.getUrl("hotelOrder", { id: order.id }));
      } else if (btn.value == "expediting_delivery") {
        this.publicMessage(order, btn, "提醒商家发货");
      } else if (btn.value == "snatch_regiment_barter") {
        // 抢团易货兑换
        this.showBarter = true;
        this.showBarter_value = barter;
      } else if (btn.value == 53) {
        this.getBlindBoxGoods(order.id);
      } else {
        this.publicMessage(order, btn, "");
      }
    },
    confirmBarter() {
      let that = this;
      $http.get("plugin.snatch-regiment.api.order.barter", { order_id: that.orderPayId }).then(
        function (response) {
          if (response.result == 1) {
            that.$notify({
              background: "#f0f9eb",
              message: `易货兑换成功`,
              color: "#67c23a"
            });
            that.$emit("ConfrimOrderNotification", "pay");
          } else {
            that.$dialog.alert({ message: response.msg });
          }
        },
        function (response) {
          console.log(response);
        }
      );
    },
    cancelBarter() {
      this.showBarter = false;
      this.showBarter_value = null;
    },
    //司机配送确认发货
    supplierDriverSend() {
      var that = this;
      var urls = "plugin.delivery-driver.home.delivery-info.get-driver-list";
      if (that.noMoreClick) {
        return;
      }
      that.noMoreClick = true;
      $http.get(urls, {}).then(
        function (response) {
          console.log("oo++3", response);
          that.noMoreClick = false;
          if (response.result == 1) {
            that.driverOptions = [];
            that.driverOptions = response.data;
            var arrayOfSquares = that.driverOptions.map(function (item) {
              return item.driver_name + "(" + item.user_phone + ")";
            });
            that.driverColumns = arrayOfSquares;
          } else {
            that.$dialog.alert({ message: response.msg });
          }
        },
        function (response) {
          that.noMoreClick = false;
          console.log(response);
        }
      );
    },
    /*以下四个都是下拉司机配送选择相关方法*/
    driverSeleRegional: function () {
      this.driverDateshow_1 = true;
    },
    onDriverChange(picker, value, index) {},
    onDriverCancelbtn: function (val, index) {
      this.driverDateshow_1 = false;
    },
    onDriverConfirmbtn: function (val, index) {
      var array = this.driverOptions;
      this.driverDateshow_1 = false;
      this.driverRegional = val;
      this.driverNumber = array[index].license_number;
      this.driverId = array[index].id;
    },
    //司机配送确认发货取消
    driverSendCancel() {
      this.driverDialogVisible = false;
    },
    //查看发票
    checkInvoice(btn, order) {
      this.$router.push(this.fun.getUrl("Invoice", { order_id: order.id }));
    },
    //卡密
    truckList(btn, order) {
      this.$router.push(this.fun.getUrl("TruckList", { order_id: order.id }));
    },
    // 评价
    evaluate(order, btn) {
      this.$router.push(
        this.fun.getUrl("DeliveryEvaluate", {
          order_id: order.id,
          api: btn.api,
          name: "distributor"
        })
      );
    },
    // 申请归还的操作
    getReturn(btn, order) {
      let that = this;
      if (this.noMoreClick) {
        return;
      }
      that.noMoreClick = true;
      $http.get(btn.api, { order_id: order.id }).then(res => {
        that.noMoreClick = false;
        if (res.result == 1) {
          that.$dialog.alert({ message: res.msg });

          that.$emit("ConfrimOrderNotification");
        } else {
          that.$dialog.alert({ message: res.msg });
        }
      });
    },

    publicMessage(order, btn, text) {
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
            function (response) {
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
            function (response) {
              that.noMoreClick = false;
              console.log(response);
            }
          );
        })
        .catch(() => {});
    },

    confirmWriteOff(order, btn) {
      var that = this;
      let url = "";
      if (btn.value == "clerk_code") {
        url = "plugin.delivery-station.frontend.order.detail.qr-code-url";
      } else if (btn.value == "package_deliver") {
        url = btn.api;
      }
      $http.get(url, { order_id: order.id }, "正在获取核销码").then(
        function (response) {
          if (response.result == 1) {
            if (btn.value == "clerk_code") {
              that.writeOffQR = response.data.qrcode_url;
            } else if (btn.value == "package_deliver") {
              that.writeOffQR = response.data.qr_code_url;
            }
            that.showWriteOff = true;
          } else {
            that.$dialog.alert({ message: response.msg });
          }
        },
        function (response) {
          console.log(response);
        }
      );
    },
    //获取快递公司
    getCompany(btn) {
      let that = this;
      let urls = "";
      if (this.orderType == "supplier") {
        urls = "plugin.supplier.frontend.order.express-company";
      } else if (this.orderType == "serviceReplenish") {
        urls = "plugin.service-station.frontend.order-list.express";
      } else if (this.orderType == "auction") {
        urls = "plugin.auction.api.sendOrder";
      } else if (this.orderType == "auctioneer") {
        urls = "plugin.auction.api.sendOrder";
      } else if (this.orderType == "subsidiary") {
        urls = "plugin.subsidiary.frontend.order.express-company";
      } else {
        urls = "plugin.store-cashier.frontend.store.center.sendOrder";
      }
      if (that.noMoreClick) {
        return;
      }
      that.noMoreClick = true;
      $http.get(urls, { order_id: that.orderPayId }).then(
        function (response) {
          console.log("oo++3", response);
          that.noMoreClick = false;
          if (response.result == 1) {
            if (that.orderType == "supplier") {
              that.jurisdiction_set = response.data.jurisdiction_set;
            }
            that.options = [];
            that.options = response.data.express_companies;
            let arrayOfSquares = that.options.map(function (item) {
              return item.name;
            });
            that.columns = arrayOfSquares;
            that.filterExpressCompanys = arrayOfSquares;
            that.addresseeInfo = response.data.address;
          } else {
            that.$dialog.alert({ message: response.msg });
          }
        },
        function (response) {
          that.noMoreClick = false;
          console.log(response);
        }
      );
    },
    //快递公司选择监听
    selectCompany(value) {
      console.log(value, this.expressName);
    },
    //确认发货取消
    sendCancel() {
      this.dialogVisible = false;
    },
    //确认发货
    sendGoogs() {
      var that = this;
      // if (that.expressName == "" && that.numberName == "") {
      //   that.$notify("请选择快递公司和输入快递单号");
      //   return;
      // } else if (that.expressName == "") {
      //   that.$notify("请选择快递公司");
      //   return;
      // } else if (that.numberName == "") {
      //   that.$notify("请输入快递单号");
      //   return;
      // }
      let json = {};
      if (this.isShowDri && that.activeName == "second") {
        json.order_id = that.orderPayId;
        json.dispatch_type_id = 7;
        json.driver_id = that.driverId;
      } else {
        json.order_id = that.orderPayId;
        json.express_code = that.expressName.value;
        json.express_company_name = that.expressName.name;
        json.express_sn = that.numberName;
      }
      let _urls = "";
      if (this.orderType == "supplier") {
        _urls = "plugin.supplier.frontend.order.send";
      } else if (this.orderType == "serviceReplenish") {
        _urls = "plugin.service-station.frontend.order.order-operation.send";
      } else if (this.orderType == "subsidiary") {
        _urls = "plugin.subsidiary.frontend.order.send";
      } else if (this.orderType == "auction") {
        _urls = "plugin.auction.api.order-operation.send";
      } else if (this.orderType == "auctioneer") {
        _urls = "plugin.auction.api.order-operation.send";
      } else {
        _urls = "plugin.store-cashier.frontend.store.center.order-operation.send";
      }

      if (that.noMoreClick) {
        return;
      }
      that.noMoreClick = true;
      $http.get(_urls, json).then(
        function (response) {
          that.noMoreClick = false;
          if (response.result == 1) {
            that.dialogVisible = false;
            that.$emit("ConfrimOrderNotification", "pay");
            that.$notify({
              background: "#f0f9eb",
              message: "发货成功",
              color: "#67c23a"
            });
          } else {
            that.$dialog.alert({ message: response.msg });
          }
        },
        function (response) {
          that.noMoreClick = false;
          console.log(response);
        }
      );
    },
    //多订单合并支付的响应方法
    multiplePayChange(value) {
      this.$emit("MultiplePayNotification", this.checkList);
    },
    toDetail(order) {
      this.$emit("ToDetailNotification", order);
    },

    //查看物流
    checklogistics(item, btn) {
      //回放轨迹
      console.log(JSON.parse(window.localStorage.getItem("globalParameter")).delivery_driver_open);

      if (item.dispatch_type_id == 7 && JSON.parse(window.localStorage.getItem("globalParameter")).delivery_driver_open == "1") {
        this.$router.push(
          this.fun.getUrl("track", {
            id: item.id
          })
        );
      }
      if (item.is_all_send_goods == 0) {
        this.$router.push(
          this.fun.getUrl("logistics", {
            id: item.id,
            fromGrab: 1,
            api: btn.api
          })
        );
      } else {
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
          // this.datasource.splice(this.datasource.indexOf(item), 1);
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
          // this.datasource.splice(this.datasource.indexOf(item), 1);
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
    //取消订单
    cancleOrder(item, btn) {
      this.$dialog
        .confirm({ message: "确定取消此订单?" })
        .then(() => {
          //删除当前选中的地址
          this.datasource.splice(this.datasource.indexOf(item), 1);
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
    //删除订单
    deleteOrder(item, btn) {
      this.$dialog
        .confirm({ message: "确定删除此订单?" })
        .then(() => {
          //删除当前选中的地址
          this.datasource.splice(this.datasource.indexOf(item), 1);
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
      //status-2合并支付 type-1订单支付
      if(item.plugin_id == 71){
        this.$router.push(
          this.fun.getUrl(
            "orderpay",
            {
              status: 2,
              order_ids: item.id,
              iscps:true
            },
            { api: btn.api }
          )
        );
        return;
      }
      this.$router.push(
        this.fun.getUrl(
          "orderpay",
          {
            status: 2,
            order_ids: item.id
          },
          { api: btn.api }
        )
      );
    },
    //评价订单
    comment(item, btn) {
      this.$router.push(
        this.fun.getUrl("comment", {
          order: item
        })
      );
    },
    //确认收货
    confirmOrder(item, btn) {
      this.$dialog
        .confirm({ message: btn.name })
        .then(() => {
          //this.$emit('ConfrimOrderNotification');
          //调用接口通知服务器收到货物请求
          var that = this;
          if (that.noMoreClick) {
            return;
          }
          that.noMoreClick = true;
          $http
            .get(
              btn.api,
              {
                order_id: item.id
              },
              "操作中..."
            )
            .then(
              function (response) {
                that.noMoreClick = false;
                if (response.result == 1) {
                  that.$emit("ConfrimOrderNotification", item);
                } else {
                  that.$dialog.alert({ message: response.msg });
                }
              },
              function (response) {
                // error callback
                that.noMoreClick = false;
              }
            );
        })
        .catch(() => {});
    },
    //龙存管公共支付方法
    dragonPay(item) {
      let obj = item.form_data;
      var form = document.createElement("form");
      form.method = "post";
      form.setAttribute("action", item.action_url);
      let arr = ["INFO", "BODY", "SIGN", "CONTENTTYPE"];
      for (let i of arr) {
        let a = document.createElement("input");
        a.setAttribute("name", i);
        a.setAttribute("value", obj[i]);
        form.appendChild(a);
      }
      document.body.appendChild(form);
      form.style.display = "none";
      form.submit();
      return form;
    },
    //龙存管确认收货
    confirmOrder_dragon(item, btn) {
      this.$dialog
        .confirm({ message: btn.name })
        .then(() => {
          //this.$emit('ConfrimOrderNotification');
          //调用接口通知服务器收到货物请求
          var that = this;
          if (that.noMoreClick) {
            return;
          }
          that.noMoreClick = true;
          $http
            .get(
              btn.api,
              {
                order_id: item.id
              },
              "操作中..."
            )
            .then(
              function (response) {
                that.noMoreClick = false;
                if (response.result == 1) {
                  that.dragonPay(response.data);
                  that.$emit("ConfrimOrderNotification", item);
                } else {
                  that.$dialog.alert({ message: response.msg });
                }
              },
              function (response) {
                that.noMoreClick = false;
                // error callback
              }
            );
        })
        .catch(() => {});
    },
    //追加评价
    reCommend(item, btn) {},
    toRefundDetail(item, btn) {
      this.$router.push(
        this.fun.getUrl("aftersales", {
          refund_id: item.refund_id
        })
      );
    },
    //退款
    toRefund(item, btn) {
      //refund
      if (btn.value == "snatch_regiment_refund") {
        this.$router.push(
          this.fun.getUrl("refund", {
            order_id: item.id,
            order_type: 3
          },{value:btn.value})
        );
      } else {
        this.$router.push(
          this.fun.getUrl("refund", {
            order_id: item.id,
            order_type: 1
          },{value:btn.value})
        );
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
    sentRequest(action, params, isIndicator) {
      let that = this;
      if (that.noMoreClick) {
        return;
      }
      that.noMoreClick = true;
      $http.get(action, params, "").then(
        function (response) {
          that.noMoreClick = false;
          console.log("显示", response);
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
        function (response) {
          that.noMoreClick = false;
          // error callback
        }
      );
    },
    sheetAction() {
      console.log(this.sheetVisible);
    },
    //更新
    loadTop() {
      // this.initData();
      // this.getOrderList(this.selected);
      alert("刷新");
      this.$refs.loadmore.onTopLoaded();
    },
    // 加载更多
    loadBottom() {
      console.log("加载更多");
      this.$refs.loadmore.onBottomLoaded();
      //this.allLoaded = true;// 若数据已全部获取完毕,不在显示加载更多组件
      if (this.getAllLoaded) {
        this.allLoaded = false;
      } else {
        this.allLoaded = true;
      }
    },
    /*以下四个都是下拉快递选择相关方法*/
    seleRegional: function () {
      this.dateshow_1 = true;
    },
    onChange(picker, value, index) {},
    onCancelbtn: function (val, index) {
      this.dateshow_1 = false;
      setTimeout(() => {
        this.inputExpressCompanyName = "";
      }, 100);
    },
    onConfirmbtn: function (val, index) {
      this.dateshow_1 = false;
      this.regional = val ? val : "请选择快递公司";

      let array = this.options.filter(item => {
        return item.name == val;
      });
      if(array.length > 0) {
        this.expressName = array[0];
      }else {
        this.expressName = {};
      }
      setTimeout(() => {
        this.inputExpressCompanyName = "";
      }, 100);
    },
    stopmove(e) {
      e.preventDefault();
      e.stopPropagation();
    },
    stoppao(e) {
      e.stopPropagation();
    },

    //酒店时间转换
    //时间日期
    getDays(strDateStart, strDateEnd) {
      let start = strDateStart.split(" ");
      let end = strDateEnd.split(" ");
      let strSeparator = "-"; //日期分隔符
      let oDate1, oDate2, iDays;
      oDate1 = start[0].split(strSeparator);
      oDate2 = end[0].split(strSeparator);
      let strDateS = new Date(oDate1[0], oDate1[1] - 1, oDate1[2]);
      let strDateE = new Date(oDate2[0], oDate2[1] - 1, oDate2[2]);
      iDays = parseInt(Math.abs(strDateS - strDateE) / 1000 / 60 / 60 / 24); //把相差的毫秒数转换为天数
      console.log(iDays);
      return iDays;
    },

    //value 11 酒店确认下单
    confirmHotelOrder(api, id) {
      let that = this;
      if (that.noMoreClick) {
        return;
      }
      that.noMoreClick = true;
      $http
        .get(api, { order_id: id }, "处理中...")
        .then(res => {
          that.noMoreClick = false;
          if (res.result == 1) {
            that.$dialog.alert({ message: res.msg });
            this.reload();
          } else {
            that.$dialog.alert({ message: res.msg });
          }
        })
        .catch(error => {
          that.noMoreClick = false;
          console.log(error);
        });
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
    }
  },
  watch: {
    inputExpressCompanyName(newVal) {
      let res = this.columns.filter(val => {
        return val.indexOf(newVal) !== -1;
      });
      this.filterExpressCompanys = res;
    }
  },
  inject: ["reload"],
  components: {
    VanSearch: Search
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#orderList {
  .blank {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    img {
      width: 6rem;
      height: 6rem;
    }

    span {
      margin-top: 15px;
      color: #ccc;
      font-size: 14px;
    }
  }

  .mint-navbar .mint-tab-item {
    padding: 0.875rem 0;
  }

  .van-dialog {
    width: 80%;
    height: 25rem;
    padding-bottom: 3.125rem;
    padding-top: 3.125rem;

    .van-dialog__content {
      padding-bottom: 1.25rem;

      section {
        height: 16rem;
        padding: 0 0.75rem;
        font-size: 14px;
        overflow-y: scroll;

        .van-button--plain.van-button--primary {
          color: #1989fa;
          width: 100%;
          text-align: right;
        }

        .van-button--normal {
          padding: 0;
        }

        .van-cell {
          padding: 0.875rem 0;
        }

        .van-hairline--top-bottom::after {
          border-width: 0;
        }
      }

      .title {
        line-height: 3.125rem;
        font-weight: bold;
        padding: 0 0.75rem 0 0.75rem;
        position: fixed;
        top: 0;
        width: 100%;
        background: #fff;
        border-bottom: solid 1px #ebebeb;
      }

      .addressee {
        font-size: 15px;
        font-weight: bold;
        min-height: 1.875rem;
        line-height: 1.875rem;
      }

      .user_name {
        width: 100%;
        min-height: 1.5rem;
        line-height: 1.5rem;
        overflow: visible;
        color: #8c8c8c;
      }

      .user_city {
        width: 100%;
        overflow: visible;
        line-height: 1.5rem;
        color: #8c8c8c;
        margin-bottom: 0.625rem;
      }

      .select_company,
      .input_number {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        height: 2.875rem;
        line-height: 2.8125rem;

        .company_right,
        .number_right {
          width: 60%;
          text-align: right;
          height: 2.875rem;
          border-bottom: solid 0.0625rem #ebebeb;
        }
      }

      .store_foot {
        width: 100%;
        position: fixed;
        bottom: 0;
        display: flex;

        .van-button {
          width: 50%;
          height: 3.125rem;
          background: #fff;
          font-size: 16px;
        }

        .btn_b {
          color: #1989fa;
          border-left: solid 0.0625rem #ebebeb;
          border-top: solid 0.0625rem #ebebeb;
        }

        .btn_a {
          border-top: solid 0.0625rem #ebebeb;
        }
      }
    }
  }
}

.olis {
  height: 100vh;
}

.Margintop {
  margin-bottom: 3.75rem;
}

.shop {
  background: #fff;
  margin: 0.625rem;
  border-radius: 10px;
  border-bottom: 0.0625rem solid #ebebeb;
  border-top: 0.0625rem solid #ebebeb;

  a {
    color: #000;
  }

  .title::after {
    content: "";
    display: block;
    clear: both;
  }

  .title {
    padding: 0 0.5rem;
    display: flex;
    align-items: center;

    h4 {
      text-align: left;
      font-weight: normal;
      line-height: 2.25rem;
      flex: 9;
      font-size: 14px;
      margin-left: 5px;
      color: #666;

      b {
        font-size: 18px;
      }
    }

    span {
      color: #f15353;
      text-align: right;
      margin-right: 0.0625rem;
      flex: 2;
      font-size: 14px;
    }

    .tags {
      font-size: 12px;
      background-color: #fcbc07;
      color: #fff;
      border-radius: 8px;
      padding: 3px 6px;
    }
  }

  span.del {
    border-radius: 0.875rem;
    border: 0.0625rem solid #f15353;
    text-align: center;
    padding: 0.25rem 0.625rem;
    font-size: 12px;
  }

  .shop-box {
    display: flex;
    padding: 0.3rem 0.6rem;
    line-height: 28px;

    .shop-box-left {
      display: flex;
      width: 90%;

      p {
        font-size: 16px;
        font-weight: bold;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    .icon-fontclass-dianpu {
      font-size: 26px;
      color: #f15353;
    }

    .icon-advertise-next {
      font-size: 26px;
      color: #bdbdbd;
      flex: 0 0 30px;
    }
  }

  .address-box {
    padding: 0.3rem 0.875rem;
    text-align: left;
    color: #909090;
  }

  .allbt {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    border-top: 0.0625rem solid #ebebeb;
    padding-right: 0.875rem;
    padding-top: 0.5rem;
    flex-wrap: wrap;
    position: relative;

    span {
      min-width: 65px;
      border-radius: 15px;
      border: 0.0625rem solid #666;
      margin-left: 0.625rem;
      padding: 0.25rem 0.625rem;
      text-align: center;
      font-size: 12px;
      margin-bottom: 0.5rem;
    }

    .red-button {
      border: 0.0625rem solid #f14e4e;
      background-color: #f14e4e;
      color: #fff;
    }

    .noClickBG {
      border: 0.0625rem solid #e8e8e8;
      background: #e8e8e8;
      color: #999;
    }

    .trans {
      position: absolute;
      right: 1.875rem;
      bottom: 2.5rem;
      width: 0;
      height: 0;
      border-width: 0.8rem 0.8rem 0;
      border-style: solid;
      border-color: #f5f5f5 transparent transparent;
    }

    .more-button {
      position: absolute;
      border: solid 1px #e2e2e2;
      width: 70px;
      border-radius: 5px;
      background: #fff;
      right: 0.875rem;
      bottom: 3.2rem;

      p {
        padding: 0.3rem 0.1rem;
        border-top: 1px solid #e2e2e2;
      }
    }
  }

  .goods::after {
    content: "";
    display: block;
    clear: both;
  }

  .goods {
    width: 100%;
    box-sizing: border-box;

    /* background: #fafafa; */
    .img {
      padding: 0.625rem;

      /* flex: 1; */
      width: 30%;
      float: left;
      display: inline-block;

      /* background:blue; */
      img {
        width: 100%;
      }
    }

    .warp {
      width: 69%;
      padding: 0.625rem 1rem 0.625rem 0;
      float: left;
      display: inline-block;

      .inner {
        float: left;
        box-sizing: border-box;
        text-align: left;

        .name {
          font-size: 14px;
          text-align: left;
          color: #333;
          margin-bottom: 0.625rem;
          height: 2.5rem;
          line-height: 1.25rem;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .num {
          font-size: 14px;
          color: #333;
        }
      }
    }

    .price {
      font-size: 14px;
      text-align: right;
      color: #333;
      padding: 0.625rem;

      small {
        font-size: 12px;
      }
    }

    .option {
      color: #888;
      font-size: 12px;
      flex: 1;
      display: flex;
      line-height: 14px;
    }
  }

  #tbs {
    display: flex;
    align-items: center;
    background: #fff;
    flex-flow: row wrap;
    padding: 0.625rem;
    line-height: 1.5rem;
    border-bottom: 0.0625rem solid #d9d9d9;

    .left {
      text-align: left;
      flex: 50%;
      color: #858585;
    }

    .right {
      text-align: right;
      flex: 50%;
    }

    .add {
      color: #259b24;
    }

    .reduce {
      color: #e51c23;
    }
  }
}

.barter_dialog {
  height: auto !important;
  padding: 0 !important;

  .barter_dialog_1 {
    padding: 0.875rem 0;
    font-size: 1rem;
    font-weight: bold;
    color: #000;
  }

  .barter_dialog_2 {
    padding: 0.5rem 0;
    font-size: 0.875rem;
    color: #ee0a24;
  }
}

.blindBoxInfo {
  .close {
    height: 4rem;
    display: flex;
    align-items: flex-end;
    justify-content: center;

    .icon-adsystem_icon_cancle {
      font-size: 3rem;
      color: #fff;
      width: 3rem;
      height: 3rem;
    }
  }

  .multipleWrapper {
    width: 18.906rem;
    height: 22.25rem;
    background: url(https://www.yunzmall.com/min_img/blindToast.png);
    background-size: 100% 100%;

    .desc {
      padding-top: 1.45rem;
      padding-bottom: 0.906rem;
      font-size: 0.938rem;
      color: #fff;
    }

    .goodsWrapper {
      margin: 0 auto;
      padding: 0 0.1rem;
      width: 16.031rem;
      height: 17.6rem;
      border-radius: 0.625rem;
      overflow: scroll;

      .goodsItem {
        width: 100%;
        margin-bottom: 0.6rem;
        background-color: #fff;
        border-radius: 0.313rem;

        .goodInfo {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.531rem 0.469rem;
          font-size: 0.625rem;

          .c1 {
            color: #666;
          }

          .c2 {
            color: #f14e4e;
          }
        }

        .goodContent {
          display: flex;
          padding-bottom: 0.5rem;

          .goods_img {
            height: 3.125rem;
            padding: 0 0.5rem;
            border-radius: 0.125rem;

            img {
              width: 3.125rem;
              height: 3.125rem;
              border-radius: 0.125rem;
            }
          }

          .content {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 3.125rem;
            padding-right: 1.3rem;
            text-align: left;

            .name {
              font-size: 0.75rem;
              color: #333;
              font-weight: bold;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
            }

            .price {
              font-size: 0.625rem;
              color: #666;
            }
          }
        }
      }
    }
  }
}
</style>

<style>
.express-select-search.van-search .van-cell {
  align-items: center;
  padding: 0;
}

.express-select-search .van-field__control {
  text-align: center !important;
}
</style>
