<template>
  <div class="cart"
       id="cart"
       :class="[this.fun.getPhoneEnv() == 3?'pcStyleCart':'', fun.isIphoneX() ? 'iphoneXStyle' : ''] ">
    <c-title :hide="false"  :text="$i18n.t('cart.购物车')">
      <template slot="edit"
                v-if="tabActive==='rent'&&isShowListRent">
        <div class="to-edit"
             @click="onRentCartDelete">
          {{ !rentDelete ? $i18n.t('cart.编辑') : $i18n.t('cart.完成') }}
        </div>
      </template>
      <template slot="edit"
                v-if="tabActive==='pay'&& isShowList">
        <div class="to-edit"
             @click="onCartDelete">
          {{ !cartDelete ? $i18n.t('cart.编辑') : $i18n.t('cart.完成') }}
        </div>
      </template>
    </c-title>
    <div style="height: 40px;"></div>
    <van-tabs v-model="tabActive" sticky v-if="isRentTab">
      <van-tab name="rent" :title="$i18n.t('cart.租赁')"></van-tab>
      <van-tab name="pay" :title="$i18n.t('cart.购买')"></van-tab>
    </van-tabs>
    <div>
      <div v-show="tabActive=='rent'" v-if="isRentTab">
        <div class="rent-box">
          <!--<div class="edit" @click="onRentCartDelete" v-if="isShowListRent">-->
          <!--<i class="fa fa-pencil-square-o"></i>-->
          <!--<span>{{ !rentDelete ? "编辑" : "完成" }}</span>-->
          <!--</div>-->
          <div v-if="isShowListRent"
               class="rent_main">
            <van-checkbox-group v-model="rentCheckList"
                                @change="rentAllSelectHandle">
              <div class="rent-one"
                   v-for="(item,i) in rentGoods" :key='i'
                   @click.stop="selectBolfun(0)">
                <template v-if="item.goods.stock_status == 0 || rentDelete">
                  <van-checkbox checked-color="#f15353"
                                :key="item"
                                :name="item"
                                @change="selectGood">&nbsp;</van-checkbox>
                </template>
                <template v-else-if="item.goods.stock_status == 2">
                  <span class="gray">{{$i18n.t('下架')}}</span>
                </template>
                <template v-else>
                  <span class="gray">{{$i18n.t('失效')}}</span>
                </template>

                <div class="info-box">
                  <div class="img"
                       @click="toRentDetail(item)">
                    <img :src="item.goods.thumb" />
                  </div>
                  <div class="info">
                    <h1 @click="toRentDetail(item)"
                        style="-webkit-box-orient: vertical;">
                      {{ item.goods.title }}
                    </h1>
                    <template v-if="item.goods.stock_status == 0">
                      <ul class="day"
                          v-if="item.has_one_lease_goods">
                        <li>
                          <span v-show="parseInt(item.goods.market_price)">{{$i18n.t('cart.吊牌价')}}：{{$i18n.t('money')}}{{ item.goods.market_price }}{{$i18n.t('元')}}</span>
                        </li>
                        <li v-if="
                            item.has_one_lease_goods.is_rights == 1
                          ">
                          <i class="iconfont icon-rent"></i>
                        </li>
                      </ul>
                      <div class="bottom_sum">
                        <ul class="member">
                          <li>
                            <small>{{$i18n.t('money')}}</small>
                            <b>{{ item.goods.price }}</b>&nbsp;<small>/{{$i18n.t('天')}}</small>
                          </li>
                        </ul>
                        <div class="num">
                          <div class="leftnav"
                               @click="rentDeleteNumber(item)">
                            -
                          </div>
                          <input type="text"
                                 disabled="false"
                                 class="shownum"
                                 v-model="item.total" />
                          <div class="rightnav"
                               @click="rentAddNumber(item)">
                            +
                          </div>
                        </div>
                      </div>
                    </template>
                    <template v-else>
                      <div style="text-align: left; color: #999;">该商品已不能租赁</div>
                    </template>
                  </div>
                </div>
              </div>
            </van-checkbox-group>
            <div class="recommend-box"
                 v-if="!this.fun.isTextEmpty(hotRentList)">
              <h1>{{$i18n.t('cart.近期热租')}}</h1>
              <div class="line"></div>
              <h2>{{$i18n.t('cart.看看其他宝宝都再想什么')}}</h2>
            </div>
            <div class="box"
                 v-if="!this.fun.isTextEmpty(hotRentList)">
              <div class="left"
                   v-for="(item,i) in hotRentList" :key='i'
                   @click="gotoHotRentDetail(item.id)">
                <div class="goods-box">
                  <div class="img"><img :src="item.thumb"
                         lazy="loaded" /></div>
                  <div class="text">
                    <span><small>{{$i18n.t('money')}}</small>
                      {{ item.price }}
                      <small>/{{$i18n.t('cart.天起')}}</small>
                    </span>
                    <ul class="sum">
                      <li>
                        <span v-show="parseInt(item.market_price)">{{$i18n.t('cart.吊牌价')}}：{{$i18n.t('money')}}{{ item.market_price }}{{$i18n.t('元')}}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div class="cart_pay" :style="{bottom: $store.state.temp.item && $store.state.temp.item.is_decorate === 1 ? '50px' : ''}"
                 v-show="!rentDelete">
              <div class="all">
                <div class="checkall"
                     @click.stop="selectBolfun(1)">
                  <van-checkbox :name="$i18n.t('全选')"
                                checked-color="#f15353"
                                @change="rentAllSelect"
                                v-model="rentCheckAll">{{$i18n.t('全选')}}</van-checkbox>
                </div>
              </div>

              <ul class="text">
                <li class="freight">
                  <span style="color: #999; font-size: 12px;">({{$i18n.t('cart.不含运费')}})</span>
                </li>
                <li>
                  {{$i18n.t('cart.合计')}}：<span style="font-size: 14px; color: #f15353;">{{$i18n.t('money')}}</span><span class="totalprice">{{ rentTotal }}</span>
                </li>
              </ul>
              <div class="paysub "
                   @click="checkGoods('rent')">
                {{$i18n.t('cart.结算')}}<small class="total" style="font-size: 12px;">({{ rentCount }})
                </small>
              </div>
            </div>
          </div>
        </div>
        <!--合计  -->
        <div class="cart_del"
             v-show="rentDelete">
          <div class="checkall"
               @click.stop="selectBolfun(1)">
            <van-checkbox :name="$i18n.t('全选')"
                          checked-color="#f15353"
                          @change="rentAllSelect"
                          v-model="rentCheckAll">{{$i18n.t('全选')}}</van-checkbox>
          </div>
          <span @click="rentDeleteGoods">{{$i18n.t('cart.删除')}}</span>
        </div>
        <div id="nocard"
             v-if="!isShowListRent">
          <div class="card_no">
            <img src="../../assets/images/cart.png"
                 style="width: 6.25rem; height: 6.25rem;"
                 alt="购物车">
            <!--<i class="fa fa-shopping-cart" style="font-size:6.25rem;"></i>-->
            <br />
            <span style="line-height: 1.125rem; font-size: 16px;">
              {{$i18n.t('cart.购物车快饿瘪了')}}
            </span>
            <br />{{$i18n.t('cart.主人快去给我找点东西吧')}}
          </div>
          <div class="card_no_menu">
            <router-link :to="fun.getUrl('member', {})">
              <div class="card_no_nav">{{$i18n.t('cart.个人中心')}}</div>
            </router-link>
            <router-link :to="fun.getUrl('home', {})">
              <div class="card_no_nav togo">{{$i18n.t('cart.去逛逛')}}</div>
            </router-link>
          </div>
        </div>
      </div>
      <div v-show="tabActive=='pay'">
        <div class="cart_main"
             v-if="isShowList" :class="[!isRentTab?'noTop':'']">
          <van-checkbox-group v-model="checkList"
                              @change="allSelectHandle">
            <div class="cart_good"
                 v-for="(good, index) in goods"
                 v-if="good.goods"
                 @click.stop="selectBolfun(0)" :key='index'>
              <div class="ico"
                   v-show="edit">
                <i class="fa fa-trash-o"></i>
              </div>
              <template v-if="good.goods.stock_status == 0 || cartDelete">
                <van-checkbox checked-color="#f15353"
                              :key="good"
                              :name="good"
                              @change="selectGood">&nbsp;</van-checkbox>
              </template>
              <template v-else-if="good.goods.stock_status == 2">
                <span class="gray">{{$i18n.t('下架')}}</span>
              </template>
              <template v-else>
                <span class="gray">{{$i18n.t('失效')}}</span>
              </template>

              <div class="right">
                <div class="img"
                     @click="toGoodsInfo(good)">
                  <img :src="good.goods.thumb" />
                </div>
                <div class="info">
                  <ul class="inner">
                    <h1 class="name"
                        @click="toGoodsInfo(good)"
                        style="-webkit-box-orient: vertical;">
                      {{ good.goods.title|escapeTitle }}
                    </h1>
                    <li class="introduction">{{ good.option_str }}</li>
                  </ul>
                  <template v-if="good.goods.stock_status == 0">
                    <div class="other">
                      <template v-if="good.goods.point_goods">
                        <div class="price"><span>{{ good.goods.point_goods.point }}</span>{{integral}}</div>
                      </template>
                      <template v-else>
                        <div class="price">{{$i18n.t('money')}}<span>{{ good.goods.price }}</span></div>
                      </template>
                      <div class="num">
                        <div class="leftnav"
                             @click.stop="numberLeft(index)">
                          -
                        </div>
                        <input type="number"
                               class="shownum"
                               v-model.lazy="good.total"
                               @blur="changeCount(good.id, good.total, index)" />
                        <div class="rightnav"
                             @click.stop="numberRight(index)">
                          +
                        </div>
                      </div>
                    </div>
                  </template>
                  <template v-else>
                    <div style="text-align: left; color: #999;">该商品已不能购买</div>
                  </template>
                </div>
              </div>
            </div>
          </van-checkbox-group>
          <div class="cart_pay" :style="{bottom: $store.state.temp.item && $store.state.temp.item.is_decorate === 1 ? '50px' : ''}"
               v-show="!cartDelete">
            <div class="all"
                 sel="1">
              <div class="checkall"
                   @click.stop="selectBolfun(1)">
                <van-checkbox checked-color="#f15353"
                              v-model="checkAll"
                              :checked="checkAll"
                              :name="$i18n.t('全选')"
                              @change="allSelect">{{$i18n.t('全选')}}</van-checkbox>
                <span class="t"></span>
              </div>
            </div>
            <ul class="text">
              <li class="freight">
                <span style="color: #999; font-size: 12px;">({{$i18n.t('cart.不含运费')}})</span>
              </li>
              <li>
                {{$i18n.t('cart.合计')}}：<span style="font-size: 14px; color: #f15353;">{{$i18n.t('money')}}</span><span class="totalprice">{{ total }}</span>
              </li>
            </ul>
            <div class="paysub "
                 @click="checkGoods">
              {{$i18n.t('cart.结算')}}<small class="total" style="font-size: 12px;">({{ count }})</small>
            </div>
          </div>
        </div>
        <div class="cart_del"
             v-show="cartDelete">
          <div class="checkall"
               @click.stop="selectBolfun(1)">
            <van-checkbox checked-color="#f15353"
                          v-model="checkAll"
                          :checked="checkAll"
                          :name="$i18n.t('全选')"
                          @change="allSelect">{{$i18n.t('全选')}}
            </van-checkbox>
          </div>
          <span @click="deleteGoods">{{$i18n.t('cart.删除')}}</span>
        </div>
        <div id="nocard"
             v-if="!isShowList">
          <div class="card_no">
            <img src="../../assets/images/cart.png"
                 style="width: 6.25rem; height: 6.25rem;"
                 alt="购物车">
            <!--<i class="fa fa-shopping-cart" style="font-size:6.25rem;"></i>-->
            <br /><span style="line-height: 1.125rem; font-size: 16px;">{{$i18n.t('cart.购物车快饿瘪了')}}</span>
            <br />{{$i18n.t('cart.主人快去给我找点东西吧')}}
          </div>
          <div class="card_no_menu">
            <router-link :to="fun.getUrl('member', {})">
              <div class="card_no_nav">{{$i18n.t('cart.个人中心')}}</div>
            </router-link>
            <router-link :to="fun.getUrl('home', {})">
              <div class="card_no_nav togo">{{$i18n.t('cart.去逛逛')}}</div>
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <div style="height: 6.13rem;"></div>

    <van-popup v-model="showChoose" round style="width: 20rem;">
      <div class="wrapper">
        <div class="block" @click.stop>
          <div class="choose-title">
            您的购物车配送方式有冲突，请选择其中一种配送方式~
          </div>

          <div class="choose-content">
            <van-radio-group v-model="radioChoose">
              <div v-for="(item, index) in dispatch_types" :key="index"  style="padding: 0.5rem 0;">
                <van-radio :name="index.toString()" checked-color="#ff4949" >
                    <div class="radio-title">{{item.name}}({{item.member_carts.length}}件)</div>
                </van-radio>
                <ul class="radio-list">
                  <li class="radio-item" v-for="(goods, i) in item.member_carts" :key="i">
                    <p>{{goods.title}}</p>
                    <p v-if="goods.option_title" style="font-size: 12px; color: #666;">规格：{{goods.option_title}}</p>
                  </li>
                </ul>
              </div>

            </van-radio-group>
          </div>

          <div class="buttons">
            <div class="button-item">
              <div class="button-content" @click="showChoose = false">返回购物车</div>
            </div>
            <div class="button-item">
              <div class="button-content red" @click="toBuy">去结算</div>
            </div>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import cart from "./cart_controller";
export default cart;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/css/cart.scss";

.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.block {
  position: relative;
  width: 19rem;
  height: 22rem;
  border-radius: 15px;
  background-color: #fff;
  padding: 0.5rem;
  text-align: left;
}

.choose-title {
  color: #878787;
  padding: 0.5rem;
  border-bottom: solid 1px #f5f5f5;
}

.choose-content {
  height: 15rem;
  overflow-y: scroll;
}

.radio-title {
  font-size: 16px;
  font-weight: bold;
}

.radio-list {
  padding: 0.5rem;
}

.radio-item {
  padding: 0.5rem 0;
  border-bottom: solid 1px #f5f5f5;
}

.buttons {
  display: flex;
  position: absolute;
  bottom: 0.5rem;
  width: 100%;
}

.button-item {
  flex: 1;
  display: flex;
  align-items: center;
}

.button-content {
  margin: 0 auto;
  width: 6.5rem;
  height: 2rem;
  line-height: 2rem;
  text-align: center;
  border-radius: 0.5rem;
  border: solid 1px #b5b5b5;
}

.button-content.red {
  color: #fff;
  background-color: #f15353;
  border: none;
}
</style>
