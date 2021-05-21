<template>
  <div id="supplier" v-if="showPage">
    <!--<c-title :hide="false" text='供应商店铺'></c-title>-->
    <!--<div style="height:40px;"></div>-->
    <div class="search-box">
      <div class="return" @click="goBack">
        <i class="fa fa-angle-left"></i>
      </div>
      <div class="search" @click="goToSearch">
        <van-icon class="iconfont icon-sousuo" size="1.125rem" color="#666"></van-icon>
        <input type="text" placeholder="搜索本店商品" readonly/>
      </div>
      <div class="icon-a" @click="show1 = true">
        <van-icon class="iconfont icon-service" size="1.875rem" color="#666"></van-icon>
      </div>
      <div class="icon-b" @click="toggleSlide()">
        <van-icon class="iconfont icon-more" size="1.875rem" color="#666"></van-icon>
      </div>
    </div>
    <ul class="menu" v-if="sliderShow">
      <div class="spare">
        <van-icon class="iconfont icon-spare" custom size="1rem" color="#333"></van-icon>
      </div>
      <li @click="goToUrl('home', 'route')">
        <van-icon class="iconfont icon-home" custom size="1.25rem" color="#f5f5f5"></van-icon>
        <span>首页</span>
      </li>
      <li @click="goToUrl('orderlist', 'route')">
        <van-icon class="iconfont icon-order" custom size="1.25rem" color="#f5f5f5"></van-icon>
        <span>订单</span>
      </li>
      <li @click="goToUrl('member', 'route')">
        <van-icon class="iconfont icon-my" custom size="1.25rem" color="#f5f5f5"></van-icon>
        <span>我的</span>
      </li>
    </ul>
    <div class="supplier-box">
      <div class="supplier-info">
        <div class="user-img"><img :src="supplierInfo.logo"/></div>
        <ul class="user-name">
          <li>{{ fun.isTextEmpty(supplierInfo.store_name) ? supplierInfo.username : supplierInfo.store_name }}</li>
          <li>
            商品数量：<span>{{ indexData.list_count }}</span>
          </li>
        </ul>
        <div class="user-btn" @click="goToSupplierInfo">查看信息</div>
      </div>
    </div>
    <!-- 选项卡 -->
    <van-tabs v-model="tab" swipeable @change='changeTab'>
      <!-- 首页 -->
      <van-tab title="首页">
        <div class="home-page">
          <div class="banner" v-if="(indexData.slide && indexData.slide.length > 0) || (!fun.isTextEmpty(indexData.advs) &&
                  (!fun.isTextEmpty(indexData.advs[0].img) || !fun.isTextEmpty(indexData.advs[1].img)))">
            <div class="slide" v-if="indexData.slide && indexData.slide.length > 0">
              <c-myswipe
                :pagination-visible="true"
                :repeating="true"
                :slides="indexData.slide"
                :auto="3000"
                style="height: 8rem; width: 21.9375rem; margin: 0 auto; border-radius: 0.375rem 0.375rem 0 0;"
              >
                <div
                  v-for="(slide, index) in indexData.slide"
                  :key="index"
                  style="width: 100%; height: 100%;"
                  @click="goToUrl(slide.link, 'href')"
                >
                  <img width="100%" height="100%" :src="slide.thumb"/>
                </div>
              </c-myswipe>
            </div>
            <ul
              class="slide_bottom"
              v-if="
                !fun.isTextEmpty(indexData.advs) &&
                  (!fun.isTextEmpty(indexData.advs[0].img) || !fun.isTextEmpty(indexData.advs[1].img))
              "
            >
              <li
                :key="i"
                v-for="(item, i) in indexData.advs"
                @click="goToUrl(item.link, 'href')"
                v-if="!fun.isTextEmpty(item.img)"
              >
                <img :src="item.img"/>
              </li>
            </ul>
          </div>
          <div class="hot" v-if="!fun.isTextEmpty(indexData.list_is_hot)">
            <div class="title">
              <div class="icon"><img src="../../../assets/images/goods-like01.png"/></div>
              <h1>热销top</h1>
            </div>
            <div class="goods" :key="i" v-for="(item, i) in indexData.list_is_hot" @click="goToDetail(item.id)">
              <div class="img"><img :src="item.thumb" style="width: 100%; height: 100%;"/></div>
              <ul class="info">
                <li style="-webkit-box-orient: vertical;">{{ item.title }}</li>
                <li>
                  <span class="left">
                    <font>{{ $i18n.t("money") }}</font>
                    <span
                      v-if="item.vip_level_status && item.vip_level_status.status == 1"
                      style="font-size: 0.75rem; background: #f15353; color: white; padding: 0.2rem 0.5rem; border-top-left-radius: 0.5rem; border-bottom-right-radius: 0.5rem;"
                    >
                      {{ item.vip_level_status.word }}
                    </span>
                    <span v-else>
                      {{ item.price }}
                    </span>
                  </span>
                  <span class="right">
                    <span v-show="parseInt(item.market_price)">{{ $i18n.t("money") }}{{ item.market_price }}</span>
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div class="rec" v-if="!fun.isTextEmpty(indexData.list_is_recommand)">
            <div class="title">
              <div class="icon"><img src="../../../assets/images/member-hot.png"/></div>
              <h1>店长推荐</h1>
            </div>
            <div class="goods-list">
              <div class="goods" :key="i" v-for="(item, i) in indexData.list_is_recommand" @click="goToDetail(item.id)">
                <div class="img">
                  <img :src="item.thumb ? item.thumb : require('../../../assets/images/loading.jpg')"/>
                </div>
                <ul class="info">
                  <li style="-webkit-box-orient: vertical;">{{ item.title }}</li>
                  <li>
                    <div class="left" style="overflow: hidden; height: 25px; line-height: 25px;">
                      <font>{{ $i18n.t("money") }}</font>
                      <span
                        v-if="item.vip_level_status && item.vip_level_status.status == 1"
                        style="font-size: 0.75rem; background: #f15353; color: white; padding: 0.2rem 0.5rem; border-top-left-radius: 0.5rem; border-bottom-right-radius: 0.5rem;"
                      >
                        {{ item.vip_level_status.word }}
                      </span>
                      <span v-else>
                        {{ item.price }}
                      </span>
                    </div>
                    <div class="right">
                      <span v-show="parseInt(item.market_price)">{{ $i18n.t("money") }}{{ item.market_price }}</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </van-tab>
      <!-- 商品 -->
      <van-tab title="商品">
        <c-sort :supplier="true" v-on:sortIn="sortOut"></c-sort>
        <div class="goods-box">
          <div class="goods-list">
            <div class="goods" :key="i" v-for="(item, i) in goodsArr" @click="goToDetail(item.id)">
              <div class="img"><img :src="item.thumb" style="width: 100%; height: 100%;"/></div>
              <ul class="info">
                <li style="-webkit-box-orient: vertical;">{{ item.title }}</li>
                <li>
                  <span class="left">
                    <font>{{ $i18n.t("money") }}</font>
                    <span
                      v-if="item.vip_level_status && item.vip_level_status.status == 1"
                      style="font-size: 0.75rem; background: #f15353; color: white; padding: 0.2rem 0.5rem; border-top-left-radius: 0.5rem; border-bottom-right-radius: 0.5rem;"
                    >
                      {{ item.vip_level_status.word }}
                    </span>
                    <span v-else>
                      {{ item.price }}
                    </span>
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div v-if="good_page >= good_total_page">
            <img style="width: 6rem;" src="../../../assets/images/no-more-product.png" alt=""/>
          </div>
        </div>
      </van-tab>

      <!-- 活动 -->
      <van-tab title="活动">
        <div class="active">
          <div class="goods-list">
            <div
              class="goods"
              :key="i"
              v-for="(item, i) in actGoodsArr"
              @click="goToDetail(item.id)"
              v-if="item.has_one_goods_limit_buy.status != 0"
            >
              <div class="img"><img :src="item.thumb" style="width: 100%; height: 100%;"/></div>
              <ul class="info">
                <li style="-webkit-box-orient: vertical;">{{ item.title }}</li>
                <li>
                  <span class="left">
                    <font>{{ $i18n.t("money") }}</font>
                    <span
                      v-if="item.vip_level_status && item.vip_level_status.status == 1"
                      style="font-weight: 400; font-size: 0.75rem; line-height: 0px;"
                    >
                      {{ item.vip_level_status.word }}
                    </span>
                    <span v-else>
                      {{ item.price }}
                    </span>
                  </span>
                  <span class="right">限时特价</span>
                </li>
              </ul>
            </div>
          </div>
          <div v-if="act_page >= act_total_page">
            <img style="width: 6rem;" src="../../../assets/images/no-more-product.png" alt=""/>
          </div>
        </div>
      </van-tab>
      <!-- 直播间 -->
      <van-tab title="直播" v-if="is_room == 1 && recordsList.length > 0">
        <template v-if="!fun.isTextEmpty(recordsList)">
          <c-live :recordsList="recordsList" :showtitle="false"></c-live>
          <span style="color: #999;" v-if="showMoreLive" @click.stop="getLiveList(true)">加载更多</span>
        </template>
        <img
          v-if="fun.isTextEmpty(recordsList)"
          style="width: 6rem;"
          src="../../../assets/images/no-more-product.png"
          alt=""
        />
      </van-tab>
    </van-tabs>

    <van-popup v-model="show1" position="center" round style="width: 80%;">
      <div class="pop-content">
        <div class="pop-top">
          <div class="left" v-if="!fun.isTextEmpty(cservice)">
            <div class="wrap">
              <a :href="cservice">
                <div class="image"><img src="../../../assets/images/kf_online_contect@2x.png"/></div>
              </a>
              <div>在线联系</div>
            </div>
          </div>
          <div
            style="display: flex; align-items: center;"
            v-if="!fun.isTextEmpty(cservice) && !fun.isTextEmpty(service_mobile)"
          >
            <div class="line"></div>
          </div>
          <div class="right" v-if="!fun.isTextEmpty(service_mobile)">
            <div class="wrap">
              <div class="image">
                <a :href="`tel:${service_mobile}`"><img src="../../../assets/images/kf_tel_contect@2x.png"/></a>
              </div>

              <div style="margin-top: 0.5rem;">{{ service_mobile }}</div>
            </div>
          </div>
        </div>
        <div class="pop-bottom" v-if="!fun.isTextEmpty(service_QRcode)">
          <div class="image">
            <img :src="service_QRcode" style="width: 100%; height: 100%;"/>
          </div>
        </div>
        <i class="iconfont icon-close11" @click="show1 = false"></i>
      </div>
    </van-popup>
  </div>
