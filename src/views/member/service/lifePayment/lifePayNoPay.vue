<template>

  <div id="lifePayNoPay" :class="'lifePayNoPay'+$store.state.service.lang">

    <c-title :hide="false" :text='language.orderDetail'></c-title>
    <div style="height: 40px;"></div>

    <div class="main">
      <div class="title">
        <p>{{language.orderNum}}{{data.numId}}</p>
        <span>{{data.status}}</span>
      </div>
      <div class="top normal">
        <ul>
          <li>{{language.accountNum}}<span>123</span></li>
          <li>{{language.trafficFine}}<span>广州自来水公司</span></li>
        </ul>
      </div>

      <div class="middle normal">
        <ul>
          <li>{{language.recharge}}<span>{{data.denomination}}元</span></li>
          <li>{{language.state}}<span>等待充值</span></li>
        </ul>
      </div>

      <div class="content normal">
        <ul>
          <li>{{language.giftScore}}<span>10积分</span></li>
        </ul>
      </div>

      <div class="content normal">
        <ul>
          <li>{{language.goodsAmount}}<span>{{$i18n.t("money")}}{{data.money}}</span></li>
          <li>{{language.scorePay}}<span>-{{data.scoreDel}}</span></li>
          <li>{{language.payStyle}}<span>{{data.payMethod}}</span></li>
        </ul>
      </div>
      <div class="bottom">
        <b>{{language.payNum}}</b><b>{{data.payNum}}</b><br/>
        <span class="orderTime">{{language.date}}</span><span>{{data.date}}</span>
      </div>
      <div class="footer">
        <span class="btn">{{language.cancle}}</span>
        <span class="btn">{{language.toPay}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import cTitle from "components/title";

export default {
  components: { cTitle },
  data() {
    return {
      language: {},
      data: {
        numId: "12345689",
        status: "待支付",
        denomination: 20,
        totalSize: 200,
        money: "19.9x2",
        scoreDel: "4.00",
        payMethod: "-----",
        payNum: "30.00",
        date: "2017-05-01 11:00:00"
      }
    };
  },
  methods: {},
  //实时监测this.$store.state.service.chinese的变化，获取最新的语言包
  computed: {
    getLangState() {
      return this.$store.state.service.languageService;
    }
  },
  watch: {
    getLangState(val) {
      if (val) {
        this.language = JSON.parse(sessionStorage.languageService).lifePayNoPay;
      } else {
        this.language = this.$store.state.service.languageService.lifePayNoPay;
      }
    }
  },

  mounted() {
    if (sessionStorage.languageService) {
      this.language = JSON.parse(sessionStorage.languageService).lifePayNoPay;
    } else {
      this.language = this.$store.state.service.languageService.lifePayNoPay;
    }
  },

  activated() {
    this.$store.commit("onload");
  }

};

</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .lifePayNoPaych {
    .main {
      padding-top: 0.0625rem;

      .title {
        height: 2.8125rem;
        line-height: 2.8125rem;
        padding: 0 0.875rem;
        text-align: right;
        background: #fff;
        font-weight: 500;

        p {
          display: inline-block;
          color: #8c8c8c;
          font-size: 14px;
          float: left;
        }

        span {
          color: #333;
          font-size: 14px;
          font-weight: 500;
        }
      }

      .normal {
        padding: 0.625rem 0.875rem;
        background: #fff;
        margin: 0.625rem 0;

        li {
          line-height: 30px;
          text-align: left;

          span {
            display: inline-block;
            float: right;
          }
        }
      }

      .top {
        li {
          color: #8c8c8c;

          span {
            color: #333;
          }
        }
      }

      .middle {
        li {
          font-size: 14px;
          color: #8c8c8c;
          font-weight: 400;

          span {
            color: #333;
          }
        }
      }

      .content {
        li {
          font-size: 14px;
          color: #8c8c8c;

          span {
            color: #333;
          }
        }
      }

      .bottom {
        background: #fff;
        text-align: right;
        padding: 0.9375rem;
        line-height: 1.625rem;
        margin-bottom: 6.25rem;

        b {
          color: #616161;
          font-weight: 500;
        }

        span {
          color: #a5a5a5;
        }
      }

      .footer {
        background: #fff;
        position: fixed;
        bottom: 0;
        width: 100%;
        text-align: right;
        height: 2.8125rem;
        line-height: 2.8125rem;
        padding: 0 0.875rem;

        .btn {
          padding: 0.25rem 0.625rem;
          text-align: center;
          margin-left: 0.625rem;
          border-radius: 0.1875rem;
          color: #333;
          border: 0.0625rem solid #666;
          cursor: pointer;
          font-weight: 400;
        }
      }
    }
  }

  .lifePayNoPaywei {
    .main {
      padding-top: 0.0625rem;

      .title {
        height: 2.1875rem;
        line-height: 2.1875rem;
        padding: 0 0.9375rem;
        text-align: right;
        background: #fff;
        font-weight: 500;

        p {
          display: inline-block;
          color: #414141;
          font-size: 14px;
          float: right;
        }

        span {
          color: #ffc381;
          font-size: 14px;
          font-weight: 500;
          float: left;
        }
      }

      .normal {
        padding: 0.9375rem;
        background: #fff;
        margin: 0.9375rem 0;

        li {
          line-height: 1.625rem;
          text-align: right;

          span {
            display: inline-block;
            float: left;
          }
        }
      }

      .top {
        li {
          color: #4b4b4b;
        }
      }

      .middle {
        li {
          font-size: 14px;
          color: #4b4b4b;
          font-weight: 400;
          text-align: right;

          span {
            color: #ff9d2b;
            float: left;
          }
        }
      }

      .content {
        li {
          font-size: 12px;
          color: #4b4b4b;
        }
      }

      .bottom {
        background: #fff;
        text-align: right;
        padding: 0.9375rem;
        line-height: 1.625rem;
        margin-bottom: 6.25rem;

        b {
          color: #616161;
          font-weight: 500;
        }

        b:first-child {
          float: right;
        }

        span {
          color: #a5a5a5;
        }

        .orderTime {
          float: right;
        }
      }

      .footer {
        background: #fff;
        position: fixed;
        bottom: 0;
        width: 100%;
        text-align: right;

        .btn {
          width: 6.25rem;
          height: 1.875rem;
          line-height: 1.875rem;
          display: inline-block;
          text-align: center;
          margin: 0.9375rem;
          border-radius: 0.3125rem;
          color: #ff9b28;
          border: 0.0625rem solid #ffd8ab;
          cursor: pointer;
          font-weight: 400;
        }
      }
    }
  }
</style>
