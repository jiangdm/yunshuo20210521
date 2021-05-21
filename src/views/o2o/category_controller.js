import cStoreList from "components/storeList";
import { Toast } from 'vant';
import cTitle from 'components/title';
//import BMap from 'BMap';
import {scrollMixin} from '../../utils/mixin';
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      title: "搜索",
      inputs: "",
      amout: false,
      order_by: "",
      order_field: "",
      id: "",

      stores: [],

      //more
      isLoadMore: true,
      page: 1,
      total_page: 0,

      point: {}
    };
  },
  activated() {
    // console.log("point");
    // this.id = this.$route.params.id;
    this.initData();
    this.getStoresByCategoryId();
  },

  mounted() {
    // this.initData();
    // this.getStoresByCategoryId();
    //this.slider();
  },
  methods: {
    goback() {
      this.$router.go(-1);
    },
    getStoresByCategoryId() {

      var that = this;
      console.log(this.$store.state.o2oLocation);
      this.myLocation = this.$store.state.o2oLocation;
      if (!this.myLocation.point) {
        var mapObj = new AMap.Map('iCenter');
        mapObj.plugin('AMap.Geolocation', function () {
          var geolocation = new AMap.Geolocation({
            enableHighAccuracy: true, // 是否使用高精度定位，默认:true
            timeout: 10000, // 超过10秒后停止定位，默认：无穷大
            maximumAge: 0, // 定位结果缓存0毫秒，默认：0
            convert: true, // 自动偏移坐标，偏移后的坐标为高德坐标，默认：true
            showButton: true, // 显示定位按钮，默认：true
            buttonPosition: 'LB', // 定位按钮停靠位置，默认：'LB'，左下角
            buttonOffset: new AMap.Pixel(10, 20), // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
            showMarker: true, // 定位成功后在定位到的位置显示点标记，默认：true
            showCircle: true, // 定位成功后用圆圈表示定位精度范围，默认：true
            panToLocation: true, // 定位成功后将定位到的位置作为地图中心点，默认：true
            zoomToAccuracy: true // 定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
          });
          mapObj.addControl(geolocation);
          geolocation.getCurrentPosition();
          AMap.event.addListener(geolocation, 'complete', onComplete); // 返回定位信息
          AMap.event.addListener(geolocation, 'error', onError); // 返回定位出错信息
        });

        function onComplete(obj) {
          // var res = '经纬度：' + obj.position +
          //   '\n精度范围：' + obj.accuracy +
          //   '米\n定位结果的来源：' + obj.location_type +
          //   '\n状态信息：' + obj.info +
          //   '\n地址：' + obj.formattedAddress +
          //   '\n地址信息：' + JSON.stringify(obj.addressComponent, null, 4);
          var position = obj.position.toString().split(",");

          that.city = !that.fun.isTextEmpty(obj.addressComponent.city) ? obj.addressComponent.city : obj.addressComponent.province;
          that.point = {
            lat: position[1],
            lng: position[0],
            city: that.city,
          };
          that.address = obj.formattedAddress;
          that.title = obj.formattedAddress;
          that.city = !that.fun.isTextEmpty(obj.addressComponent.city) ? obj.addressComponent.city : obj.addressComponent.province;

          var pos = {
            address: obj.formattedAddress,
            city: that.city,
            title: obj.formattedAddress,
            point: that.point,
          };

          this.myLocation = pos;
          that.getStoresByCategoryIdLngAndLat(this.myLocation);

        }

        function onError(obj) {
          //alert(obj.info + '--' + obj.message);
          console.log(obj);
        }
      } else {
        that.getStoresByCategoryIdLngAndLat(this.myLocation);
      }
    },

    getStoresByCategoryIdLngAndLat(r) {
      var that = this;
      var p = this.fun.bd_encrypt(r.point.lng, r.point.lat);
      console.log(p);
      that.$store.commit('setLocation', r);
      let point ={
        point:{
          lat : p.lat,
          lng : p.lng
        },
        city:r.city
      };
      this.locaLng = point;
      if(!p.lng) {
        p.lng = '';
        p.lat = '';
      }
      let json = {
        category_id: this.id,
        // lng: 113.273289,
        // lat: 23.15729,
        // city_name: '广州市',
        lng: p.lng,
        lat: p.lat,
        city_name: r.city,
        page: 1
      };
      // var that = this;
      // let json = {
      //   category_id: this.id,
      //   lng: r.position.getLng(),
      //   lat: r.position.getLat(),
      //   city_name: r.addressComponent.city,
      //   page: this.page
      // };
      $http.get("plugin.store-cashier.frontend.store.store.get-store-list-by-category-id-to-page", json, "").then(response => {
        if (response.result == 1) {
          that.isLoadMore = true;
          that.total_page = response.data.last_page;
          if (!that.total_page) {
            that.total_page = 0;
          }
          that.stores = response.data.data;
        } else {
          that.stores = [];
          Toast(response.msg);
        }
      }).catch(error => {
        console.log(error);
      });
    },


    getMoreData(r) {
      if(!r){
        if(this.myLocation.lng){
          r = this.myLocation;
        }else{
          r = this.locaLng;
        }
      }
      let that = this;
      that.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        let json = {
          category_id: this.id,
          lng: r.point.lng,
          lat: r.point.lat,
          city_name: r.city,
          page: this.page
        };
        // let json = {
        //   category_id: this.id,
        //   lng: r.position.getLng(),
        //   lat: r.position.getLat(),
        //   city_name: r.addressComponent.city,
        //   page: this.page
        // };
        $http.get('plugin.store-cashier.frontend.store.store.get-store-list-by-category-id-to-page', json, '正在获取更多...').then(function (response) {
          if (response.result == 1) {
            that.isLoadMore = true;
            that.stores = that.stores.concat(response.data.data); //数组拼接
          } else {
            that.page = that.page - 1;
            that.isLoadMore = false;
            return;
          }
        }, function (response) {
          // error callback
        });

      }
    },
    changList() {
      this.getMoreData(this.myLocation);
    },

    initData() {
      this.id = this.$route.params.id;
      this.stores = [];
      this.page = 1;
      this.total_page = 0;
      this.isLoadMore = true;
      this.point = {};
    },

    // onComplete(data) {
    //   console.log(data.addressComponent.city);
    //   this.point = data;
    //
    //   this.getStoresByCategoryIdLngAndLat(data);
    // },
    //
    // onError(error) {
    //   Toast(error.message);
    // }
  },

  components: {
    cStoreList,
    cTitle
  }
};
