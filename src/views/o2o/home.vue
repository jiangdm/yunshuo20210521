<template>
  <div id="all" :class="[this.fun.getPhoneEnv() == 3 ? 'pcStyle' : '']">
    <header :class="{ amout }" v-if="isfollow">
      <!--用户进入商城，判断是否关注公众号-->
      <div class="attention">
        <img :src="follow_mode.logo" />
        <!--用户分享时显示用户头像，不是分享进入页面显示商城logo-->

        <div class="text">
          <p>
            <span style="display: inline-block; overflow: hidden; color: #fff;">来自</span>
            <span style="display: inline-block; max-width: 11.5rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ follow_mode.text }}</span>
            <span style="display: inline-block; overflow: hidden; color: #fff;">的推荐</span>
          </p>

          <!--用户分享时显示用户名；不是分享进入页面时，显示商城名-->

          <p>关注公众号，享专属服务</p>
        </div>

        <button><a :href="follow_mode.url"> 立即关注</a></button>
        <!--跳转至后台设置页面-->
      </div>
    </header>
    <!-- new页面 -->
    <div class="search_box" :class="{ isfollow }">
      <ul class="search">
        <li class="left" @click="tolocation">
          <i class="iconfont icon-order_locate"></i>
          <span>{{ address || "全国" }}</span>
          <i class="iconfont icon-member-bottom"></i>
        </li>
        <li class="right" @click="tosearch">
          <i class="iconfont icon-sousuo"></i>
          <input type="text" title="搜索" readonly="readonly" placeholder="附近商家商品" />
        </li>
      </ul>
    </div>

    <div style="height: 2.75rem;"></div>
    <div class="c-swipe">
      <template v-if="carousels">
        <van-swipe :autoplay="4000" :show-indicators="false" :width="fun.getPhoneEnv() == 3 ? 375 : clientWidths">
          <van-swipe-item v-for="(slide, index) in carousels" :key="index" @click.native="bannerClick(slide)">
            <div style="margin: 0.5rem;">
              <img width="100%" style="height: 11.25rem;" :src="slide.thumb" />
            </div>
          </van-swipe-item>
        </van-swipe>
      </template>
    </div>

    <div class="ment" v-if="!fun.isTextEmpty(category)">
      <c-ment :datas="fun.chunk(category, 10)"></c-ment>
    </div>
    <div class="oads-img" v-if="!fun.isTextEmpty(bannerData.img)">
      <img v-if="bannerData" style="width: 100%; min-height: 5.5rem;" :src="bannerData.img" @click="bannerClick(bannerData)" />
    </div>
    <div class="oads" v-if="ads && ads.length">
      <div class="oads-right">
        <template v-for="(item, index) in ads">
          <img :key="index" :src="item.img" @click="bannerClick(item)" v-if="item.img" />
        </template>
      </div>
    </div>

    <!-- 门店拼团列表 start  -->
    <o2o-group-cart v-if="hot_arrondi.is_open_store == '1' || hot_arrondi.is_open_store == 1" :list="hot_arrondi.list"></o2o-group-cart>
    <!-- 门店拼团列表 end  -->
    <!-- 拓客卡插件start -->
    <div class="toker" v-show="customer.length > 0">
      <div class="tokerTop">
        <span style="font-size: 1.13rem; font-weight: 600;">拓客卡</span>
        <div class="topRight" @click="tokerSetMeal">查看更多 <i class="iconfont icon-member_right"></i></div>
      </div>
      <div class="tokerList">
        <div class="tokerlis" v-for="(item, ind) in customer" :key="ind" @click="toDetail(item.goodid)">
          <div class="listT">
            <img :src="item.img" alt="" />
          </div>
          <div class="listB">
            <div class="listBtitle">{{ item.name }}</div>
            <div class="listBPrice">￥{{ item.pricenow }}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 拓客卡end -->
    <div v-if="stores.length > 0 && !is_open">
      <c-storeList @changList="getMoreData" :stores="stores" text="附近的店铺" :isLoadMore="isLoadMore" :page="page" :totalPage="total_page"></c-storeList>
    </div>
    <template v-if="!shop && !is_open">
      <yz-blank :datas="stores" text="该定位暂无门店信息" :isBtn="false"></yz-blank>
    </template>
    <template v-if="shop && is_open">
      <showbusiness :shopPoint="point" :shopCity="city" :isStore="true" :datas="shop"></showbusiness>
    </template>
    <div style="height: 3.125rem;"></div>
  </div>
</template>

<script>
import home from "./home_controller";

export default home;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/css/o2oindex.scss";
</style>
