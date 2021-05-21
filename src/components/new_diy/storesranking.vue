<template>
  <div :class="className">
    <!-- style -->
    <div v-html="css"></div>

    <!--门店静态-->
    <div>
      <div id="store" v-if="datas.get_number">
        <div class="tab_box" v-if="datas.tab_list && datas.tab_list.length > 0">
          <ul class="tab_list">
            <van-tabs
              v-model="active"
              sticky
              @change="onClick"
              :background="datas.tab_bg_color"
              :title-active-color="datas.tab_active_color"
              :color="datas.tab_active_color"
              :title-inactive-color="datas.tab_color"
              id="tab"
            >
              <van-tab title="人气商家" name="popularity_short" v-if="datas.tab_list.indexOf('1') > -1">
                <div class="store-box">
                  <div class="store-list" @click="toRouter(items)" v-for="(items, i) in shopList0" :key="i">
                    <div class="item-top">
                      <div class="left">
                        <div class="image">
                          <img v-lazy="items.thumb" alt=""/>
                        </div>
                        <div class="category" v-if="items.has_one_category"
                             @click.stop="toClassify(items.has_one_category.id)">
                          {{ items.has_one_category.name }}
                        </div>
                        <div class="category" v-if="!items.has_one_category">
                          暂无分类
                        </div>
                      </div>
                      <div class="right">
                        <div class="title">{{ items.store_name }}</div>
                        <div class="sale">
                          <div class="grade">
                            <i class="iconfont icon-card_collect_b"></i>
                            <span>{{ items.average_score }}分</span>
                          </div>
                          <div class="num" v-if="datas.discount_list.indexOf('1') > -1">月销{{ items.order_total }}单</div>
                          <div class="num" v-if="datas.discount_list.indexOf('1') < 0"></div>
                          <div class="distance" @click.stop="goToAdress(items)" v-if="items.distance">{{ items.distance
                            }}{{ items.unit }} <i class="iconfont icon-all_daohang"></i></div>
                        </div>
                        <div class="discounts" v-if="items.address" style="color: #666;">
                          <span v-if="items.address.city">{{ items.address.city }}</span>
                          <span v-if="items.address.detailed_address">{{ items.address.detailed_address }}</span>
                        </div>
                        <div class="discounts">
                          <div class="discounts-list"
                               v-if="datas.discount_list.indexOf('4') > -1 && items.has_many_coupon && items.has_many_coupon.length > 0">
                            <div class="type">优惠</div>
                            <div class="con" v-for="(coupon, index) in items.has_many_coupon" :key="index"
                                 v-if="index <= 2">
                              {{ coupon.name }}
                            </div>
                          </div>
                          <div class="discounts-list"
                               v-if="(datas.discount_list.indexOf('3') > -1 && items.store_point.point_deduct_switch != 0) || items.store_love.deduction == 1">
                            <div class="type">{{ items.goods_show && items.goods_show.search_class_name ?
                              items.goods_show.search_class_name : "抵扣" }}
                            </div>
                            <div class="con" v-if="items.store_love.deduction == 1 ? true : false">
                              {{ items.store_love.deduction_proportion }}
                            </div>
                            <div
                              class="con"
                              :class="{ store_deduction_style: items.goods_show && items.goods_show.store_deduction_style }"
                              v-if="items.store_point.point_deduct_switch == 0 ? false : true"
                            >
                              {{ items.store_point.max_point_deduct }}
                            </div>
                            <div class="con store_cash_back_style"
                                 v-if="items.store_point.commission_deduct && items.goods_show.store_cash_back">
                              {{ items.store_point.commission_deduct }}
                            </div>
                          </div>
                          <div class="discounts-list"
                               v-if="(datas.discount_list.indexOf('2') > -1 && items.store_point.point_switch != 0) || items.store_love.award == 1">
                            <div class="type">赠送</div>
                            <div class="con" v-if="items.store_point.point_switch == 0 ? false : true">
                              {{ items.store_point.point }}
                            </div>
                            <div class="con" v-if="items.store_love.award == 1 ? true : false">
                              {{ items.store_love.award_proportion }}
                            </div>
                          </div>
                        </div>
                        <div class="label">
                          <div class="label-list" v-if="items.dispatchs">
                            <div class="label-title" v-for="dispatch in items.dispatchs" :key="dispatch">
                              {{ dispatch }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="goods"
                         v-if="datas.show_goods && items.recommend_goods && items.recommend_goods.length > 0">
                      <div class="goods-list">
                        <div class="goods-one" v-for="(good, i) in items.recommend_goods" :key="i"
                             @click.stop="toGood(good.goods_id)">
                          <div class="goods-image">
                            <img v-lazy="good.thumb" alt=""/>
                          </div>
                          <div class="goods-title">{{ good.title }}</div>
                          <div class="price" v-if="fun.isTextEmpty(good.goods_show)">{{ $i18n.t("money") }}{{ good.price
                            }}
                          </div>
                          <div class="show_price_box" v-if="!fun.isTextEmpty(good.goods_show)">
                            <div class="show_price" :class="[i % 2 == 0 ? 'red_white' : 'white_red']"
                                 v-for="(item, i) in good.goods_show" :key="i">{{ item.name }}：{{ item.value }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="loading-box" v-if="isLoadMore0" @click="getMoreList">
                    {{ $i18n.t("加载更多") }}
                  </div>
                </div>
              </van-tab>
              <van-tab title="新入驻商家" name="new_short" v-if="datas.tab_list.indexOf('2') > -1">
                <div class="store-box">
                  <div class="store-list" @click="toRouter(items)" v-for="(items, i) in shopList1" :key="i">
                    <div class="item-top">
                      <div class="left">
                        <div class="image">
                          <img v-lazy="items.thumb" alt=""/>
                        </div>
                        <div class="category" v-if="items.has_one_category"
                             @click.stop="toClassify(items.has_one_category.id)">
                          {{ items.has_one_category.name }}
                        </div>
                        <div class="category" v-if="!items.has_one_category">
                          暂无分类
                        </div>
                      </div>
                      <div class="right">
                        <div class="title">{{ items.store_name }}</div>
                        <div class="sale">
                          <div class="grade">
                            <i class="iconfont icon-card_collect_b"></i>
                            <span>{{ items.average_score }}分</span>
                          </div>
                          <div class="num" v-if="datas.discount_list.indexOf('1') > -1">月销{{ items.order_total }}单</div>
                          <div class="num" v-if="datas.discount_list.indexOf('1') < 0"></div>
                          <div class="distance" @click.stop="goToAdress(items)" v-if="items.distance">{{ items.distance
                            }}{{ items.unit }} <i class="iconfont icon-all_daohang"></i></div>
                        </div>
                        <div class="discounts" v-if="items.address" style="color: #666;">
                          <span v-if="items.address.city">{{ items.address.city }}</span>
                          <span v-if="items.address.detailed_address">{{ items.address.detailed_address }}</span>
                        </div>
                        <div class="discounts">
                          <div class="discounts-list"
                               v-if="datas.discount_list.indexOf('4') > -1 && items.has_many_coupon && items.has_many_coupon.length > 0">
                            <div class="type">优惠</div>
                            <div class="con" v-for="(coupon, index) in items.has_many_coupon" :key="index"
                                 v-if="index <= 2">
                              {{ coupon.name }}
                            </div>
                          </div>
                          <div class="discounts-list"
                               v-if="(datas.discount_list.indexOf('3') > -1 && items.store_point.point_deduct_switch != 0) || items.store_love.deduction == 1">
                            <div class="type">{{ items.goods_show && items.goods_show.search_class_name ?
                              items.goods_show.search_class_name : "抵扣" }}
                            </div>
                            <div class="con" v-if="items.store_love.deduction == 1 ? true : false">
                              {{ items.store_love.deduction_proportion }}
                            </div>
                            <div
                              class="con"
                              :class="{ store_deduction_style: items.goods_show && items.goods_show.store_deduction_style }"
                              v-if="items.store_point.point_deduct_switch == 0 ? false : true"
                            >
                              {{ items.store_point.max_point_deduct }}
                            </div>
                            <div class="con store_cash_back_style"
                                 v-if="items.store_point.commission_deduct && items.goods_show.store_cash_back">
                              {{ items.store_point.commission_deduct }}
                            </div>
                          </div>
                          <div class="discounts-list"
                               v-if="(datas.discount_list.indexOf('2') > -1 && items.store_point.point_switch != 0) || items.store_love.award == 1">
                            <div class="type">赠送</div>
                            <div class="con" v-if="items.store_point.point_switch == 0 ? false : true">
                              {{ items.store_point.point }}
                            </div>
                            <div class="con" v-if="items.store_love.award == 1 ? true : false">
                              {{ items.store_love.award_proportion }}
                            </div>
                          </div>
                        </div>
                        <div class="label">
                          <div class="label-list" v-if="items.dispatchs">
                            <div class="label-title" v-for="dispatch in items.dispatchs" :key="dispatch">
                              {{ dispatch }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="goods"
                         v-if="datas.show_goods && items.recommend_goods && items.recommend_goods.length > 0">
                      <div class="goods-list">
                        <div class="goods-one" v-for="(good, i) in items.recommend_goods" :key="i"
                             @click.stop="toGood(good.goods_id)">
                          <div class="goods-image">
                            <img v-lazy="good.thumb" alt=""/>
                          </div>
                          <div class="goods-title">{{ good.title }}</div>
                          <div class="price" v-if="fun.isTextEmpty(good.goods_show)">{{ $i18n.t("money") }}{{ good.price
                            }}
                          </div>
                          <div class="show_price_box" v-if="!fun.isTextEmpty(good.goods_show)">
                            <div class="show_price" :class="[i % 2 == 0 ? 'red_white' : 'white_red']"
                                 v-for="(item, i) in good.goods_show" :key="i">{{ item.name }}：{{ item.value }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="loading-box" v-if="isLoadMore1" @click="getMoreList">
                    {{ $i18n.t("加载更多") }}
                  </div>
                </div>
              </van-tab>
              <van-tab title="优惠商家" name="preferential_short" v-if="datas.tab_list.indexOf('3') > -1">
                <div class="store-box">
                  <div class="store-list" @click="toRouter(items)" v-for="(items, i) in shopList2" :key="i">
                    <div class="item-top">
                      <div class="left">
                        <div class="image">
                          <img v-lazy="items.thumb" alt=""/>
                        </div>
                        <div class="category" v-if="items.has_one_category"
                             @click.stop="toClassify(items.has_one_category.id)">
                          {{ items.has_one_category.name }}
                        </div>
                        <div class="category" v-if="!items.has_one_category">
                          暂无分类
                        </div>
                      </div>
                      <div class="right">
                        <div class="title">{{ items.store_name }}</div>
                        <div class="sale">
                          <div class="grade">
                            <i class="iconfont icon-card_collect_b"></i>
                            <span>{{ items.average_score }}分</span>
                          </div>
                          <div class="num" v-if="datas.discount_list.indexOf('1') > -1">月销{{ items.order_total }}单</div>
                          <div class="num" v-if="datas.discount_list.indexOf('1') < 0"></div>
                          <div class="distance" @click.stop="goToAdress(items)" v-if="items.distance">{{ items.distance
                            }}{{ items.unit }} <i class="iconfont icon-all_daohang"></i></div>
                        </div>
                        <div class="discounts" v-if="items.address" style="color: #666;">
                          <span v-if="items.address.city">{{ items.address.city }}</span>
                          <span v-if="items.address.detailed_address">{{ items.address.detailed_address }}</span>
                        </div>
                        <div class="discounts">
                          <div class="discounts-list"
                               v-if="datas.discount_list.indexOf('4') > -1 && items.has_many_coupon && items.has_many_coupon.length > 0">
                            <div class="type">优惠</div>
                            <div class="con" v-for="(coupon, index) in items.has_many_coupon" :key="index"
                                 v-if="index <= 2">
                              {{ coupon.name }}
                            </div>
                          </div>
                          <div class="discounts-list"
                               v-if="(datas.discount_list.indexOf('3') > -1 && items.store_point.point_deduct_switch != 0) || items.store_love.deduction == 1">
                            <div class="type">{{ items.goods_show && items.goods_show.search_class_name ?
                              items.goods_show.search_class_name : "抵扣" }}
                            </div>
                            <div class="con" v-if="items.store_love.deduction == 1 ? true : false">
                              {{ items.store_love.deduction_proportion }}
                            </div>
                            <div
                              class="con"
                              :class="{ store_deduction_style: items.goods_show && items.goods_show.store_deduction_style }"
                              v-if="items.store_point.point_deduct_switch == 0 ? false : true"
                            >
                              {{ items.store_point.max_point_deduct }}
                            </div>
                            <div class="con store_cash_back_style"
                                 v-if="items.store_point.commission_deduct && items.goods_show.store_cash_back">
                              {{ items.store_point.commission_deduct }}
                            </div>
                          </div>
                          <div class="discounts-list"
                               v-if="(datas.discount_list.indexOf('2') > -1 && items.store_point.point_switch != 0) || items.store_love.award == 1">
                            <div class="type">赠送</div>
                            <div class="con" v-if="items.store_point.point_switch == 0 ? false : true">
                              {{ items.store_point.point }}
                            </div>
                            <div class="con" v-if="items.store_love.award == 1 ? true : false">
                              {{ items.store_love.award_proportion }}
                            </div>
                          </div>
                        </div>
                        <div class="label">
                          <div class="label-list" v-if="items.dispatchs">
                            <div class="label-title" v-for="dispatch in items.dispatchs" :key="dispatch">
                              {{ dispatch }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="goods"
                         v-if="datas.show_goods && items.recommend_goods && items.recommend_goods.length > 0">
                      <div class="goods-list">
                        <div class="goods-one" v-for="(good, i) in items.recommend_goods" :key="i"
                             @click.stop="toGood(good.goods_id)">
                          <div class="goods-image">
                            <img v-lazy="good.thumb" alt=""/>
                          </div>
                          <div class="goods-title">{{ good.title }}</div>
                          <div class="price" v-if="fun.isTextEmpty(good.goods_show)">{{ $i18n.t("money") }}{{ good.price
                            }}
                          </div>
                          <div class="show_price_box" v-if="!fun.isTextEmpty(good.goods_show)">
                            <div class="show_price" :class="[i % 2 == 0 ? 'red_white' : 'white_red']"
                                 v-for="(item, i) in good.goods_show" :key="i">{{ item.name }}：{{ item.value }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="loading-box" v-if="isLoadMore2" @click="getMoreList">
                    {{ $i18n.t("加载更多") }}
                  </div>
                </div>
              </van-tab>
            </van-tabs>
          </ul>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import emptyImage from "../../assets/images/new_diy/banner.png";
// import { Toast } from 'vant';

const documentElement = document.documentElement;
const body = document.body;
// 自定义样式
const css = function() {
  if (this.datas.preview_color) {
    // 确保数据已传入
    const {
      preview_color,
      font_size,
      font_color,
      border_radius,
      class_font_size,
      class_font_color,
      class_bg_color,
      class_border_radius,
      location_font_size,
      location_font_color,
      discount_font_size,
      discount_title_color,
      discount_font_color,
      tag_font_size,
      tag_font_color,
      tag_bg_color,
      tag_border_color,
      tag_border_radius
    } = this.datas;

    return `
    .component-${this.id} #store {
        background-color: ${preview_color};
    }

    .component-${this.id} .store-list .right .title{
        font-size: ${font_size}px;
        color: ${font_color};
    }

    .component-${this.id} .store-list .left .image img{
        border-radius: ${border_radius}px;
    }

    .component-${this.id} .store-list .right .distance{
        font-size: ${location_font_size}px;
        color: ${location_font_color};
    }

    .component-${this.id} .store-list .category{
        background-color: ${class_bg_color};
        border-radius: ${class_border_radius}px;
        font-size: ${class_font_size}px;
        color: ${class_font_color};
    }

    .component-${this.id} .store-list .discounts .discounts-list{
        font-size: ${discount_font_size}px;
    }

    .component-${this.id} .store-list .discounts .discounts-list .con{
        color: ${discount_font_color};
    }

    .component-${this.id} .store-list .discounts-list .type{
        color: ${discount_title_color};
    }

    .component-${this.id} .store-list .label-list .label-title{
        background-color: ${tag_bg_color};
        border-radius: ${tag_border_radius}px;
        border: solid  1px ${tag_border_color};
        font-size: ${tag_font_size}px;
        color: ${tag_font_color};
    }

`;
  }
};

export default {
  data() {
    return {
      emptyImage,
      active: "popularity_short",

      tab: 0,
      titleName: [
        {
          id: "popularity_short",
          text: "人气商家",
          url: "plugin.store-cashier.frontend.store.store.get-store-list-rank"
        },
        {
          id: "new_short",
          text: "新入驻商家",
          url: "plugin.store-cashier.frontend.store.store.get-store-list-rank"
        },
        {
          id: "preferential_short",
          text: "优惠商家",
          url: "plugin.store-cashier.frontend.store.store.get-store-list-rank"
        }
      ],
      api: "",
      dataJson: {},

      // 定位
      point: {},
      city: "",

      //人气商家数组和分页数据
      shopList0: [],
      isLoadMore0: false,
      page0: 1,
      total_page0: 0,
      //新入驻商家数组和分页数据
      shopList1: [],
      isLoadMore1: false,
      page1: 1,
      total_page1: 0,
      //优惠商家数组和分页数据
      shopList2: [],
      isLoadMore2: false,
      page2: 1,
      total_page2: 0
    };
  },
  props: ["id", "datas", "lastIndex", "index", "isBottom"],
  computed: {
    css() {
      return "<style>" + css.call(this) + "</style>";
    },
    className() {
      const name = ["component-wrapper", `component-${this.id}`];
      return name;
    }
  },
  mounted() {
    let myLocation = this.$store.state.o2oLocation;
    if (myLocation.point) {
      this.address = myLocation.title;
      this.city = myLocation.city;
      this.point = myLocation.point;
      if (this.datas.tab_list.indexOf("1") > -1) {
        this.chooseTab(" ", "popularity_short");
      } else if (this.datas.tab_list.indexOf("2") > -1) {
        this.chooseTab(" ", "new_short");
      } else if (this.datas.tab_list.indexOf("3") > -1) {
        this.chooseTab(" ", "preferential_short");
      }
      //初始化数据
    } else {
      console.log("location不存在");
      this.getLocation();
    }
  },
  activated() {
    let myLocation = this.$store.state.o2oLocation;
    if (myLocation.point) {
      this.address = myLocation.title;
      this.city = myLocation.city;
      this.point = myLocation.point;
      if (this.datas.tab_list.indexOf("1") > -1) {
        this.chooseTab(" ", "popularity_short");
      } else if (this.datas.tab_list.indexOf("2") > -1) {
        this.chooseTab(" ", "new_short");
      } else if (this.datas.tab_list.indexOf("3") > -1) {
        this.chooseTab(" ", "preferential_short");
      }
      //初始化数据
    } else {
      console.log("location不存在");
      this.getLocation();
    }
  },
  watch: {
    isBottom: function(newVal, oldVal) {
      // this.lastIndex == this.index判断商品列表是最后一个组件
      if (newVal && this.lastIndex == this.index && this[`isLoadMore${this.tab}`]) {
        this.getMoreList();
      }
    }
  },
  methods: {
    onClick(index, title) {
      // console.log(index,title)
      this.chooseTab("", index);
    },
    toClassify(id) {
      this.$router.push(this.fun.getUrl("o2oCategory", { id: id }));
    },
    chooseTab(key, index) {
      // 找到对应的索引
      function pFn(p) {
        return p.id == index;
      }

      this.tab = this.titleName.findIndex(pFn);
      this.api = this.titleName[this.tab].url;
      let sorting = this.titleName[this.tab].id;
      if( sorting == 'preferential_short' ) {
        this.datas.discount_type == '1' ? sorting = 'preferential_short_percentage' : sorting = 'preferential_short';
      }
      this[`isLoadMore${this.tab}`] = false;
      this[`total_page${this.tab}`] = 0;
      this[`page${this.tab}`] = 1;
      let p = this.fun.bd_encrypt(this.point.lng, this.point.lat);
      this.dataJson = {
        lng: p.lng,
        lat: p.lat,
        city_name: this.city,
        // lng: 113.307605,
        // lat: 23.389929,
        // city_name: "广州市",
        page: this[`page${this.tab}`],
        sorting: sorting,
        is_aggregation: 1
      };
      if (!p.lng) {
        this.dataJson.lng = "";
        this.dataJson.lat = "";
      }
      this.getList();
    },
    getList() {
      $http
        .get(this.api, this.dataJson, " ")
        .then(
          response => {
            if (response.result === 1) {
              this[`shopList${this.tab}`] = response.data.data;
              this[`total_page${this.tab}`] = response.data.last_page;
              this[`total_page${this.tab}`] <= 1 ? (this[`isLoadMore${this.tab}`] = false) : (this[`isLoadMore${this.tab}`] = true);

              if (this[`shopList${this.tab}`].length > this.datas.get_number) {
                this[`shopList${this.tab}`].splice(this.datas.get_number, this[`shopList${this.tab}`].length - this.datas.get_number);
                this[`isLoadMore${this.tab}`] = false;
              }
            } else {
              console.log(response.msg);
            }
          },
          response => {
            console.log(response.msg);
          }
        )
        .catch(error => {
          console.log(error);
        });
    },
    //获取滚动条当前的位置
    getScrollTop() {
      var scrollTop = 0;
      if (documentElement && documentElement.scrollTop) {
        scrollTop = documentElement.scrollTop;
      } else if (body) {
        scrollTop = body.scrollTop;
      }
      return scrollTop;
    },
    //获取当前可视范围的高度
    getClientHeight() {
      var clientHeight = 0;
      if (body.clientHeight && documentElement.clientHeight) {
        clientHeight = Math.min(body.clientHeight, documentElement.clientHeight);
      } else {
        clientHeight = Math.max(body.clientHeight, documentElement.clientHeight);
      }
      return clientHeight;
    },
    //获取文档完整的高度
    getScrollHeight() {
      return Math.max(body.scrollHeight, documentElement.scrollHeight);
    },
    handleScroll() {
      //滚动事件触发
      if (Number(this.getScrollTop() + this.getClientHeight() + 5) >= this.getScrollHeight()) {
        //此处发起请求
        if (this[`isLoadMore${this.tab}`]) {
          this.getMoreList();
        } else {
          console.log("没有数据了");
        }
      }
    },
    getMoreList() {
      //获取更多数据
      this[`isLoadMore${this.tab}`] = false; // 防止多次请求分页数据
      if (this[`page${this.tab}`] >= this[`total_page${this.tab}`]) {
        return;
      } else {
        this[`page${this.tab}`] = this[`page${this.tab}`] + 1;
        let p = this.fun.bd_encrypt(this.point.lng, this.point.lat);
        let sorting = this.titleName[this.tab].id;
        if( sorting == 'preferential_short' ) {
          this.datas.discount_type == '1' ? sorting = 'preferential_short_percentage' : sorting = 'preferential_short';
        }
        this.dataJson = {
          lng: p.lng,
          lat: p.lat,
          city_name: this.city,
          // lng: 113.307605,
          // lat: 23.389929,
          // city_name: "广州市",
          page: this[`page${this.tab}`],
          sorting: sorting,
          is_aggregation: 1
        };
        if (!p.lng) {
          this.dataJson.lng = "";
          this.dataJson.lat = "";
        }
        $http
          .get(this.api, this.dataJson, " ")
          .then(
            response => {
              this[`isLoadMore${this.tab}`] = true;
              if (response.result === 1) {
                this[`shopList${this.tab}`] = this[`shopList${this.tab}`].concat(response.data.data);
                this[`total_page${this.tab}`] = response.data.last_page;
                this[`page${this.tab}`] >= this[`total_page${this.tab}`] ? (this[`isLoadMore${this.tab}`] = false) : (this[`isLoadMore${this.tab}`] = true);

                if (this[`shopList${this.tab}`].length > this.datas.get_number) {
                  this[`shopList${this.tab}`].splice(this.datas.get_number, this[`shopList${this.tab}`].length - this.datas.get_number);
                  this[`isLoadMore${this.tab}`] = false;
                }
              } else {
                this[`page${this.tab}`] = this[`page${this.tab}`] - 1;
                this[`isLoadMore${this.tab}`] = false;
              }
            },
            function(response) {
              console.log(response.msg);
            }
          )
          .catch(err => {
            console.log(err);
          });
      }
    },
    // 跳转到店铺
    toRouter(item) {
      if (item.specify_show == 1) {
        this.$router.push(this.fun.getUrl("o2oStore_v2", { store_id: item.id, fromHome: 1 }));
      } else {
        this.$router.push(this.fun.getUrl("HomeSeller", { store_id: item.id, fromHome: 1 }));
      }
    },
    toGood(item) {
      if (item.id) {
        this.$router.push(this.fun.getUrl("goods", { id: item.id }));
      } else {
        this.$router.push(this.fun.getUrl("goods", { id: item }));
      }
    },
    //跳转地址
    goToAdress(items) {
      let point = this.fun.bd_decrypt(items.longitude, items.latitude);
      this.fun.goToWXAdress(point, items.store_name, items.address.detailed_address);
    },

    getLocation() {
      var that = this;
      var mapObj = new AMap.Map("iCenter");
      mapObj.plugin("AMap.Geolocation", function() {
        var geolocation = new AMap.Geolocation({
          enableHighAccuracy: true, // 是否使用高精度定位，默认:true
          timeout: 10000, // 超过10秒后停止定位，默认：无穷大
          maximumAge: 0, // 定位结果缓存0毫秒，默认：0
          convert: true, // 自动偏移坐标，偏移后的坐标为高德坐标，默认：true
          showButton: true, // 显示定位按钮，默认：true
          buttonPosition: "LB", // 定位按钮停靠位置，默认：'LB'，左下角
          buttonOffset: new AMap.Pixel(10, 20), // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
          showMarker: true, // 定位成功后在定位到的位置显示点标记，默认：true
          showCircle: true, // 定位成功后用圆圈表示定位精度范围，默认：true
          panToLocation: true, // 定位成功后将定位到的位置作为地图中心点，默认：true
          zoomToAccuracy: true // 定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
        });
        mapObj.addControl(geolocation);
        geolocation.getCurrentPosition();
        AMap.event.addListener(geolocation, "complete", onComplete); // 返回定位信息
        AMap.event.addListener(geolocation, "error", onError); // 返回定位出错信息
      });

      function onComplete(obj) {
        var position = obj.position.toString().split(",");
        that.point = {
          lat: position[1],
          lng: position[0]
        };
        that.address = obj.formattedAddress;
        that.title = obj.formattedAddress;
        if (obj.addressComponent) {
          that.city = !that.fun.isTextEmpty(obj.addressComponent.city) ? obj.addressComponent.city : obj.addressComponent.province;
        } else {
          that.city = "";
        }

        var pos = {
          address: obj.formattedAddress,
          city: that.city,
          title: obj.formattedAddress,
          point: that.point
        };
        console.log("test pos", pos);
        that.$store.commit("updateLocation", pos);
        that.$store.commit("setLocation", pos);
        window.localStorage.setItem("myLocation", JSON.stringify(pos));
        if (that.datas.tab_list.indexOf("1") > -1) {
          that.chooseTab(" ", "popularity_short");
        } else if (that.datas.tab_list.indexOf("2") > -1) {
          that.chooseTab(" ", "new_short");
        } else if (that.datas.tab_list.indexOf("3") > -1) {
          that.chooseTab(" ", "preferential_short");
        }
      }

      function onError(obj) {
        that.chooseTab(" ", "popularity_short");
        console.log(obj);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
  // 默认
  * {
    list-style-type: none;
  }

  .component-wrapper {
    width: 100%;
    text-align: left;
  }

  #store {
    .store-list {
      display: flex;
      flex-direction: column;
      justify-content: center;
      width: 100%;
      overflow: hidden;
      padding: 10px;

      /* border-bottom: solid 1px #e6e6e6; */
      .item-top {
        display: flex;
        width: 100%;
      }

      .left {
        width: 93.75px;
        text-align: center;

        .image {
          width: 70px;
          height: 70px;

          /* border-radius: 50%; */
          margin: 0 10px;

          img {
            width: 100%;
            height: 100%;

            /* border-radius: 50%; */
          }
        }

        .category {
          margin-top: 10px;
          display: inline-block;

          /* background: #adadad; */

          /* color: #fff; */

          /* border-radius: 5px; */
          padding: 1px 5px;
        }
      }

      .right {
        width: 281.25px;

        .title {
          font-weight: 600;

          /* color: #000; */

          /* font-size: 14px; */
        }

        .sale {
          font-size: 12px;
          color: #666;
          display: flex;
          width: 100%;

          .grade {
            padding-right: 5px;

            i {
              color: #ffba00;
              font-size: 12px;
            }
          }

          .num {
            flex: 1;
          }

          .distance {
            text-align: right;
            width: 100px;
            padding-right: 10px;
            display: flex;
            align-items: center;
            justify-content: flex-end;

            i {
              color: #ff2c29;
              font-size: 20px;
            }
          }
        }

        .discounts {
          margin-bottom: 5px;

          .discounts-list {
            display: flex;
            align-items: center;

            /* font-size: 12px; */

            /* justify-content: start; */
            overflow: hidden;

            .type {
              /* font-size: 12px; */

              /* color: #ff2c29; */
              font-weight: 600;
              padding-right: 10px;
            }

            .con {
              padding-right: 10px;

              /* color: #000; */
            }
          }
        }

        .label {
          font-size: 12px;

          .label-list {
            flex-wrap: wrap;
            display: flex;
            align-items: center;

            .label-title {
              margin-right: 10px;
              margin-bottom: 5px;
              padding: 0 5px;

              /* background: #fff; */

              /* color: #666; */

              /* border: 1px solid #ff8400; */

              /* border-radius: 6px; */
            }
          }
        }
      }

      .goods {
        width: 100%;
        font-size: 12px;
        margin-top: 10px;
        box-sizing: border-box;

        .goods-list {
          display: flex;
          align-items: center;
          flex-wrap: nowrap;
          width: 100%;
          overflow-x: scroll;

          .goods-one {
            margin-right: 10px;
            width: 90px;

            .goods-image {
              width: 90px;
              height: 90px;
              border-radius: 5px;

              img {
                width: 100%;
                height: 100%;
                border-radius: 5px;
              }
            }

            .goods-title {
              margin-top: 5px;
              width: 100%;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }

            .price {
              color: #ff2c29;
              font-weight: 600;
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

          /* 门店拼团 */
        }
      }
    }

    .scroll {
      overflow-x: scroll;
    }

    .loading-box {
      width: 100%;
      height: 50px;
      line-height: 50px;
      text-align: center;
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
      margin-left: 0.25rem;
    }
  }
</style>
