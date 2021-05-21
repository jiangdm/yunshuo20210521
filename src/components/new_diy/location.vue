<template>
  <div class="U000005-template1"
       :class="className">
    <!-- style -->
    <div v-html="css"></div>

    <div class="location-box" v-if="datas.location_style == 1 || datas.location_style == 2">
      <div class="location-left" @click='tolocation'>
        <i class="iconfont icon-order_locate"></i>
        <span class="title">{{address || '全国'}}</span>
        <i class="iconfont icon-advertise-next"></i>
      </div>
      <div class="location-right" v-show="datas.show_search != 1" @click='tosearch'>
        <i class="iconfont icon-all_search_2"></i>
        <span>{{datas.search_title}}</span>
      </div>
      <div v-if="datas.location_style == 2 && datas.show_search != 1" @click='tosearch' class="location-search">搜索</div>
    </div>

    <div class="location-box2" v-if="datas.location_style == 3">
      <div class="location-whole">
        <div class="location-left" @click='tolocation'>
          <span class="title">{{address || '全国'}}</span>
          <i class="iconfont icon-advertise-next"></i>
        </div>
        <div class="location-right" v-show="datas.show_search != 1" @click='tosearch'>
          <i class="iconfont icon-all_search_2"></i>
          <span>{{datas.search_title}}</span>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { Toast } from 'vant';
// 自定义样式
const css = function () {
  const {
    preview_color,
    border_style,
    search_border_radius,
    bg_color,
    border_color,
    font_color,
    city_font_color,
  } = this.datas;

  return `
        .component-${this.id} .location-box, .component-${this.id} .location-box2{
            background-color: ${preview_color.color || '#f8f8f8'};
            background-image: url(${preview_color.isColor == 2? preview_color.image: ''});
            background-size: 100% 100%;
            background-position: center;
            background-repeat: no-repeat;
        }
        .component-${this.id} .location-box .location-right{
            border-radius: ${search_border_radius}px;
            border: solid  ${border_style}px ${border_color};
            background-color: ${bg_color || '#f8f8f8'};
            color: ${font_color};
        }

        .component-${this.id} .location-search {
            color: ${city_font_color};
        }

        .component-${this.id} .location-box .location-left {
            color: ${city_font_color};
        }

        .component-${this.id} .location-box2 .location-whole {
            border-radius: ${search_border_radius}px;
            border: solid  ${border_style}px ${border_color};
            background-color: ${bg_color || '#f8f8f8'};
        }

        .component-${this.id} .location-box2 .location-left {
            color: ${city_font_color};
            border-color: ${city_font_color};
        }

        .component-${this.id} .location-box2 .location-right {
            color: ${font_color};
        }
    `;
};

export default {
  props: ['id', 'datas', 'styles'],
  data() {
    return {
      address: '',
      city: '',
      point: {},
    };
  },
  computed: {
    css() {
      return '<style>' + css.call(this) + '</style>';
    },
    className() {
      const name = ['component-wrapper', `component-${this.id}`];
      return name;
    },
  },
  mounted() {
    this.ready();
  },
  activated() {
    this.ready();
  },
  methods: {
    ready: function () {
      var myLocation = this.$store.state.o2oLocation;

      this.$store.commit('setReferer', window.location.href);
      if (myLocation.point) {
        this.address = myLocation.title;
        this.city = myLocation.city;
        this.point = myLocation.point;
        console.log('temp myLocation:', myLocation);

      } else {
        console.log('location不存在');
        this.getLocation();
      }
    },

    getLocation() {
      var that = this;
      var mapObj = new AMap.Map('iCenter');
      mapObj.plugin('AMap.Geolocation', function () {
        var geolocation = new AMap.Geolocation({
          enableHighAccuracy: true, // 是否使用高精度定位，默认:true
          timeout: 10000,           // 超过10秒后停止定位，默认：无穷大
          maximumAge: 0,            // 定位结果缓存0毫秒，默认：0
          convert: true,            // 自动偏移坐标，偏移后的坐标为高德坐标，默认：true
          showButton: true,         // 显示定位按钮，默认：true
          buttonPosition: 'LB',     // 定位按钮停靠位置，默认：'LB'，左下角
          buttonOffset: new AMap.Pixel(10, 20), // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
          showMarker: true,         // 定位成功后在定位到的位置显示点标记，默认：true
          showCircle: true,         // 定位成功后用圆圈表示定位精度范围，默认：true
          panToLocation: true,      // 定位成功后将定位到的位置作为地图中心点，默认：true
          zoomToAccuracy: true       // 定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
        });
        mapObj.addControl(geolocation);
        geolocation.getCurrentPosition();
        AMap.event.addListener(geolocation, 'complete', onComplete); // 返回定位信息
        AMap.event.addListener(geolocation, 'error', onError);       // 返回定位出错信息
      });

      function onComplete(obj) {
        // var res = '经纬度：' + obj.position +
        //     '\n精度范围：' + obj.accuracy +
        //     '米\n定位结果的来源：' + obj.location_type +
        //     '\n状态信息：' + obj.info +
        //     '\n地址：' + obj.formattedAddress +
        //     '\n地址信息：' + JSON.stringify(obj.addressComponent, null, 4);
        //alert(JSON.stringify(obj.addressComponent, null, 4));
        var position = obj.position.toString().split(",");
        that.point = {
          lat: position[1],
          lng: position[0],
        };
        that.address = obj.formattedAddress;
        that.title = obj.formattedAddress;
        if(obj.addressComponent) {
          that.city = !that.fun.isTextEmpty(obj.addressComponent.city)
            ? obj.addressComponent.city
            : obj.addressComponent.province;
        }else {
          that.city = "";
        }

        var pos = {
          address: obj.formattedAddress,
          city: that.city,
          title: obj.formattedAddress,
          point: that.point,
        };
        console.log('test pos', pos);
        that.$store.commit('updateLocation', pos);
        that.$store.commit('setLocation', pos);
        window.localStorage.setItem("myLocation", JSON.stringify(pos));
      }

      function onError(obj) {
        console.log(obj);
      }
    },
    tolocation() {
      this.$router.push(this.fun.getUrl('o2oLocation'));
    },
    tosearch() {
      if (!this.city) {
        Toast('请先选择城市');
        return;
      }
      this.$router.push(this.fun.getUrl('o2oSearch', {city: this.city, point: JSON.stringify(this.point)}));
    },
  },

};
</script>

<style lang="scss" scoped>
  // 默认
  .component-wrapper {
    width: 100%;
    text-align: left;
  }

  .title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .location-box {
    display: flex;
    height: 45px;
    line-height: 45px;
    padding: 0 10px;

    .location-left {
      width: 40%;
      display: flex;
    }

    .location-right {
      width: 60%;
      height: 25px;
      line-height: 25px;
      align-self: center;
      padding: 0 8px;
    }

    .location-search {
      width: 10%;
      margin-left: 5px;
    }
  }

  .location-box2 {
    height: 45px;
    line-height: 45px;
    width: 100%;
    padding: 8px 10px;

    .location-whole {
      display: flex;
      padding: 5px;
      height: 30px;
      line-height: 20px;
    }

    .location-left {
      display: flex;
      width: 40%;
    }

    .location-right {
      border-left: 1px solid #d3d3d3;
      width: 60%;
      padding-left: 10px;
    }
  }
</style>
