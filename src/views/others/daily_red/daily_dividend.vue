<template>
  <div id="daily_red">
    <div
      class="content"
      :style="{ width: fun.getPhoneEnv() == 3 ? '375px' : '' }"
    >
      <div class="headImg" :style="{ backgroundColor: bjcolor }">
        <div
          class="header"
          :style="{ width: fun.getPhoneEnv() == 3 ? '375px' : '' }"
        >
          <i class="iconfont icon-back" @click="goback"></i>
          <span>{{ redData.daily_dividend_title }}</span>
        </div>
        <img :src="redData.thumb" alt="" @click="golink"/>
      </div>
      <div class="ImgBg" :style="{ backgroundColor: bjcolor }">
        <div class="red-box">
          <div class="head">
            <span>{{ redData.daily_dividend_title }}</span>
            <div class="red-color">
              <em>{{ accMul(integral,receive_amount) ? accMul(integral,receive_amount) : '0.00'}}</em><span>元</span>
            </div>
          </div>
          <div class="red-number">
            <div class="red-Vdi">
              <span>今日分红总额</span>
              <span class="pt05 fb">{{ amount.amount ? amount.amount : '0.00'}}</span>
            </div>
            <div class="red-Vdi">
              <span>当前共建值</span>
              <span class="pt05 fb">{{credit6 ? credit6 : '0.00'}}</span>
            </div>
            <div class="red-Vdi">
              <span>参与分红共建值</span>
              <span class="pt05 fb">{{ income_credit6 ? income_credit6 : 0 }}</span>
            </div>
          </div>
          <!--
          <div style="margin-top: 0.6rem;">
            <span style="font-size: 14px;">剩余分红天数</span>
          </div>
          <div class="process">
            <span
              class="bar"
              :style="{
                width:
                  (redData.receive_number /
                    (redData.vilidity + redData.receive_number)).toFixed(2) *
                    100 +
                  '%'
              }"
            ></span>
          </div>
          -->

          <div class="get-ab">
            <div class="red" @click="toPage('DailyRecord')">分红明细</div>
            <div class="orange" @click="toPage('RedRecond')">共建值明细</div>
          </div>
        </div>

        <div class="text-box pt1">
          <div class="wfsf_head">
            <span>万份收益</span>
            <div class="red-color">
              <em>{{million ? million : '0.00'}}</em><span>元</span>
            </div>
          </div>
          <div class="much">
            <div class="num" style="text-align: left;">
              <span>已分红天数</span>
              <span class="fb pt05 ulev1 t-red">{{ redData.receive_number }}</span>
            </div>
            <div class="num" style="text-align: right;">
              <span>剩余分红天数</span>
              <span class="fb pt05 ulev1">{{ redData.validity ? redData.validity : 0 }}</span>
            </div>
          </div>

        </div>

        <div class="text-box">
          <div class="title">活动介绍</div>
          <div
            style="margin: 0.5rem 1rem; text-align: left; font-size: 12px; color: #333;"
          >
            <div v-html="redData.content"></div>
          </div>
        </div>

      </div>
    </div>
<!--
    <van-popup v-model="show" :overlay="true">
      <div class="red-popup">
        <img src="../../../assets/images/bg_redenvelope@2x.png" alt="" />
        <div class="pop-text">
          <span class="money">{{$i18n.t('money')}}{{ daily_dividend }}</span>
          <span class="tip">恭喜您成功领取到红包！</span>
          <span class="sure-btn" @click="show = false">确定</span>
        </div>
      </div>
    </van-popup>
    -->
  </div>
</template>

<script>
import daily_red_controller from "./daily_dividend_controller";

