import cTitle from "components/title";
// import { mapState, mapMutations } from 'vuex';
import { Toast } from "vant";
// import District from "src/gov_province_city_area_id";
import cDyPopup from "./diyFormPopup";
import deliveryMap from "components/delivery_map";
import yzAddressList from "components/ui_components/yz_addressList/index";
import location from "components/ui_components/yz_addressList/location";

const TAG_ACTION_BUY = "-2"; // 直接购买
const TAG_ACTION_CART = "-1"; // 1购物车结算
var _root_tag = ""; // 0 直接购买 1购物车结算
var _goodsId = "";
var _optionsId = "";
var _total = 1;
var currentAddId = "";
var currentAddress = {};
var _cart_ids = [];
var _packagJson = {};

var location_loading = 0; //防止频繁定位，后面考虑优化封装在getLocation()解决

export default {
  data() {
    return {
      popCode: "",
      showPop: false,
      stepper_show: 0,
      clicktag: 0,
      good_clicktag: 0,
      getDispatch: false, //第一次请求接口获取配送方式后，需要取默认第一个的dispatch_type_id重新请求接口
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
      showAddress: false,
      yzAddressListOptions: {}, //地址组件配置信息（可选）

      // 优惠券
      popupCouponSpecs: false,
      coupon_size: 0,
      checkCouponList: [],
      use_coupon_size: 0,

      // 积分抵扣 其他抵扣
      checkDeductionList: [],

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
      getParams_status: false, //是否已请求接口
      myRealname: "",
      myIdcard: "",
      showMyinfo: false,

      isRent: false, // 租赁商品标识
      checkList: [], // 权益商品选择列表
      isRightChoose: false, // 是否选择权益商品

      rentTime: [], // 租期
      rentFree: "", // 可以免租的件数

      isOpenRight: false, // 是否开启会员权益开关

      currentIndex: "999",

      agreement: false, // 同意租赁协议
      agreementShow: false,

      AgreementPay: "", // 是否显示支付协议
      agreementPay: false, // 同意支付协议
      agreementPayShow: false, // 支付协议

      agreeCon: {}, // 租赁协议
      rent_deposit_free: 0, // 免押件数
      rent_free: 0, // 免租件数

      cup_notice: true, // 优惠券标识
      submit_active: true,
      isResize: false,
      isShowCoupon: true, //是否显示优惠券

      defaultAddress: {},

      note: [], // 留言
      service_fee: [], //服务费、运费说明
      for_serviceFee_status: false, //是否已遍历完成，避免van-checkbox-group 的change

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
        company_number: "",
        email: ""
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

      isGetAgreementPay: false, //判断是否已经请求了支付协议接口

      service_fee_items: {}, //服务费

      distributionUserName: "",
      distributionUserMobile: "",

      isOpenTeam: false, //是否为一键开团
      isJoinTeam: false, //是否为去参团

      isPhoto: false, //开启相册商品，true为相册商品
      fileList1: [], //相册路径链接
      fileList2: [],
      show: false, //图片预览组件为true显示
      imgIndex: 1, //相册图片预览起始位置
      checkedImg: true, //true为开启微信相册
      max_count: 9, //最大上传张数
      min_count: 1, //最小上传张数
      photosize: 1024 * 1024 * 30,
      storeNo_photo: false,

      selfCarryType: [],
      defaultSelfCarry: "",
      isQuest_ing: true, //是否正在请求数据中
      isShowDiyForm: false, //是否开启自定义表单
      diyform_id: 0,
      form_data_id: "", //提交自定义表单后返回的表单id，
      diyTitle: "", //自定义表单名称
      deliverName: "自提点", //自提点自定义名称

      dyFormPopup: false,
      dfData: {},
      goodDYDormID: null,
      activeDYGoodID: null,
      activeFormDataID: null,
      dyDescription: null,
      dyTiitle: "",
      dyThumb: null, //表单图片
      oldOrder_data: [], //用于保存保存商品自定义表单后的数据

      is_region: 0,

      delivery_note: "", //门店配送说明
      delivery_area: [[116.403322, 39.920255]], // 配送范围经纬度
      locations: [116.403322, 39.920255], //门店经纬度
      is_open_store_delivery: false, //是否开启门店配送
      locationName: "", //经纬度
      deliveryScopeShow: false,
      district_id: 0, //地址区域id

      show_domain: false,
      shop_domain: "", //绑定域名
      isCueCoupon: false, //提示优惠券选择，只提示一次
      openCueCoupon: false,
      plugin_id: "", //应用市场plugin_id===58的时候要请求另外一个接口

      orderLocationObj: { positioning_success: 0, province: "", city: "" }, //下单添加定位地址（业绩区域）
      is_coupon_SELE: false,
      coupons_temp: {}, //折叠优惠券input框model
      timeoutId: null, //防抖，防止折叠优惠券频繁触发
      fromStock: "", // 是否是云库存商品
      is_cps: false, //聚合cps标识
      cpsType: "2", //1,直冲2，卡券
      cpsTxt: "", //直冲帐号

      // 话费慢充
      show_recharge_mobile: "",
      recharge_tips: "",
      recharge_mobile: "",

      // 自定义表单
      hasGoodOpenDF: false,
      //上门安装 插件名：live-install
      minDate: new Date(),
      installDate: null, //预约时间(10位时间戳)
      install_comment: "", //安装备注，不要超过120个字符
      location: {}, //定位信息
      showLocation: false,
      showInstallPop: false,

      storeSearchBtn: {}, //门店搜索插件自定义下单页按钮
      default_deduction: 0,  //判断积分抵扣默认是否开启
    };
  },

  /**
   *  预下单页面:
   *  params : packagJson  changeSelfCarry address_data create district_id  pointId exchangeData
   *
   *  query : tag level_id  team_id goodsId  optionsId total store_id  isCash  distributionUserName distributionUserMobile
   *          orderType  mark team_id option_level_id at_id
   *          leader_id  order_id  activity_id cart_ids
   *  */

  async activated() {
    if (this.$route.query.fromStock) {
      this.fromStock = this.$route.query.fromStock;
    }

    // 聚合cps商品预下单标识
    if (this.$route.query.cpstype) {
      this.cpsType = this.$route.query.cpstype;
    }
    if (this.$route.query.iscps) {
      this.is_cps = true;
    }
    // end
    if (JSON.parse(window.localStorage.getItem("globalParameter")).order_locate == true) {
      this.orderLocationObj = await this.getCurrentOrderLocation();
    }

    this.initData();
    // 接收参数
    _root_tag = this.$route.query.tag;
    this.isOpenTeam = !this.fun.isTextEmpty(this.$route.query.level_id); //是否为一键开团
    this.isJoinTeam = !this.fun.isTextEmpty(this.$route.query.team_id); //是否为去参团
    if (JSON.parse(window.localStorage.getItem("globalParameter")).is_open_photo_order == "1" && _root_tag == TAG_ACTION_BUY) {
      //需求：商城商品、供应商商品立即购买和门店商品下单才能使用相册上传模块，且一个下单的商品id（新需求去掉购物车，不能使用相册）
      this.isPhoto = true; //开启相册上传模块
      this.setPhotoNum();
    }

    let fromChange = this.$route.params.changeSelfCarry ? JSON.parse(this.$route.params.changeSelfCarry) : this.$route.query.changeSelfCarry ? JSON.parse(this.$route.query.changeSelfCarry) : null;
    if (fromChange) {
      //从更换自提点列表页面选择后返回 或者 社群团购结算进入tag=communityBuy
      this.defaultSelfCarry = fromChange;
      this.selected = 8;
    }
    console.log("_root_tag", _root_tag);
    if (this.fun.isTextEmpty(_root_tag)) {
      // 为空跳回
      this.$router.go(-1);
      return;
    }

    if (_root_tag == TAG_ACTION_BUY || _root_tag == "appointment_goods" || _root_tag == "yun_sign_goods" || _root_tag == "activity" || _root_tag == "cps" || _root_tag == "channel_buy") {
      _goodsId = this.$route.query.goodsId;
      _optionsId = this.$route.query.optionsId;
      _total = this.$route.query.total;
      this.store_id = this.$route.query.store_id;
      if (this.$route.query.store_id) {
        // 门店拓客
        this.initStore("is_activity");
      } else if (this.$route.query.groupStoreID) {
        //门店拼团
        // this.store_id = this.$route.query.groupStoreID;
        this.initStore();
      }
      this.getDataActionBuy(); // 直接购买
    } else if (_root_tag == TAG_ACTION_CART || _root_tag == "-10" || _root_tag == "communityBuy") {
      _cart_ids = this.$route.query.cart_ids.split(",");
      if (this.fun.isTextEmpty(_cart_ids)) {
        // 为空跳回
        this.$router.go(-1);
        return;
      }
      this.getDataActionCart(); // 购物车结算
    } else if (_root_tag == "channel" || _root_tag == "channel_Replenishment" || _root_tag == "channel_TCOrder") {
      _cart_ids = this.$route.query.cart_ids.split(",");
      if (this.fun.isTextEmpty(_cart_ids)) {
        // 为空跳回
        this.$router.go(-1);
        return;
      }
      this.getChannelActionCart(); // 渠道商订货购物车结算
    } else if (_root_tag == "store") {
      this.store_id = this.$route.query.store_id;
      // this.getDataActionStoreCart();//门店结算
      if (this.$route.query.isCash === 1) {
        this.getCashGood();
      } else {
        this.initStore();
      }
    } else if (_root_tag == "rentCartBuy") {
      // 租赁购物车
      this.currentIndex = "999";
      _cart_ids = this.$route.query.cart_ids.split(",");
      if (this.fun.isTextEmpty(_cart_ids)) {
        // 为空跳回
        this.$router.go(-1);
        return;
      }
      this.isRent = true;
      this.getRentDataActionCart([], []);
      this.getRentTimeList();
      this.judgeIsRight();
    } else if (_root_tag == "rentBuy") {
      this.currentIndex = "999";
      this.isRent = true;
      _goodsId = this.$route.query.goodsId;
      _optionsId = this.$route.query.optionsId;
      _total = this.$route.query.total;

      this.getRentDataActionCart([], []);
      this.getRentTimeList();
      this.judgeIsRight();
    } else if (_root_tag == "packagBuy") {
      // 套餐购买 使用params不能刷新
      _packagJson = this.$route.params.packagJson;
      _cart_ids = this.$route.query.cart_ids.split(",");
      if (this.fun.isTextEmpty(_cart_ids) || this.fun.isTextEmpty(_packagJson)) {
        // 为空跳回
        this.$router.go(-1);
        return;
      }
      this.goPackagBuy();
    } else if (_root_tag == "POrder") {
      //挂单商品
      this.getPendingOrder_type(); //批发区下单页类型判断,即导航栏判断
      _goodsId = this.$route.query.goodsId;
      _optionsId = this.$route.query.optionsId;
      _total = this.$route.query.total;
    } else if (_root_tag == "fromExchange") {
      //会员中心-兑换中心-去兑换（商城商品）
      _goodsId = this.$route.query.goodsId;
      // console.log(_goodsId);
      this.getExchangeData();
    } else if (_root_tag == "starGroup") {
      console.log("星团");
      _goodsId = this.$route.query.goodsId;
      _optionsId = this.$route.query.optionsId;
      _total = this.$route.query.total;
      this.getDataActionBuy(); // 直接购买
    } else if (_root_tag == "blindBox") {
      _goodsId = this.$route.query.goodsId;
      this.getDataActionBuy(); // 直接购买
    }

    // this.getParams();
    // this.getAgreementPay();
    // this.checkTaxGoods();
    // this.getIvoice();
    this.isTaxGoods = false;
    this.ImgBtnMethob();
  },

  mounted() {
    this.clicktag = 0;
    this.good_clicktag = 0;
    this.showAddress = false;
  },
  methods: {
    ImgBtnMethob() {
      // this.checkedImg = false;
      if (this.fun.isWeiXin() && this.fun.getPhoneEnv() == "2") {
        // if (this.fun.isWeiXin()) {
        //当前使用环境为安卓机的微信app下，即使用微信SDK提供的接口调用微信相册实现图片多选上传功能（注：微信官方一次最多只能9张）
        //因ios与h5自身通过设置input属性为multiple可实现多选，暂无调用微信接口上传
        this.checkedImg = true;
      } else {
        this.checkedImg = false;
      }
    },
    //弃用微信接口原因：当选择微信原图上传时微信还是会进行压缩(任务编号: 33970又改了回来。。。)
    // 相关问题链接：https://developers.weixin.qq.com/community/develop/doc/00088493fb47182c6e27b681b54c00
    chooseImage() {
      let that = this;
      let wxChooseNum = this.max_count - this.fileList1.length;
      wx.chooseImage({
        count: wxChooseNum, // 默认9
        sizeType: ["original"], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ["album"], // 可以指定来源是相册还是相机，默认二者都有
        success: function(req) {
          var localIds = req.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
          for (let j = 0; j < localIds.length; j++) {
            wx.getLocalImgData({
              localId: req.localIds[j].toString(),
              success: function(res) {
                const localData = res.localData;
                let imageBase64 = "";
                if (localData.indexOf("data:image") == 0) {
                  //苹果的直接赋值，默认生成'data:image/jpeg;base64,'的头部拼接
                  imageBase64 = localData;
                } else {
                  //此处是安卓中的唯一得坑！在拼接前需要对localData进行换行符的全局替换,M~M~P~~~
                  //此时一个正常的base64图片路径就完美生成赋值到img的src中了
                  imageBase64 = "data:image/jpeg;base64," + localData.replace(/\n/g, "");
                }
                that.onRead_1(imageBase64);
              },
              fail(res) {
                console.log("getLocalImgData::error");
                alert("getLocalImgData::error", res);
              }
            });
          }
        },
        fail() {
          console.log("chooseImage::error");
          alert("chooseImage::error", res);
        }
      });
    },
    dataURItoBlob(dataURI) {
      // 图片转成Buffer---------------------------------
      let byteString = atob(dataURI.split(",")[1]);
      let mimeString = dataURI
        .split(",")[0]
        .split(":")[1]
        .split(";")[0];
      let ab = new ArrayBuffer(byteString.length);
      let ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      return new Blob([ab], { type: mimeString });
    },
    // 判断多图上传，循环onRead_1方法
    multipleMethod_1(e, flag) {
      let isSlice = this.fileList1.length + e.length - this.max_count;
      // console.log(isSlice);
      let _data = e;
      if (isSlice > 0) {
        _data.splice(-isSlice, isSlice);

        this.$dialog.alert({ message: `(＞﹏＜)哎呦，您不小心选多了${isSlice}张！` });
      }

      if (_data && _data.length) {
        for (let i = 0; i < _data.length; i++) {
          this.onRead_1(_data[i], flag);
        }
      } else {
        this.onRead_1(_data, flag);
      }
    },
    // vant 多图片上传
    onRead_1(e, flag) {
      var That = this;
      Toast.loading({
        message: "上传中",
        forbidClick: true
      });
      let fd = new FormData();
      if (this.checkedImg) {
        fd.append("file", That.dataURItoBlob(e));
      } else {
        if (flag === true) {
          fd.append("file", e);
        } else {
          fd.append("file", e.file); // 第一个参数字符串可以填任意命名，第二个根据对象属性来找到file
        }
      }
      axios
        .post(this.fun.getRealUrl("plugin.photo-order.api.upload.uploadPic"), fd, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then(response => {
          var responseData = response.data;
          if (responseData.result === 1) {
            Toast.clear();
            if (!That.checkedImg) {
              if (flag === true) {
                That.fileList2.push({
                  url: URL.createObjectURL(e)
                });
              } else {
                That.fileList2.push({
                  url: URL.createObjectURL(e.file)
                });
              }
            }
            That.fileList1.push(responseData.data.img_url);
          } else {
            Toast.clear();
            Toast(responseData.msg);
          }
        })
        .catch(error => {
          Toast.clear();
          console.log(error);
        });
    },
    showimg(ind) {
      this.imgIndex = ind;
      this.show = true;
    },
    removeImg: function(delIndex) {
      this.fileList1.splice(delIndex, 1);
      console.log(this.fileList1.length);
      return this.fileList1;
    }, //================================相册上传 end===================================
    setPhotoNum() {
      //设置相册上传数量，当接口返回result==1时，即当前商品设置了独立的相册数量设置；返回result==0时，即采用插件设置的公共限制数量
      let that = this;
      $http.get("plugin.photo-order.api.photo-goods.getPhotoGoods", { goods_id: that.$route.query.goodsId }, "").then(function(response) {
        if (response.result == 1) {
          let _max = response.data.goods_max_photo;
          let _min = response.data.goods_min_photo;
          if (_max != 0 && _max >= _min) {
            that.max_count = _max;
          } else {
            that.max_count =
              Number(_min) >= Number(JSON.parse(window.localStorage.getItem("globalParameter")).photo_order_max_pohot)
                ? _min
                : Number(JSON.parse(window.localStorage.getItem("globalParameter")).photo_order_max_pohot);
          }
          that.min_count = _min ? _min : Number(JSON.parse(window.localStorage.getItem("globalParameter")).photo_order_min_pohot);
          console.log("独立的相册数量设置", that.max_count, that.min_count);
        } else {
          that.max_count = Number(JSON.parse(window.localStorage.getItem("globalParameter")).photo_order_max_pohot); //最大上传张数
          that.min_count = Number(JSON.parse(window.localStorage.getItem("globalParameter")).photo_order_min_pohot)
            ? Number(JSON.parse(window.localStorage.getItem("globalParameter")).photo_order_min_pohot)
            : 1; //最小上传张数
          console.log("公共限制数量", that.max_count, that.min_count);
        }
        if (!that.max_count) {
          that.isPhoto = false;
          console.log("没有设置相册最大上传张数，关闭相册上传");
        }
      });
    },
    //初始化数据 distributionUserName
    initData() {
      this.recharge_mobile = "";
      this.show_recharge_mobile = "";
      this.show_domain = false;
      this.shop_domain = "";
      this.clicktag = 0;
      this.good_clicktag = 0;
      this.getDispatch = false;

      this.submit_active = true;
      //地址清空
      this.realname = "";
      this.mobile = "";
      this.address = "";

      this.linkinfo = {
        mobile: "",
        name: ""
      };
      this.oldOrder_data = [];
      this.order_data = [];
      this.defaultAddress = {};

      this.store_info = {};
      this.storeCarts = [];
      this.store_id = 0;
      this.selected = 0;
      this.showAddress = false;
      this.goodsInfo = {};
      this.order = {};
      this.dispatch = [];
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
      this.isShowCoupon = true;

      // 抵扣
      this.checkDeductionList = [];

      this.dispatch = [];
      // 续费商品
      this.goods_id = "";
      this.isGetAgreementPay = false;

      currentAddId = "";
      currentAddress = {};

      _cart_ids = [];

      //是否保存过自提点提货人和手机号信息，有的话自动填写【任务编号: 35632】
      let _ztdInfo = JSON.parse(window.localStorage.getItem("selfCarryInfo")) || {};
      if (this.$route.query.store_id) {
        //这是门店的
        this.linkinfo.name = !this.fun.isTextEmpty(_ztdInfo.distributionUserName) ? _ztdInfo.distributionUserName : "";
        this.linkinfo.mobile = !this.fun.isTextEmpty(_ztdInfo.distributionUserMobile) ? _ztdInfo.distributionUserMobile : "";
      } else {
        this.distributionUserName = this.$route.query.distributionUserName
          ? this.$route.query.distributionUserName
          : !this.fun.isTextEmpty(_ztdInfo.distributionUserName)
            ? _ztdInfo.distributionUserName
            : "";
        this.distributionUserMobile = this.$route.query.distributionUserMobile
          ? this.$route.query.distributionUserMobile
          : !this.fun.isTextEmpty(_ztdInfo.distributionUserMobile)
            ? _ztdInfo.distributionUserMobile
            : "";
      }

      this.isOpenTeam = false;
      this.isJoinTeam = false;
      this.isCueCoupon = false;
      this.openCueCoupon = false;

      this.fileList1 = []; //相册
      this.fileList2 = []; //相册
      this.show = false;
      this.imgIndex = 1; //相册图片预览起始位置
      this.isPhoto = false;
      this.checkedImg = true; //true为开启微信相册

      this.isShowDiyForm = false;
      this.diyform_id = 0;
      this.form_data_id = "";
      this.diyTitle = "";
      this.for_serviceFee_status = false;
      this.service_fee = [];
      this.is_open_store_delivery = false;
      this.locationName = "";
      this.district_id = this.$route.params.district_id || 0;
      this.deliveryScopeShow = false;
    },

    // 整合了发票、是否显示个人信息接口
    getParams(cart_ids) {
      let json = {};
      if (_root_tag == "store" && !cart_ids) {
        return;
      } else if (_root_tag == "store" && cart_ids) {
        _cart_ids = cart_ids;
      }
      if (cart_ids && this.$route.query.cart_ids && this.$route.query.cart_ids.split) {
        _cart_ids = this.$route.query.cart_ids.split(",");
      }
      let good_ids = [];

      if (_root_tag == TAG_ACTION_CART || _root_tag == "rentCartBuy" || _root_tag == "channel" || _root_tag == "channel_Replenishment" || _root_tag == "channel_TCOrder" || _root_tag == "-10") {
        // _cart_ids = this.$route.query.cart_ids.split(',');

        for (let j = 0; j < this.goodsInfo.orders.length; j++) {
          for (let i = 0; i < this.goodsInfo.orders[j].order_goods.length; i++) {
            good_ids.push(this.goodsInfo.orders[j].order_goods[i].goods_id);
          }
        }
        if (this.fun.isTextEmpty(good_ids)) {
          // 为空跳回
          this.$router.go(-1);
          return;
        }
      } else {
        _goodsId = this.$route.query.goodsId;
        good_ids.push(_goodsId);
      }
      json = {
        goods_ids: JSON.stringify(good_ids),
        mid: this.fun.getKeyByMid()
      };
      $http
        .get("from.div-from.get-params", json, " ")
        .then(
          response => {
            if (response.result === 1) {
              if (this.$route.query.orderType != "groupBuy_open" || this.$route.query.orderType != "groupBuy_join") {
                this.isGetAgreementPay = true;
                this.AgreementPay = response.data.getPayProtocol;
              }
              try {
                this.openCueCoupon = response.data.getCouponSet == 0 ? false : true; //是否开启下单优惠券提示
              } catch (error) {
                console.log(error);
              }
              this.checkTaxGoods(response.data.isDisplay);
              if (response.data.getMemberInfo) this.getMemberInfo(response.data.getMemberInfo);
              if (response.data.explain) this.getExplain(response.data.explain);

              this.getIvoice(response.data.sinvoice);
              this.storeSearchBtn = response.data.storeSearch || {};
            } else {
              this.isGetAgreementPay = false;
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

    gotoDiyform() {
      // let that = this;
      this.toRouter("GoodsOrderDiyForm", "push", {
        changeSelfCarry: JSON.stringify(this.defaultSelfCarry),
        distributionUserName: this.distributionUserName,
        distributionUserMobile: this.distributionUserMobile
      });
      // this.$router.push(
      //   this.fun.getUrl("GoodsOrderDiyForm", {
      //     tag: that.$route.query.tag,
      //     goodsId: that.$route.query.goodsId,
      //     optionsId: that.$route.query.optionsId,
      //     total: that.$route.query.total,
      //     id: that.diyform_id,
      //     form_data_id: that.form_data_id,
      //     changeSelfCarry: JSON.stringify(that.defaultSelfCarry),
      //     distributionUserName: that.distributionUserName,
      //     distributionUserMobile: that.distributionUserMobile
      //   })
      // );
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
      console.log("route", this.$route.query);
      var _goodsId = this.$route.query.goodsId;
      var _optionsId = this.$route.query.optionsId;
      var _total = this.$route.query.total;
      var submitActionTag = this.$route.query.tag;
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
      this.$dialog.alert({ message: this.explain_content });
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
      this.email = "";
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
        this.$dialog.alert({ message: "请填写抬头" });
        return;
      }
      if (this.iscur_b && this.fun.isTextEmpty(this.invoice_list.company_number)) {
        this.$dialog.alert({ message: "请添加纳税人识别号" });
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
    // 套餐购买
    goPackagBuy() {
      let that = this;
      let json = {
        package_id: _packagJson.package_id,
        goods: JSON.stringify(_packagJson.goods_list),
        member_coupon_ids: this.assembleCoupons(),
        orders: JSON.stringify(this.assembleDeduction()),
        address: JSON.stringify(currentAddress),
        dispatch_type_id: this.selected
      };
      $http.get("plugin.goods-package.frontend.package.package-buy.index", json, "生成中").then(
        function(response) {
          if (response.result === 1) {
            that.goodsInfo = response.data;
            that.cup_notice = true;
            that.setViewData(response.data); // 设置界面
            that.initCoupon(response.data.discount); // 设置优惠券信息
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

    // 直接购买
    getDataActionBuy() {
      let that = this;
      let json = {
        goods_id: _goodsId,
        total: _total,
        option_id: _optionsId,
        member_coupon_ids: this.assembleCoupons(),
        orders: JSON.stringify(this.assembleDeduction()),
        address: JSON.stringify(currentAddress),
        dispatch_type_id: this.selected,
        mark: this.$route.query.mark ? this.$route.query.mark : 0
      };

      //自提点开启
      if (this.selected == "8") {
        json.package_deliver_id = this.defaultSelfCarry.id;
      }

      if(this.default_deduction != 0) {
        json.no_deduction_ids = this.default_deduction;
      }

      let _URL_DataActionBuy = "";
      if (this.isOpenTeam) {
        console.log("一键开团，leveid", this.isOpenTeam);
        json.option_level_id = this.$route.query.option_level_id; //规格层级id
        json.level_id = this.$route.query.level_id; //一键开团 拼团层级id
        _URL_DataActionBuy = "plugin.fight-groups.frontend.controllers.team.pre-open-team";
        if (this.$route.query.groupStoreID) {
          json.store_id = this.$route.query.groupStoreID; //门店id
          //门店拼团
          _URL_DataActionBuy = "plugin.fight-groups.frontend.store.frontend-team.pre-open-team";
        }
      } else if (this.isJoinTeam) {
        console.log("去参团", this.isJoinTeam);
        json.team_id = this.$route.query.team_id; //一键开团 拼团层级id
        json.option_level_id = this.$route.query.option_level_id; //规格层级id
        _URL_DataActionBuy = "plugin.fight-groups.frontend.controllers.team.pre-join-team";
        if (this.$route.query.groupStoreID) {
          json.store_id = this.$route.query.groupStoreID; //门店id
          //门店拼团
          _URL_DataActionBuy = "plugin.fight-groups.frontend.store.frontend-team.pre-join-team";
        }
      } else if (that.$route.query.tag == "POrder") {
        //挂单商品
        json.pending_order_type = that.selected; //批发订单使用类型
        _URL_DataActionBuy = "plugin.pending-order.frontend.goods-buy.index";
      } else if (that.$route.query.orderType == "groupBuy_open") {
        //拼购商品开团
        json.at_id = that.$route.query.at_id; //活动ID
        delete json.option_id;
        _URL_DataActionBuy = "plugin.together-purchase.api.team.preOpenTeam";
      } else if (that.$route.query.orderType == "groupBuy_join") {
        //拼购商品参团
        json.at_id = that.$route.query.at_id; //活动ID
        json.leader_id = that.$route.query.leader_id; //团长ID
        delete json.option_id;
        _URL_DataActionBuy = "plugin.together-purchase.api.team.preJoinTeam";
      } else if (that.$route.query.orderType == "grabGroup_open") {
        //抢团开团
        json.option_id = 0;
        json.snatch_option_id = _optionsId;
        json.at_id = that.$route.query.at_id; //活动ID
        _URL_DataActionBuy = "plugin.snatch-regiment.api.team.preOpenTeam";
      } else if (that.$route.query.orderType == "grabGroup_join") {
        //抢团参团
        json.leader_id = that.$route.query.leader_id; //团长ID
        json.at_id = that.$route.query.at_id; //活动ID
        json.option_id = 0;
        json.snatch_option_id = _optionsId;
        _URL_DataActionBuy = "plugin.snatch-regiment.api.team.preJoinTeam";
      } else if (that.$route.query.store_id) {
        //门店拓客
        json.store_id = that.$route.query.store_id; //门店ID
        _URL_DataActionBuy = "plugin.store-cashier.frontend.store.goods-buy";
      } else if (that.$route.query.tag == "starGroup") {
        //星拼乐
        json.at_id = this.$route.query.at_id; //活动ID
        json.leader_id = this.$route.query.leader_id; //团ID
        json.goods_id = _goodsId;
        json.total = _total;
        json.option_id = _optionsId;
        _URL_DataActionBuy = "plugin.star-spell.frontend.team.joinTeam";
      } else if (that.$route.query.tag == "blindBox") {
        json.activity_id = this.$route.query.at_id; //活动ID
        json.goods_id = _goodsId;
        _URL_DataActionBuy = "plugin.blind-box.api.buy";
      } else if (that.$route.query.tag == "channel_buy") {
        //渠道商立即购买
        json.channel_type = "2"; //2进货
        _URL_DataActionBuy = "plugin.channel.frontend.replenish-goods-buy.index";
      } else if (that.fromStock == 1) {
        //云库存立即购买
        _URL_DataActionBuy = "plugin.agency.api.goods-buy.index";
      } else {
        _URL_DataActionBuy = "order.goods-buy";
      }

      if (this.good_clicktag === 0) {
        this.good_clicktag = 1;
        $http.post(_URL_DataActionBuy, json, "生成中").then(
          function(response) {
            if (response.result === 1) {
              that.goodsInfo = response.data;
              that.cup_notice = true;
              that.setViewData(response.data); // 设置界面
              that.initCoupon(response.data.discount); // 设置优惠券信息
              if (that.$route.query.orderType == "groupBuy_open" || that.$route.query.orderType == "groupBuy_join") {
                //拼购支付协议
                that.isGetAgreementPay = true;
                that.AgreementPay = that.goodsInfo.together_purchase_agreement;
              }
            } else {
              Toast(response.msg);
              that.$router.go(-1);
              that.cup_notice = true;
            }
            setTimeout(function() {
              that.good_clicktag = 0;
            }, 1000);
          },
          function(response) {
            console.log(response);
          }
        );
      }
    },

    //兑换中心进入兑换商品下单页调用
    getExchangeData(_id) {
      let that = this;
      let json = {
        goods_id: _goodsId,
        total: _total,
        option_id: _optionsId,
        member_coupon_ids: this.assembleCoupons(),
        orders: JSON.stringify(this.assembleDeduction()),
        address: JSON.stringify(currentAddress),
        dispatch_type_id: this.selected,
        mark: this.$route.query.mark ? this.$route.query.mark : 0
      };

      let _URL_DataActionBuy = "";
      //兑换中心商品
      let _exchangeData = that.$route.query.exchangeData;
      if (this.fun.isTextEmpty(_exchangeData)) {
        // 为空跳回
        this.$router.go(-1);
        return;
      }
      json.data = _exchangeData;
      json.is_exchange = _id == 0 ? 0 : 1;

      if (that.$route.query.store_id !== undefined) {
        json.store_id = that.$route.query.store_id;
        _URL_DataActionBuy = "plugin.store-cashier.frontend.store.exchange-center";
      } else {
        _URL_DataActionBuy = "coupon.exchange-center.exchange-buy";
      }
      $http.post(_URL_DataActionBuy, json, "").then(
        function(response) {
          if (response.result === 1) {
            that.goodsInfo = response.data;
            that.cup_notice = true;
            that.setViewData(response.data); // 设置界面
            that.DefaultSelectCoupon(response.data.discount.member_coupons); // 设置优惠券信息
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

    // 购物车结算
    getDataActionCart() {
      let that = this;
      let json = {
        cart_ids: _cart_ids,
        member_coupon_ids: this.assembleCoupons(),
        orders: JSON.stringify(this.assembleDeduction()),
        address: JSON.stringify(currentAddress),
        dispatch_type_id: this.selected
      };

      if(this.default_deduction != 0) {
        json.no_deduction_ids = this.default_deduction;
      }

      let _URL_ActionCart = "";
      if (_root_tag == "-10") {
        _URL_ActionCart = "plugin.pack-fixed-price.api.cart-buy.index";
      } else if (_root_tag == "communityBuy") {
        _URL_ActionCart = "plugin.package-deliver.frontend.cartBuy.index";
        json.dispatch_type_id = 8;
        json.package_deliver_id = this.$route.query.package_deliver_id;
        json.group_id = this.$route.query.group_id;
      } else {
        _URL_ActionCart = "order.cart-buy";
      }

      $http.get(_URL_ActionCart, json, "生成中").then(
        function(response) {
          if (response.result === 1) {
            that.goodsInfo = response.data;
            that.cup_notice = true;
            that.setViewData(response.data); // 设置界面
            that.initCoupon(response.data.discount); // 设置优惠券信息
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
    // 渠道商购物车结算(订货)
    getChannelActionCart() {
      let that = this;
      let json = {
        cart_ids: _cart_ids,
        member_coupon_ids: this.assembleCoupons(),
        orders: JSON.stringify(this.assembleDeduction()),
        address: JSON.stringify(currentAddress),
        dispatch_type_id: this.selected
      };

      let _URL_ActionCart = null;
      if (_root_tag == "channel_TCOrder") {
        _URL_ActionCart = "plugin.channel.frontend.replenish-cart-buy.index";
      } else {
        _URL_ActionCart = "plugin.channel.frontend.cart-buy.index";
        json.order_id = that.$route.query.order_id;
      }
      if (_root_tag == "channel" || _root_tag == "channel_TCOrder") {
        json.channel_type = 2; //订货
      } else if (_root_tag == "channel_Replenishment") {
        json.channel_type = 1; //补货
      }

      $http.get(_URL_ActionCart, json, "生成中").then(
        function(response) {
          if (response.result === 1) {
            that.goodsInfo = response.data;
            that.cup_notice = true;
            that.setViewData(response.data); // 设置界面
            that.initCoupon(response.data.discount); // 设置优惠券信息
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

    // 门店购物车商品
    getDataActionStoreCart() {
      let that = this;
      $http
        .get(
          "plugin.store-cashier.frontend.shoppingCart.member-cart.index",
          {
            store_id: that.store_id
          },
          ""
        )
        .then(
          response => {
            if (response.result === 1) {
              that.cup_notice = true;
              that.storeCarts = [];
              response.data.forEach(item => {
                that.storeCarts.push(item.id);
              });
              if (!that.isGetAgreementPay) {
                that.getParams(that.storeCarts);
              }
              that.getStoreCartBuy(that.storeCarts);
              if (JSON.parse(window.localStorage.getItem("globalParameter")).is_open_photo_order == "1" && that.storeCarts.length == 1) {
                //门店商品仅单个商品下单才可进行上传相册,多个商品购物车结算不开启
                console.log("开启相册上传模块");
                that.isPhoto = true; //开启相册上传模块
                that.max_count = Number(JSON.parse(window.localStorage.getItem("globalParameter")).photo_order_max_pohot); //最大上传张数
                that.min_count = Number(JSON.parse(window.localStorage.getItem("globalParameter")).photo_order_min_pohot)
                  ? Number(JSON.parse(window.localStorage.getItem("globalParameter")).photo_order_min_pohot)
                  : 1; //最小上传张数
              } else if (JSON.parse(window.localStorage.getItem("globalParameter")).is_open_photo_order == "1") {
                that.storeNo_photo = true;
              }
            } else {
              that.cup_notice = true;
              alert("无商品");
            }
          },
          response => {}
        );
    },

    // 门店结算
    getStoreCartBuy(cart_ids) {
      let that = this;
      let json = {
        cart_ids: cart_ids,
        store_id: that.store_id,
        dispatch_type_id: this.selected,
        member_coupon_ids: this.assembleCoupons(),
        orders: JSON.stringify(this.assembleDeduction()),
        address: JSON.stringify(currentAddress)
      };
      $http.get("plugin.store-cashier.frontend.store.cart-buy", json, "生成中").then(
        function(response) {
          if (response.result === 1) {
            that.goodsInfo = response.data;
            that.setViewData(response.data); // 设置界面
            that.initCoupon(response.data.discount); // 设置优惠券信息
          } else {
            // 编辑地址时不提示错误信息
            if (that.popAddAddress) {
              return;
            }
            if (response.msg === "请完善地址经纬度信息") {
              // 门店配送提示不能返回上一页 #62588
              Toast("请完善收件人的地址经纬度信息");
            } else {
              Toast(response.msg);
              that.$router.go(-1);
            }
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },

    // 设置界面
    setViewData(data) {
      let that = this;
      if(data.discount.default_deduction != 0) {
        this.default_deduction = data.discount.default_deduction;
      }
      if (this.$route.query.myinfo) {
        // 如果是修改信息页面回来就重新请求
        this.getParams_status = false;
      }
      if (!this.getParams_status) {
        this.getParams_status = true;
        this.getParams();
      }
      if (_root_tag != "POrder") {
        //挂单不适用商城整合统一的配送方式
        this.dispatch = data.dispatch.delivery_method; //配送方式
        if (this.fun.isTextEmpty(this.dispatch)) {
          this.selected = 0;
        } else {
          this.selected = this.selected == 0 ? data.dispatch.delivery_method[0].dispatch_type_id : this.selected; //默认第一
          // if (this.$route.params.pointId) {
          //   this.selected = 3;
          // }
        }
      }
      this.setAddressViewData(data.dispatch.default_member_address); // 设置地址界面
      //判断是否有订单需要填写地址
      this.show_address = this.isOrderAddress_M(data.orders);
      if (data.is_agency_restock && data.is_agency_restock == 1) {
        this.show_address = true;
      }
      this.order_data = data.orders;

      // console.log("this.....", data.dispatch.delivery_method);
      if (!this.getDispatch && !this.fun.isTextEmpty(data.dispatch.delivery_method) && _root_tag != "communityBuy") {
        //第一次请求接口获取配送方式后，需要取默认第一个的dispatch_type_id重新请求接口
        this.getDispatch = true;
        this.dispatch.forEach(items => {
          if (items.dispatch_type_id == 8) {
            console.log("有自提点配送方式，请求定位获取自提点列表");
            that.getLocation();
          }
        });
        this.good_clicktag = 0;
        this.requestByAddress();
        return;
      }

      // console.log(data, '参数data')
      this.service_fee_items = data.service_fee_items;

      // 处理提交表单后，点击积分抵扣和优惠券这些需要重新请求接口数据时，之前保存的表单id被覆盖问题
      if (!this.fun.isTextEmpty(this.oldOrder_data)) {
        for (let index = 0; index < this.goodsInfo.orders.length; index++) {
          that.goodsInfo.orders[index].order_goods = that.oldOrder_data.orders[index].order_goods;
        }
      }

      //判断有订单是否有绑定域名
      this.shop_domain = this.getOrderDomain(data.orders);

      this.findGoodOpen(); // 循环订单列表是否开启表单和慢充
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

        this.$dialog.alert({ message: "下单错误" });
      }
    },

    // 设置地址界面
    setAddressViewData(model) {
      if (model == undefined || model == "" || model == []) {
        return;
      }
      // 设置地址id
      currentAddId = model.id || model.address_id;
      currentAddress = model;
      this.realname = this.fun.isTextEmpty(model.username) ? "" : model.username;
      this.mobile = this.fun.isTextEmpty(model.mobile) ? "" : model.mobile;
      this.address = this.fun.isTextEmpty(model.province)
        ? ""
        : model.province + " " + model.city + " " + model.district + " " + (this.fun.isTextEmpty(model.street) ? "" : model.street + " ") + model.address;
    },

    // 选择地址后重新计算数据
    requestByAddress() {
      // 重新计算
      if (
        _root_tag == TAG_ACTION_BUY ||
        _root_tag == "appointment_goods" ||
        _root_tag == "yun_sign_goods" ||
        _root_tag == "activity" ||
        _root_tag == "starGroup" ||
        _root_tag == "blindBox" ||
        _root_tag == "channel_buy"
      ) {
        this.order_data = "";
        this.getDataActionBuy(); // 直接购买
      } else if (_root_tag == "fromExchange") {
        this.order_data = "";
        this.getExchangeData(); // 兑换中心
      } else if (_root_tag == TAG_ACTION_CART || _root_tag == "-10" || _root_tag == "communityBuy") {
        this.order_data = "";
        this.getDataActionCart(); // 购物车结算
      } else if (_root_tag == "channel" || _root_tag == "channel_Replenishment" || _root_tag == "channel_TCOrder") {
        this.order_data = "";
        this.getChannelActionCart(); // 渠道商购物车结算
      } else if (_root_tag == "store") {
        this.getDataActionStoreCart(); // 门店结算
      } else if (_root_tag == "rentCartBuy" || _root_tag == "rentBuy") {
        this.rentGoodBuy();
      } else if (_root_tag == "packagBuy") {
        // 套餐购买
        this.order_data = "";
        this.goPackagBuy();
      }
    },

    //显示地址pop
    showDistribution() {
      //获取配送站信息
      this.popupDistribution = true;
    },

    //显示地址pop
    showAddressFun() {
      // 获取收货地址
      this.yzAddressListOptions = {
        is_open_store_delivery: this.is_open_store_delivery,
        selected: this.selected
      };
      this.showAddress = true;
    },

    //获取当前位置信息，用于提交订单
    getCurrentOrderLocation() {
      return new Promise((resolev, reject) => {
        Toast.loading({
          message: "获取位置信息",
          forbidClick: true
        });
        var mapObj = new AMap.Map("iCenter");
        mapObj.plugin("AMap.Geolocation", () => {
          var geolocation = new AMap.Geolocation({
            enableHighAccuracy: true, // 是否使用高精度定位，默认:true
            timeout: 10000, // 超过10秒后停止定位，默认：无穷大
            maximumAge: 0, // 定位结果缓存0毫秒，默认：0
            convert: true, // 自动偏移坐标，偏移后的坐标为高德坐标，默认：true
            showButton: true, // 显示定位按钮，默认：true
            buttonPosition: "LB", // 定位按钮停靠位置，默认：'LB'，左下角
            buttonOffset: new AMap.Pixel(10, 20), // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
            showMarker: true, // 定位成功后在定位到的位置显示点标记，默认：true
            showCircle: true, // 定位成功后用圆圈表示定位精度范围，默认：true
            panToLocation: true, // 定位成功后将定位到的位置作为地图中心点，默认：true
            zoomToAccuracy: true // 定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
          });
          mapObj.addControl(geolocation);
          geolocation.getCurrentPosition();
          AMap.event.addListener(geolocation, "complete", obj => {
            Toast.clear();
            //console.log("执行1");
            resolev({
              positioning_success: 1,
              province: obj.addressComponent.province,
              city: obj.addressComponent.city
            });
          }); // 返回定位信息
          AMap.event.addListener(geolocation, "error", () => {
            Toast.clear();
            //console.log("执行2");
            resolev({
              positioning_success: 0,
              province: "",
              city: ""
            });
          }); // 返回定位出错信息
        });
      });
    },

    // 门店商品提交
    submitStore() {
      if (!this.goodsInfo.orders) {
        return;
      }
      let that = this;
      let json = this.assembleJson();

      if (this.isHasInstall()) {
        //有勾选了上门安装服务，需要填写经纬度和时间
        if (!this.installDate) {
          Toast("请选择预约时间！");
          this.submit_active = true;
          return;
        }
        if (!this.location || !this.location.point || !this.location.point.lat) {
          Toast("请选择地理位置！");
          this.submit_active = true;
          return;
        }
        if (this.fun.isMoblie(this.linkinfo.mobile)) {
          this.$dialog.alert({ message: "请输入正确的手机号" });
          this.submit_active = true;
          return;
        }
        let live_install_json = {
          live_install: {
            longitude: this.location.point.lng,
            latitude: this.location.point.lat,
            reserve_time: this.fun.getTimestamp(this.installDate),
            install_comment: this.install_comment
          }
        };
        Object.assign(json, live_install_json);
      }

      if (this.store_info.delivery_information == null || this.store_info.delivery_information == 0) {
        if (this.selected == "8" && !this.show_address) {
          if (!this.defaultSelfCarry.id) {
            Toast("请选择自提点");
            this.submit_active = true;
            return;
          }
          if (this.fun.isTextEmpty(this.distributionUserName)) {
            Toast("请填写提货人姓名");
            this.submit_active = true;
            return;
          }
          if (this.fun.isTextEmpty(this.distributionUserMobile)) {
            Toast("请输入提货人手机");
            this.submit_active = true;
            return;
          }
          this.save_ztd_LocalStorage(this.distributionUserName, this.distributionUserMobile);
        }

        if ((this.selected == "0" || this.selected == "1" || this.selected == "3") && this.fun.isTextEmpty(currentAddId)) {
          if (!this.show_address) {
            Toast("请选择收货地址");
            this.submit_active = true;
            return;
          }
        }

        // let json1 = {
        //   dispatch_type_id: this.selected,
        //   store_id: this.store_id,
        //   mobile: this.store_info.store_mobile,
        //   realname: this.store_info.store_name,
        //   address: JSON.stringify(currentAddress),
        //   goods: JSON.stringify(this.assembleGoods()),
        //   cart_ids: JSON.stringify(this.storeCarts),
        //   member_coupon_ids: JSON.stringify(this.assembleCoupons()),
        //   orders: JSON.stringify(this.assembleDeduction()),
        //   // 发票
        //   invoice_type: this.iscur_c ? 0 : 1,
        //   rise_type: this.iscur ? 1 : 0,
        //   call: this.invoice_list.call,
        //   email: this.invoice_list.email,
        //   company_number: this.invoice_list.company_number
        // };
        // console.log(json1,"json")

        if (this.$store.state.liveRoomID) {
          json.room_id = this.$store.state.liveRoomID;
        }

        if (this.clicktag === 0) {
          this.clicktag = 1;
          $http
            .post("plugin.store-cashier.frontend.store.create", json, "提交中")
            .then(
              response => {
                if (response.result === 1) {
                  that.$router.replace(
                    that.fun.getUrl("orderpay", {
                      status: "2",
                      order_ids: response.data.order_ids
                    })
                  );
                } else {
                  Toast(response.msg);
                }
                setTimeout(function() {
                  that.clicktag = 0;
                }, 1000);
              },
              function(response) {
                that.submit_active = true;
                console.log(response);
              }
            )
            .catch(err => {
              that.submit_active = true;
              console.log(err);
            });
        }
      } else if (this.store_info.delivery_information == 1) {
        if (this.selected == "8") {
          if (!this.defaultSelfCarry.id) {
            Toast("请选择自提点");
            this.submit_active = true;
            return;
          }
          if (this.fun.isTextEmpty(this.distributionUserName)) {
            Toast("请填写提货人姓名");
            this.submit_active = true;
            return;
          }
          if (this.fun.isTextEmpty(this.distributionUserMobile)) {
            Toast("请输入提货人手机");
            this.submit_active = true;
            return;
          }
          this.save_ztd_LocalStorage(this.distributionUserName, this.distributionUserMobile);
        } else if (this.selected == "0" || this.selected == "1" || this.selected == "3") {
          if (!this.show_address) {
            if (this.fun.isTextEmpty(currentAddId)) {
              Toast("请选择收货地址");
              this.submit_active = true;
              return;
            }
          }
        }

        if (this.selected == "2") {
          if (this.fun.isTextEmpty(this.linkinfo.name) || this.fun.isTextEmpty(this.linkinfo.mobile)) {
            Toast("请输入提货人信息");
            return;
          } else {
            this.save_ztd_LocalStorage(this.linkinfo.name, this.linkinfo.mobile);
          }
        }

        if ((this.selected == "0" || this.selected == "1" || this.selected == "3") && this.fun.isTextEmpty(currentAddId)) {
          if (!this.show_address) {
            Toast("请选择收货地址");
            this.submit_active = true;
            return;
          }
        }

        if (this.selected == "2" && this.fun.isMoblie(this.linkinfo.mobile)) {
          this.$dialog.alert({ message: "请输入正确的手机号" });
          return;
        }

        if (this.clicktag === 0) {
          this.clicktag = 1;
          $http
            .post("plugin.store-cashier.frontend.store.create", json, "提交中")
            .then(
              response => {
                if (response.result === 1) {
                  that.$router.replace(
                    that.fun.getUrl("orderpay", {
                      status: "2",
                      order_ids: response.data.order_ids
                    })
                  );
                } else {
                  Toast(response.msg);
                }
                setTimeout(function() {
                  that.clicktag = 0;
                }, 1000);
              },
              function(response) {
                console.log(response);
              }
            )
            .catch(err => {
              console.log(err);
            });
        }
      }
    },
    isHasInstall() {
      //判断是否有勾选了上门安装服务
      for (let j = 0; j < this.service_fee_items.length; j++) {
        if (this.service_fee_items[j].code == "liveInstall") {
          return true;
        }
      }
      return false;
    },

    // 普通商品提交订单
    submit() {
      if (!this.goodsInfo.orders) {
        return;
      }

      let that = this;
      console.log("state===res", this.submit_active);
      if (this.isPhoto) {
        //相册模块开启下单时判断 是否符合条件
        if (this.fileList1.length < this.min_count) {
          this.$dialog.alert({ message: `上传图片张数不应少于${this.min_count}张` });
          return;
        }
      }
      if (this.mustSelectCoupon()) {
        // 提示优惠券【51723】
        return;
      }
      //渠道商订货补货不需要填写地址
      let isNeedAddress = !(this.$route.query.tag == "channel" || this.$route.query.tag == "channel_Replenishment" || this.$route.query.tag == "channel_TCOrder");

      if (this.submit_active == true) {
        this.submit_active = false;
        let json = this.assembleJson();

        if (this.isAllDFOk()) {
          Toast("请填写表单！");
          this.submit_active = true;
          return;
        }

        // 手机慢充
        if (this.show_recharge_mobile && !this.recharge_mobile) {
          Toast("请输入充值手机号码！");
          this.submit_active = true;
          return;
        } else if (this.show_recharge_mobile && this.recharge_mobile) {
          let myreg = /^[1][0-9]{10}$/;
          if (!myreg.test(this.recharge_mobile)) {
            Toast("请输入正确的充值手机号码！");
            this.submit_active = true;
            return;
          }
        }

        if (this.AgreementPay && !this.isRent) {
          if (!this.agreementPay) {
            Toast("请勾选支付协议");
            this.submit_active = true;
            return;
          }
        }

        if (this.show_domain && !this.shop_domain) {
          Toast("请先新增/绑定站点");
          this.submit_active = true;
          return;
        }

        if (this.selected == "2" && this.store_info.delivery_information == 1) {
          if (this.fun.isTextEmpty(this.linkinfo.name) || this.fun.isTextEmpty(this.linkinfo.mobile)) {
            Toast("请输入提货人信息");
            this.submit_active = true;
            return;
          } else {
            this.save_ztd_LocalStorage(this.linkinfo.name, this.linkinfo.mobile);
          }
        }

        if (this.isRent) {
          if (this.store_id) {
            this.submitStore();
            this.submit_active = true;
            return;
          }
          if (!this.show_address && (this.selected == "0" || this.selected == "1") && isNeedAddress) {
            if (this.fun.isTextEmpty(currentAddId)) {
              Toast("请选择收货地址");
              this.submit_active = true;
              return;
            }
          }

          if (!this.agreement) {
            Toast("请勾选租赁协议");
            this.submit_active = true;
            return;
          }

          if (this.selected == "8") {
            if (!this.defaultSelfCarry.id) {
              Toast("请选择自提点");
              this.submit_active = true;
              return;
            }
            if (this.fun.isTextEmpty(this.distributionUserName)) {
              Toast("请填写提货人姓名");
              this.submit_active = true;
              return;
            }
            if (this.fun.isTextEmpty(this.distributionUserMobile)) {
              Toast("请输入提货人手机");
              this.submit_active = true;
              return;
            }
            this.save_ztd_LocalStorage(this.distributionUserName, this.distributionUserMobile);
          } else if (this.selected == "0" || this.selected == "1") {
            if (!this.show_address) {
              if (this.fun.isTextEmpty(currentAddId)) {
                Toast("请选择收货地址");
                this.submit_active = true;
                return;
              }
            }
          }
          // console.log("我执行了吗",json);
          if (this.clicktag === 0) {
            this.clicktag = 1;
            let orderCreate = "";
            if (this.isPhoto) {
              orderCreate = "plugin.photo-order.api.create";
            } else if (_root_tag == "POrder") {
              orderCreate = "plugin.pending-order.frontend.create.index";
            } else if (_root_tag == "appointment_goods") {
              orderCreate = "plugin.appointment.frontend.order.create";
            } else if (_root_tag == "channel" || _root_tag == "channel_Replenishment") {
              orderCreate = "plugin.channel.frontend.create.index";
            } else if (_root_tag == "channel_TCOrder") {
              orderCreate = "plugin.channel.frontend.replenish-create.index";
            } else if (_root_tag == "yun_sign_goods") {
              orderCreate = "plugin.yun-sign.frontend.order.create";
            } else if (_root_tag == "activity") {
              orderCreate = "plugin.activity-apply.api.create";
            } else if (_root_tag == "-2" && (this.$route.query.orderType == "groupBuy_open" || this.$route.query.orderType == "groupBuy_join")) {
              orderCreate = "plugin.together-purchase.api.create.index";
            } else if (_root_tag == "-2" && (this.$route.query.orderType == "grabGroup_open" || this.$route.query.orderType == "grabGroup_join")) {
              json.option_id = 0;
              json.snatch_option_id = _optionsId;
              orderCreate = "plugin.snatch-regiment.api.create.index";
            } else if (_root_tag == "-10") {
              //一口价
              orderCreate = "plugin.pack-fixed-price.api.create.index";
              // json.cart_ids = JSON.parse(this.$route.query.cart_ids)
              let fixedArr = this.$route.query.cart_ids.split(",");
              json.cart_ids = JSON.stringify(fixedArr);
            } else if (that.$route.query.tag == "channel_buy") {
              //渠道商立即购买
              json.channel_type = "2";
              orderCreate = "plugin.channel.frontend.replenish-create.index";
            } else {
              orderCreate = "plugin.lease-toy.api.order.create";
            }
            console.log(json);

            $http
              .post(orderCreate, json, "提交中")
              .then(
                function(response) {
                  if (response.result === 1) {
                    that.clearStorage();
                    that.$router.replace(
                      that.fun.getUrl("orderpay", {
                        status: "2",
                        order_ids: response.data.order_ids
                      })
                    );
                  } else {
                    Toast(response.msg);
                  }
                  that.submit_active = true;
                  setTimeout(function() {
                    that.clicktag = 0;
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
        } else {
          if (this.store_id) {
            this.submitStore();
            this.submit_active = true;
            return;
          }

          if (this.selected == "8") {
            if (!this.defaultSelfCarry.id) {
              Toast("请选择自提点");
              this.submit_active = true;
              return;
            }
            if (this.fun.isTextEmpty(this.distributionUserName)) {
              Toast("请填写提货人姓名");
              this.submit_active = true;
              return;
            }
            if (this.fun.isTextEmpty(this.distributionUserMobile)) {
              Toast("请输入提货人手机");
              this.submit_active = true;
              return;
            }
            this.save_ztd_LocalStorage(this.distributionUserName, this.distributionUserMobile);
          } else if (this.selected == "0" || this.selected == "1") {
            if (!this.show_address) {
              if (this.fun.isTextEmpty(currentAddId)) {
                Toast("请选择收货地址");
                this.submit_active = true;
                return;
              }
            }
          }

          if (!this.show_address && (this.selected == "0" || this.selected == "1") && isNeedAddress) {
            if (this.fun.isTextEmpty(currentAddId)) {
              Toast("请选择收货地址");
              this.submit_active = true;
              return;
            }
          }

          if (this.clicktag === 0) {
            this.clicktag = 1;

            let orderCreates = "";
            if (this.isPhoto) {
              orderCreates = "plugin.photo-order.api.create";
            } else if (this.isOpenTeam || this.isJoinTeam) {
              orderCreates = "plugin.fight-groups.frontend.controllers.create.index";
              if (this.$route.query.groupStoreID) {
                orderCreates = "plugin.fight-groups.frontend.store.create.index";
                json.store_id = this.$route.query.groupStoreID;
              }
            } else if (_root_tag == "POrder") {
              orderCreates = "plugin.pending-order.frontend.create.index";
            } else if (_root_tag == "buyCar") {
              orderCreates = "plugin.staging-buy-car.frontend.create.index";
            } else if (_root_tag == "appointment_goods") {
              orderCreates = "plugin.appointment.frontend.order.create";
            } else if (_root_tag == "channel" || _root_tag == "channel_Replenishment") {
              orderCreates = "plugin.channel.frontend.create.index";
            } else if (_root_tag == "channel_TCOrder") {
              orderCreates = "plugin.channel.frontend.replenish-create.index";
            } else if (_root_tag == "yun_sign_goods") {
              orderCreates = "plugin.yun-sign.frontend.order.create";
            } else if (_root_tag == "activity") {
              orderCreates = "plugin.activity-apply.api.create";
            } else if (_root_tag == "-2" && (this.$route.query.orderType == "groupBuy_open" || this.$route.query.orderType == "groupBuy_join")) {
              orderCreates = "plugin.together-purchase.api.create.index";
            } else if (_root_tag == "-2" && (this.$route.query.orderType == "grabGroup_open" || this.$route.query.orderType == "grabGroup_join")) {
              json.option_id = 0;
              json.snatch_option_id = _optionsId;
              orderCreates = "plugin.snatch-regiment.api.create.index";
            } else if (_root_tag == "-10") {
              //一口价
              orderCreates = "plugin.pack-fixed-price.api.create.index";
              let fixedArr = this.$route.query.cart_ids.split(",");
              json.cart_ids = JSON.stringify(fixedArr);
            } else if (_root_tag == "communityBuy") {
              //社区团购
              orderCreates = "plugin.package-deliver.frontend.create.index";
              json.group_id = this.$route.query.group_id;
              json.package_deliver_id = this.$route.query.package_deliver_id;
            } else if (_root_tag == "starGroup") {
              json.at_id = this.$route.query.at_id; //活动ID
              json.leader_id = this.$route.query.leader_id; //团ID
              json.goods_data = {
                goods_id: _goodsId,
                total: _total,
                option_id: _optionsId
              };

              orderCreates = "plugin.star-spell.frontend.create.index";
            } else if (_root_tag == "blindBox") {
              //盲盒
              json.activity_id = this.$route.query.at_id; //活动ID
              orderCreates = "plugin.blind-box.api.create";
            } else if (that.$route.query.tag == "channel_buy") {
              //渠道商立即购买
              json.channel_type = "2";
              orderCreates = "plugin.channel.frontend.replenish-create.index";
            } else if (this.fromStock == 1) {
              // 云库存
              orderCreates = "plugin.agency.api.create.index";
            } else {
              if (this.is_cps) {
                // 如果是聚合cps的商品走立即购买换这个接口
                orderCreates = "plugin.aggregation-cps.api.create-order";
                if (this.cpsType == "1") {
                  // 直冲需要填写帐号
                  if (this.cpsTxt == "") {
                    Toast("请输入帐号");
                    return;
                  } else {
                    json.recharge_number = this.cpsTxt;
                  }
                }
              } else {
                orderCreates = "order.create";
              }
            }
            // console.log("我执行了吗",json);
            $http
              .post(orderCreates, json, "提交中")
              .then(
                function(response) {
                  if (response.result === 1) {
                    that.deleteAddressData();
                    if (that.is_cps) {
                      // 聚合cps商品下单
                      that.$router.replace(
                        that.fun.getUrl("orderpay", {
                          status: "2",
                          order_ids: response.data.order_ids,
                          iscps: true
                        })
                      );
                    } else {
                      that.$router.replace(
                        that.fun.getUrl("orderpay", {
                          status: "2",
                          order_ids: response.data.order_ids
                        })
                      );
                    }
                  } else {
                    Toast(response.msg);
                  }
                  that.submit_active = true;
                  setTimeout(function() {
                    that.clicktag = 0;
                  }, 1000);
                },
                function(response) {
                  that.submit_active = true;
                  console.log(response);
                }
              )
              .catch(err => {
                that.submit_active = true;
                console.log(err);
              });
          }
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
        email: this.invoice_list.email,
        company_number: this.invoice_list.company_number,
        dispatch_type_id: this.selected //配送方式 ，1：快递 ||2：门店自提||3：门店配送（送货上门）||8：自提点
      };
      // 分销活动页面购买的商品，带活动id
      if (this.$route.query.activity_id) {
        json.activity_id = this.$route.query.activity_id;
      }

      if (this.hasGoodOpenDF) {
        //有商品开启自定义表单
        console.log("有商品开启自定义表单");
        json.order_goods = JSON.stringify(this.assembleGoodsDFData());
      }

      if (this.show_recharge_mobile) {
        //有商品开启话费慢充
        console.log("有商品开启话费慢充");
        json.order_goods = JSON.stringify(this.assembleGoodsTELData());
      }

      if (_root_tag == TAG_ACTION_BUY || _root_tag == "buyCar" || _root_tag == "appointment_goods" || _root_tag == "yun_sign_goods" || _root_tag == "activity" || _root_tag == "blindBox") {
        json.mark = this.$route.query.mark;
        //isOpenTeam 一键开团
        if (this.isOpenTeam) {
          json.level_id = this.$route.query.level_id;
          json.option_level_id = this.$route.query.option_level_id;
          if (this.$route.query.groupStoreID) {
            json.store_id = this.$route.query.groupStoreID; //门店id
          }
        } else if (this.isJoinTeam) {
          json.team_id = this.$route.query.team_id;
          json.option_level_id = this.$route.query.option_level_id;
          if (this.$route.query.groupStoreID) {
            json.store_id = this.$route.query.groupStoreID; //门店id
          }
        } else if (this.$route.query.store_id) {
          // 门店拓客
          json.store_id = Number(this.$route.query.store_id);
          json.mobile = this.linkinfo.mobile;
          json.realname = this.linkinfo.name;
          json.cart_ids = [];
        }
      } else if (_root_tag == TAG_ACTION_CART || _root_tag == "channel" || _root_tag == "channel_Replenishment" || _root_tag == "channel_TCOrder" || _root_tag == "communityBuy") {
        json.cart_ids = JSON.stringify(_cart_ids);
      } else if (_root_tag == "store") {
        json.store_id = this.store_id;
        json.mobile = this.linkinfo.mobile;
        json.realname = this.linkinfo.name;
        json.cart_ids = JSON.stringify(this.storeCarts);
      } else if (_root_tag == "rentCartBuy" || _root_tag == "rentBuy") {
        let right = window.localStorage.getItem("rentTimeRight");
        let choose = window.localStorage.getItem("rentTimeChoose");
        let self = window.localStorage.getItem("rentTimeSelf");
        let r = this.fun.isTextEmpty(right) == null ? [] : right;
        let assem = {};

        if (!this.fun.isTextEmpty(choose)) {
          assem = choose;
        } else if (!this.fun.isTextEmpty(self)) {
          assem = self;
        } else {
          assem = {};
        }

        json.lease_rights = r;
        json.lease_term = assem;
        json.cart_ids = JSON.stringify(_cart_ids);
        json.mark = this.$route.query.mark;
      } else if (_root_tag == "packagBuy") {
        // 套餐购买
        json.package_id = _packagJson.package_id;
      } else if (_root_tag == "POrder") {
        json.mark = this.$route.query.mark;
        json.pending_order_type = this.selected;
      } else if (_root_tag == "fromExchange") {
        // 兑换中心
        json.mark = this.$route.query.mark;
      }

      if (this.isPhoto) {
        //相册参数
        json.thumbs = this.fileList1;
        json.is_open_photo_order = 1;
      }

      if (this.isShowDiyForm) {
        json.diyform_id = this.form_data_id; //自定义表单
      }

      if (this.selected == "8") {
        json.package_deliver_id = this.defaultSelfCarry.id;
        json.realname = this.distributionUserName;
        json.mobile = this.distributionUserMobile;
        delete json.address;
      }
      if (_root_tag == "channel" || _root_tag == "channel_TCOrder") {
        json.channel_type = 2;
        json.address = {};
      } else if (_root_tag == "channel_Replenishment") {
        json.channel_type = 1;
        json.order_id = this.$route.query.order_id;
        json.address = {};
      }

      if (
        this.$route.query.orderType == "groupBuy_open" ||
        this.$route.query.orderType == "groupBuy_join" ||
        this.$route.query.orderType == "grabGroup_open" ||
        this.$route.query.orderType == "grabGroup_join"
      ) {
        //拼购
        json.at_id = this.$route.query.at_id;
        json.leader_id = this.$route.query.leader_id || 0;
      }

      if (this.$store.state.liveRoomID) {
        json.room_id = this.$store.state.liveRoomID;
      }
      if (this.selected == "2") {
        json.mobile = this.linkinfo.mobile;
        json.realname = this.linkinfo.name;
      }
      if (this.selected == "3") {
        json.mobile = this.store_info.store_mobile;
        json.realname = this.store_info.store_name;
      }

      Object.assign(json, this.orderLocationObj);
      console.log(json);
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
          model.option_id = this.goodsInfo.orders[j].order_goods[i].goods_option_id;
          newGoods.push(model);
        }
      }
      return newGoods;
    },
    assembleGoodsDFData() {
      //组装商品自定义表单信息
      let newGoodsDF = [];
      for (let j = 0; j < this.goodsInfo.orders.length; j++) {
        for (let i = 0; i < this.goodsInfo.orders[j].order_goods.length; i++) {
          if (this.goodsInfo.orders[j].order_goods[i].diy_form) {
            let modelDF = {};
            modelDF.pre_id = this.goodsInfo.orders[j].order_goods[i].pre_id;
            modelDF.diyform_data_id = this.goodsInfo.orders[j].order_goods[i].diy_form.diyform_data_id;
            newGoodsDF.push(modelDF);
          }
        }
      }
      return newGoodsDF;
    },

    assembleGoodsTELData() {
      //组装商品话费慢充信息
      let newGoodsDF = [];
      let modelDF = {};
      modelDF.pre_id = this.show_recharge_mobile;
      modelDF.mobile = this.recharge_mobile;
      newGoodsDF.push(modelDF);
      return newGoodsDF;
    },

    // 组装优惠券json信息
    assembleCoupons() {
      let coupons = [];
      console.log("参数==========", this.checkCouponList);
      for (let i = 0; i < this.checkCouponList.length; i++) {
        if (this.is_coupon_SELE) {
          //开启折叠优惠券
          console.log("this.checkCouponList[0].num", this.coupons_temp[this.checkCouponList[i].coupon_id].num);
          let conpon_arr = this.checkCouponList[i].has_conpon_id;
          coupons = coupons.concat(conpon_arr.slice(0, this.coupons_temp[this.checkCouponList[i].coupon_id].num));
          this.use_coupon_size = coupons.length;
        } else {
          coupons.push(this.checkCouponList[i].id);
        }
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
      // let that = this;
      this.isShowCoupon = coupon.whether_show_coupon == "1" ? true : false;
      this.coupon_size = coupon.member_coupons.length;
      this.is_coupon_SELE = coupon.coupon_show == "1" ? true : false;
      if (this.is_coupon_SELE) {
        let arr2 = coupon.member_coupons.sort(function(a, b) {
          return a.expired_at - b.expired_at;
        });
        // console.log("排序数组-------------------", arr2)
        // this.coupons = coupon.member_coupons;
        this.initSelectCoupon(arr2);
      } else {
        this.coupons = coupon.member_coupons;
      }
    },
    mustSelectCoupon() {
      // 后台设置，下单前判断有优惠券数量但没使用时，是否提示并展开选择优惠券弹窗，只提示一次！
      if (this.openCueCoupon && this.coupon_size > 0 && this.use_coupon_size < 1 && !this.isCueCoupon) {
        //显示优惠券列表弹窗
        // 按钮文字改变
        // Toast('当前订单有优惠券符合使用条件')
        this.isCueCoupon = true;
        this.popupCouponSpecs = true;
        return true;
      }
      return false;
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
    selectCoupon(value, valObj, num) {
      // 处理选择
      // this.screenCoupon(value)
      // 因为换了组件改调用方法
      this.screenCoupon(value, valObj, num);
      // 设置已经使用多少优惠券
      this.use_coupon_size = this.checkCouponList.length;

      // 重新计算
      if (_root_tag == TAG_ACTION_BUY || _root_tag == "appointment_goods" || _root_tag == "yun_sign_goods" || _root_tag == "activity" || _root_tag == "channel_buy" || _root_tag == "blindBox") {
        this.getDataActionBuy(); // 直接购买
      } else if (_root_tag == "fromExchange") {
        this.getExchangeData(0); // 兑换中心
      } else if (_root_tag == TAG_ACTION_CART || _root_tag == "-10" || _root_tag == "communityBuy") {
        this.getDataActionCart(); // 购物车结算
      } else if (_root_tag == "channel" || _root_tag == "channel_Replenishment" || _root_tag == "channel_TCOrder") {
        this.getChannelActionCart(); // 渠道商购物车结算
      } else if (_root_tag == "store") {
        this.getDataActionStoreCart(); // 门店结算
      } else if (_root_tag == "rentCartBuy" || _root_tag == "rentBuy") {
        this.rentGoodBuy();
      } else if (_root_tag == "packagBuy") {
        // 套餐购买
        this.goPackagBuy();
      }
    },
    chooseCoupon(index, valid) {
      if (valid) {
        this.coupons[index].checked = true;
      }
    },

    // 筛选数据优惠券状态
    screenCoupon(value, valObj, num) {
      // console.log(value,valObj,"valObj");
      var tarValue = valObj;
      if (value) {
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

        if (this.is_coupon_SELE && value) {
          //开启折叠优惠券并且为点击复选框为选中状态
          this.coupons_temp[tarValue.coupon_id].num = num || 1;
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
        if (this.is_coupon_SELE && !value) {
          //开启折叠优惠券并且为点击复选框为选中状态
          this.coupons_temp[tarValue.coupon_id].num = 0;
        }
      }
    },
    //折叠优惠券
    initSelectCoupon(coupon) {
      let coupon_data = coupon;
      let result = [];
      let temp = {};

      for (let i = 0; i < coupon_data.length; i++) {
        let num = 0; //同类型已选中并符合使用条件的优惠券数量
        let valid = 0; //最高限制使用数量
        let has_conpon_id = [coupon_data[i].id];
        if (coupon_data[i].checked) {
          num++;
        }
        if (coupon_data[i].valid) {
          valid++;
        }
        for (let j = i + 1; j < coupon_data.length; j++) {
          // console.log("33333333==================", coupon_data[j].coupon_id)
          if (coupon_data[i].coupon_id == coupon_data[j].coupon_id) {
            if (coupon_data[j].checked) {
              num++;
            }
            if (coupon_data[j].valid) {
              valid++;
            }
            has_conpon_id.push(coupon_data[j].id);
            coupon_data.splice(j, 1);
            j--;
          }
        }
        let _data = coupon_data[i];
        _data.has_conpon_id = has_conpon_id;
        _data.valid_num = valid;
        result.push(_data);
        temp[coupon_data[i].coupon_id] = {};
        temp[coupon_data[i].coupon_id].num = num;
      }
      this.coupons_temp = temp;
      this.coupons = result;
      // console.log(this.coupons, this.coupons_temp,"coupons_temp");
    },
    changeConpon(num, data) {
      let valObj = data.name;
      // console.log('=================', num, data, valObj.valid_num)
      if (num > valObj.valid_num) {
        Toast(`使用张数已达上限`);
        this.stepper_show = 1; //添加原因van-stepper的value只有第一次有
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          // 注意此时修改 value 后会再次触发 change 事件
          this.coupons_temp[valObj.coupon_id].num = valObj.valid_num;
          this.stepper_show = 0;
        }, 200);

        // this.$set(this.coupons_temp[valObj.coupon_id], "num", valObj.valid_num);
        return;
      } else if (num == "" || num == undefined || num == 0) {
        Toast("暂不使用请取消勾选");
        return;
      } else {
        clearTimeout(this.timer);
        this.coupons_temp[valObj.coupon_id].num = num;
        // console.log(num,this.coupons_temp[valObj.coupon_id].num,this.coupons_temp,"this.coupons_temp");
      }

      // clearTimeout方法，以便控制连续触发带来的无用调用
      let value = {
        target: { checked: true }
      };
      let that = this;
      if (this.timeoutId) {
        clearTimeout(this.timeoutId); // 先清除之前的延时，并在下面重新开始计算时间
      }
      this.timeoutId = setTimeout(function() {
        // 200毫秒以后执行方法
        that.selectCoupon(value, valObj, num);
      }, 200); // 如果还没有执行就又被触发，会根据上面的clearTimeout来清除并重新开始计算
    },
    // 抵扣选择响应,运费选择
    discountHandle(item, value, tag) {
      if (this.good_clicktag === 0) {
        if (tag == "discount") {
          this.screenDiscount(item, value);
        } else if (tag == "serviceFee") {
          this.serviceFeesHandle(item, value);
        }

        this.discount_price = 0;
        // 重新计算
        if (_root_tag == TAG_ACTION_BUY || _root_tag == "appointment_goods" || _root_tag == "yun_sign_goods" || _root_tag == "activity" || _root_tag == "channel_buy" || _root_tag == "blindBox") {
          this.getDataActionBuy(); // 直接购买
        } else if (_root_tag == "fromExchange") {
          this.getExchangeData(0); // 直接购买
        } else if (_root_tag == TAG_ACTION_CART || _root_tag == "-10" || _root_tag == "communityBuy") {
          this.getDataActionCart(); // 购物车结算
        } else if (_root_tag == "channel" || _root_tag == "channel_Replenishment" || _root_tag == "channel_TCOrder") {
          this.getChannelActionCart(); // 渠道商购物车结算
        } else if (_root_tag == "store") {
          this.getDataActionStoreCart(); // 门店结算
        } else if (_root_tag == "rentCartBuy" || _root_tag == "rentBuy") {
          this.rentGoodBuy();
        } else if (_root_tag == "packagBuy") {
          // 套餐购买
          this.goPackagBuy();
        }
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
              if (this.fun.isTextEmpty(this.checkDeductionList[i].deduction_ids)) {
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
          }
          // tempDeduction_ids.push(value.code)
          _deductionItem.deduction_ids = tempDeduction_ids;
          _deductionItem.pre_id = item.pre_id;
          _deductionItem.note = this.note[item.pre_id];
          this.checkDeductionList.push(_deductionItem);
        } else {
          if (tempDeduction_ids.length > 0) {
            for (let j = 0; j < tempDeduction_ids.length; j++) {
              if (tempDeduction_ids[j] == value.code) {
                tempDeduction_ids.splice(j, 1);
              }
            }
          }
          // tempDeduction_ids.push(value.code)
          _deductionItem.deduction_ids = tempDeduction_ids;
          _deductionItem.pre_id = item.pre_id;
          _deductionItem.note = this.note[item.pre_id];
          this.checkDeductionList.push(_deductionItem);
        }
      } else {
        this.screenDiscount(item, item.order_deductions[0]);
      }

      console.log("this.checkDeductionList::::", this.checkDeductionList);
    },
    serviceFeesHandle(item, value) {
      let _this = this;
      //服务费、运费复选框
      let _data = {};
      if (this.checkDeductionList.length > 0) {
        for (let i = 0; i < this.checkDeductionList.length; i++) {
          if (this.checkDeductionList[i].pre_id == item.pre_id) {
            if (this.service_fee[item.pre_id].indexOf("liveInstall") > -1 && !location_loading) {
              location_loading = 1;
              this.fun
                .getLocation()
                .then(function(res) {
                  _this.location = res;
                  location_loading = 2;
                })
                .catch(function(err) {
                  Toast("定位失败，请手动切换定位！");
                  location_loading = 2;
                  _this.location.address = "定位失败，请手动切换！";
                  console.log(err);
                });
            }
            this.checkDeductionList[i].service_fee = this.service_fee[item.pre_id];
            return;
          }
        }
        _data.pre_id = item.pre_id;
        _data.service_fee = this.service_fee[item.pre_id];
        this.checkDeductionList.push(_data);
      } else {
        _data.pre_id = item.pre_id;
        _data.service_fee = this.service_fee[item.pre_id];
        this.checkDeductionList.push(_data);
        if (this.service_fee[item.pre_id].indexOf("liveInstall") > -1 && !location_loading) {
          location_loading = 1;
          this.fun
            .getLocation()
            .then(function(res) {
              location_loading = 2;
              _this.location = res;
            })
            .catch(function(err) {
              location_loading = 2;
              _this.location.address = "定位失败，请手动切换！";
              console.log(err);
            });
        }
      }
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
              if (this.fun.isTextEmpty(this.checkDeductionList[i].deduction_ids)) {
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
          }
          tempDeduction_ids.push(value.code);
          _deductionItem.deduction_ids = tempDeduction_ids;
          _deductionItem.pre_id = item.pre_id;
          _deductionItem.note = this.note[item.pre_id];
          _deductionItem.service_fee = this.service_fee[item.pre_id];
          this.checkDeductionList.push(_deductionItem);
        } else {
          if (tempDeduction_ids.length > 0) {
            for (let j = 0; j < tempDeduction_ids.length; j++) {
              if (tempDeduction_ids[j] == value.code) {
                tempDeduction_ids.splice(j, 1);
              }
            }
          }
          tempDeduction_ids.push(value.code);
          _deductionItem.deduction_ids = tempDeduction_ids;
          _deductionItem.pre_id = item.pre_id;
          _deductionItem.note = this.note[item.pre_id];
          _deductionItem.service_fee = this.service_fee[item.pre_id];
          this.checkDeductionList.push(_deductionItem);
        }
      } else {
        // 取消选中
        if (this.checkDeductionList.length > 0) {
          for (let i = 0; i < this.checkDeductionList.length; i++) {
            if (this.checkDeductionList[i].pre_id == item.pre_id) {
              // 先获取回来
              if (this.fun.isTextEmpty(this.checkDeductionList[i].deduction_ids)) {
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
            _deductionItem.service_fee = this.service_fee[item.pre_id];
            this.checkDeductionList.push(_deductionItem);
          } else {
            // tempDeduction_ids.push(value.code)
            _deductionItem.deduction_ids = tempDeduction_ids;
            _deductionItem.pre_id = item.pre_id;
            _deductionItem.note = this.note[item.pre_id];
            _deductionItem.service_fee = this.service_fee[item.pre_id];
            this.checkDeductionList.push(_deductionItem);
          }
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
            _deductionItem.service_fee = this.service_fee[item.pre_id];
            this.checkDeductionList.push(_deductionItem);
          } else {
            // tempDeduction_ids.push(value.code)
            _deductionItem.deduction_ids = tempDeduction_ids;
            _deductionItem.pre_id = item.pre_id;
            _deductionItem.note = this.note[item.pre_id];
            _deductionItem.service_fee = this.service_fee[item.pre_id];
            this.checkDeductionList.push(_deductionItem);
          }
        }
      }

      // console.log('checkList:', this.checkDeductionList)
    },

    // 增加/修改地址
    confirmSelectAddress(item) {
      console.log(item);
      this.setAddressViewData(item);
      this.requestByAddress(); // 选择地址后重新计算
      this.showAddress = false;
    },
    // 新增地址v2----------------------------------------------新增地址v2//

    alertMyInfo() {
      this.toRouter("myinfo", "push");
      // this.$router.push(
      //   this.fun.getUrl("myinfo", {
      //     tag: this.$route.query.tag,
      //     goodsId: this.$route.query.goodsId,
      //     optionsId: this.$route.query.optionsId,
      //     total: this.$route.query.total
      //   })
      // );
    },
    //更换自提点 （杨朗）
    replaceZT(flag) {
      this.save_ztd_LocalStorage(this.distributionUserName, this.distributionUserMobile);
      if (flag === "noLocation") {
        this.toRouter("SelfCarry_info", "replace", { goods: JSON.stringify(this.assembleGoods()), noLocation: 1 });
      } else {
        this.toRouter("SelfCarry_info", "replace", { goods: JSON.stringify(this.assembleGoods()) });
      }
      // this.$router.replace(
      //   this.fun.getUrl("SelfCarry_info", {
      //     tag: this.$route.query.tag,
      //     goodsId: this.$route.query.goodsId,
      //     optionsId: this.$route.query.optionsId,
      //     total: this.$route.query.total,
      //     id: this.diyform_id, //跳转到其他页面的参数传递逻辑太重复了，后期必须优化统一跳转参数。。。。看看上面的跳转返回alertMyInfo
      //     form_data_id: this.form_data_id,
      //     cart_ids: this.$route.query.cart_ids,
      //     store_id: this.$route.query.store_id
      //   })
      // );
    },

    //门店过期商品下单
    getCashGood() {
      $http.get("plugin.store-cashier.frontend.store.enter.getSetGoodsId", {}, "").then(
        response => {
          if (response.result === 1) {
            this.goods_id = response.data.goods_id;
            if (!response.data.store) {
              _goodsId = this.goods_id;
              _root_tag = "-2";
              this.store_id = 0;
              this.getDataActionBuy();
            } else {
              _root_tag = "store";

              this.store_info = response.data.store;
              this.dispatch = response.data.dispatch.delivery_method;
              that.setAddressViewData(response.data.dispatch.default_member_address); // 设置地址界面
              this.getDataActionStoreCart();
            }
          } else {
            Toast(response.msg);
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },

    initStore(str) {
      const that = this;
      this.recipient_name = "";
      this.recipient_mobile = "";
      $http.get("plugin.store-cashier.frontend.store.get-store-info.get-info-by-store-id", { store_id: that.store_id || that.$route.query.groupStoreID }, " ").then(
        function(response) {
          if (response.result === 1) {
            // that.dispatch = response.data.dispatch.delivery_method;
            that.setAddressViewData(response.data.dispatch.default_member_address); // 设置地址界面
            that.store_info = response.data;
            console.log("dispatch::::", that.dispatch);
            that.recipient_name = response.data.store_carry.name;
            that.recipient_mobile = response.data.store_carry.number;
            if (str !== "is_activity" && !that.$route.query.groupStoreID) {
              that.getDataActionStoreCart();
            }
            // 门店配送数据
            //开启门店配送
            if (that.store_info.dispatch_type.indexOf(3) != -1) {
              if (that.store_info.store_delivery && that.store_info.store_delivery.delivery_status == 1) {
                console.log("111111111111111111111111111111111111");
                that.is_open_store_delivery = true;
                that.delivery_note = that.store_info.store_delivery ? that.store_info.store_delivery.delivery_note : "";
                that.delivery_note = that.delivery_note.replace(/\n|\r/g, "<br/>"); //文本域换行处理
                let delivery_area = that.store_info.store_delivery ? that.store_info.store_delivery.delivery_area : [];
                let locations = that.store_info.store_delivery ? that.store_info.store_delivery.locations : [];
                let arr_delivery_area = [];
                delivery_area.forEach((item, index) => {
                  arr_delivery_area.push([Number(item.R), Number(item.Q)]);
                });
                that.delivery_area = arr_delivery_area;
                that.locations = [Number(locations.longitude).toFixed(6), Number(locations.latitude).toFixed(6)];
              }
            }
            // 门店配送-选择定位页面跳转回下单页
            // if(this.$route.params.pointId) {
            //   this.initAddress();
            // }
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

    // 租赁购物车结算
    getRentDataActionCart(right, rent) {
      if (_root_tag == "rentCartBuy") {
        let that = this;
        let json = {
          lease_rights: right,
          lease_term: rent,
          cart_ids: _cart_ids,
          member_coupon_ids: this.assembleCoupons(),
          orders: JSON.stringify(this.assembleDeduction()),
          address: JSON.stringify(currentAddress),
          dispatch_type_id: this.selected,
          mark: this.$route.query.mark
        };

        //自提点开启
        if (this.selected == "8") {
          json.package_deliver_id = this.defaultSelfCarry.id;
        }

        $http.get("plugin.lease-toy.api.order.cart-buy", json, "生成中").then(
          function(response) {
            if (response.result == 1) {
              that.goodsInfo = response.data;
              that.cup_notice = true;
              // that.order = response.data.order
              that.setViewData(response.data); // 设置界面
              that.initCoupon(response.data.discount); // 设置优惠券信息
            } else {
              that.cup_notice = true;
              Toast(response.msg);
              that.$router.go(-1);
            }
          },
          function(response) {
            console.log(response);
          }
        );
      } else if (_root_tag == "rentBuy") {
        let that = this;
        let json = {
          lease_rights: right,
          lease_term: rent,
          goods_id: _goodsId,
          total: _total,
          option_id: _optionsId,
          member_coupon_ids: this.assembleCoupons(),
          orders: JSON.stringify(this.assembleDeduction()),
          address: JSON.stringify(currentAddress),
          dispatch_type_id: this.selected,
          mark: this.$route.query.mark ? this.$route.query.mark : 0
        };

        //自提点开启
        if (this.selected == "8") {
          json.package_deliver_id = this.defaultSelfCarry.id;
        }

        $http.get("plugin.lease-toy.api.order.goods-buy", json, "生成中").then(
          function(response) {
            // console.log(response.data)
            if (response.result == 1) {
              that.goodsInfo = response.data;
              that.cup_notice = true;
              // that.order = response.data.order
              that.setViewData(response.data); // 设置界面
              that.initCoupon(response.data.discount); // 设置优惠券信息
            } else {
              Toast(response.msg);
              that.$router.go(-1);
            }
          },
          function(response) {
            console.log(response);
          }
        );
      }
    },

    // 获取租期列表
    getRentTimeList() {
      $http
        .get("plugin.lease-toy.api.lease-term.index", {})
        .then(response => {
          // console.log(response)
          if (response.result == 1) {
            this.rentTime = response.data.list;
            this.rentFree = response.data.level.rent_free;
            this.agreeCon = response.data.lease_toy_set;
            this.rent_deposit_free = response.data.level.deposit_free;
            this.rent_free = response.data.level.rent_free;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    // 权益商品选择事件
    rentSelect() {
      // console.log(this.isOpenRight);
      // 1.判断是否选择权益商品，有则租期按照会员权益日期计算
      this.clearStorage();
      this.judgeIsRight();
      if (this.isOpenRight) {
        let arr = [];

        this.order_data.forEach(val => {
          val.order_goods.forEach(item => {
            // console.log(item)
            let obj = {
              goods_id: item.goods_id,
              total: item.total
            };
            arr.push(obj);
          });
        });

        window.localStorage.setItem("rentTimeRight", JSON.stringify(arr));

        this.getRentDataActionCart(JSON.stringify(arr), []);
      } else if (!this.isOpenRight) {
        this.currentIndex = "999";
        this.getRentDataActionCart([], []);
      } else {
        return;
      }
    },

    // 判断是否选择权益商品
    judgeIsRight() {
      if (this.isOpenRight) {
        this.isRightChoose = false;
      } else {
        this.isRightChoose = true;
      }
    },

    // 选择租期
    rentTimeChoose(item, index) {
      if (this.currentIndex == index) {
        this.currentIndex = "999";
        this.clearStorage();
        this.getRentDataActionCart([], []);
      } else {
        this.clearStorage();
        this.currentIndex = index;

        let obj = {
          days: 0,
          lease_term_id: item.id
        };

        window.localStorage.setItem("rentTimeChoose", JSON.stringify(obj));
        this.getRentDataActionCart([], JSON.stringify(obj));
      }
    },

    // 选择自定义租期
    rentSelfChoose() {
      this.clearStorage();
      this.currentIndex = "999";
      //   .then(({ value, action }) => {
      //     // console.log(value)
      //     if (this.fun.isTextEmpty(value)) {

      //       this.$dialog.alert({message:'租期不能为空'});
      //       return
      //     }

      //     let obj = {
      //       days: value,
      //       lease_term_id: 0
      //     }

      //     window.localStorage.setItem('rentTimeSelf', JSON.stringify(obj))
      //     this.getRentDataActionCart([], JSON.stringify(obj))
      //   })
      //   .catch(error => {
      //     console.log('取消自定义租期！！！')
      //   })
      this.showPop = true;
    },
    activation() {
      // console.log(value)
      if (this.fun.isTextEmpty(this.popCode)) {
        this.$dialog.alert({ message: "租期不能为空" });
        return;
      }

      let obj = {
        days: this.popCode,
        lease_term_id: 0
      };

      window.localStorage.setItem("rentTimeSelf", JSON.stringify(obj));
      this.getRentDataActionCart([], JSON.stringify(obj));
    },
    //租赁商品下单
    rentGoodBuy() {
      if (this.isOpenRight) {
        this.getRentDataActionCart(window.localStorage.getItem("rentTimeRight"), []);
      } else {
        if (this.currentIndex == "999") {
          if (!this.fun.isTextEmpty(window.localStorage.getItem("rentTimeSelf"))) {
            let val = window.localStorage.getItem("rentTimeSelf");
            this.getRentDataActionCart([], val);
          } else {
            this.getRentDataActionCart([], []);
          }
        } else {
          if (!this.fun.isTextEmpty(window.localStorage.getItem("rentTimeChoose"))) {
            let param = window.localStorage.getItem("rentTimeChoose");
            this.getRentDataActionCart([], param);
          }
        }
      }
    },

    getOrderDomain(_data) {
      for (let j = 0; j < _data.length; j++) {
        if (_data[j].plugin_id === 58) {
          this.plugin_id = 58;
        }
      }
      //判断有订单是否有绑定域名  有则取第一个
      //return 已绑定域名
      for (let j = 0; j < _data.length; j++) {
        if (_data[j].domain !== undefined) {
          // 是否应用市场产品的商品
          this.show_domain = true;
        }
        if (_data[j].domain) {
          console.log("已绑定域名");
          return _data[j].domain;
        }
      }
      return "";
    },

    isOrderAddress_M(_data) {
      //判断是否有订单需要填写地址，有一单需要填写地址则需要填写地址才可以下单
      //return false 提交订单需要填写地址
      for (let j = 0; j < _data.length; j++) {
        if (!_data[j].need_address) {
          console.log("有订单需要填写地址");
          return false;
        }
      }
      return true;
    },
    toRouter(url, jumpType, params, query) {
      if (jumpType === "replace") {
        this.$router.replace(
          this.fun.getUrl(
            url,
            {
              tag: this.$route.query.tag,
              goodsId: this.$route.query.goodsId,
              optionsId: this.$route.query.optionsId,
              total: this.$route.query.total,
              id: this.diyform_id,
              form_data_id: this.form_data_id,
              cart_ids: this.$route.query.cart_ids,
              store_id: this.$route.query.store_id,
              ...params
            },
            { ...query }
          )
        );
      } else {
        this.$router.push(
          this.fun.getUrl(
            url,
            {
              tag: this.$route.query.tag,
              goodsId: this.$route.query.goodsId,
              optionsId: this.$route.query.optionsId,
              total: this.$route.query.total,
              id: this.diyform_id,
              form_data_id: this.form_data_id,
              cart_ids: this.$route.query.cart_ids,
              store_id: this.$route.query.store_id,
              ...params
            },
            { ...query }
          )
        );
      }
    },

    toSite() {
      let query = {};
      if (!this.shop_domain) {
        if (this.plugin_id) {
          query = { plugin_id: this.plugin_id };
        }
        this.toRouter("bindingSite", "replace", {}, query);
      }
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

    getLocation() {
      let that = this;
      this.fun
        .getLocation()
        .then(function(res) {
          that.getList(res);
        })
        .catch(function(err) {
          that.isQuest_ing = false;
        });
    },
    //获取自提点列表（杨朗）
    getList(_data) {
      let that = this;
      let p = this.fun.bd_encrypt(_data.point.lng, _data.point.lat);
      let json = {
        city_name: _data.city,
        lat: p.lat,
        lng: p.lng,
        kwd: "",
        goods: JSON.stringify(this.assembleGoods())
      };
      this.isQuest_ing = true;
      $http.get("plugin.package-deliver.frontend.deliver.getList", json).then(
        function(response) {
          that.isQuest_ing = false;
          if (response.result === 1) {
            that.deliverName = response.data.name;
            if (that.fun.isTextEmpty(that.defaultSelfCarry.id)) {
              that.defaultSelfCarry = response.data.list.data[0] ? response.data.list.data[0] : ""; //没有就取第一个为默认自提点。。。
            }
          } else {
            Toast(response.msg);
          }
        },
        function(response) {
          that.isQuest_ing = false;
          console.log(response);
        }
      );
    },

    getPendingOrder_type() {
      //获取批发区下单页类型判断
      //挂单不适合配送方式
      let that = this;
      $http
        .get("plugin.pending-order.frontend.wholesale-area.pending-order-type", {}, "")
        .then(response => {
          // console.log(response)
          if (response.result == 1) {
            if (response.data.status == 0) {
              that.dispatch = [
                { name: "零售", dispatch_type_id: 0 },
                { name: "自用", dispatch_type_id: 1 }
              ];
              that.selected = 0;
            } else {
              that.dispatch = [{ name: "自用", dispatch_type_id: 1 }];
              that.selected = 1;
            }
            that.getDataActionBuy(); // 直接购买
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    findGoodOpen() {
      for (let j = 0; j < this.goodsInfo.orders.length; j++) {
        if (this.goodsInfo.orders[j].require_mobile) {
          console.log("有商品开启话费慢充！！！");
          this.recharge_tips = this.goodsInfo.orders[j].tips;
          this.show_recharge_mobile = this.goodsInfo.orders[j].order_goods[0].pre_id;
        }
        for (let i = 0; i < this.goodsInfo.orders[j].order_goods.length; i++) {
          if (this.goodsInfo.orders[j].order_goods[i].diy_form) {
            console.log("有商品开启自定义表单！！！");
            this.hasGoodOpenDF = true;
          }
        }
      }
    },
    isAllDFOk() {
      //判断是否有商品开启自定义表单但是没有提交的，没提交过的diyform_data_id为0
      let that = this;
      if (this.goodsInfo.orders) {
        for (let j = 0; j < this.goodsInfo.orders.length; j++) {
          for (let i = 0; i < that.goodsInfo.orders[j].order_goods.length; i++) {
            if (that.goodsInfo.orders[j].order_goods[i].diy_form && that.goodsInfo.orders[j].order_goods[i].diy_form.diyform_data_id == 0) {
              console.log("有未填写的表单！！！");
              return true;
            }
          }
        }
      }
    },
    dfsave(_dyData) {
      console.log("diyFormPopup组件它点击提交了,这是它的数据", _dyData);
      let that = this;
      for (let j = 0; j < this.goodsInfo.orders.length; j++) {
        for (let i = 0; i < that.goodsInfo.orders[j].order_goods.length; i++) {
          if (that.goodsInfo.orders[j].order_goods[i].goods_id == that.activeDYGoodID) {
            that.goodsInfo.orders[j].order_goods[i].diy_form.diyform_data_id = _dyData;
            console.log("设置that.goodsInfo", that.goodsInfo);
            that.oldOrder_data = that.goodsInfo;
            that.dyFormPopup = false;
            return;
          }
        }
      }
    },
    getGoodDFData(_gID, _dyID, _fDataID) {
      console.log("表单id;;;;;", _gID, _dyID, _fDataID);
      this.goodDYDormID = _dyID;
      this.activeDYGoodID = _gID;
      this.activeFormDataID = _fDataID;
      let that = this;
      let _json = {
        form_id: _dyID
      };
      if (_fDataID) {
        _json.form_data_id = _fDataID;
      }
      $http.get("plugin.diyform.api.diy-form.getSingleFormData", _json).then(
        function(response) {
          if (response.result === 1) {
            that.dfData = response.data;
            that.dyThumb = response.data.thumb ? response.data.thumb : null;
            that.dyDescription = response.data.description ? response.data.description : null;
            that.dyTiitle = response.data.title ? response.data.title : "表单信息";
            that.dyFormPopup = true;
          } else {
            that.$dialog.alert({ message: response.msg });
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    //下单页优化提货人姓名和电话自动填上上次填写的信息【任务编号: 35632】
    save_ztd_LocalStorage(_name, _mobile) {
      let _memberInfoes = {
        distributionUserName: _name,
        distributionUserMobile: _mobile
      };
      localStorage.setItem("selfCarryInfo", JSON.stringify(_memberInfoes));
    },
    // 门店配送-查看配送范围
    showDeliveryMap() {
      this.deliveryScopeShow = true;
    },
    showLocationPop() {
      if (location_loading != 2) return;
      this.showLocation = true;
    },
    confirmLocation(data) {
      this.location = data;
    }
  },
  components: { cTitle, cDyPopup, deliveryMap, yzAddressList, location },
  watch: {}
};
