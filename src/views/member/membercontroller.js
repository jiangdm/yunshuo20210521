// import { mapMutations } from "vuex";
import cTitle from "../../components/title";
import { setInterval } from "core-js";
import { Toast } from "vant";

// 旧装修
import showmembercenter from "components/member/member_head";
import showmemberincome from "components/member/member_head_middle";
import showmemberorder from "components/member/member_head_bottom";
import showmemberhotelorder from "components/member/member_order";
import showmembercarorder from "components/member/member_carorder";
import showmemberleaseorder from "components/member/member_lease";
import showmembersnatchorder from "components/member/member_grab_group";
import showmembertool from "components/member/member_tool";
import showmembermerchant from "components/member/member_merchant";
import showmembermarket from "components/member/member_market";
import showmemberasset from "components/member/member_asset";
import showmembergrouporder from "components/member/member_fight_groups";
import showdiyform from "components/temp/form";
import showsign from "components/temp/showsign";
import showflashsale from "components/member/time_limit";
import showcoupon from "components/cupcon";
import showarticle from "components/article";
import showheadline from "components/topline";
import showassemble from "components/time_group";
import showbanner from "components/temp/banner";
import showmenu from "components/temp/menu";
import showtitle from "components/temp/title";
import showsearch from "components/temp/search";
import showline from "components/temp/line";
import showblank from "components/temp/blank";
import showrichtext from "components/temp/richtext";
import showpicture from "components/temp/picture";
import showcube from "components/temp/cube";
import showarea from "components/temp/area";
import showshop from "components/temp/shop";
import showgoods from "components/member/goods";
import shownearbygoods from "components/member/near_goods";
import shownotice from "components/temp/notice";
import showlocation from "components/temp/location";
import showstore from "components/temp/stores";
import showbusiness from "components/temp/business";
import showvideo from "components/temp/video";

//新装修
import U_memberasset from "components/new_diy/memberasset";
import U_membermarket from "components/new_diy/membermarket";
import U_membermerchant from "components/new_diy/membermerchant";
import U_memberorder from "components/new_diy/memberorder";
import U_memberrights from "components/new_diy/memberrights";
import U_membertool from "components/new_diy/membertool";
import U_membertop from "components/new_diy/membertop";

// import QRCode from 'qrcode';
import html2canvas from "html2canvas";
import yzGoodsposter from "components/ui_components/yz_goodsPoster";

// let isMCreated = 0;
window.memberAdvertisement = 1; //弹出周期设置为关闭网页(弹窗广告)
const documentElement = document.documentElement;
const body = document.body;

