<template>
  <div id="goodslist">
    <p class="component-title" v-if="!noText">{{ text | escapeTitle }}</p>
    <div class="store">
      <div @click="toRouter(items)" v-for="(items, i) in stores" :key="i">
        <div class="list">
          <div style="flex: 0 0 4rem;">
            <div class="store-img">
              <a class="store-logo">
                <span class="img-mask" v-if="items.operating_state === 1"></span>
                <span class="img-text" v-if="items.operating_state === 1">商家休息中</span>
                <img v-lazy="items.thumb" />
              </a>
            </div>
            <div class="classify" v-if="items.has_one_category">
              <span @click.stop="toClassify(items.has_one_category.id)">{{ items.has_one_category.name }}</span>
            </div>
            <div class="classify" v-if="!items.has_one_category">
              <span>暂无分类</span>
            </div>
          </div>

          <!--new-->
          <div class="store-intro2">
            <h2>{{ items.store_name }}</h2>
            <div class="score-box">
              <div class="score-left">
                <i class="iconfont icon-card_collect_b"></i>
                <span>{{ items.average_score }}分</span>
                <span style="margin-left: 0.5rem;">月售{{ items.order_total }}单</span>
              </div>
              <div class="score-right" @click.stop="goToAdress(items)">{{ items.distance }}{{ items.unit }} <i class="iconfont icon-all_daohang"></i></div>
            </div>
            <div class="dispatch-box" v-if="items.address" style="padding: 0; color: #666;">
              <p v-if="items.address.city">{{ items.address.city }}</p>
              <p v-if="items.address.detailed_address">{{ items.address.detailed_address }}</p>
            </div>
            <div class="discount-box">
              <p class="discount-item" v-if="items.has_many_coupon && items.has_many_coupon.length > 0">
                <span class="red">优惠</span>
                <span style="margin-left: 0.5rem;" v-for="(coupon, index) in items.has_many_coupon" :key="index" v-if="index <= 2">{{ coupon.name }}</span>
              </p>
              <p class="discount-item" v-if="items.store_point.point_switch != 0 || items.store_love.award == 1">
                <span class="red">赠送</span>
                <span style="margin-left: 0.5rem;" v-if="items.store_point.point_switch == 0 ? false : true">{{ items.store_point.point }}</span>
                <span style="margin-left: 0.5rem;" v-if="items.store_love.award == 1 ? true : false">{{ items.store_love.award_proportion }}</span>
              </p>
              <p class="discount-item" v-if="items.store_point.point_deduct_switch != 0 || items.store_love.deduction == 1">
                <span class="red">{{ items.goods_show && items.goods_show.search_class_name ? items.goods_show.search_class_name : "抵扣" }}</span>
                <span style="margin-left: 0.5rem;" v-if="items.store_love.deduction == 1 ? true : false">{{ items.store_love.deduction_proportion }}</span>
                <span
                  style="margin-left: 0.5rem;"
                  :class="{ store_deduction_style: items.goods_show && items.goods_show.store_deduction_style }"
                  v-if="items.store_point.point_deduct_switch == 0 ? false : true"
                  >{{ items.store_point.max_point_deduct }}</span
                >
                <span style="margin-left: 0.5rem;" class="store_cash_back_style" v-if="items.store_point.commission_deduct && items.goods_show.store_cash_back">{{
                  items.store_point.commission_deduct
                }}</span>
              </p>
              <p class="discount-item" v-if="items.store_full_reduction && items.store_full_reduction.length != 0">
                <span class="red">满减</span>
                <span style="margin-left: 0.5rem;" v-for="(reduction, index) in items.store_full_reduction" :key="index" v-if="index <= 2">{{ reduction }}</span>
              </p>
              <p class="discount-item" v-if="items.store_full_package">
                <span class="red">包邮</span>
                <span style="margin-left: 0.5rem;">{{ items.store_full_package }}</span>
              </p>
            </div>
            <div class="dispatch-box" v-if="items.dispatchs">
              <span v-for="dispatch in items.dispatchs" :key="dispatch">{{ dispatch }}</span>
            </div>
          </div>
          <!--new end-->
        </div>
        <div class="goods-box" v-if="items.recommend_goods && items.recommend_goods.length > 0">
          <div class="good-item" v-for="(good, i) in items.recommend_goods" :key="i" @click.stop="toGood(good.goods_id)">
            <div class="good-img">
              <img v-lazy="good.thumb" alt />
            </div>
            <p class="good-title">{{ good.title }}</p>
            <p class="good-price" v-if="fun.isTextEmpty(good.goods_show)">{{ $i18n.t("money") }}{{ good.price }}</p>
            <div class="show_price_box" v-if="!fun.isTextEmpty(good.goods_show)">
              <div class="show_price" :class="[i % 2 == 0 ? 'red_white' : 'white_red']" v-for="(item, i) in good.goods_show" :key="i">{{ item.name }}:{{ item.value }}</div>
            </div>
          </div>
        </div>
      </div>
      <div style="width: 100%; height: 50px; line-height: 50px;" v-if="!show && !noText">{{ $i18n.t("没有更多了") }}~</div>
      <div style="width: 100%; height: 50px; line-height: 50px;" v-if="show && !noText" @click="getMoreStores">
        {{ $i18n.t("加载更多") }}
      </div>
    </div>
  </div>
