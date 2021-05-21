<template>
  <div class="share">
    <c-title class="circle_title" :hide="false" :text="'分享奖'"> </c-title>
    <!-- 用户信息 -->
    <div class="member">
      <div class="member_info">
        <img class="pictrue" :src="memberInfo.pic" alt="" />
        <span class="name">{{memberInfo.name}}</span>
      </div>
    </div>
    <div class="accruing">
      <span>累计金额</span>
      <span class="accruing_money">￥{{ incomeCount || 0 }}</span>
    </div>
    <div class="recordList">
      <van-tabs v-model="active" title-active-color="#FB6B68" color="#FB6B68">
        <van-tab title="奖励记录" name="award">
          <!-- 没有数据时 -->
          <div class="no_data" v-if="awardList.length == 0">暂无数据~</div>
          <!-- 奖励记录列表 -->
          <div class="award_list">
            <div class="list" v-for="(item,index) in awardList" :key="index">
              <div class="list_left">
                <div class="name" v-if="item.order">{{item.order.order_sn}}</div>
                <div class="time">{{item.created_at}}</div>
              </div>
              <div class="list_right">
                <div class="income">￥{{item.amount}}</div>
              </div>
            </div>
          </div>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import index_controller from "./index_controller";
export default index_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.circle_title {
  height: 2.19rem;
}
// 用户信息样式
.member {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 6rem;
  padding: 2rem;
  background-color: #f15353;

  .pictrue {
    width: 3.44rem;
    height: 3.44rem;
    border-radius: 50%;
  }

  .name {
    vertical-align: top;
    padding-left: 1rem;
    color: #fff;
  }
}

// 总金额样式
.accruing {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #fff;

  .accruing_money {
    color: #f15353;
  }
}

// 列表样式
.recordList {
  margin-top: 0.63rem;

  .list {
    display: flex;
    padding: 1rem;
    background-color: #fff;
    border-bottom: 0.06rem solid #f2f2f2;

    .list_left {
      width: 50%;
      text-align: left;

      .name {
        color: #040a0d;
        padding-bottom: 1rem;
      }

      .time {
        font-size: 12px;
        color: #6a6a6a;
      }
    }

    .list_right {
      width: 50%;
      text-align: right;

      .income {
        color: #f15353;
      }
    }
  }

  .no_data {
    margin-top: 1rem;
  }
}
</style>
