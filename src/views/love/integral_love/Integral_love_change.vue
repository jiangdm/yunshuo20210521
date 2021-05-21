<template>
  <div id="integral_transfer">
    <c-title :hide="false"
             :text="`转化${integral.love_name||'爱心值'}`"> </c-title>
    <div style="height: 50px;"></div>
    <!-- 优化 -->
    <div class="content">
      <ul class="transfer_info">
        <li class="info_a">
          <span>当前{{ integral.integral_name||'消费积分' }}：</span>
          <span>{{ integral.member_integral }}</span>
        </li>
        <li class="info_b">
          <span>受让人ID：</span>
          <input type="text"
                 v-model="transferID"
                 placeholder="请输入您要转账的会员ID" />
        </li>
      </ul>
      <div class="transfer_sum">
        <span>转化{{ integral.integral_name||'消费积分' }}</span>
        <div class="sum">
          <input type="tel"
                 v-model="transferIntegral"
                 placeholder="0.00" />
        </div>

      </div>
      <div class="explain">
        <p>例如:1个消费积分等于2个<span>{{integral.love_name||'爱心值'}}</span></p>
        <p style="color: #ccc; margin-top: 0.5rem;">注:转化比例{{integral.transformation_amount}}:{{integral.transformation_ratio}},你实际到账数为{{Number(transferIntegral)/integral.transformation_amount*integral.transformation_ratio}}</p>
      </div>
      <button type="button"
              class="btn custom_color"
              @click="sureTransfer">
        确认转化
      </button>
    </div>
  </div>
</template>

<script>
import Integral_love_change_controller from './Integral_love_change_controller';

export default Integral_love_change_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#integral_transfer {
  .content {
    .transfer_info {
      background: #fff;
      padding-left: 0.875rem;
      font-size: 16px;

      .info_a,
      .info_b {
        line-height: 2.875rem;
        border-bottom: solid 0.0625rem #ebebeb;
        display: flex;
        justify-content: flex-start;

        span:first-child {
          // width: 6.875rem;
          display: block;
          text-align: left;
        }

        input {
          border: none;
          width: 15.625rem;
        }
      }
    }

    .explain {
      padding: 0.625rem 0.875rem;
      background: #fff;
      text-align: left;
    }

    .transfer_sum {
      background: #fff;
      padding: 0.625rem 0.875rem;
      border-bottom: solid 1px #ccc;

      span {
        display: block;
        font-size: 16px;
        line-height: 2.5rem;
        text-align: left;
      }

      .sum {
        text-align: left;
        font-size: 24px;

        input {
          margin-left: 0.375rem;
          line-height: 3.75rem;
          width: 90%;
          font-size: 36px;
          border: none;
        }
      }
    }

    .personal_info {
      margin-top: 0.625rem;
      background: #fff;
      padding-left: 0.875rem;

      li {
        line-height: 2.875rem;
        display: flex;
        font-size: 16px;
        border-bottom: solid 0.0625rem #ebebeb;
        text-align: left;

        span:first-child {
          display: block;
          width: 6.875rem;
        }
      }

      li:last-child {
        border: none;
      }
    }

    .btn {
      width: 21.5625rem;
      margin: 1.25rem auto;
      height: 2.875rem;
      border-radius: 0.25rem;
      font-size: 16px;
      color: #fff;
      background: #f15353;
      border: none;
    }
  }
}
</style>
