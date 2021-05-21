import cTitle from "components/title";
// import { Toast } from 'vant';
export default {
  data() {
    return {
      radio: "",
      toi: this.fun.getKeyByI(),
      Data: {},
      integralShow: false,
      sure_usable: "",
      love_name: "", //爱心值自定义名称
      withdraw_status: false,
      cmc_withdraw_status: "0",
      balance_withdraw_status: "0"
    };
  },
  activated() {
    this.iniData();
    //获取数据
    this.getStoreInfo();
    this.fun.setWXTitle(this.fun.initWithdrawal());
  },
  computed: {
    coin: function() {
      return (
        Number(this.sure_usable) *
        Number(this.Data.withdraw_integral_scale) *
        Number(this.Data.integral_withdraw_proportion / 100)
      );
    }
  },
  methods: {
    iniData() {
      this.Data = {};
      this.integralShow = false;
      this.withdraw_status = false;
      this.sure_usable = "";
      // this.radio = "1";
      this.toi = this.fun.getKeyByI();
    },
    getStoreInfo() {
      var that = this;
      $http
        .get(
          "plugin.love.Frontend.Modules.Love.Controllers.withdraw.page",
          {},
          " "
        )
        .then(
          function(response) {
            if (response.result === 1) {
              that.Data = response.data;
              that.integralShow = that.Data.integral_withdraw_status;
              that.withdraw_status = that.Data.withdraw_status;
              that.cmc_withdraw_status = that.Data.cmc_withdraw_status;
              that.balance_withdraw_status = that.Data.balance_withdraw_status;
              // if (!that.withdraw_status && that.integralShow) {
              //   that.radio = "2";
              // }
              // if (that.withdraw_status && !that.integralShow) {
              //   that.radio = "1";
              // }
              // if (that.withdraw_status && that.integralShow) {
              //   that.radio = "1";
              // }
              that.love_name = response.data.love_name;
            } else {
              that.$dialog.alert({ message: response.msg });

            }
          },
          function(response) {
            // error callback
          }
        );
    },
    confirm() {
      //withdraw_money
      var that = this;

      if (this.sure_usable == undefined || this.sure_usable <= 0) {
        that.$dialog.alert({ message: `${this.fun.initWithdrawal()}数值不可低于0` });
        return;
      }
      if (!this.radio) {
        this.$dialog.alert({ message: "请选择提现类型" });
        return;
      }
      let json = { change_value: this.sure_usable, withdraw_type: this.radio };
      $http
        .get(
          "plugin.love.Frontend.Modules.Love.Controllers.withdraw.index",
          json,
          "正在提交数据"
        )
        .then(
          function(response) {
            if (response.result == 1 && response.data.type == "1") {
              that.$router.push(that.fun.getUrl("withdrawal"));
            } else if (response.result == 1 && response.data.type == "2") {
              that.$dialog.alert({ message: response.msg }).then(()=>{
                that.$router.go(-1);
              });
            } else {
              that.$dialog.alert({ message: response.msg });
            }
          },
          function(response) {
            // error callback
          }
        );
    }
  },

  components: { cTitle }
};