export default daily_red_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#daily_red {
  background: #f70034;
  margin-bottom: 2rem;

  .headImg {
    width: 100%;
    min-height: 3rem;

    .header {
      color: white;
      font-weight: bold;
      line-height: 22px;
      font-size: 18px;
      position: absolute;
      top: 0;
      width: 100%;
      text-align: center;
      padding: 0.5rem 0;
    }

    .icon-back {
      position: absolute;
      left: 1.5rem;
      font-weight: bolder;
    }

    img {
      width: 100%;
    }
  }

  .ImgBg {
    padding: 1rem 0;
    margin-top: -1rem;

    /* background: url("/addons/yun_shop/static/img/bg_2@2x.png") no-repeat; */
  }

  .red-box,
  .list-box,
  .text-box,
  .good-box {
    margin: 0 auto 1rem auto;
    padding-bottom: 1rem;
    width: 22rem;
    background-color: #fff;
    border-radius: 5px;
  }

  .title {
    font-size: 14px;
    color: #fd2352;
    font-weight: bold;
    padding: 0.8rem;
    margin: 0 1rem;
    border-bottom: 0.01rem solid #dcdbdb;
  }

  .list-box {
    overflow: hidden;

    .title {
      display: flex;
      flex-direction: column;
    }

    .gray-text {
      font-size: 12px;
      color: #6e6e6e;
    }

    ul {
      margin: 0.5rem 1rem;
      max-height: 16rem;

      li {
        display: flex;
      }

      .left {
        flex: 0 0 2.5rem;
        align-self: center;

        img {
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
        }
      }

      .right {
        flex: 1;
        display: flex;
        flex-direction: column;
        margin-left: 1rem;
      }

      .right-box {
        display: flex;

        .name {
          flex: 1;
          text-align: left;
        }

        .price {
          flex: 1;
          text-align: right;
          color: #ff2a50;
        }

        .time {
          flex: 1;
          text-align: right;
          color: #999;
        }
      }
    }
  }

  .red-Vdi {
    display: flex;
    flex-direction: column;
  }

  .red-box {
    position: relative;

    .head {
      padding: 0.5rem;
    }

    .red-color {
      font-size: 46px;
      color: #fe3055;
      margin: 1rem;

      span {
        color: #fe3055;
      }
    }

    .get-red,
    .get-gray {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      color: #fff;
      text-align: center;
      margin: 0.5rem auto 0 auto;

      em {
        line-height: 100px;
        font-size: 18px;
      }
    }

    .get-reds {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;

      span {
        color: #fff;
        font-size: 16px;
      }
    }

    .get-red {
      // background-image: linear-gradient(0deg, #ff3961 0%, #ffb65a 100%),
      // linear-gradient(#ff3255, #ff3255);
      background-blend-mode: normal, normal;
    }

    .get-gray {
      background-color: #e1e1e1;
    }

    .red-number {
      display: flex;

      div {
        flex: 1;
      }
    }

    .process {
      width: 20rem;
      height: 6px;
      background-color: #dfdfdf;
      border-radius: 3px;
      margin: 1rem auto;
      margin-top: 0.5rem;
      position: relative;

      .bar {
        position: absolute;
        left: 0;
        height: 6px;
        border-radius: 3px;
        background-color: #fd2352;
      }
    }


    span {
      font-size: 12px;
      color: #666;
    }
  }

  .get-ab {
    position: absolute;
    top: 1rem;
    right: 0;
    font-size: 12px;
    color: #fff;
    .red{
      background:#fd2352;
      padding: 0.1rem 0.5rem;
      border-radius: 8px 0 0 8px;
      margin-bottom: 0.5rem;
    }
  }

  .gray {
    padding: 0.1rem 0.5rem;
    background-color: #d8d8d8;
    border-radius: 8px 0 0 8px;
    margin-bottom: 0.5rem;
  }

  .orange {
    padding: 0.1rem 0.5rem;
    background-color: #ff9f59;
    border-radius: 8px 0 0 8px;
  }

  .good-box {
    .goods {
      margin: 0.5rem 1rem;
      display: flex;
      flex-wrap: wrap;

      li {
        width: 48%;
        text-align: left;
        font-size: 12px;
        margin-bottom: 0.5rem;
      }

      li:nth-child(odd) {
        margin-right: 0.7rem;
      }

      .good-img {
        width: 9.6rem;
        height: 9.6rem;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .good-title {
        word-break: break-all;
        color: #333;
        min-height: 2rem;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .amount {
        color: #fd2352;
        border: 1px solid #fd2352;
        line-height: 2rem;
        padding: 0.2rem;
        border-radius: 3px;
      }

      .buy {
        display: flex;
        font-size: 14px;

        span:first-child {
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }

      .red-buy {
        flex: 0 0 4rem;
        margin-left: 0.4rem;
        font-size: 12px;
        background-color: #fd2352;
        border-radius: 7px;
        color: #fff;
        padding: 0.1rem 0.3rem;
      }
    }
  }

  .red-popup {
    width: 17rem;
    margin: 0 auto;
    position: relative;

    .pop-text {
      color: #fff;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      bottom: 3rem;
      display: flex;
      flex-direction: column;
      width: 90%;
    }

    .money {
      font-size: 44px;
    }

    .tip {
      font-size: 12px;
      margin: 1rem;
    }

    .sure-btn {
      background-color: #ffc900;
      border-radius: 20px;
      padding: 0.5rem;
      font-size: 20px;
    }

    img {
      width: 100%;
    }
  }

  .van-popup {
    background-color: transparent;
  }
  .fb{font-weight:bold;}
  .pt05{padding-top:0.5rem}
  .ulev1{font-size:20px;}
  .pt1{padding-top:1rem;}
  .t-red{color:#fd2352;}
  .much {
      display: flex;
      width: 20rem;
      margin: 0 auto;
      justify-content: center;
      align-items: center;
      .num {
        flex: 1;
        display: flex;
        flex-direction: column;
        text-align:center !important;
      }
    }
    .wfsf_head{
      padding-bottom:1rem;
      em{
        font-style: normal;
        font-weight: 400;
        font-size: 46px;
        color: #fe3055;
      }
    }

}
</style>
