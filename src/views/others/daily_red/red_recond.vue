<template>
  <div id="RedRecond">
    <c-title :hide="false" :text="'共建值记录'">
    </c-title>
    <div style="height: 40px;"></div>

    <div class="blank" v-if="recordsList.length <= 0">
      <img src="../../../assets/images/blank.png">
      <span>还没有记录哦</span>
    </div>

    <div class="content" v-if="recordsList.length > 0">
      <ul>
        <li v-for="(item, index) in recordsList" :key="index">
          <div class="first tx-l">
            <p>单号：{{item.serial_number}}</p>
            <span class="time">{{item.created_at}}</span>
          </div>
          <div class="gjz tx-r" style="line-height: 2rem;">
           + {{item.change_money}}
          </div>

        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import red_amount_controller from "./red_recond_controller";

export default red_amount_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  #RedRecond {
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
        display: flex;
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
  .gjz{color:green;font-size:16px;font-weight:bold;}
</style>
