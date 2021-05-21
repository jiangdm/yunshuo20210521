// import { mapState } from 'vuex';
import cTitle from "components/title";
import { Toast } from "vant";
// import BScroll from 'better-scroll';

export default {
  data() {
    return {
      position_switch: "",
      show: true,
      status: false,
      sixCity: [],
      hotCity: [],
      citys: [],
      address: "",
      city: "",
      point: ""
    };
  },
  //computed: mapState(['mailInfo']),

  mounted() {
    window.addEventListener("scroll", this.slider);
  },
  created() {
    this.status = this.$route.query.tag == "activity";
    this.ready();
  },
  computed: {
    shortcutList() {
      return this.citys.map(group => {
        return group.title.substr(0, 1);
      });
    }
  },
  activated() {
    this.status = this.$route.query.tag == "activity";
    if (this.status) {
      this.$route.meta.foot = true;
      this.$emit("changeFoot", this.$route.meta.foot);
    }
    this.ready();
    this.getSixCityList();
    this.getCityList();
    this.fun.setWXTitle(this.$store.state.temp.item.janst);
  },
  methods: {
    ready() {
      let myLocation = this.$store.state.o2oLocation;

      if (myLocation.point) {
        this.address = myLocation.title;
        this.city = myLocation.city;
        this.point = myLocation.point;
        //this.$store.commit('updateLocation', myLocation);
        //this.$store.commit('setLocation', myLocation);
        //初始化数据

        // this.getStores();
      } else {
        console.log("location不存在");
        this.getLocation();
      }
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
        that.city = !that.fun.isTextEmpty(obj.addressComponent.city)
          ? obj.addressComponent.city
          : obj.addressComponent.province;

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
      }

      function onError(obj) {
        console.log(obj);
      }
    },
    getSixCityList() {
      let api;
      if (this.$route.query.tag == "hotel") {
        api = "plugin.hotel.frontend.hotel.hotel.get-hot-citys";
      } else if (this.$route.query.tag == "oil") {
        api = "plugin.easy-refuel.frontend.index.getHotCitys";
      } else if (this.$route.query.tag == "activity") {
        api = "plugin.activity-apply.api.index.getHotCitys";
      } else if (this.$route.query.tag == "community") {
        api = "plugin.store-community.frontend.community.getHotCitys";
      } else {
        api = "plugin.store-cashier.frontend.store.store.getHotCitys";
      }
      $http.get(api).then(
        response => {
          if (response.result === 1) {
            this.sixCity = response.data.citys;
            if (response.data.position_switch) {
              this.position_switch = response.data.position_switch;
            }
          } else {
            console.log(response.msg);
          }
        },
        response => {
          //alert('网络错误，请稍后再试！')
        }
      );
    },
    getCityList() {
      let api;
      if (this.$route.query.tag == "hotel") {
        api = "plugin.hotel.frontend.hotel.hotel.get-city-initials";
      } else if (this.$route.query.tag == "oil") {
        api = "plugin.easy-refuel.frontend.index.getCitys";
      } else if (this.$route.query.tag == "activity") {
        api = "plugin.activity-apply.api.index.getCityInitials";
      } else if (this.$route.query.tag == "community") {
        api = "plugin.store-community.frontend.community.getCityInitials";
      } else {
        api = "plugin.store-cashier.frontend.store.store.getCityInitials";
      }
      $http.get(api).then(
        response => {
          if (response.result === 1) {
            this.citys = response.data.initials;
          } else {
            console.log(response.msg);
          }
        },
        response => {
          //alert('网络错误，请稍后再试！')
        }
      );
    },
    Jump(event, index) {
      let text = event.currentTarget.innerHTML;
      Toast(text);
      let jump = document.querySelectorAll(".d_jump");

      if (typeof jump[index] === "undefined") {
        return;
      }

      // 获取需要滚动的距离
      let total = jump[index].offsetTop;
      // Chrome
      document.body.scrollTop = total;
      // Firefox
      document.documentElement.scrollTop = total;
      // Safari
      window.pageYOffset = total;
    },
    toHot() {
      let text = event.currentTarget.innerHTML;
      Toast(text);
      let jump = document.querySelectorAll(".hot-location");

      // 获取需要滚动的距离
      let total = jump.offsetTop;
      // Chrome
      document.body.scrollTop = total;
      // Firefox
      document.documentElement.scrollTop = total;
      // Safari
      window.pageYOffset = total;
    },
    setCity(areaname) {
      if (!areaname) {
        let point = {
          lat: "",
          lng: ""
        };
        let pos = {
          address: "",
          city: "",
          title: "",
          point: point
        };
        this.$store.commit("updateLocation", pos);
        this.$store.commit("setLocation", pos);
        console.log(this.$store.state.o2oLocation, this.$store.state.referer);
        if (this.$store.state.referer) {
          window.location.href = this.$store.state.referer;
        } else {
          this.$router.push(this.fun.getUrl("o2oHome", { fromHome: 1 }));
        }
      } else if (this.$route.query.tag) {
        this.city = areaname;
        this.$router.push(
          this.fun.getUrl("o2oCity", {}, { tag: this.$route.query.tag, city: areaname })
        );
      } else {
        this.city = areaname;
        this.$router.push(this.fun.getUrl("o2oCity", {}, { city: areaname }));
      }
    },
    toGeolocation() {
      if (this.$route.query.tag) {
        this.$router.push(this.fun.getUrl("o2oLocation_loc", {}, { tag: this.$route.query.tag }));
      } else {
        this.$router.push(this.fun.getUrl("o2oLocation_loc"));
      }
    },
    goback() {
      this.$router.go(-1);
    },

    tosearch() {
      if (this.$route.query.tag) {
        this.$router.push(
          this.fun.getUrl("o2oLocation_loc", { fromHome: 1 }, { tag: this.$route.query.tag })
        );
      }else {
        this.$router.push(this.fun.getUrl("o2oLocation_loc", { fromHome: 1 }));
      }
    },
    slider() {
      var top = document.documentElement.scrollTop || document.body.scrollTop;
      if (top < 50) {
        this.amout = false;
      } else {
        this.amout = true;
      }
    },

    //获取地址信息
    // getAddressInfo() {
    //   var that = this;
    //   if (
    //     this.$store.state.city.length == 0 ||
    //     this.$store.state.province.length == 0 ||
    //     this.$store.state.district.length == 0
    //   ) {
    //     //saveAddresssInfo
    //
    //     $http.get("member.member-address.address").then(
    //       function(response) {
    //         if (response.result == 1) {
    //           //console.log(JSON.stringify(response.data.city));
    //           that.$store.commit("saveAddresssInfo", {
    //             city: response.data.city,
    //             province: response.data.province,
    //             district: response.data.district
    //           });
    //         }
    //       },
    //       function(response) {
    //         // error callback
    //       }
    //     );
    //   }
    // },

  },

  components: {
    cTitle,
  },

};