</template>

<script>
// import { Toast } from 'vant';
import { mapState } from "vuex";
// import cStar from 'components/star';

export default {
  // components: { cStar },
  props: ["stores", "text", "loading", "totalPage", "page", "isLoadMore", "noText"],
  data() {
    return {
      list: [],
      // show: false
    };
  },
  mounted() {
    this.show = this.isLoadMore;
  },
  computed: {
    ...mapState(["view"]),
    show() {
      return !(this.page >= this.totalPage);
    }
  },
  activated() {},
  methods: {
    toGood(id) {
      this.$router.push(this.fun.getUrl("goods", { id: id }));
    },
    goToAdress(items) {
      let point = this.fun.bd_decrypt(items.longitude, items.latitude);
      this.fun.goToWXAdress(point, items.store_name, items.address.detailed_address);
      // if (this.fun.isWeiXin()) {
      //   this.goToWXAdress(point, items);
      // } else {
      //   window.location.href = `https://uri.amap.com/navigation?to=${point.lng},${point.lat},${items.store_name}&mode=car&policy=1&src=mypage&coordinate=gaode&callnative=0`;
      // }
    },
    goToWXAdress(point, store) {
      $http
        .post(
          "member.member.wxJsSdkConfig",
          {
            url: this.fun.isIosOrAndroid() === "android" ? window.location.href : window.initUrl
          },
          " "
        )
        .then(
          response => {
            if (response.result === 1) {
              if (response.data.config) {
                wx.config({
                  debug: false,
                  appId: response.data.config.appId,
                  nonceStr: response.data.config.nonceStr,
                  timestamp: response.data.config.timestamp,
                  url: response.data.config.url,
                  signature: response.data.config.signature,
                  jsApiList: ["checkJsApi", "openLocation", "getLocation"]
                });

                wx.checkJsApi({
                  jsApiList: ["getLocation"],
                  success: function(res) {
                    if (res.checkResult.getLocation == false) {
                      alert("你的微信版本太低，不支持微信JS接口，请升级到最新的微信版本！");
                    }
                  }
                });
                wx.ready(function() {
                  wx.getLocation({
                    type: "gcj02", // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                    success: function(res) {
                      wx.openLocation({
                        latitude: point.lat, // 纬度，浮点数，范围为90 ~ -90
                        longitude: point.lng, // 经度，浮点数，范围为180 ~ -180。
                        name: store.store_name, // 位置名
                        address: store.address.detailed_address, // 地址详情说明
                        scale: 20 // 地图缩放级别,整形值,范围从1~28。默认为最大
                      });
                    },
                    cancel: function(res) {
                      alert("用户拒绝授权获取地理位置");
                    }
                  });
                });

                wx.error(function(response) {
                  console.log(response);
                  window.location.href = `https://uri.amap.com/navigation?to=${point.lng},${point.lat},${store.store_name}&mode=car&policy=1&src=mypage&coordinate=gaode&callnative=0`;
                });
              } else {
                window.location.href = `https://uri.amap.com/navigation?to=${point.lng},${point.lat},${store.store_name}&mode=car&policy=1&src=mypage&coordinate=gaode&callnative=0`;
              }
            } else {
              window.location.href = `https://uri.amap.com/navigation?to=${point.lng},${point.lat},${store.store_name}&mode=car&policy=1&src=mypage&coordinate=gaode&callnative=0`;
            }
          },
          function(response) {
            console.log(response);
            window.location.href = `https://uri.amap.com/navigation?to=${point.lng},${point.lat},${store.store_name}&mode=car&policy=1&src=mypage&coordinate=gaode&callnative=0`;
          }
        );
    },

    toRouter(item) {
      if (item.specify_show == 1) {
        this.$router.push(this.fun.getUrl("o2oStore_v2", { store_id: item.id, fromHome: 1 }));
      } else {
        this.$router.push(this.fun.getUrl("HomeSeller", { store_id: item.id, fromHome: 1 }));
      }
    },

    //跳转至分类
    toClassify(id) {
      this.$router.push(this.fun.getUrl("o2oCategory", { id: id }));
    },

    getMoreStores() {
      this.$emit("changList");
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#goodslist {
  background: #f5f5f5;

  .loadNomore img {
    width: 20%;
  }

  h3 {
    width: 65%;
    position: relative;
    margin: 0 auto 0.9375rem;
    height: 1.25rem;
    padding: 0.625rem 0 0;

    span {
      display: block;
    }

    .title {
      width: 48%;
      text-align: center;
      padding: 0 0.625rem;
      background: #f5f5f5;
      position: absolute;
      z-index: 9;
      left: 0;
      right: 0;
      margin: auto;
      font-size: 14px;
      color: #666;
    }

    .spas {
      border-bottom: 0.0625rem solid #d9d9d9;
      position: absolute;
      z-index: 5;
      top: 1.25rem;
      width: 100%;
    }
  }

  .component-title {
    background: #fff;
    padding: 0.625rem;
    text-align: left;
    font-weight: bold;
    font-size: 18px;
  }

  .store {
    height: auto;
    width: 100%;
    background: #fff;

    /* margin-top: 0.625rem; */
    border-bottom: 0.0625rem solid #f5f3f3;

    .list {
      position: relative;
      padding: 12px;

      /* border-top: 0.0625rem solid #e7e9e4; */
      background: #fff;
      font-size: 14px;
      color: #333;
      text-align: left;
      display: flex;

      .store-img {
        position: relative;

        .store-logo {
          position: absolute;
          top: 0;
          bottom: 0;
          float: none;
          width: 4rem;
          height: 4rem;
        }

        .img-mask {
          position: relative;
          top: 60%;
          left: 0;
          z-index: 10;
          width: 100%;
          height: 40%;
          border: 0.0625rem solid #e8e8e8;
          display: inline-block;
          margin-right: 0.5rem;
          font-size: 12px;
          background-color: #3b4043;
          opacity: 0.6;
        }

        .img-text {
          position: relative;
          top: 20%;
          left: 3%;
          z-index: 15;
          width: 100%;
          height: 40%;
          display: inline-block;
          margin-right: 0.5rem;
          font-size: 12px;
          color: white;
        }

        img {
          position: absolute;
          top: 0;
          left: 0;
          z-index: 5;
          width: 100%;
          height: 100%;
          border: 0.0625rem solid #e8e8e8;
          display: inline-block;
          margin-right: 0.5rem;
          border-radius: 50%;
        }
      }

      /* new */
      .store-intro2 {
        flex: 1;
        position: relative;
        margin-left: 0.75rem;
        display: flex;
        flex-direction: column;

        h2 {
          max-width: 17rem;
          font-size: 14px;
          color: #333;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          display: inline-block;
          margin-top: 0;
          font-weight: bold;
          flex: 1;
        }

        .score-box {
          display: flex;
          width: 100%;
          color: #666;
          padding: 0.2rem 0;

          .score-left {
            flex: 1;
            align-self: center;
            justify-self: center;

            .icon-card_collect_b {
              color: #ffba00;
            }
          }

          .score-right {
            color: #ff2c29;
            flex: 0 0 4rem;
            text-align: right;
            display: flex;
            align-items: center;
            justify-content: space-between;

            i {
              font-size: 20px;
            }
          }
        }

        .discount-box {
          display: flex;
          flex-direction: column;

          .red {
            color: #ff2c29;
          }
        }

        .dispatch-box {
          display: flex;
          padding: 0.5rem 0;

          span {
            margin-right: 0.4rem;
            padding: 0 0.3rem;
            color: #666;
            border-radius: 10px;
            border: solid 1px #ff8400;
          }
        }
      }

      /* new end */
    }
  }

  .classify {
    float: left;
    margin-top: 4.375rem;

    span {
      width: 4rem;
      height: 1.25rem;
      display: block;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 12px;
      line-height: 1.25rem;
      cursor: pointer;
      background-color: #ff6333;
      border-radius: 0.313rem;
      color: #fff;
    }
  }
}
// new list
.zanwBox {
  width: 6rem;
  height: 8rem;
  flex-shrink: 0;
}

.goods-box {
  margin: 0 0.5rem;
  display: flex;
  // width: 17.4rem;
  overflow-x: scroll;

  .good-item {
    width: 6rem;
    margin-right: 0.56rem;
    font-size: 15px;
    text-align: left;

    .good-img {
      width: 6rem;
      height: 6rem;
      border-radius: 5px;

      img {
        width: 100%;
        height: 100%;
        border-radius: 5px;
      }
    }

    .good-title {
      font-weight: bold;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 12px;
    }

    .good-price {
      font-weight: bold;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 11px;
      color: #ff2c29;
    }
  }

  /* 门店拼团 */
  .show_price_box {
    display: flex;
    flex-wrap: wrap;
  }

  .show_price {
    font-size: 11px;
    color: #ff2c29;
    border: solid #ff2c29 1px;
    padding: 1px 4px;
    margin-top: 5px;
  }

  .red_white {
    color: #fff;
    background: #ff2c29;
    margin-right: 5px;
  }

  .white_red {
    color: #ff2c29;
    background: #fff;
  }

  .store_deduction_style {
    background: #ff2c29;
    color: #fff;
    padding: 0 5px;
    font-size: 10px;
  }

  .store_cash_back_style {
    border: 1px solid #ff2c29;
    color: #ff2c29;
    padding: 0 5px;
    font-size: 10px;
  }

  /* 门店拼团 */
}

.store_deduction_style {
  background: #ff2c29;
  color: #fff;
  padding: 0 5px;
  font-size: 10px;
}

.store_cash_back_style {
  border: 1px solid #ff2c29;
  color: #ff2c29;
  padding: 0 5px;
  font-size: 10px;
}
</style>
