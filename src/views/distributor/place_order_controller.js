// import { mapState, mapMutations } from "vuex";
import { Toast } from 'vant';
// import District from "src/gov_province_city_area_id";
import yzAddressList from "components/ui_components/yz_addressList/index";

const TAG_ACTION_CART = "channel_freedom"; // 渠道商（自由发货）购物车结算
var _root_tag = ""; // 0 直接购买 1购物车结算
// var _goodsId = "";
// var _optionsId = "";
// var _total = 1;
var currentAddId = "";
var currentAddress = {};
var _cart_ids = [];
// var _packagJson = {};

var clicktag = 0;

export default {
  data() {
    return {
      radio1: "1",
      show1: false,
      order_data: "",
      integral: window.localStorage.integral,
      onclast: false,
      goodsInfo: {},
      order: {},
      realname: "", // 收件人
      mobile: "",
      address: "",
      goods: [],
      goods_price: 0,
      dispatch_price: 0,
      price: 0,
      discount_price: 0,
      popupSpecs: false,
      showAddress: false,
      addressData: [],

      // 优惠券
      popupCouponSpecs: false,
      coupon_size: 0,
      checkCouponList: [],
      use_coupon_size: 0,

      // 积分抵扣 其他抵扣
      checkDeductionList: [],

      // 新增地址v2------------------------------------------------新增地址v2//
      form: {
        username: "",
        mobile: "",
        province: "",
        city: "",
        district: "",
        street: "",
        address: "",
        isDefault: false
      },
      district: district, // 地址本地数据
      popAddAddress: false,
      addressShow: false,
      addressName: "", // 地址区域
      strShow: false, // 街道显示
      streetShow: false, // 街道pop
      // 新增地址v2------------------------------------------------新增地址v2//

      // 跨境
      isTaxGoods: false,
      member_name: "",
      member_card: "",
      popupMemberSpecs: false,
      explain_title: "",
      explain_content: "",

      // O2O部分
      storeCarts: [],
      store_id: 0,
      selected: 0,
      store_info: {},
      linkinfo: {
        mobile: "",
        name: ""
      },
      dispatch: [],

      // 个人信息和修改
      myRealname: "",
      myIdcard: "",
      showMyinfo: false,

      // 租赁商品标识
      isRent: false,

      // 权益商品选择列表
      checkList: [],

      // 是否选择权益商品
      isRightChoose: false,

      // 租期
      rentTime: [],

      // 可以免租的件数
      rentFree: "",

      // 是否开启会员权益开关
      isOpenRight: false,

      currentIndex: "999",

      // 同意租赁协议
      agreement: false,

      agreementShow: false,

      // 是否显示支付协议
      AgreementPay: "",
      // 同意支付协议
      agreementPay: false,
      // 支付协议
      agreementPayShow: false,

      // 租赁协议
      agreeCon: {},

      // 免押件数
      rent_deposit_free: 0,

      // 免租件数

      rent_free: 0,

      // 优惠券标识

      cup_notice: true,
      submit_active: true,
      isResize: false,

      defaultAddress: {},
      create: true,

      // 留言
      note: [],

      // 发票
      isShowInvoice: true,
      // showInvoiceTitle: '',
      // invoicename: '',
      // companyname: '',
      invoice_status: true,
      papery_status: "",
      electron_status: "",
      person_status: true,
      unit_status: false,
      iscur: true,
      iscur_b: false,
      iscur_c: true,
      iscur_d: false,
      // invoiceType: "",
      invoice_list: {
        call: "",
        company_number: ""
      },
      show_address: true,
      recipient_name: "",
      recipient_mobile: "",

      // 续费商品
      goods_id: "",
      // 添加的name
      priceInfo: {},
      dispatchInfo: {},
      deductionInfo: {},
      total_items: [],
      discount_amount_items: [],
      popupDistribution: false, //配送站弹窗是否显示

      //判断是否已经请求了支付协议接口
      isGetAgreementPay: false,

      //服务费
      service: {},
    };
  },

  activated() {
    this.initData();
    // 接收参数
    _root_tag = this.$route.params.tag;

    console.log("_root_tag", _root_tag);
    if (this.fun.isTextEmpty(_root_tag)) {
      // 为空跳回
      this.$router.push(this.fun.getUrl("home", {}));
    }

    if (_root_tag == TAG_ACTION_CART) {
      _cart_ids = this.$route.params.cart_ids;
      this.getDataActionCart(); // 购物车结算
    }

    this.getParams();
    this.isTaxGoods = false;
  },

  mounted() {
    this.popupSpecs = false;
    this.showAddress = false;
  },
  methods: {
    //初始化数据
    initData() {
      this.submit_active = true;
      //地址清空
      this.realname = "";
      this.mobile = "";
      this.address = "";

      this.linkinfo = {
        mobile: "",
        name: ""
      };

      this.order_data = [];
      this.defaultAddress = {};

      this.store_info = {};
      this.storeCarts = [];
      this.store_id = 0;
      this.selected = 0;
      this.popupSpecs = false;
      this.showAddress = false;
      this.goodsInfo = {};
      this.order = {};
      this.dispatch = [];
      this.addressData = [];
      this.isResize = false;

      this.isRent = false;
      this.AgreementPay = "";

      this.checkList = [];

      this.isRightChoose = false;

      this.rentTime = [];

      this.rentFree = "";

      this.isOpenRight = false;

      this.agreement = false;
      this.agreementPay = false;

      this.agreementShow = false;
      this.agreementPayShow = false;

      this.agreeCon = {};

      this.note = [];

      // 优惠券
      this.popupCouponSpecs = false;
      this.coupon_size = 0;
      this.use_coupon_size = 0;
      this.checkCouponList = [];
      this.coupons = [];

      // 抵扣
      this.checkDeductionList = [];

      // 新增地址v2------------------------------------------------新增地址v2//
      this.popAddAddress = false;
      this.addressShow = false;
      this.strShow = false;
      this.addressName = "";
      this.streetShow = false;
      // 新增地址v2------------------------------------------------新增地址v2//

      this.dispatch = [];
      this.dispatchName = {
        1: "快递",
        2: "上门自提",
        3: "送货上门"
      };

      // 续费商品
      this.goods_id = "";

      this.isGetAgreementPay = false;

      currentAddId = "";
      currentAddress = {};

      _cart_ids = [];
    },

    // 整合了发票、是否显示个人信息接口
    getParams(cart_ids) {
      let json = {};
      if (_root_tag == "store" && !cart_ids) {
        return;
      } else if (_root_tag == "store" && cart_ids) {
        _cart_ids = cart_ids;
      }

      if (_root_tag == TAG_ACTION_CART) {
        _cart_ids = this.$route.params.cart_ids;
      }
      json = {
        goods_ids: JSON.stringify(_cart_ids),
        mid: this.fun.getKeyByMid()
      };
      $http
        .get("from.div-from.get-params", json, " ")
        .then(
          response => {
            if (response.result === 1) {
              this.isGetAgreementPay = true;
              this.AgreementPay = response.data.getPayProtocol;
              this.checkTaxGoods(response.data.isDisplay);
              this.getMemberInfo(response.data.getMemberInfo);
              this.getExplain(response.data.explain);
              this.getIvoice(response.data.sinvoice);
            } else {
              this.isGetAgreementPay = false;
              console.log(response.msg);
            }
          },
          function(response) {
            this.isGetAgreementPay = false;
            console.log(response);
          }
        )
        .catch(err => {
          this.isGetAgreementPay = false;
          console.log(err);
        });
    },

    // 获取是否显示支付协议
    getAgreementPay() {
      $http.get("shop.index.getPayProtocol", {}, " ").then(
        response => {
          if (response.result === 1) {
            this.AgreementPay = response.data;
          } else {
            console.log(response.msg);
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },

    //是否海外商品
    checkTaxGoods(data) {
      if (data.status) {
        this.isTaxGoods = true;
        // this.getMemberInfo();
        // 显示个人信息
        this.showMyinfo = data.status;
      } else {
        this.isTaxGoods = false;
        // 隐藏个人信息
        this.showMyinfo = false;
      }
    },

    // 修改用户信息
    saveInfo() {
      let that = this;
      console.log("route", this.$route.params);
      var _goodsId = this.$route.params.goodsId;
      var _optionsId = this.$route.params.optionsId;
      var _total = this.$route.params.total;
      var submitActionTag = this.$route.params.tag;
      if (submitActionTag == "cart") {
        that.addCartReq(_goodsId, _optionsId, _total);
        return;
      }
      let json = {
        member_name: this.member_name,
        member_card: this.member_card
      };
      $http.get("from.div-from.updateMemberInfo", json, "添加中").then(
        function(response) {
          if (response.result === 1) {
            Toast("更新成功");
            that.popupMemberSpecs = false;
          } else {
            Toast(response.msg);
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },

    open() {
      this.$dialog.alert({ message:this.explain_content});
    },

    // 配置用户信息
    getMemberInfo(data) {
      this.member_name = data.realname;
      this.member_card = data.idcard;
      // 个人信息
      this.myRealname = data.realname;
      this.myIdcard = data.idcard;
    },

    getExplain(data) {
      this.explain_title = data.explain_title;
      this.explain_content = data.explain_content;
    },

    // 发票数据
    getIvoice(data) {
      this.papery_status = parseInt(data.invoice.papery);
      this.electron_status = parseInt(data.invoice.electron);
      if (!this.papery_status && !this.electron_status) {
        this.isShowInvoice = false;
      }
    },

    invoice_type() {
      if (this.iscur_c) {
        this.iscur_c = false;
        this.iscur_d = true;
      } else {
        this.iscur_c = true;
        this.iscur_d = false;
      }
    },

    invoice_title() {
      // 清空填写
      this.invoice_list.call = "";
      this.invoice_list.company_number = "";
      if (this.iscur) {
        this.iscur = false;
        this.iscur_b = true;
        this.person_status = false;
        this.unit_status = true;
      } else {
        this.iscur = true;
        this.iscur_b = false;
        this.person_status = true;
        this.unit_status = false;
      }
    },

    Subinvoice() {
      if (this.fun.isTextEmpty(this.invoice_list.call)) {

        this.$dialog.alert({message:"请填写抬头"});
        return;
      }
      if (
        this.iscur_b &&
        this.fun.isTextEmpty(this.invoice_list.company_number)
      ) {
        this.$dialog.alert({message:"请添加纳税人识别号"});

        return;
      }
      // 页面回显
      this.invoicename = this.iscur_c ? "电子" : "纸质";
      this.companyname = this.iscur ? "个人" : "单位";
      this.showInvoiceTitle = this.invoice_list.call;

      this.show1 = false;
    },

    closePopup() {
      this.show1 = false;
    },

    // 购物车结算
    getDataActionCart() {
      let that = this;
      let json = {
        dispatch_type_id: 1,
        channel_type: 3,
        cart_ids: _cart_ids,
        i: this.fun.getKeyByI(),
        type: this.fun.getTyep(),
        member_coupon_ids: this.assembleCoupons(),
        orders: JSON.stringify(this.assembleDeduction()),
        address: JSON.stringify(currentAddress)
      };

      let _URL_ActionCart = "plugin.channel.frontend.freedom-cart-buy.index";

      $http.get(_URL_ActionCart, json, "生成中").then(
        function(response) {
          if (response.result === 1) {
            that.goodsInfo = response.data;
            that.cup_notice = true;
            // that.order = response.data.order
            // that.dispatch = response.data.dispatch
            that.setViewData(response.data); // 设置界面
            that.setAddressViewData(
              response.data.dispatch.default_member_address
            ); // 设置地址界面
            that.initCoupon(response.data.discount.member_coupons); // 设置优惠券信息
          } else {
            Toast(response.msg);
            that.$router.go(-1);

            that.cup_notice = true;
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },

    // 设置界面
    setViewData(data) {
      // console.log(data, '参数data')
      this.service = data.fee_items;
      this.order_data = data.orders;
      this.show_address = data.orders[0].need_address;
      // var amount_items = data.amount_items;
      this.price = data.total_price; // 设置总价格（合计）
      this.total_items = data.amount_items;
      var discount_amount_items = data.discount_amount_items;
      this.discount_amount_items = data.discount_amount_items;

      discount_amount_items.forEach(items => {
        var totalPrice = 0;
        totalPrice += parseInt(items.amount);
        this.discount_price = totalPrice; // 设置总优惠价格
      });

      if (_root_tag == "store" && this.price < 0) {
        this.$router.push(this.fun.getUrl("o2oHome", {}));

        this.$dialog.alert({message:"下单错误"});
      }
    },

    // 设置地址界面
    setAddressViewData(model) {
      if (model == undefined || model == "" || model == []) {
        return;
      }

      // 设置地址id
      currentAddId = model.id;
      currentAddress = model;

      this.realname = this.fun.isTextEmpty(model.username)
        ? ""
        : model.username;
      this.mobile = this.fun.isTextEmpty(model.mobile) ? "" : model.mobile;
      this.address = this.fun.isTextEmpty(model.province)
        ? ""
        : model.province +
        " " +
        model.city +
        " " +
        model.district +
        " " +
        (this.fun.isTextEmpty(model.street) ? "" : model.street + " ") +
        model.address;
    },

    // 选择地址后重新计算数据
    requestByAddress() {
      // 重新计算
      if (_root_tag == TAG_ACTION_CART) {
        this.order_data = "";
        this.getDataActionCart(); // 购物车结算
      }
    },

    showAddressFun() {
      this.showAddress = true;
    },

    // 增加/修改地址
    confirmSelectAddress(item) {
      console.log(item);
      this.setAddressViewData(item);
      this.requestByAddress(); // 选择地址后重新计算
      this.showAddress = false;
    },

    //显示地址pop
    // showAddress() {
    //   // 获取收货地址
    //   this.getAddress();
    // },

    // 获取收货地址
    getAddress() {
      this.addressData = [];
      let that = this;
      let json = {
        i: this.fun.getKeyByI(),
        type: this.fun.getTyep()
      };
      $http.get("member.member-address.index", json, "获取中").then(
        function(response) {
          if (response.result === 1) {
            that.popupSpecs = true;
            that.addressData = response.data;
            that.defaultAddress = response.data.filter(function(item) {
              return item.isdefault === 1;
            });
          } else {
            that.$dialog.alert({message:response.msg});

          }
        },
        function(response) {
          console.log(response);
        }
      );
    },

    // 选择地址
    selectAddress(item) {
      // console.log(item)
      this.setAddressViewData(item); // 更新界面 & ID
      this.requestByAddress(); // 选择地址后重新计算
      // 关闭 地址栏
      this.popupSpecs = false;
    },

    // 设置地址
    editAddress() {
      this.popupSpecs = false;
      this.create = false;
      this.popAddAddress = true;
      this.getStreet(this.defaultAddress[0].district_id);
      this.form.address_id = this.defaultAddress[0].id;
      this.form.username = this.defaultAddress[0].username;
      this.form.mobile = this.defaultAddress[0].mobile;
      this.form.province = this.defaultAddress[0].province;
      this.form.city = this.defaultAddress[0].city;
      this.form.district = this.defaultAddress[0].district;
      this.form.address = this.defaultAddress[0].address;
      this.form.street = this.defaultAddress[0].street;
      this.form.isDefault =
        this.defaultAddress[0].isDefault === 0 ? false : true;
      this.addressName =
        this.form.province + " " + this.form.city + " " + this.form.district;
    },

    // 跳转到新增地址
    addAddress() {
      // this.$router.push(this.fun.getUrl('appendAddress', {fromGood: 1}))

      // 关闭 地址栏
      this.popupSpecs = false;
      // this.$router.push({ name: "appendAddress", params: {}, query: { i: this.toi } })

      // 新增地址 本地处理
      this.showAddAddress();
    },

    // 普通商品提交订单
    submit() {
      console.log("state===res", this.submit_active);
      if (this.submit_active == true) {
        this.submit_active = false;

        if (!this.order_data[0].need_address) {
          if (this.fun.isTextEmpty(currentAddId)) {
            Toast("请选择收货地址");
            this.submit_active = true;
            return;
          }
        }

        let that = this;
        let json = this.assembleJson();

        if (clicktag === 0) {
          clicktag = 1;
          let orderCreate = "plugin.channel.frontend.freedom-create.index";
          $http.post(orderCreate, json, "提交中").then(
            function(response) {
              if (response.result === 1) {
                that.clearStorage();
                Toast("下单成功！");
                that.$router.push(that.fun.getUrl("distributorIndex", {}));
              } else {
                Toast(response.msg);
              }
              that.submit_active = true;
              setTimeout(function() {
                clicktag = 0;
              }, 1000);
            },
            function(response) {
              that.submit_active = true;
              console.log(response);
            }
          )
            .catch(err => {
              console.log(err);
            });
        }
      }
    },
    //删除那个区域代理的地址id
    deleteAddressData() {
      window.localStorage.removeItem("level");
      window.localStorage.removeItem("province_id");
      window.localStorage.removeItem("city_id");
      window.localStorage.removeItem("district_id");
      window.localStorage.removeItem("street_id");
    },
    // 组装json数据
    assembleJson() {
      let json = {
        //公共数据
        address: JSON.stringify(currentAddress),
        goods: JSON.stringify(this.assembleGoods()),
        member_coupon_ids: JSON.stringify(this.assembleCoupons()),
        orders: JSON.stringify(this.assembleDeduction()),
        // 发票
        invoice_type: this.iscur_c ? 0 : 1,
        rise_type: this.iscur ? 1 : 0,
        call: this.invoice_list.call,
        company_number: this.invoice_list.company_number
      };

      if (_root_tag == TAG_ACTION_CART) {
        json.dispatch_type_id = 1;
        json.cart_ids = JSON.stringify(_cart_ids);
      }

      if(_root_tag == "channel_freedom"){
        json.channel_type = 3;
      }
      return json;
    },

    // 组装商品信息
    assembleGoods() {
      let newGoods = [];

      for (let j = 0; j < this.goodsInfo.orders.length; j++) {
        for (let i = 0; i < this.goodsInfo.orders[j].order_goods.length; i++) {
          let model = {};
          model.goods_id = this.goodsInfo.orders[j].order_goods[i].goods_id;
          model.total = this.goodsInfo.orders[j].order_goods[i].total;
          model.option_id = this.goodsInfo.orders[j].order_goods[
            i
          ].goods_option_id;
          newGoods.push(model);
        }
      }
      return newGoods;
    },
    assembleGoodsDFData(){
      //组装商品自定义表单信息
      let that = this;
      let newGoodsDF = [];
      for (let j = 0; j < this.goodsInfo.orders.length; j++) {
        for (let i = 0; i < this.goodsInfo.orders[j].order_goods.length; i++) {
          if(that.goodsInfo.orders[j].order_goods[i].diy_form){
            let modelDF = {};
            modelDF.pre_id = this.goodsInfo.orders[j].order_goods[i].pre_id;
            modelDF.diyform_data_id = this.goodsInfo.orders[j].order_goods[i].diy_form.diyform_data_id;
            newGoodsDF.push(modelDF);
          }
        }
      }
      return newGoodsDF;
    },

    // 组装优惠券json信息
    assembleCoupons() {
      let coupons = [];

      for (let i = 0; i < this.checkCouponList.length; i++) {
        coupons.push(this.checkCouponList[i].id);
      }

      return coupons;
    },
    // 组装优惠抵扣信息
    assembleDeduction() {
      let deductions = [];

      // this.checkDeductionList[i].note = this.note[this.checkDeductionList[i].pre_id]

      for (let i = 0; i < this.checkDeductionList.length; i++) {
        // this.checkDeductionList[i].deduction_ids = this.checkDeductionList[i].deduction_ids.join(',')
        deductions.push(this.checkDeductionList[i]);
      }
      return deductions;
    },

    // 初始化优惠券
    initCoupon(coupon) {
      this.coupon_size = coupon.length;
      this.coupons = coupon;
    },

    //初始化带有默认选中优惠券
    DefaultSelectCoupon(coupon) {
      this.coupon_size = coupon.length;
      this.coupons = coupon;
      this.checkCouponList = [];
      coupon.forEach((item, ind) => {
        if (item.checked == true) {
          this.checkCouponList.push(item);
        }
      });
      this.use_coupon_size = this.checkCouponList.length;
    },

    // 优惠券
    showCoupon() {
      if (this.coupon_size == 0) {
        Toast("暂无优惠券使用");
        return;
      }
      this.popupCouponSpecs = true;
    },

    // 选择优惠券
    selectCoupon(value, valObj) {
      // 处理选择
      // this.screenCoupon(value)
      // 因为换了组件改调用方法
      this.screenCoupon(value, valObj);
      // 设置已经使用多少优惠券
      this.use_coupon_size = this.checkCouponList.length;

      // 重新计算
      if (_root_tag == TAG_ACTION_CART) {
        this.getDataActionCart(); // 购物车结算
      }
    },
    chooseCoupon(index) {
      this.coupons[index].checked = true;
    },

    // 筛选数据优惠券状态
    screenCoupon(value, valObj) {
      var tarValue = valObj;
      console.log("选中优惠券", value, valObj);
      if (value.target.checked) {
        // 选中添加
        this.cup_notice = false;
        if (this.checkCouponList.length > 0) {
          for (let i = 0; i < this.checkCouponList.length; i++) {
            if (this.checkCouponList[i].id == tarValue.id) {
              this.checkCouponList.splice(i, 1);
            }
          }
          this.checkCouponList.push(tarValue);
        } else {
          this.checkCouponList.push(tarValue);
        }
      } else {
        // 取消选中

        this.cup_notice = true;

        if (this.checkCouponList.length > 0) {
          for (let i = 0; i < this.checkCouponList.length; i++) {
            if (this.checkCouponList[i].id == tarValue.id) {
              this.checkCouponList.splice(i, 1);
            }
          }
        }
      }
    },

    // 抵扣选择响应
    discountHandle(item, value) {
      this.screenDiscount(item, value);
      this.discount_price = 0;
      // 重新计算
      if (_root_tag == TAG_ACTION_CART) {
        this.getDataActionCart(); // 购物车结算
      }
    },

    // 发票触发抵扣事件
    noteHandle(event, item) {
      if (!item.order_deductions[0]) {
        // 临时数据
        let _deductionItem = {};
        let tempDeduction_ids = [];
        if (this.checkDeductionList.length > 0) {
          for (let i = 0; i < this.checkDeductionList.length; i++) {
            if (this.checkDeductionList[i].pre_id == item.pre_id) {
              // 先获取回来
              if (
                this.fun.isTextEmpty(this.checkDeductionList[i].deduction_ids)
              ) {
                tempDeduction_ids = [];
              } else {
                tempDeduction_ids = this.checkDeductionList[i].deduction_ids;
              }
              this.checkDeductionList.splice(i, 1);
              break;
            }
          }

          if (tempDeduction_ids.length > 0) {
            for (let j = 0; j < tempDeduction_ids.length; j++) {
              if (tempDeduction_ids[j] == value.code) {
                tempDeduction_ids.splice(j, 1);
              }
            }

            // tempDeduction_ids.push(value.code)
            _deductionItem.deduction_ids = tempDeduction_ids;
            _deductionItem.pre_id = item.pre_id;
            _deductionItem.note = this.note[item.pre_id];
            this.checkDeductionList.push(_deductionItem);
          } else {
            // tempDeduction_ids.push(value.code)
            _deductionItem.deduction_ids = tempDeduction_ids;
            _deductionItem.pre_id = item.pre_id;
            _deductionItem.note = this.note[item.pre_id];
            this.checkDeductionList.push(_deductionItem);
          }
        } else {
          if (tempDeduction_ids.length > 0) {
            for (let j = 0; j < tempDeduction_ids.length; j++) {
              if (tempDeduction_ids[j] == value.code) {
                tempDeduction_ids.splice(j, 1);
              }
            }

            _deductionItem.deduction_ids = tempDeduction_ids;
            _deductionItem.pre_id = item.pre_id;
            _deductionItem.note = this.note[item.pre_id];
            this.checkDeductionList.push(_deductionItem);
          } else {
            // tempDeduction_ids.push(value.code)
            _deductionItem.deduction_ids = tempDeduction_ids;
            _deductionItem.pre_id = item.pre_id;
            _deductionItem.note = this.note[item.pre_id];
            this.checkDeductionList.push(_deductionItem);
          }
        }
      } else {
        this.screenDiscount(item, item.order_deductions[0]);
      }

      console.log("this.checkDeductionList::::", this.checkDeductionList);
    },

    // 筛选抵扣
    screenDiscount(item, value) {
      // console.log("value::::", value)

      // 临时数据
      let _deductionItem = {};
      let tempDeduction_ids = [];

      if (value.checked) {
        // 选中添加

        if (this.checkDeductionList.length > 0) {
          for (let i = 0; i < this.checkDeductionList.length; i++) {
            if (this.checkDeductionList[i].pre_id == item.pre_id) {
              // 先获取回来
              if (
                this.fun.isTextEmpty(this.checkDeductionList[i].deduction_ids)
              ) {
                tempDeduction_ids = [];
              } else {
                tempDeduction_ids = this.checkDeductionList[i].deduction_ids;
              }

              this.checkDeductionList.splice(i, 1);
              break;
            }
          }

          if (tempDeduction_ids.length > 0) {
            for (let j = 0; j < tempDeduction_ids.length; j++) {
              if (tempDeduction_ids[j] == value.code) {
                tempDeduction_ids.splice(j, 1);
              }
            }

            tempDeduction_ids.push(value.code);
            _deductionItem.deduction_ids = tempDeduction_ids;
            _deductionItem.pre_id = item.pre_id;
            _deductionItem.note = this.note[item.pre_id];
            this.checkDeductionList.push(_deductionItem);
          } else {
            tempDeduction_ids.push(value.code);
            _deductionItem.deduction_ids = tempDeduction_ids;
            _deductionItem.pre_id = item.pre_id;
            _deductionItem.note = this.note[item.pre_id];
            this.checkDeductionList.push(_deductionItem);
          }

          // if (tempDeduction_ids.indexOf(value.code) <= 0) {
          //     tempDeduction_ids.push(value.code)
          //     _deductionItem.deduction_ids = tempDeduction_ids
          //     _deductionItem.pre_id = item.order.pre_id
          //     this.checkDeductionList.push(_deductionItem)
          //     console.log("LengthPush:",_deductionItem)
          // }
        } else {
          if (tempDeduction_ids.length > 0) {
            for (let j = 0; j < tempDeduction_ids.length; j++) {
              if (tempDeduction_ids[j] == value.code) {
                tempDeduction_ids.splice(j, 1);
              }
            }

            tempDeduction_ids.push(value.code);
            _deductionItem.deduction_ids = tempDeduction_ids;
            _deductionItem.pre_id = item.pre_id;
            _deductionItem.note = this.note[item.pre_id];
            this.checkDeductionList.push(_deductionItem);
          } else {
            tempDeduction_ids.push(value.code);
            _deductionItem.deduction_ids = tempDeduction_ids;
            _deductionItem.pre_id = item.pre_id;
            _deductionItem.note = this.note[item.pre_id];
            this.checkDeductionList.push(_deductionItem);
          }

          // if (tempDeduction_ids.indexOf(value.code) <= 0) {
          //     tempDeduction_ids.push(value.code)
          //     _deductionItem.deduction_ids = tempDeduction_ids
          //     _deductionItem.pre_id = item.order.pre_id
          //     this.checkDeductionList.push(_deductionItem)
          //     console.log("LengthPush:", _deductionItem)
          // }
        }
      } else {
        // 取消选中
        if (this.checkDeductionList.length > 0) {
          for (let i = 0; i < this.checkDeductionList.length; i++) {
            if (this.checkDeductionList[i].pre_id == item.pre_id) {
              // 先获取回来
              if (
                this.fun.isTextEmpty(this.checkDeductionList[i].deduction_ids)
              ) {
                tempDeduction_ids = [];
              } else {
                tempDeduction_ids = this.checkDeductionList[i].deduction_ids;
              }
              this.checkDeductionList.splice(i, 1);
              break;
            }
          }

          if (tempDeduction_ids.length > 0) {
            for (let j = 0; j < tempDeduction_ids.length; j++) {
              if (tempDeduction_ids[j] == value.code) {
                tempDeduction_ids.splice(j, 1);
              }
            }

            // tempDeduction_ids.push(value.code)
            _deductionItem.deduction_ids = tempDeduction_ids;
            _deductionItem.pre_id = item.pre_id;
            _deductionItem.note = this.note[item.pre_id];
            this.checkDeductionList.push(_deductionItem);
          } else {
            // tempDeduction_ids.push(value.code)
            _deductionItem.deduction_ids = tempDeduction_ids;
            _deductionItem.pre_id = item.pre_id;
            _deductionItem.note = this.note[item.pre_id];
            this.checkDeductionList.push(_deductionItem);
          }

          // if (tempDeduction_ids.indexOf(value.code) > -1) {
          //     tempDeduction_ids.removeByValue(value.code)
          //     _deductionItem.deduction_ids = tempDeduction_ids
          //     _deductionItem.pre_id = item.order.pre_id
          //     this.checkDeductionList.push(_deductionItem)
          //     console.log("LengthPush:", _deductionItem)
          // }
        } else {
          if (tempDeduction_ids.length > 0) {
            for (let j = 0; j < tempDeduction_ids.length; j++) {
              if (tempDeduction_ids[j] == value.code) {
                tempDeduction_ids.splice(j, 1);
              }
            }

            // tempDeduction_ids.push(value.code)
            _deductionItem.deduction_ids = tempDeduction_ids;
            _deductionItem.pre_id = item.pre_id;
            _deductionItem.note = this.note[item.pre_id];
            this.checkDeductionList.push(_deductionItem);
          } else {
            // tempDeduction_ids.push(value.code)
            _deductionItem.deduction_ids = tempDeduction_ids;
            _deductionItem.pre_id = item.pre_id;
            _deductionItem.note = this.note[item.pre_id];
            this.checkDeductionList.push(_deductionItem);
          }
          // if (tempDeduction_ids.indexOf(value.code) > -1) {
          //     tempDeduction_ids.removeByValue(value.code)
          //     _deductionItem.deduction_ids = tempDeduction_ids
          //     _deductionItem.pre_id = item.order.pre_id
          //     this.checkDeductionList.push(_deductionItem)
          //     console.log("LengthPush:", _deductionItem)
          // }
        }
      }

      // console.log('checkList:', this.checkDeductionList)
    },

    // 新增地址v2----------------------------------------------新增地址v2//
    // 显示增加地址
    showAddAddress() {
      this.form = {
        username: "",
        mobile: "",
        province: "",
        city: "",
        district: "",
        street: "",
        address: "",
        isDefault: false
      };
      this.addressName = "";
      this.popAddAddress = true;
      this.create = true;
    },

    // 关闭增加地址
    popAddressClose() {
      this.popAddAddress = false;
    },

    // 地址回调
    addressCallback(obj) {
      this.form.street = "";
      this.districtVal = "";
      this.addressName =
        obj.itemName1 + " " + obj.itemName2 + " " + obj.itemName3;
      this.form.province = obj.itemName1;
      this.form.city = obj.itemName2;
      this.form.district = obj.itemName3;
      this.getStreet(obj.itemValue3);
    },

    // 获取街道
    getStreet(param) {
      $http
        .get("member.memberAddress.street", {
          district_id: param
        })
        .then(response => {
          if (response.result === 1 && !this.fun.isTextEmpty(response.data)) {
            if (
              !this.fun.isTextEmpty(response.data) &&
              response.data.length > 0
            ) {
              this.districtVal = response.data;
              this.strShow = true;
            } else {
              this.strShow = false;
            }
          } else {
            this.strShow = false;
          }
        })
        .catch(error => {
          this.strShow = false;
          console.log(error);
        });
    },

    streetChoose() {
      if (this.fun.isTextEmpty(this.addressName)) {
        this.$dialog.alert({message:"请先选择所在地区"});
      } else {
        this.streetShow = true;
      }
    },

    streetConfirm(name) {
      this.form.street = name;
      this.streetShow = false;
    },

    // 增加/修改地址
    appendAddress(str) {
      var that = this;

      if (this.fun.isTextEmpty(this.form.username)) {

        this.$dialog.alert({message:"请输入收货人姓名"});
        return;
      }

      if (this.fun.isTextEmpty(this.form.mobile)) {
        this.$dialog.alert({message:"请输入联系电话"});

        return;
      }
      if (!/^[0-9]{1,}$/.test(this.form.mobile)) {
        this.$dialog.alert({message:"请输入正确的联系电话"});

        return;
      }

      // if (this.fun.isMoblie(this.form.mobile)) {

      //   return;
      // }

      if (this.fun.isTextEmpty(this.addressName)) {

        this.$dialog.alert({message:"请选择所在区域"});
        return;
      }

      if (this.strShow && this.fun.isTextEmpty(this.form.street)) {

        this.$dialog.alert({message:"请选择所在街道"});
        return;
      }

      if (this.fun.isTextEmpty(this.form.address)) {
        this.$dialog.alert({message:"请输入详细地址"});

        return;
      }

      let json = {};
      if (this.strShow) {
        json = {
          username: this.form.username,
          mobile: this.form.mobile,
          province: this.form.province,
          city: this.form.city,
          district: this.form.district,
          street: this.form.street,
          address: this.form.address,
          isdefault: this.form.isDefault ? 1 : 0,
          address_id: this.form.address_id
        };
      } else {
        json = {
          username: this.form.username,
          mobile: this.form.mobile,
          province: this.form.province,
          city: this.form.city,
          district: this.form.district,
          address: this.form.address,
          isdefault: this.form.isDefault ? 1 : 0,
          address_id: this.form.address_id
        };
      }

      let api = "";
      if (str === "update") {
        api = "member.member-address.update";
      } else {
        api = "member.member-address.store";
      }

      $http.post(api, json, "").then(
        function(response) {
          if (response.result == 1) {

            that.$dialog.alert({message:response.msg});
            that.popAddressClose();
            that.setAddressViewData(response.data);
            that.requestByAddress(); // 选择地址后重新计算
            that.form = {
              username: "",
              mobile: "",
              province: "",
              city: "",
              district: "",
              street: "",
              address: "",
              isDefault: false
            };
            that.addressName = "";
          } else {
            that.$dialog.alert({message:response.msg});

          }
        },
        function(response) {
          // error callback
        }
      );
    },
    // 新增地址v2----------------------------------------------新增地址v2//

    alertMyInfo() {
      this.$router.push(
        this.fun.getUrl("myinfo", {
          tag: this.$route.params.tag,
          goodsId: this.$route.params.goodsId,
          optionsId: this.$route.params.optionsId,
          total: this.$route.params.total
        })
      );
    },

    initStore() {
      const that = this;
      this.recipient_name = "";
      this.recipient_mobile = "";
      $http
        .get(
          "plugin.store-cashier.frontend.store.get-store-info.get-info-by-store-id",
          {
            store_id: that.store_id
          },
          " "
        )
        .then(
          function(response) {
            if (response.result === 1) {
              that.dispatch = response.data.dispatch_type;

              that.store_info = response.data;

              if (that.dispatch.length > 0) {
                if (!that.selected) {
                  that.selected = that.dispatch[0].toString();
                }
              }
              console.log("dispatch::::", that.dispatch);
              that.recipient_name = response.data.store_carry.name;
              that.recipient_mobile = response.data.store_carry.number;
              that.getDataActionStoreCart();
            } else {
              Toast(response.msg);
              that.$router.go(-1);
            }
          },
          function(response) {
            console.log(response);
          }
        );
    },

    // 清除localstorage
    clearStorage() {
      window.localStorage.removeItem("rentTimeSelf");
      window.localStorage.removeItem("rentTimeChoose");
      window.localStorage.removeItem("rentTimeRight");
    },

    showAgreement() {
      this.agreementShow = true;
    },

    showPay() {
      this.agreementPayShow = true;
    },
    isFocus() {
      this.isResize = true;
    },
    isBlur() {
      this.isResize = false;
    },
    getPendingOrder_type() {
      //获取批发区下单页类型判断
      let that = this;
      $http
        .get(
          "plugin.pending-order.frontend.wholesale-area.pending-order-type",
          {},
          ""
        )
        .then(response => {
          // console.log(response)
          if (response.result == 1) {
            if (response.data.status == 0) {
              that.pdOrderType = [
                { name: "零售", code: "0" },
                { name: "自用", code: "1" }
              ];
              that.POChooseType = "0";
            } else {
              that.pdOrderType = [{ name: "自用", code: "1" }];
            }
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  components: {
    yzAddressList
  },
};
