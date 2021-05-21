<template>
  <div>
    <c-title :hide="false" :text="'合同账单'">
    </c-title>
    <div style="height: 40px;"></div>
    <ul class="head">
      <li>
        <p class="num">{{dataInfo.contract_num_sum || 0}}</p>
        <p>购买数量</p>
      </li>
      <li>
        <p class="num">{{dataInfo.use_num_sum || 0}}</p>
        <p>已使用数量</p>
      </li>
      <li>
        <p class="num">{{dataInfo.rest_num_sum || 0}}</p>
        <p>可使用数量</p>
      </li>
    </ul>
    <div class="bill-box">
      <div class="blank" v-if="recordsList.length<=0">
        <img src="../../../assets/images/blank.png">
        <span>还没有记录哦</span>
      </div>
      <div class="item-box" v-for="item in recordsList" :key="item.id">
        <div class="top">
          <!--<div class="left">-->
            <!--<img src="https://b.yunzmall.com/image/7ddfbe47f490da923a777062779c4142.jpg" alt="">-->
          <!--</div>-->
          <div class="left">
            <p class="title">{{item.change_mode}}</p>
            <!--<p class="price">{{$i18n.t('money')}}500</p>-->
            <!--<p class="time">购买时间2020-02-15 15:25:24</p>-->
            <!--<p class="time">可用合同数：180</p>-->
          </div>
          <div class="right">
            <p class="price" v-if="item.income_type == 1">{{item.contract_num}}份</p>
            <p class="green" v-else>{{item.contract_num}}份</p>
          </div>
        </div>
        <div class="bottom">
          <p class="time">可用合同数：{{item.after_num}}</p>
          <p class="time right">购买时间{{item.created_at}}</p>
        </div>
        <p class="end_time" v-if="item.income_type == 1">有效期{{item.end_time}}</p>
      </div>
    </div>

    <div class="fixed-box" v-if="showBox">
      <router-link class="fixed-item" :to="fun.getUrl('home')">
        <i class="iconfont icon-zhuye2" style="font-size: 28px;"></i>
        <span>首页</span>
      </router-link>
      <router-link class="fixed-item" :to="fun.getUrl('signIndex')">
        <i class="iconfont icon-yq_hetongzhongxin" style="padding: 4px;"></i>
        <span>合同中心</span>
      </router-link>
      <div class="triangle"></div>
    </div>
    <div class="fixed-img" @click="showBox = !showBox">
      <img src="../../../assets/images/sign/yht_exprot@2x.png" alt="">
    </div>
  </div>
</template>

<script>
import cTitle from "components/title";
import { Toast } from 'vant';
import { scrollMixin } from "utils/mixin";

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      showBox: false,
      dataInfo: {},
      recordsList: [],
      //more
      isLoadMore: true,
      page: 1,
      total_page: 0,
    };
  },
  activated() {
    this.showBox = false;
    this.getData();
  },
  methods: {
    getData() {
      this.page = 1;
      $http
        .get(
          "plugin.yun-sign.frontend.contract-num-log.get-list",
          { page: 1 },
          "加载中"
        )
        .then(response => {
          if (response.result === 1) {
            this.dataInfo = response.data;
            this.isLoadMore = true;
            this.total_page = response.data.list.last_page;
            if (!this.total_page) {
              this.total_page = 0;
            }
            this.recordsList = response.data.list.data;
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //获取更多数据
    getMoreData() {
      const that = this;
      that.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        $http
          .get(
            "plugin.yun-sign.frontend.contract-num-log.get-list",
            {
              page: that.page
            },
            "加载中"
          )
          .then(
            function(response) {
              that.isLoadMore = true;
              if (response.result === 1) {
                var myData = response.data.list.data;
                that.recordsList = that.recordsList.concat(myData); //数组拼接
              } else {
                that.page = that.page - 1;
                that.isLoadMore = false;
                return;
              }
            },
            function(response) {
              // error callback
            }
          );
      }
    },
  },
  components: { cTitle }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .head {
    background: #fff;
    display: flex;
    padding: 1rem;

    li {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    p {
      color: #999;
    }

    .num {
      font-size: 18px;
      color: #000;
      font-weight: bold;
    }
  }

  .item-box {
    margin-top: 0.5rem;
    display: flex;
    flex-direction: column;
    background: #fff;
    padding: 0.5rem;

    .top {
      display: flex;

      .left {
        flex: 1;
        text-align: left;

        .title {
          font-weight: bold;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .price {
          color: #ff2c29;
          font-size: 18px;
        }

        .time {
          font-size: 12px;
          color: #666;
        }
      }

      .right {
        flex: 0 0 5rem;
        text-align: right;

        .price {
          color: #ff2c29;
          font-size: 18px;
        }

        .green {
          color: #009c00;
          font-size: 18px;
        }
      }
    }

    .bottom {
      margin-top: 0.5rem;
      display: flex;
      font-size: 12px;

      .time {
        flex: 1;
        text-align: left;
        font-size: 12px;
        color: #666;
      }

      .right {
        text-align: right;
      }
    }

    .end_time {
      text-align: right;
      font-size: 12px;
      color: #ff2c29;
    }
  }

  .fixed-img {
    position: fixed;
    bottom: 8rem;
    right: 2%;

    img {
      width: 3rem;
      height: 3rem;
    }
  }

  .fixed-box {
    background: #fff;
    position: fixed;
    bottom: 12rem;
    right: 2%;
    color: #518bff;
    width: 4rem;
    border-radius: 5px;
    padding: 2px;
    box-shadow: 0 0.25rem 0.5625rem 0.0625rem rgba(0, 0, 0, 0.06);

    .triangle {
      position: fixed;
      bottom: 11.1rem;
      right: 8%;
      width: 0;
      height: 0;
      border: 8px solid transparent;
      border-top-color: #fff;
    }

    .fixed-item {
      display: flex;
      flex-direction: column;

      i {
        font-size: 21px;
      }
    }
  }
</style>