export default {
  data() {
    return {
      show_member_id: "",
      member_agent: "",
      city: "",
      point: {},
      address: "",
      Toast: "",
      myType: window.localStorage.type,
      // 华侨币
      coin: false,

      pluginsList: [],

      coin_name: "",
      // 是否开启关系链
      relation_switch: false,
      // 不否开户爱心值插件
      isLove: false,
      // 爱心值名称
      love_name: "",
      // 是否有推广下线资格 0-无资格；1-有资格
      is_agent: 0,
      // 我的推荐人
      // MyReferrer: '',
      // 二维码
      qrcode: "",
      allLoaded: false,
      // 刷新组件的运行状态
      topStatus: "",
      // 余额
      balance_value: "0.00",
      // 积分
      integral: "",
      // 优惠券
      coupon: "",
      // 会员名字
      username: "",
      // 头像
      avatar: "",
      createtime: "",
      // 余额
      credit: "",
      // 版权
      copyright: "",
      //版权图片
      copyrightImg: "",
      // 1男
      gender: 1,
      group_id: "",
      group_name: "",
      has_one_fans: {
        followed: 1,
        uid: 9
      },
      level_id: 2,
      // 会员等级
      level_name: "",
      mobile: "",
      nickname: "",
      realname: "",
      uid: "",
      waitPay: 0,
      waitSend: 0,
      waitReceive: 0,
      waitrRefund: 0,
      // 供应商申请
      supplier: "",
      haveShop: "",
      plugins: [],

      poster: "",
      poster_Data: {
        poster_data: null,
        background: {}
      },
      poster_id: null, //海报id

      store_set: {
        is_cash_pay: "",
        is_open_cashier: "",
        is_write_information: ""
      },

      is_custom: false, // 自定义参数
      custom_title: "", // 自定义title
      custom_value: "", // 自定义值

      is_validity: false, // 会员等级时间限制
      validity_value: "", // 会员等级时间限制 数据

      isELive: false, // 生活缴费开关

      is_stroeWithdraw: false, // 门店提现
      isApp: false,

      // is_extension: false, //推广

      signs: false,
      sign_name: "",

      // 帮助中心
      helps: false,
      help_name: "",

      // 冻结币
      froze_name: "",
      is_froze: false,

      // 门店申请和供应商申请开关
      is_o2oApply: true,
      is_supplierApply: true,
      supplier_id: "",

      // 显示提现
      // isWithdraw: false,
      // 邀请码
      inviteCode: "",
      isshowInvit: "",
      // 是否是推广员
      isGeneralize: "",
      // 会员等级是否可点击
      isMemberGrade: false,
      // 爱心值
      love_obj: {},
      integral_show: {},

      template: "",
      // 点击展示
      activeNames: ["3"],
      // 酒店订单显示
      is_hotel: false,
      // 网约车订单显示
      is_open_net_car: false,
      // 酒店订单
      hotel_order: {},
      //拼团订单
      groups_order: {},
      grabGroup_order: {}, //抢团
      PageNameList: {},
      // 租凭订单显示
      is_open_lease_toy: false,
      lease_order: [], // 租凭订单数量数组
      lease_order_one: {},
      lease_order_two: {},
      lease_order_three: {},
      lease_order_four: {},

      //装修
      designer: {},
      showDiy: [],
      designerStatus: false,
      // car: {},
      member_order: {},
      // 当前的会员model
      member_item: {},
      wechat_login_mode: false,

      //提现字样
      name_of_withdrawal_text: "",
      loadingImg: true,

      //H5端没有做的入口
      notShow: ["coupons_qrcode"],

      isDecorate: false, //是否新装修
      clientWidth: "375",
      id: "M" + new Date().getTime(),
      popShow: false,
      advertising: {},
      components: [],
      page_id: "",
      isBottom: false,
      btnFlag: false,

      posterShow: false,
      isNewPosterPlugin: false, //是否为新海报插件
      toastPoster: null,
      current_page: 1,
      total_page: 0,
      isLoadMore: true,
      lastIndex: ""
    };
  },
  activated() {
    setTimeout(() => {
      this.member_agent =
        JSON.parse(window.localStorage.getItem("mailLanguage")).agent && JSON.parse(window.localStorage.getItem("mailLanguage")).agent.agent
          ? JSON.parse(window.localStorage.getItem("mailLanguage")).agent.agent
          : "客户";
      this.$forceUpdate();
    }, 2000);
    if (!this.fun.isTextEmpty(window.sessionStorage.getItem("signHref"))) {
      window.location.href = window.sessionStorage.getItem("signHref");
    }
    // var province = localStorage.getItem("province")
    // if (province == null) {
    // 	this.fun.getAddressInfo(); //获取地址json数据
    // }
    this.isApp = this.fun.isApp();
    // if (isMCreated === 1) {
    //   this.designer = JSON.parse(window.localStorage.getItem("yzdesigner"));
    this.getMemberData();
    // }
    wx.miniProgram.postMessage({
      data: { goods_title: this.$store.state.temp.item.janst }
    });
    //提现字样
    this.customizeIncome();
    this.fun.setWXTitle($i18n.t("会员中心"));
    // this.getMemberInfo()
    // this.getEnablePlugin()

    // this.getStroeWithdraw()
    // this.getExtension()
    // this.getMemberGrade()

    // this.getMemberCustom();//获取自定义数据
    window.addEventListener("scroll", this.handleScroll);
  },
  deactivated() {
    window.removeEventListener("scroll", this.handleScroll);
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
  created() {
    // if (isMCreated === 0) {
    //   this.newTemplate();
    // }
  },
  updated() {
    // isMCreated = 1;
  },
  /*
    会员中心插件分类：
     营销互动：客户、优惠券、二维码、评论、
     实用工具：设置、收藏、足迹、地址管理、消息通知
  */
  mounted() {},
  methods: {
    switch1() {
      if ($i18n.locale == "zh") {
        $i18n.locale = "en";
      } else {
        $i18n.locale = "zh";
      }
    },
    // new
    getMemberData() {
      $http
        .post("member.member.member-data", { v: 2 }, " ")
        .then(
          response => {
            console.log(response, "0000000");
            if (response.result === 1) {
              if (this.$store.state.temp.item.is_decorate === 1) {
                this.getNewDecorate(response.data.designer.data);
                this.designerStatus = response.data.designer.status;
                window.yzdesignerStatus = this.designerStatus;
              } else {
                this.newTemplate(response.data.designer);
              }

              this.getMemberInfo(response.data.member, response.data.order, response.data.plugins);

              this.lease_order = response.data.order.lease_order;
              if (!this.fun.isTextEmpty(this.lease_order)) {
                this.lease_order.map(item => {
                  if (item.status == "0") {
                    this.lease_order_one = item;
                  } else if (item.status == "1") {
                    this.lease_order_two = item;
                  } else if (item.status == "2") {
                    this.lease_order_three = item;
                  } else if (item.status == "3") {
                    this.lease_order_four = item;
                  }
                });
              }

              if (!this.fun.isTextEmpty(response.data.member.yz_member)) {
                this.custom_value = response.data.member.yz_member.custom_value;
                this.getMemberCustom(this.custom_value, response.data.member.yz_member.validity, response.data.setting.custom); // 获取自定义数据
              }
              this.wechat_login_mode = response.data.setting.wechat_login_mode;
              this.show_member_id = response.data.setting.show_member_id;
              this.getEnablePlugin(response.data.plugins);
              this.getStroeWithdraw(response.data.plugins.is_open);
              this.getExtension(response.data.relation);
              this.getMemberGrade(response.data.setting.level);
            } else {
              Toast(response.msg);
              this.template = "01";
              require("@/assets/css/member/02.scss");
            }
          },
          response => {
            console.log(response.msg);
            require("@/assets/css/member/02.scss");
          }
        )
        .catch(err => {
          console.error(err);
          require("@/assets/css/member/02.scss");
        });
    },
    newTemplate(data) {
      // $http.get("member.member-designer.index").then(
      //   response => {
      //     if (response.result === 1) {
      this.designer = data.data;
      this.showDiy = [];
      this.designer.map((item, index, key) => {
        if (item.temp === "showdiyform") {
          this.showDiy.push(item);
        }
      });
      for (let i in this.designer) {
        this.designer[i].temp = "show" + this.designer[i].temp;
        if (this.designer[i].temp === "showlocation" || this.designer[i].temp === "showstore") {
          this.isLocation = true;
        }
      }
      // window.localStorage.setItem(
      //   "yzdesigner",
      //   JSON.stringify(this.designer)
      // );
      this.$store.commit("membertempIndex", data);
      this.designerStatus = data.status;
      window.yzdesignerStatus = this.designerStatus;
      // this.getMemberData();
      //     } else {
      //     }
      //   },
      //   response => {
      //     console.log(response.msg);
      //   }
      // );
    },
    getNewDecorate(data) {
      this.page_id = data.id;
      if (data.page) {
        this.total_page = data.page.total_page;
        this.current_page = data.page.current_page;
        this.lastIndex = data.page.count - 1;
      }

      let needLocations = ["U_location", "U_stores", "U_goodsnearby", "U_community"];

      this.components = data.datas;
      if (this.components && this.components.length > 0) {
        this.components.map(item => {
          if (needLocations.includes(item.component_key)) {
            this.isLocation = true;
          }
        });
      }
      if (data.page_info) {
        //会员中心只有弹窗广告
        this.advertising = data.page_info.advertising_id;
        if (this.advertising.id && this.advertising.datas) {
          this.advertising.datas = JSON.parse(this.advertising.datas);
        }
      }

      if (this.advertising && this.advertising.id && window.memberAdvertisement === 1 && this.advertising.show_rule === 1) {
        window.memberAdvertisement = 0;
        this.popShow = true;
        this.$nextTick(() => {
          this.initAdvertising();
        });
      }

      this.isDecorate = true;
    },
    getMoreDecorate() {
      this.isLoadMore = false; // 防止多次请求分页数据
      if (this.current_page < this.total_page) {
        this.current_page = this.current_page + 1;
        $http.get("plugin.decorate.frotend.decorate-api.get-page", { decorate_page: this.current_page, decorate_id: this.page_id }, "..").then(response => {
          if (response.result == 1) {
            this.isLoadMore = true;
            this.components = this.components.concat(response.data.datas);
          } else {
            this.isLoadMore = false;
            this.current_page = this.current_page - 1;
          }
        });
      } else {
        console.log("加载完了");
      }
    },
    // 图片加载完回调
    getImg(url, callback) {
      let img = new Image();
      img.src = url;
      //如果图片被缓存，则直接返回缓存数据
      if (img.complete) {
        /* callback(img.width, img.height); */
        callback(Number(img.height) / Number(img.width));
      } else {
        //完全加载完毕的事件
        img.onload = function() {
          /* callback(img.width, img.height); */
          callback(Number(img.height) / Number(img.width));
        };

        img.onerror = function() {
          console.log("图片加载出错");
        };
      }
    },
    initAdvertising() {
      let that = this;
      this.getImg(this.advertising.image, function(scale) {
        // 图片加载完后获取图片高度
        let script = document.createElement("script");
        script.type = "text/wxtag-template";
        script.text = `<div style="width: ${that.clientWidth * 0.65}px;height: ${that.clientWidth * 0.65 * scale}px;"></div>`;
        that.advertising.html = `<wx-open-launch-weapp username="${that.advertising.s_id}" path="${that.advertising.s_url}">${script.outerHTML}</wx-open-launch-weapp>`;
        that.$forceUpdate();
      });
    },
    closePop() {
      this.popShow = false;
    },
    turnTo() {
      if (this.advertising.h_url) {
        if (this.advertising.h_url === window.location.href) {
          this.popShow = false;
        } else {
          window.location.href = this.advertising.h_url;
        }
      }
    },

    // 获取酒店自定义字段
    // getCustomizeHotelHead() {
    //   var isQuestHotel = localStorage.getItem("customizeHotelHead")
    //   if (!this.fun.isTextEmpty(isQuestHotel)) {
    //     this.PageNameList = JSON.parse(
    //       localStorage.getItem("customizeHotelHead")
    //     )
    //   } else {
    //     $http
    //       .get(
    //         "plugin.hotel.frontend.hotel.get-hotel-info.get-custom-name",
    //         {},
    //         "加载中"
    //       )
    //       .then(response => {
    //         if (response.result === 1) {
    //           this.PageNameList = response.data
    //           localStorage.setItem(
    //             "customizeHotelHead",
    //             JSON.stringify(response.data)
    //           )
    //         } else {
    //           console.log(response.msg)
    //         }
    //       })
    //       .catch(error => {
    //         console.log(error)
    //       })
    //   }
    // },
    // 获取模板样式

    getTemplate() {
      $http.get("plugin.designer.home.index.templateSet", {}, " ").then(
        response => {
          if (response.result === 1) {
            if (response.data.member) {
              this.template = response.data.member.name;
            }
            if (!this.template) {
              this.template = "01";
            }
            if (this.template === "02") {
              // 背景图片样式
              require("@/assets/css/icon.scss");
              require("@/assets/css/member/01.scss");
            } else {
              // 阿里图标库样式
              require("@/assets/css/member/02.scss");
            }
          } else {
            this.template = "01";
            require("@/assets/css/member/02.scss");
          }
        },
        response => {
          require("@/assets/css/member/02.scss");
          console.log(response.msg);
        }
      );
    },
    // 退出登录
    outInfo() {
      $http.get("member.logout.index").then(
        response => {
          if (response.result == 1) {
            window.localStorage.setItem("isWxLogin", -1);
            this.$store.commit("savemodel", {});
            this.$store.commit("alerts", response.msg);
            localStorage.setItem("token", "");
            localStorage.setItem("loginUid", "");
            this.$dialog
              .alert({ message: response.msg })
              .then(() => {
                this.$router.push(this.fun.getUrl("login"));
              })
              .catch(() => {});
          }
        },
        response => {
          console.log(response.msg);
        }
      );
    },

    openQrCode(e) {
      this.getPoster(e);
    },
    openQrCode_old(e) {
      if (!this.poster) {
        if (!this.timer) {
          this.getPoster_oldApi(e);
          this.timer = setInterval(() => {
            this.getPoster_oldApi(e);
          }, 3000);
        } else {
          // this.$refs.hook.style.display = e;
        }
      } else {
        // this.$refs.hook.style.display = e;
        clearInterval(this.timer);
        this.toastPoster.clear();
      }
    },
    getPoster(e) {
      if (!this.fun.isTextEmpty(this.poster_Data.poster_data) || !this.fun.isTextEmpty(this.poster)) {
        this.posterShow = true;
        // this.$refs.hook.style.display = e;
        return;
      }
      let that = this;
      $http.get("member.qrcode.get-poster", {}, {}).then(
        response => {
          if (response.result === 1) {
            this.isNewPosterPlugin = response.data.new || false;
            if (response.data.center_show == 0) {
              //0 返回的默认图片
              that.poster = response.data.image_url;
              that.posterShow = true;
            } else if (response.data.center_show == 1) {
              //前端生成
              that.poster_Data.background.src = response.data.background_url || response.data.background;
              that.poster_Data.background.type = "background";
              that.poster_Data.poster_data = response.data.style_data;
              that.poster_id = response.data.id;
              that.posterShow = true;
              // that.$nextTick(() => {
              //   that.forCreateEwm();
              // });
            } else if (response.data.center_show == 2) {
              //部分关注二维码不支持跨域，走老接口
              that.toastPoster = Toast({
                duration: -1, // 持续展示 toast
                message: "正在为您生成海报中"
              });
              that.openQrCode_old(e);
              return;
            }
            // this.$refs.hook.style.display = 'block';
          } else {
            Toast(response.msg);
          }
        },
        response => {
          console.log(response.msg);
          if (this.timer) {
            clearInterval(this.timer);
            if (this.toastPoster) {
              this.toastPoster.clear();
            }
          }
        }
      );
    },
    getPoster_oldApi(e) {
      $http.get("member.poster").then(
        response => {
          if (response.result === 1) {
            this.poster = response.data.image_url;
            // this.$refs.hook.style.display = e;
            if (this.poster && this.timer) {
              this.posterShow = true;
              clearInterval(this.timer);
              if (this.toastPoster) {
                this.toastPoster.clear();
              }
            }
          } else {
            Toast(response.msg);
            if (this.timer) {
              this.posterShow = true;
              clearInterval(this.timer);
              if (this.toastPoster) {
                this.toastPoster.clear();
              }
            }
          }
        },
        response => {
          console.log(response.msg);
          if (this.timer) {
            this.posterShow = true;
            clearInterval(this.timer);
            if (this.toastPoster) {
              this.toastPoster.clear();
            }
          }
        }
      );
    },

    forCreateEwm() {
      let that = this;
      //循环批量生成二维码 qr_shop（推广二维码）、qr_app_share（app分享）接口返回链接，需要前端生成二维码(注释：新海报接口返回图片)
      // this.poster_Data.style_data.forEach(function (val, index) {
      //   if (val.type == 'qr_shop' || val.type == 'qr_app_share') {
      //     that.createEwmQrc(index, val.src)
      //   }
      // });

      // 问题：截图不全；原因：滚轮滑动造成的，主要是html2canvas是根据body进行截图，若内容高度高于body时，就会出现这样的问题(大概意思就是有滚动条时造成的)
      // 解决方案：(在生成截图前，先把滚动条置顶)
      window.pageYOffset = 0;
      window.pageXOffset = 0;
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      setTimeout(() => {
        that.saveImg();
      }, 1500);
      // setTimeout(() => {
      //   this.loadingImg = false;
      // }, 1500);
    },
    // createEwmQrc(_index, _url) {
    //   let _ID = `ewmCanvas_${_index}`
    //   QRCode.toCanvas(document.getElementById(_ID), _url, error => {
    //     if (error) {
    //       console.log(error)
    //     } else {
    //       console.log('success:地址转化二维码成功=======================')
    //     }
    //   })
    // },
    saveImg() {
      //转化成图片
      var content = document.getElementById("code_box");
      const that = this;
      html2canvas(content, {
        useCORS: true,
        tainttest: true, //检测每张图片都已经加载完成
        height: content.offsetHeight, //注意 下面解决当页面滚动之后生成图片出现白边问题
        width: content.offsetWidth,
        scrolly: 0,
        scrollx: 0,
        backgroundColor: null // 解决生成的图片有白边
      }).then(canvas => {
        that.dataURL = canvas.toDataURL("image/png"); //创建base64图片
        document.getElementById("thecanvas").setAttribute("src", that.dataURL);
        that.uploadImageM();
      });
    },
    uploadImageM(e) {
      //图片上传
      let that = this;
      this.dataURL = e;
      let uploadImage = this.fun.getRealUrl("member.qrcode.uploadLocal", { local_upload: 1, poster_id: that.poster_id, is_new: this.isNewPosterPlugin ? 1 : 0 });
      let fd = new FormData();
      fd.append("file", this.dataURItoBlob(this.dataURL));
      axios
        .post(uploadImage, fd, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then(response => {
          if (response.data.result == 1) {
            $http
              .post("member.qrcode.poster-record", { poster_id: that.poster_id, image: response.data.data.img_url, is_new: this.isNewPosterPlugin ? 1 : 0 })
              .then(response => {
                if (response.result === 1) {
                  console.log("添加海报生成记录成功");
                } else {
                  Toast(response.msg);
                }
              })
              .catch(error => {
                console.log(error);
              });
          } else {
            Toast(response.data.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    dataURItoBlob(dataURI) {
      // 图片转成Buffer---------------------------------
      var byteString = atob(dataURI.split(",")[1]);
      var mimeString = dataURI
        .split(",")[0]
        .split(":")[1]
        .split(";")[0];
      var ab = new ArrayBuffer(byteString.length);
      var ia = new Uint8Array(ab);
      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      return new Blob([ab], { type: mimeString });
    },

    // 获取会员信息
    getMemberInfo(data, order, plugins) {
      var that = this;
      // $http
      //   .get(
      //     "member.member.getUserInfo",
      //     {
      //       i: this.fun.getKeyByI(),
      //       type: this.fun.getTyep(),
      //       v: 2
      //     },
      //     "加载中"
      //   )
      //   .then(
      //     function(response) {
      //       if (response.result === 1) {
      that.supplier_id = data.uid;
      if (plugins.merchant && plugins.merchant.cashier) {
        that.store_set.is_open_cashier = 1;
      }
      // if (data.sign != undefined) {
      //   that.signs = data.sign.status;
      //   that.sign_name = data.sign.plugin_name;
      // }
      // if (data.help_center != undefined) {
      //   that.helps = data.help_center.status;
      //   that.help_name = data.help_center.button_name;
      // }
      // if (!data.micro) {
      //   that.haveShop = "-1";
      // } else {
      //   that.haveShop = data.micro.status;
      // }
      // that.isLove = data.love.status;

      // 爱心值名称
      // that.love_name = data.love.love_name
      // that.relation_switch = data.relation_switch

      // 供应商申请
      // that.supplier = data.supplier
      that.member_item = data;
      that.member_order = order;
      that.coupon = data.income;
      // 邀请码
      that.inviteCode = data.inviteCode.code;
      that.isshowInvit = data.inviteCode.status;

      that.isGeneralize = data.is_agent;
      that.relation_switch = data.is_agent;
      that.$store.commit("savemodel", data);
      window.localStorage.uid = data.uid;

      // that.is_agent = data.is_agent.is_agent
      // that.qrcode = data.qr;//我的推广二维
      // that.poster = data.poster; //我的推广二维

      that.coin = data.coin ? data.coin.status : false;
      that.coin_name = data.coin ? data.coin.coin_name : "";
      // that.MyReferrer = data.referral
      that.avatar = data.avatar;
      that.nickname = data.nickname;
      that.integral = data.integral;
      that.copyright = data.copyright;
      that.copyrightImg = data.copyrightImg;
      that.$store.commit("updateBanlace", {
        balance: data.credit2
      });
      that.uid = data.uid;
      that.level_name = data.level_name;
      that.credit = data.credit;
      for (let i = 0; i < order.order.length; i++) {
        // 0 待付款 1待发货 2待收货 3完成
        var item = order.order[i];
        if (item.status == 0) {
          that.waitPay = item.total;
        } else if (item.status == 1) {
          that.waitSend = item.total;
        } else if (item.status == 2) {
          that.waitReceive = item.total;
        } else if (item.status == 11) {
          that.waitrRefund = item.total;
        }
      }

      // }
      that.mobile = data.mobile;

      //设置开关 生活缴费
      // that.isELive = data.elive.status;

      //冻结币
      // that.is_froze = data.froze.status;
      // that.froze_name = data.froze.froze_name;

      that.love_obj = data.love_show;
      that.integral_show = data.integral_show;
      that.is_open_net_car = plugins.is_open.is_open_net_car == 1 ? true : false;
      that.is_hotel = plugins.is_open.is_open_hotel == 1 ? true : false;
      this.is_open_lease_toy = plugins.is_open.is_open_lease_toy == 1 ? true : false;
      that.is_open_fight_groups = plugins.is_open.is_open_fight_groups == 1 ? true : false;
      that.is_open_snatch_regiment = plugins.is_open.is_open_snatch_regiment == 1 ? true : false;
      that.is_hotel = plugins.is_open.is_open_hotel == 1 ? true : false;
      that.is_open_lease_toy = plugins.is_open.is_open_lease_toy == 1 ? true : false;
      if (that.is_hotel) {
        that.PageNameList = plugins.hotel;
        localStorage.setItem("customizeHotelHead", JSON.stringify(plugins.hotel));
        // that.getCustomizeHotelHead()
      }
      // if (data.withdraw_status == 1) {
      // 显示提现
      //   that.isWithdraw = true;
      // }
      if (order.hotel_order) {
        order.hotel_order.forEach(item => {
          if (item.status == 0) {
            that.hotel_order["waitPay"] = item.total;
          } else if (item.status == 1) {
            that.hotel_order["waitSure"] = item.total;
          } else if (item.status == 2) {
            that.hotel_order["waitEnter"] = item.total;
          } else if (item.status == 11) {
            that.hotel_order["waitCheckOut"] = item.total;
          }
        });
      }
      if (order.fight_groups_order) {
        order.fight_groups_order.forEach(item => {
          if (item.status == 0) {
            that.groups_order["waitPay"] = item.total;
          } else if (item.status == 1) {
            that.groups_order["waitSure"] = item.total;
          } else if (item.status == 2) {
            that.groups_order["waitEnter"] = item.total;
          } else if (item.status == 11) {
            that.groups_order["waitCheckOut"] = item.total;
          }
        });
      }
      if (order.snatch_regiment_order) {
        order.snatch_regiment_order.forEach(item => {
          if (item.status == 0) {
            that.grabGroup_order["waitPay"] = item.total;
          } else if (item.status == 1) {
            that.grabGroup_order["waitSure"] = item.total;
          } else if (item.status == 2) {
            that.grabGroup_order["waitEnter"] = item.total;
          } else if (item.status == 11) {
            that.grabGroup_order["waitCheckOut"] = item.total;
          }
        });
      }
      //   },
      //   function(response) {
      //     console.error(response.msg);
      //   }
      // );
    },

    //获取自定义数据 validity会员等级时间限制
    getMemberCustom(value, validity, data) {
      let that = this;

      // $http
      //   .get("member.member.get-custom-field", {
      //     i: this.fun.getKeyByI(),
      //     type: this.fun.getTyep()
      //   })
      //   .then(
      //     function(response) {
      //       if (response.result === 1) {
      if (data.is_custom == "1" && !that.fun.isTextEmpty(value)) {
        that.custom_title = data.custom_title;
        that.is_custom = true;
      } else {
        that.is_custom = false;
      }

      //处理会员等级时间限制
      if (data.is_validity && data.term == 1) {
        if (that.fun.isTextEmpty(validity)) {
          that.validity_value = "";
        } else {
          that.validity_value = validity + "天";
        }
      } else {
        // console.error(response.msg);
      }
      // }
      //   },
      //   function(response) {
      //     // error callback
      //     console.error(response.msg)
      //   }
      // )
    },

    handleTopChange(status) {
      this.topStatus = status;
    },
    loadTop() {
      this.getMemberData();
      // this.$refs.loadmore.onTopLoaded();
    },
    loadBottom() {
      // load more data
      this.allLoaded = true; // if all data are loaded
      // this.$refs.loadmore.onBottomLoaded();
    },

    // 获取门店提现
    getStroeWithdraw(data) {
      // var that = this
      // $http
      //   .get("plugin.store-cashier.frontend.store.center.is-store.index", {})
      //   .then(
      //     function(response) {
      //       if (response.result === 1) {
      if (data) {
        this.is_stroeWithdraw = data.is_store == 1 ? true : false;
      }
      //     } else {
      //       console.error(response.msg)
      //       that.is_stroeWithdraw = false
      //     }
      //   },
      //   function(response) {
      //     console.error(response.msg)
      //     that.is_stroeWithdraw = false
      //   }
      // )
    },

    // 推广
    getExtension(data) {
      // var that = this
      // $http
      //   .get("member.member.isOpenRelation", {})
      //   .then(response => {
      //     if (response.result === 1) {
      //       this.is_extension = data.switch == 1 ? true : false;
      //       this.isWithdraw = data.switch == 1 ? true : false;
      //   } else {
      //     console.error(response.msg);
      //     that.is_stroeWithdraw = false;
      //   }
      // })
      // .catch(error => {
      //   console.log(error);
      //   that.is_stroeWithdraw = false;
      // });
    },

    // 跳转至会员权益
    gotoMemberGrade() {
      if (this.isMemberGrade) {
        this.$router.push(this.fun.getUrl("MemberGradeList"));
      }
    },

    // 获取开启的插件列表
    getEnablePlugin(data) {
      // $http
      //   .get("member.member.getEnablePlugins", {})
      //   .then(response => {
      //     if (response.result === 1) {
      this.pluginsList = data;

      if (data.ViewSet.member) {
        this.template = data.ViewSet.member.name;
      }
      if (this.$store.state.temp.item.is_decorate === 1) {
        if (this.$store.state.temp.item.ViewSet.member.is_default != 0) {
          this.template = this.$store.state.temp.item.ViewSet.member.code.substring(6);
        } else {
          this.template = "01";
        }
      }
      if (window.yzdesignerStatus) {
        this.template = "03";
        require("@/assets/css/member/designer.scss");
      } else {
        if (!this.template) {
          this.template = "01"; //默认为01
        }
        if (this.template === "02") {
          // 背景图片样式
          require("@/assets/css/icon.scss");
          require("@/assets/css/member/01.scss");
        } else if (this.template === "01") {
          // 阿里图标库样式
          require("@/assets/css/member/02.scss");
        }
      }
      //   } else {
      //     console.log("error:", response.data)
      //   }
      // })
      // .catch(error => {
      //   console.log(error)
      // })
    },

    // 会员权益插件是否开启
    getMemberGrade(data) {
      // $http
      //   .get("member.member-level.is-open", {})
      //   .then(response => {
      //     if (response.result == 1) {
      this.isMemberGrade = data.is_open == 1 ? true : false;
      // this.isClick = data.level_type == 2 ? true : false;
      // } else {
      //   this.isMemberGrade = false
      //   this.isClick = false
      // }
      // })
      // .catch(error => {
      //   console.log(error)
      // })
    },

    pluginGoto(item) {
      if (item.name == "article") {
        this.$router.push(
          this.fun.getUrl(item.url, {
            id: "0"
          })
        );
      } else if (item.url == "liveList") {
        this.$router.push(this.fun.getUrl(item.url, { from: 1 }));
      } else if (item.name == "courier") {
        window.localStorage.setItem("couriername", item.title);
        this.$router.push(this.fun.getUrl(item.url));
      } else if (item.name == "supplier") {
        this.$router.push(
          this.fun.getUrl(item.url, {
            uid: this.supplier_id
          })
        );
      } else {
        this.$router.push(this.fun.getUrl(item.url, { fromHome: 1 }));
      }
    },
    // 复制邀请码
    onCopy: function(e) {
      Toast({
        message: "复制成功",
        duration: 1000
      });
    },
    onError: function(e) {
      Toast({
        message: "复制失败",
        duration: 1000
      });
    },
    //自定义提现收入语言
    customizeIncome() {
      let mailLanguage = this.fun.initMailLanguage();
      //自定义提现字段
      if (mailLanguage) {
        this.name_of_withdrawal_text = mailLanguage.income.name_of_withdrawal;
      }
    },
    //获取滚动条当前的位置
    getScrollTop() {
      var scrollTop = 0;
      if (documentElement && documentElement.scrollTop) {
        scrollTop = documentElement.scrollTop;
      } else if (body) {
        scrollTop = body.scrollTop;
      }
      return scrollTop;
    },
    //获取当前可视范围的高度
    getClientHeight() {
      var clientHeight = 0;
      if (body.clientHeight && documentElement.clientHeight) {
        clientHeight = Math.min(body.clientHeight, documentElement.clientHeight);
      } else {
        clientHeight = Math.max(body.clientHeight, documentElement.clientHeight);
      }
      return clientHeight;
    },
    //获取文档完整的高度
    getScrollHeight() {
      return Math.max(body.scrollHeight, documentElement.scrollHeight);
    },
    handleScroll() {
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      if (scrollTop > 60) {
        this.btnFlag = true;
      } else {
        this.btnFlag = false;
      }

      //滚动事件触发
      if (Number(this.getScrollTop() + this.getClientHeight() + 5) >= this.getScrollHeight()) {
        if (this.isLoadMore) {
          this.getMoreDecorate();
        }
        //此处发起请求
        this.isBottom = true;
      } else {
        this.isBottom = false;
      }
    }
  },
  components: {
    cTitle,
    showmembercenter,
    showmemberincome,
    showmemberorder,
    showmemberhotelorder,
    showmembercarorder,
    showmemberleaseorder,
    showmembertool,
    showmembermerchant,
    showmembermarket,
    showmemberasset,
    showmembergrouporder,
    showmembersnatchorder,
    showbanner,
    showsign,
    showmenu,
    showtitle,
    showsearch,
    showline,
    showblank,
    showrichtext,
    showpicture,
    showcube,
    showarea,
    showshop,
    showgoods,
    shownearbygoods,
    shownotice,
    showlocation,
    showstore,
    showcoupon,
    showheadline,
    showarticle,
    showflashsale,
    showbusiness,
    showassemble,
    showvideo,
    showdiyform,

    //新装修
    U_memberasset,
    U_membermarket,
    U_membermerchant,
    U_memberorder,
    U_memberrights,
    U_membertool,
    U_membertop,
    U_article: () => import('../../components/new_diy/article.vue'),
    U_backup: () => import('../../components/new_diy/backup.vue'),
    U_blank: () => import('../../components/new_diy/blank.vue'),
    U_button: () => import('../../components/new_diy/button.vue'),
    U_community: () => import('../../components/new_diy/community.vue'),
    U_coupons: () => import('../../components/new_diy/coupons.vue'),
    U_cube: () => import('../../components/new_diy/cube.vue'),
    U_form: () => import('../../components/new_diy/form.vue'),
    U_goods: () => import('../../components/new_diy/goods.vue'),
    U_goodsgroup: () => import('../../components/new_diy/goodsgroup.vue'),
    U_goodsnearby: () => import('../../components/new_diy/goodsnearby.vue'),
    U_goodsrush: () => import('../../components/new_diy/goodsrush.vue'),
    U_headline: () => import('../../components/new_diy/headline.vue'),
    U_homedata: () => import('../../components/new_diy/homedata.vue'),
    U_line: () => import('../../components/new_diy/line.vue'),
    U_livestreaming: () => import('../../components/new_diy/livestreaming.vue'),
    U_location: () => import('../../components/new_diy/location.vue'),
    U_lottery: () => import('../../components/new_diy/lottery.vue'),
    U_maps: () => import('../../components/new_diy/maps.vue'),
    U_notice: () => import('../../components/new_diy/notice.vue'),
    U_richtext: () => import('../../components/new_diy/richtext.vue'),
    U_search: () => import('../../components/new_diy/search.vue'),
    U_shopfor: () => import('../../components/new_diy/shopfor.vue'),
    U_shortvideo: () => import('../../components/new_diy/shortvideo.vue'),
    U_signin: () => import('../../components/new_diy/signin.vue'),
    U_simplegraph: () => import('../../components/new_diy/simplegraph.vue'),
    U_slideshow: () => import('../../components/new_diy/slideshow.vue'),
    U_stores: () => import('../../components/new_diy/stores.vue'),
    U_storesranking: () => import('../../components/new_diy/storesranking.vue'),
    U_suspendbutton: () => import('../../components/new_diy/suspendbutton.vue'),
    U_tabcontrol: () => import('../../components/new_diy/tabcontrol.vue'),
    U_title: () => import('../../components/new_diy/title.vue'),
    U_video: () => import('../../components/new_diy/video.vue'),
    U_stargroup: () => import('../../components/new_diy/stargroup.vue'),
    U_foot: () => import('../../components/new_diy/foot.vue'),

    yzGoodsposter
  }
};
