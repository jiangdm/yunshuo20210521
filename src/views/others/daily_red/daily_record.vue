<template>
  <div id="DailyRecond">
    <c-title :hide="false" :text="'分红明细'">
    </c-title>
    <div style="height: 40px;"></div>

    <div class="blank" v-if="recordsList.length <= 0">
      <img src="../../../assets/images/blank.png">
      <span>还没有记录哦</span>
    </div>

    <div class="content" v-if="recordsList.length > 0">
      <ul>
        <li v-for="(item, index) in recordsList" :key="index" style="padding-top:0.5rem;padding-bottom:0.5rem;">
          <div class="first" style="padding-bottom:0.2rem;">
            <span class="time" style="line-height: 2rem;">{{item.created_at}}</span>
          </div>
          <div class="fenhong" style="line-height: 2rem;">
            <div class="fl">
              消费积分<br>
              <span class="xfjf">+ {{item.integral}}</span>
            </div>
            <div class="fr">
              分红<br>
              <span  class="xfjf">+ {{item.receive_amount}}</span>
            </div>

          </div>

        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import daily_record_controller from "./daily_record_controller";

export default daily_record_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  #DailyRecond {
    // background-color: #fff;
    padding: 0.4rem;

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

    .head-img {
      display: flex;
      margin-bottom: 1rem;

      img {
        flex: 0 0 3.5rem;
        width: 3rem;
        height: 3rem;
        border-radius: 50%;
      }

      span {
        flex: 1;
        line-height: 3rem;
        text-align: left;
        margin-left: 1rem;
      }
    }

    .money {
      display: flex;

      div {
        flex: 1;
        display: flex;
        flex-direction: column;
      }

      .gray {
        font-size: 12px;
        color: #999;
      }
    }

    .first {
      flex: 0 0 8rem;
    }

    .content {
      margin: 0;
      font-size: 12px;

      li {
        background-color: #fff;
        padding: 0.5rem;
        margin-bottom:0.5rem;
        border-radius:0.3rem;
        div {
          flex: 1;
        }

        .time {
          color: #999;
        }
      }
    }

    .title {
      display: flex;
      font-size: 14px;

      span {
        flex: 1;
        color: #666;
      }
    }
  }
  .tx-l{text-align:left !important;}
  .tx-r{text-align:right !important;}
  .fenhong{display:flex;justify-content: center;}
  .xfjf{font-size:16px;font-weight:bold;color:#fd2352}
</style>
