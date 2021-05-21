<template>
  <div>
    <c-title :hide="false" :text="'应用市场'">
    </c-title>
    <div style="height: 50px;"></div>

    <!--<p class="site-name" v-if="domain">域名：{{domain}}</p>-->

    <div class="order-list">
      <div class="order-item" v-for="item in projectList" :key="item.id">
        <div class="head">
          <p style="font-weight: bold;">订单号：{{item.order_sn}}</p>
          <p style="color: #8c8c8c;">{{item.create_time}}</p>
        </div>
        <div style="text-align: left; margin: 5px 0;" v-if="item.has_market_product && item.has_market_product.domain">
          当前域名：{{item.has_market_product.domain}}
        </div>
        <div class="content" v-for="good in item.has_many_order_goods" :key="good.id">
          <div class="left">
            <img :src="good.thumb" alt="">
          </div>
          <div class="right">
            <p class="title van-multi-ellipsis--l2">{{good.title}}</p>
            <div class="check-box">
              <p class="price">{{$i18n.t("money")}}{{good.price}}</p>
              <p class="check" @click="toShow(good,item)">查看插件></p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="allLoad && projectList.length > 0">没有更多了~</div>

    <div class="blank" v-if="projectList.length <= 0">
      <img src="../../../assets/images/blank.png">
      <span>暂无数据</span>
    </div>

    <van-popup v-model="PopupShow" round closeable position="bottom">
      <p class="popup-title">插件列表</p>
      <div class="popup-box">
        <p class="popup-item van-hairline--bottom" v-for="(item, index) in showList" :key="index">{{item}}</p>
      </div>
    </van-popup>

  </div>
</template>

<script>
import application_market_controller from "./application_market_controller";

export default application_market_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .site-name {
    padding: 1rem;
    text-align: left;
  }

  .order-list {
    margin: 0 1rem 1rem 1rem;
  }

  .order-item {
    padding: 0.5rem;
    background: #fff;
    border-radius: 10px;
    margin-bottom: 0.5rem;

    .head {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
    }
  }

  .content {
    display: flex;
    margin-top: 10px;

    .left {
      width: 4rem;
      height: 4rem;

      img {
        width: 4rem;
        height: 4rem;
      }
    }

    .right {
      flex: 1;
      text-align: left;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      margin-left: 5px;

      .check-box {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .check {
          color: #f14e4e;
        }
      }
    }
  }

  .popup-title {
    padding: 1rem;
    font-size: 18px;
    font-weight: bold;
  }

  .popup-box {
    height: 15rem;
    overflow-y: scroll;

    .popup-item {
      padding: 0.5rem;
    }
  }
</style>