</template>
<script>
import supplier_controller from "./goods_supplier_controller";

export default supplier_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  #supplier {
    position: relative;

    .search-box {
      position: relative;
      display: -webkit-box;
      background-color: #fff;
      height: 2.8125rem;
      border-bottom: solid 0.0625rem #ebebeb;

      .return {
        width: 2.8125rem;
        height: 2.8125rem;
      }

      .fa-angle-left {
        font-size: 1.5rem;
        line-height: 2.8125rem;
        color: #666;
      }

      .search {
        display: flex;
        align-items: center;
        margin-top: 0.5rem;
        padding: 0 0.625rem;
        height: 1.75rem;
        line-height: 1.75rem;
        text-align: left;
        width: 13.75rem;
        border: solid 0.0625rem #666;
        border-radius: 0.875rem;

        input {
          margin-left: 0.375rem;
          border: none;
        }
      }

      .icon-b {
        width: 2.8125rem;
        height: 2.8125rem;
        line-height: 2.8125rem;
        position: absolute;
        right: 0;
        text-align: center;
        display: flex;
        align-items: center;
      }

      .icon-a {
        width: 2.8125rem;
        height: 2.8125rem;
        line-height: 2.8125rem;
        position: absolute;
        right: 2.8125rem;
        text-align: center;
        display: flex;
        align-items: center;
      }
    }

    .menu {
      padding: 0 0.625rem;
      position: absolute;
      right: 0.375rem;
      z-index: 10;
      background: rgba(51, 51, 51, 0.9);
      color: #f0f0f0;
      border-radius: 0.25rem;
      width: 7.5rem;
      opacity: 1;

      .spare {
        position: absolute;
        right: 0.5rem;
        top: -0.8375rem;

        i {
          opacity: 0.9;
        }
      }

      li {
        display: flex;
        font-size: 14px;
        height: 2.25rem;
        border-bottom: solid 0.0625rem #d6d6d6;

        i {
          line-height: 2.25rem;
          margin-right: 0.375rem;
        }

        span {
          line-height: 2.25rem;
        }
      }

      li:last-child {
        border: none;
      }
    }

    .supplier-box {
      margin-bottom: 0.625rem;
      background-color: #fff;

      .supplier-info {
        padding: 0.75rem;
        margin-top: 0.625rem;
        background-color: #fff;
        display: -webkit-flex;
        position: relative;

        .user-img {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 0.1875rem;
          overflow: hidden;

          img {
            width: 100%;
          }
        }

        .user-name {
          text-align: left;
          margin-left: 0.625rem;

          li:first-child {
            font-size: 15px;
            height: 1.25rem;
            line-height: 1.25rem;
            font-weight: bold;
          }

          li:last-child {
            height: 1.25rem;
            line-height: 1.25rem;
            color: #8c8c8c;
            font-size: 12px;

            span {
              color: #f15353;
            }
          }
        }

        .user-btn {
          display: flex;
          justify-content: center;
          top: 1.3125rem;
          position: absolute;
          right: 0.75rem;
          background-color: #f15353;
          height: 1.625rem;
          line-height: 1.625rem;
          width: 5rem;
          text-align: center;
          border-radius: 0.8125rem;
          color: #fff;

          i {
            font-size: 0.875rem;
          }

          span {
            margin-left: 0.375rem;
          }
        }
      }

      .coupon {
        padding: 0 0.875rem;
        display: -webkit-box;
        justify-content: space-between;

        .coupon-one {
          background-color: #f15353;
          width: 6.9375rem;
          height: 3.875rem;
          border-radius: 0.25rem;
          text-align: center;
          padding: 0.25rem;
          line-height: 1.6875rem;

          ul {
            width: 100%;
            height: 100%;
            border: solid 0.0625rem #fff;
            color: #fff;
            border-radius: 0.25rem;

            li:first-child {
              font-size: 18px;
              font-weight: bold;
            }

            li:last-child {
              font-size: 14px;
            }
          }
        }
      }
    }

    .home-page {
      padding-bottom: 3.125rem;

      .banner {
        padding: 0.625rem 0;

        .banner-a {
          width: 21.6875rem;
          height: 6.875rem;
          margin: 0 auto;
          background-color: #ccc;
          border-radius: 0.5rem;
          overflow: hidden;

          img {
            width: 100%;
          }
        }

        ul {
          padding: 0 0.75rem;
          margin-top: 0.3125rem;
          display: -webkit-box;
          justify-content: space-between;

          li {
            width: 10.8125rem;
            height: 5.375rem;
            background-color: #ccc;
            overflow: hidden;

            img {
              width: 100%;
            }
          }

          li:first-child {
            border-radius: 0 0 0 0.375rem;
            margin-right: 5px;
          }

          li:last-child {
            border-radius: 0 0 0.375rem 0;
          }
        }
      }

      .hot {
        background-color: #fff;

        .title {
          height: 2.25rem;
          line-height: 2.25rem;
          background-color: #fafafa;
          display: flex;
          justify-content: center;

          h1 {
            font-size: 16px;
            color: #333;
          }

          .icon {
            width: 2.25rem;
            height: 2.25rem;
            overflow: hidden;

            img {
              width: 68%;
              display: inline-block;
              vertical-align: middle;
            }
          }
        }

        .goods {
          display: -webkit-box;

          .img {
            margin: 0.375rem;
            height: 7.25rem;
            width: 7.25rem;
            background-color: #ccc;
            overflow: hidden;

            img {
              width: 100%;
            }
          }

          .info {
            width: 15.4375rem;
            margin-top: 0.625rem;
            padding: 0 1rem;
            text-align: left;
            border-bottom: solid 0.0625rem #ebebeb;

            li:first-child {
              font-size: 14px;
              line-height: 1.25rem;
              height: 2.5rem;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
            }

            li:last-child {
              font-weight: bold;
              font-size: 16px;

              .left {
                color: #f15353;
                margin-right: 0.625rem;
              }

              .right {
                color: #8c8c8c;
                text-decoration: line-through;
                font-weight: normal;
                font-size: 14px;
              }
            }
          }
        }

        ul:last-child {
          border-bottom: none;
        }
      }

      .rec {
        margin-top: 0.625rem;

        .title {
          height: 2.25rem;
          line-height: 2.25rem;
          background-color: #fafafa;
          display: flex;
          justify-content: center;

          h1 {
            font-size: 16px;
            color: #666;
          }

          .icon {
            width: 2.25rem;
            height: 2.25rem;
            overflow: hidden;

            img {
              width: 68%;
              display: inline-block;
              vertical-align: middle;
            }
          }
        }

        .goods-list {
          display: -webkit-flex;
          -webkit-flex-wrap: wrap;

          .goods {
            background-color: #fff;
            width: 11.5625rem;
            margin-bottom: 0.3125rem;
            padding-top: 0.5rem;

            .img {
              width: 10.5rem;
              height: 10.5rem;
              margin: 0 auto;
              background-color: #ccc;
              overflow: hidden;

              img {
                width: 100%;
              }
            }

            .info {
              text-align: left;
              padding: 0.375rem;
              padding-left: 0.6rem;
              font-size: 14px;

              li:first-child {
                line-height: 1.25rem;
                height: 2.5rem;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
              }

              li:last-child {
                margin-top: 0.25rem;
                font-weight: bold;
                line-height: 1.5rem;
                font-size: 16px;

                .left {
                  color: #f15353;
                  margin-right: 0.625rem;
                }

                .right {
                  color: #8c8c8c;
                  text-decoration: line-through;
                  font-weight: normal;
                  font-size: 14px;
                }
              }
            }
          }

          .goods:nth-child(2n + 1) {
            margin-right: 0.3125rem;
          }
        }
      }
    }
    // 商品
    .goods-box {
      padding-bottom: 3.125rem;

      .nav {
        height: 2.5rem;
        background-color: #fff;
        border-bottom: solid 0.0625rem #ebebeb;
        line-height: 2.5rem;
        font-size: 14px;
        color: #333;
        display: flex;

        .nav-a {
          width: 25%;
          display: flex;
          justify-content: center;

          i {
            margin-left: 0.25rem;
          }

          .icon {
            .icon-up {
              position: relative;
              top: -0.25rem;
            }

            position: relative;

            .icon-down {
              position: absolute;
              top: 0.25rem;
              left: 0;
            }
          }
        }
      }

      .goods-list {
        display: -webkit-flex;
        -webkit-flex-wrap: wrap;

        .goods {
          background-color: #fff;
          width: 11.5625rem;
          margin-bottom: 0.3125rem;
          padding-top: 0.5rem;

          .img {
            width: 10.5rem;
            height: 10.5rem;
            margin: 0 auto;
            background-color: #ccc;
            overflow: hidden;

            img {
              width: 100%;
            }
          }

          .info {
            text-align: left;
            padding: 0.375rem;
            padding-left: 0.6rem;
            font-size: 14px;

            li:first-child {
              line-height: 1.25rem;
              height: 2.5rem;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
            }

            li:last-child {
              margin-top: 0.25rem;
              font-weight: bold;
              line-height: 1.5rem;
              font-size: 16px;

              .left {
                color: #f15353;
                margin-right: 0.625rem;
              }

              .right {
                font-size: 16px;
                color: #8c8c8c;
                text-decoration: line-through;
              }
            }
          }
        }

        .goods:nth-child(2n + 1) {
          margin-right: 0.3125rem;
        }
      }
    }
    //上新
    .day-goods {
      padding-bottom: 3.125rem;

      .day {
        height: 2.25rem;
        line-height: 2.25rem;
        background-color: #fafafa;
        display: -webkit-box;
        padding: 0 0.875rem;
        text-align: left;

        h1 {
          font-size: 16px;
          color: #666;
        }
      }

      .goods-list {
        display: -webkit-flex;
        -webkit-flex-wrap: wrap;

        .goods {
          background-color: #fff;
          width: 11.5625rem;
          margin-bottom: 0.3125rem;
          padding-top: 0.5rem;

          .img {
            width: 10.5rem;
            height: 10.5rem;
            margin: 0 auto;
            background-color: #ccc;
            overflow: hidden;

            img {
              width: 100%;
            }
          }

          .info {
            text-align: left;
            padding: 0.375rem;
            padding-left: 0.6rem;
            font-size: 14px;

            li:first-child {
              line-height: 1.25rem;
              height: 2.5rem;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
            }

            li:last-child {
              margin-top: 0.25rem;
              font-weight: bold;
              line-height: 1.5rem;
              font-size: 16px;

              .left {
                color: #f15353;
                margin-right: 0.625rem;
              }

              .right {
                font-size: 16px;
                color: #8c8c8c;
                text-decoration: line-through;
              }
            }
          }
        }

        .goods:nth-child(2n + 1) {
          margin-right: 0.3125rem;
        }
      }
    }
    // 活动
    .active {
      padding-bottom: 3.125rem;

      .goods-list {
        display: -webkit-flex;
        -webkit-flex-wrap: wrap;

        .goods {
          background-color: #fff;
          width: 11.5625rem;
          margin-bottom: 0.3125rem;
          padding-top: 0.5rem;

          .img {
            width: 10.5rem;
            height: 10.5rem;
            margin: 0 auto;
            background-color: #ccc;
            overflow: hidden;

            img {
              width: 100%;
            }
          }

          .info {
            text-align: left;
            padding: 0.375rem;
            padding-left: 0.6rem;
            font-size: 14px;

            li:first-child {
              line-height: 1.25rem;
              height: 2.5rem;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
            }

            li:last-child {
              display: -webkit-flex;
              justify-content: space-between;
              margin-top: 0.25rem;
              font-weight: bold;
              line-height: 1.5rem;
              font-size: 16px;

              .left {
                color: #f15353;
                margin-right: 0.625rem;
              }

              .right {
                font-weight: normal;
                display: inline-block;
                background-color: #f15353;
                border-radius: 0.1875rem;
                padding: 0.0625rem 0.625rem;
                font-size: 12px;
                color: #fff;
              }
            }
          }
        }

        .goods:nth-child(2n + 1) {
          margin-right: 0.3125rem;
        }
      }
    }

    .pop-content {
      width: 100%;
      padding: 3.1875rem 0;
      text-align: center;
      border-radius: 1.1875rem;
      background: #fff;

      .pop-top {
        display: flex;
        align-items: unset;
        justify-content: center;

        .left {
          width: 50%;
          display: flex;
          justify-content: center;

          .wrap {
            display: flex;
            flex-direction: column;
            align-items: center;

            .image {
              width: 2.625rem;
              height: 2.625rem;
              margin-bottom: 0.5rem;

              img {
                width: 100%;
                height: 100%;
              }
            }
          }
        }

        .line {
          width: 1px;
          height: 1.625rem;
          background-color: #999;
        }

        .right {
          width: 50%;
          display: flex;
          justify-content: center;

          .wrap {
            display: flex;
            flex-direction: column;
            align-items: center;

            .image {
              width: 2.625rem;
              height: 2.625rem;
              margin-bottom: 0.5rem;

              img {
                width: 100%;
                height: 100%;
              }
            }
          }
        }
      }

      .pop-bottom {
        margin-top: 1rem;
        width: 100%;
        display: flex;
        justify-content: center;

        .image {
          width: 50%;

          img {
            width: 100%;
            height: 100%;
          }
        }
      }

      .icon-close11 {
        position: absolute;
        right: 1rem;
        top: 1rem;
        font-size: 18px;
      }
    }
  }
</style>
