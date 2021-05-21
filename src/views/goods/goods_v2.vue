<template>
  <transition>
    <div>
      <!--目前商品类型-->
      <!--voiceGoods  语音商品-->
      <!--course 课程商品-->
      <!--goods  平台商品/供应链商品 plugin_id=44-->
      <!--yun_sign_goods  电子合同商品-->
      <!--appointment_goods  预约商品-->
      <!--store_goods  门店商品-->
      <!--supplierGoods  供应商商品-->
      <!--hotelGoods   酒店商品-->
      <!--group_buy  拼购商品-->
      <!--group_good  拼团商品-->
      <!--grab_group 抢团商品-->
      <div v-if="goods_type == 'voiceGoods'">
        <component :is="voiceGoods" :goods_type="goods_type"></component>
      </div>
      <div v-if="goods_type == 'course'">
        <component :is="courseGoods" :goods_type="goods_type" :goods_info="goods_info"></component>
      </div>
      <div v-if="goods_type == 'goods' || goods_type == 'supplierGoods' || goods_type == 'yun_sign_goods' || goods_type == 'appointment_goods'">
        <component :is="cGoods" :goods_info="goods_info" :goods_type="goods_type" v-on:showComment="showCom" :is_room="is_room" :wx_video_link="wx_video_link" :touchClose="isComment"></component>
      </div>
      <div v-if="goods_type == 'store_goods'">
        <component
          :is="storeGoods"
          :showDis="showDis"
          :show8="show8"
          :goods_info_store="goods_info"
          :goods_type="goods_type"
          :store_id="store_id"
          :wx_video_link="wx_video_link"
          :is_room="is_room"
          v-on:showComment="showCom"
          :touchClose="isComment"
          :toker="is_toker"
        ></component>
      </div>
      <!--供应商和平台商品合并-->
      <!--<div v-if="goods_type == 'supplierGoods'">-->
      <!--<component-->
      <!--:is="supplierGoods"-->
      <!--:goods_info="goods_info"-->
      <!--:goods_type="goods_type"-->
      <!--v-on:showComment="showCom"-->
      <!--:is_room="is_room"-->
      <!--:touchClose="isComment"-->
      <!--&gt;</component>-->
      <!--</div>-->

      <div v-if="goods_type == 'hotelGoods'">
        <keep-alive>
          <hotel-goods :goods_info_hotel="goods_info" :goods_type="goods_type" v-on:showComment="showCom" :is_room="is_room" :touchClose="isComment"></hotel-goods>
        </keep-alive>
      </div>

      <div class="goods_detail_rows"></div>
    </div>
  </transition>
</template>

<script>
import goods from "./goods_controller";
export default goods;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/css/goods.scss";
</style>
