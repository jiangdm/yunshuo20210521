<template>
  <div class="U000002-template1">
    <img v-if="list.length == 0" :style="wrapper_style" :src="defaultUrl" alt="">
    <div v-if="list.length == 1" :style="wrapper_style">
      <img :style="img_style" :src="list[0].image" alt="" @click="toUrl(list[0])">
      <div style="position: absolute; width: 100%; height: 100%; top: 0; left: 0;"
           v-if="list[0].is_minApp == 2" @click.stop v-html="list[0].html">
      </div>
    </div>
    <swiper
      v-if="list.length > 1"
      :options="swiperOption"
      ref="mySwiper">
      <!-- slides -->
      <swiper-slide v-for="(item, idx) in list" :key="idx">
        <div class="list-image" v-if="item.image" :style="wrapper_style">
          <img :src="item.image" alt="" :style="img_style" @click="toUrl(item)">
          <div style="position: absolute; width: 100%; height: 100%; top: 0; left: 0;"
               v-if="item.is_minApp == 2" @click.stop v-html="item.html">
          </div>
        </div>
      </swiper-slide>
      <!--分页-->
      <div class="swiper-pagination" slot="pagination"></div>
    </swiper>
  </div>
</template>

<script>
// https://www.npmjs.com/package/vue-awesome-swiper
// import { Swiper, SwiperSlide } from 'vue-awesome-swiper';
import defaultUrl from "@/assets/images/new_diy/banner.png";

export default {
  props: ['id', 'datas', 'styles'],
  data () {
    return {
      clientWidth: '375',
      // 轮播图设置
      swiperOption: {
        autoplay: true,
        // loop: true,   loop模式第二轮循环的时候第一张会闪烁
        delay: 3000,
        observer:true,
        // autoHeight: true,
        pagination: {
          el: '.swiper-pagination',
        }
      },
      defaultUrl
    };
  },

  components: {
    // Swiper,
    // SwiperSlide
  },

  computed: {
    // 初始化
    swiper () {
      return this.$refs.mySwiper.swiper;
    },

    /** 样式 */
    wrapper_style() {
      const {
        padding_top,
        padding_bottom,
        padding_left,
        padding_right,
        bg_color
      } = this.datas;
      return `
                width: 100%;
                background-color: ${bg_color};
                padding-top: ${padding_top}px;
                padding-bottom: ${padding_bottom}px;
                padding-left: ${padding_left}px;
                padding-right: ${padding_right}px;
                position: relative;
            `;
    },

    img_style() {
      const {
        picture_border,
      } = this.datas;
      return `
				        width: 100%;
                border-radius: ${picture_border}px;
            `;
    },

    // 广告轮播列表
    list () {
      try {
        let list = [...this.datas.list] || [];
        list = list.filter(item => item.image != '');
        return list;
      } catch (err) {
        return [];
      }
    }
  },
  mounted () {
    this.$nextTick(()=>{
      this.initButtons();
    });
  },
  activated() {
    this.$nextTick(()=>{
      this.initButtons();
    });
  },
  methods: {
    toUrl(item) {
      if(item.is_minApp == 1 && item.h5_link) {
        window.location.href = item.h5_link;
      }
    },
    // 图片加载完回调
    getImg(url, callback) {
      let img = new Image();
      img.src = url;
      //如果图片被缓存，则直接返回缓存数据
      if (img.complete) {
        /* callback(img.width, img.height); */
        callback(Number(img.height) / Number(img.width));
      } else {
        //完全加载完毕的事件
        img.onload = function() {
          /* callback(img.width, img.height); */
          callback(Number(img.height) / Number(img.width));
        };

        img.onerror = function() {
          console.log('图片加载出错');
        };
      }
    },
    initButtons() {
      let that = this;
      if(this.fun.getPhoneEnv() == 3) {
        this.clientWidth = 375;
      }else {
        this.clientWidth = document.body.clientWidth;
      }

      for(let j=0; j<this.datas.list.length; j++) {
        if(this.datas.list[j].image) {
          this.getImg(this.datas.list[j].image, function(scale) {
            // 图片加载完后获取图片高度
            let script = document.createElement('script');
            script.type = 'text/wxtag-template';
            script.text = `<div style="width: ${that.clientWidth}px;height: ${that.clientWidth*scale}px;"></div>`;
            that.datas.list[j].html = `<wx-open-launch-weapp username="${that.datas.list[j].gh_id}" path="${that.datas.list[j].minApp_link}">${script.outerHTML}</wx-open-launch-weapp>`;

            that.datas.list.reverse().reverse(); //改变原始数组从而更新数组
          });
        }
      }

    }
  },
};
</script>

<style lang="scss">
  /* .U000002-template1 .swiper-pagination { */

  /* bottom: 0rem; */

  /* } */

  /* .U000002-template1 .swiper-pagination-bullet { */

  /* position: relative; */

  /* margin: 0 .16rem!important; */

  /* vertical-align: top; */

  /* border-radius: 0; */

  /* width: .853rem; */

  /* height: .13rem; */

  /* background-color: rgba(255, 255, 255, .8)!important; */

  /* } */

  /* .U000002-template1 .swiper-pagination-bullet:after { */

  /* content: ''; */

  /* position: absolute; */

  /* top: 0; */

  /* left: 0; */

  /* width: 0; */

  /* height: .053rem; */

  /* background-color: #fff; */

  /* } */

  /* .U000002-template1 .swiper-pagination-bullet-active { */

  /* background: #fff; */

  /* } */

</style>

<style lang="scss" scoped>
  .U000002-template1 {
    display: block;
    margin-left: auto;
    margin-right: auto;
    text-align: center;
    width: 100%;
    overflow: hidden;

    img {
      width: 100%;
      display: block;
    }
  }

</style>
