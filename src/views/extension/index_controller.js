import cTitle from "components/title";
import { Toast } from 'vant';
//import cMyextension from 'components/myextension';
export default {
  data() {
    return {
      show_member_id: '',
      //营业业绩
      // isShowPer: "",
      withdraw_date:{},
      is_show_performance: "", //营业额是否显示
      is_show_unable: "",//更多权限是否显示
      show1: false,
      mailLanguage: "", //商城自定义语言

      toi: this.fun.getKeyByI(),

      //是否有权限 来控制view显示
      is_agent: false,
      //总收入
      total_income: 0.0,

      info_img: "",

      //优化v2数据

      //会员信息
      userInfo: {
        // avatar:"",
        // grand_total:0,
        // member_id:0,
        // nickname:"",
        // usable_total:0
      },

      //推广权限

      extension: [],

      //更多推广

      unextension: [],

      //优化v2数据--结束

      //收入分享页面开关
      shareShow: false,

      //领取权益页面开关
      showEarning: false,

      template: "",
      income_name_text: "",
      is_show_limit: false,
      amount_num: 0
    };
  },

  activated() {
    //this.setUserInfo();
    this.getExtensionData();
    this.customizeIncome();
  },
  created() {
    // this.getTemplate();
  },
  mounted() {
    //this.initMailLanguage();
    console.log("this.mailLanguage", this.mailLanguage);
    this.customizeIncome();
    // this.isShowPerformance();
  },
  updated() {
    //解决从首页进入被标题覆盖
    this.fun.setWXTitle($i18n.t('我的推广'));
  },
  methods: {
    getTemplate(data) {
      // $http.get("plugin.designer.home.index.templateSet").then(
      //   response => {
      //     if (response.result === 1) {
      if (data.extension) {
        this.template = data.extension.name;
      }
      if(this.$store.state.temp.item.is_decorate === 1) {
        if(this.$store.state.temp.item.ViewSet.extension.is_default != 0) {
          this.template = this.$store.state.temp.item.ViewSet.extension.code.substring(9);
        }else {
          this.template = "01";
        }
      }
      if (!this.template) {
        this.template = "01";
      }
      if (this.template === "02") {
        // 背景图片样式
        require("@/assets/css/extension/01.scss");
      } else {
        /// 阿里图标库样式
        require("@/assets/css/extension/02.scss");
      }
      //     } else {
      //       this.template = "01";
      //       require("@/assets/css/extension/02.scss");
      //     }
      //   },
      //   response => {
      //     console.log(response.msg);
      //   }
      // );
    },
    initMailLanguage() {
      this.mailLanguage = this.fun.initMailLanguage();
    },

    //设置用户信息
    setUserInfo() {
      var that = this;
      let json = { i: this.fun.getKeyByI(), type: this.fun.getTyep() };
      $http.get("member.member.getUserInfo", json).then(
        function (response) {
          if (response.result === 1) {
            that.userName = response.data.nickname;
            that.vipId = response.data.uid;
            that.level = response.data.level_name;
            that.userAvatar = response.data.avatar;
          }
        },
        function (response) {
          console.error(response);
        }
      );
    },

    //获取设置信息
    getExtensionInfo() {
      let that = this;
      let json = { i: this.fun.getKeyByI(), type: this.fun.getTyep() };
      $http.get("member.member.agentbase", json).then(
        function (response) {
          console.log(response);
          if (response.result == 1) {
            that.info_img = response.data.banner;
          } else {
            that.info_img = "";
          }
        },
        function (response) {
          console.log(response);
        }
      );
    },

    //是否开启业绩显示
    // isShowPerformance() {
    //   $http.get("finance.OrderAll.isShow").then(res => {
    //     if (res.result === 1) {
    //       this.isShowPer = res.data.status;
    //     }
    //   });
    // },

    //验证手机身份
    gotoIncome() {
      let that = this;
      $http.get("member.member.withdrawByMobile", {}, "loading").then(
        function (response) {
          if (response.result === 1) {
            if (response.data.is_bind_mobile == 1) {
              that.$router.push(that.fun.getUrl("withdrawEditmobile", {}));
            } else {
              that.$router.push(that.fun.getUrl("withdrawal", {}));
            }
          } else {
            that.$dialog.alert({message:response.msg});

          }
        },
        function (response) {
          that.$dialog.alert({message:response.msg});

        }
      );
    },

    //接口优化
    getExtensionData() {
      $http
        .get("finance.income-page.index", {}, "loading")
        .then(response => {
          if (response.result === 1) {
            if (!(this.fun.isTextEmpty(response.data.income_page.jump_link))) {
              window.location.href = response.data.income_page.jump_link;
              return;
            }

            if (response.data.template_set || this.$store.state.temp.item.is_decorate === 1) {
              this.getTemplate(response.data.template_set);
            } else {
              this.template = "01";
              require("@/assets/css/extension/02.scss");
            }

            // 用户信息
            this.userInfo = response.data.income_page.info;

            // 可用权限
            this.extension = response.data.income_page.available;

            // 更多权限
            this.unextension = response.data.income_page.unavailable;

            // 显示收入分享
            this.shareShow = response.data.income_page.parameter.share_page;

            // 显示领取收益
            this.showEarning = response.data.income_page.parameter.plugin_settle_show;
            //是否显示营业额
            this.is_show_performance = response.data.income_page.is_show_performance;
            //是否显示更多权限
            this.is_show_unable = response.data.income_page.is_show_unable;
            this.withdraw_date=response.data.income_page.withdraw_date;

            this.show_member_id = response.data.income_page.show_member_id;
            if (response.data.income_page && response.data.income_page.withdraw_limit) {
              this.is_show_limit = response.data.income_page.withdraw_limit.is_show;
              if (this.is_show_limit) {
                this.amount_num = response.data.income_page.withdraw_limit.amount;
              }
            }
          } else {
            this.template = "01";
            require("@/assets/css/extension/02.scss");
          }
          // this.fun.setWXTitle($i18n.t('extension.我的推广')); //注释原因：快速切换导航会出现该执行语句把当前的标题覆盖掉，任务编号: 39656
        })
        .catch(error => {
          this.template = "01";
          require("@/assets/css/extension/02.scss");
          console.error(error);
        });
    },
    toToast(){
      Toast(this.withdraw_date.day_msg);
    },
    //页面跳转
    toPage(page) {
      this.$router.push(this.fun.getUrl(page, {}, { extension: "extension" }));
    },

    //权限跳转
    gotoPage(item) {
      if (!item.is_relation) {
        this.$dialog.alert({message:"未开放该权限"});
        return;
      }

      if (!item.is_agent) {
        this.$router.push(this.fun.getUrl("ExtensionApply", {}));
        return;
      }

      if (item.mark === "point_activity") {
        this.$router.push(
          this.fun.getUrl(item.url, {}, { num: this.userInfo.member_id })
        );
        return;
      }

      this.$router.push(this.fun.getUrl(item.url, {}));
    },

    //推广页
    nextPage() {
      this.$router.push(this.fun.getUrl("ExtensionPage"));
    },

    //跳转连锁店首页
    gotoChainShop() {
      this.$router.push(this.fun.getUrl("ChainShopIndex"));
    },
    //自定义提现收入语言
    customizeIncome() {
      let mailLanguage = this.fun.initMailLanguage();
      //自定义收入字段
      if (mailLanguage && mailLanguage.income) {
        this.income_name_text = mailLanguage.income.income_name;
      }

    }
  },
  components: { cTitle }
};
