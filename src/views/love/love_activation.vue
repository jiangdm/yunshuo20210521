<template>
  <div id="Love_activation">
    <c-title :hide="false" text='激活详情'></c-title>
    <div style="height: 40px;"></div>
    <div style="height: 1.25rem; background-color: #fff;"></div>
    <p>激活{{love_name}}({{$i18n.t("元")}})</p>
    <p id="money">{{usable}}
      <small></small>
    </p>
    <div class="tbs">
      <div class="left">会员冻结{{love_name}}</div>
      <div class="right">{{member_froze_love}}</div>
      <div class="left">固定激活比例</div>
      <div class="right">{{fixed_proportion}}%</div>
      <div class="left">固定激活值</div>
      <div class="right">{{fixed_activation_love}}</div>
      <div class="lise"></div>
      <div class="left">一级粉丝订单金额</div>
      <div class="right">{{order_money}}{{$i18n.t("元")}}</div>
      <div class="left">一级粉丝激活比例</div>
      <div class="right">{{proportion}}%</div>
      <div class="left">一级粉丝激活{{love_name}}</div>
      <div class="right">{{activation_love}}{{$i18n.t("元")}}</div>
      <div class="lise"></div>

      <div class="left">二、三级粉丝订单金额</div>
      <div class="right">{{order_money2}}{{$i18n.t("元")}}</div>
      <div class="left">二、三级粉丝激活比例</div>
      <div class="right">{{proportion2}}%</div>
      <div class="left">团队等级奖励{{love_name}}</div>
      <div class="right">{{team_leve_award}}{{$i18n.t("元")}}</div>
      <div class="left">二、三级粉丝激活上限比例</div>
      <div class="right">{{fetter_proportion}}%</div>

      <div class="left">二、三级粉丝激活{{love_name}}</div>
      <div class="right">{{activation_love2}}{{$i18n.t("元")}}</div>
    </div>
    <div class="tbs">
      <div class="left">激活ID</div>
      <div class="right">{{created_id}}</div>
      <div class="left">本次应激活{{love_name}}</div>
      <div class="right">{{sum_activation_love}}</div>
      <div class="left">本次实际激活{{love_name}}</div>
      <div class="right">{{actual_activation_love}}</div>
      <div class="left" style='flex: 30%;'>激活时间</div>
      <div class="right" style='flex: 70%;'>{{created_at}}</div>

    </div>
  </div>
</template>
<script>
import cTitle from "components/title";

export default {
  data() {
    return {
      // actual_activation_love:null,
      sum_activation_love: null,
      activation_love2: null,
      love_name: "",//爱心值自定义名称
      usable: 0, // 登陆会员可用爱心值
      member_froze_love: "",//会员冻结爱心值
      fixed_proportion: "", // 固定激活比例
      fixed_activation_love: "", // 固定激活值
      first_commission: null,	//	一级粉丝数据
      second_three_Commission: null,//	二三级粉丝数据
      other: null,	//	其他数据
      order_money: null,	//	订单金额
      order_money2: null,  //  二三级订单金额
      proportion: null,	//	激活比例
      proportion2: null,	//	二三级激活比例
      team_leve_award: null,	//	团队等级奖励值
      fetter_proportion: null,	//	激活上线
      actual_activation_love: null,	//	实际激活金额
      created_id: null,	//	该记录ID值
      created_at: null,	//	激活时间
      order_sn: null	//	激活流水号
    };
  },
  methods:
      {
        getUsable() {
          let that = this;
          $http.get("plugin.love.Frontend.Controllers.page.index", {}, "加载中...").then((response) => {

            if (response.result == 1) {
              this.usable = response.data.usable;
              this.love_name = response.data.love_name;
            } else {
              this.$dialog.alert({ message: response.msg });

            }

          }, function(response) {
            that.$dialog.alert({ message: response.msg });
          });

        },
        getBalance() {

          var that = this;
          $http.get("plugin.love.Frontend.Modules.Love.Controllers.activation-record-detail.index", { record_id: this.$route.params.id }, "加载中...").then((response) => {

            if (response.result == 1) {
              console.log(response.data);
              this.member_froze_love = response.data.fixed_activation.member_froze_love;
              this.fixed_proportion = response.data.fixed_activation.fixed_proportion;
              this.fixed_activation_love = response.data.fixed_activation.fixed_activation_love;

              this.order_money = response.data.first_commission.order_money;
              this.proportion = response.data.first_commission.proportion;
              this.activation_love = response.data.first_commission.activation_love;

              this.order_money2 = response.data.second_three_Commission.order_money;
              this.proportion2 = response.data.second_three_Commission.proportion;
              this.activation_love2 = response.data.second_three_Commission.activation_love;
              this.team_leve_award = response.data.second_three_Commission.team_leve_award;
              this.fetter_proportion = response.data.second_three_Commission.fetter_proportion;
              this.actual_activation_love = response.data.second_three_Commission.actual_activation_love;

              this.created_id = response.data.other.id;
              this.created_at = response.data.other.created_at;
              this.sum_activation_love = response.data.other.sum_activation_love;
              this.actual_activation_love = response.data.other.actual_activation_love;

            } else {
              that.$dialog.alert({ message: response.msg });

            }

          }, function(response) {
            that.$dialog.alert({ message: response.msg });

          });

        }

      },
  activated() {
    this.getUsable();
    this.getBalance();
  },
  components: { cTitle }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  #Love_activation {
    padding-bottom: 0.625rem;
    background-color: #fff;

    p {
      background-color: #fff;
      font-size: 14px;
    }

    #money {
      background-color: #fff;
      color: #333;
      font-weight: bold;
      font-size: 28px;
      line-height: 3rem;

      small {
        font-size: 14px;
      }
    }

    .tbs {
      display: flex;
      align-items: center;
      background: #fff;
      padding: 0 0.9375rem;
      flex-flow: row wrap;
      box-sizing: border-box;
      font-size: 14px;
      line-height: 1.875rem;

      .left {
        flex: 60%;
        text-align: left;
      }

      .right {
        flex: 40%;
        text-align: right;
      }

      .lise {
        border-bottom: 0.0625rem solid #ebebeb;
        margin: 0.625rem 0;
        width: 100%;
        display: block;
      }
    }
  }
</style>
