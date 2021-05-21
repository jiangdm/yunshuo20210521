import { Toast } from "vant";
// import U_memberasset from "components/new_diy/memberasset";
// import U_membermarket from "components/new_diy/membermarket";
// import U_membermerchant from "components/new_diy/membermerchant";
// import U_memberorder from "components/new_diy/memberorder";
// import U_memberrights from "components/new_diy/memberrights";
// import U_membertool from "components/new_diy/membertool";
// import U_membertop from "components/new_diy/membertop";
import top_navigation from "components/new_diy/top_navigation";

const documentElement = document.documentElement;
const body = document.body;
window.page_idAdvertisings = []; // 浏览周期内只显示一次
window.page_idFull_screens = [];

export default {
  data() {
    return {
      page_id: "",
      clientWidth: "375",
      page_name: "",
      isInHome: 0,
      id: "M" + new Date().getTime(),
      fullShow: false,
      popShow: false,
      advertising: {},
      full_screen: {},
      top_info: {},
      bottom_info: "",
      components: [],

      showPage: true,
      isBottom: false,
      btnFlag: false,
      isMounted: false,

      current_page: 1,
      total_page: 0,
      isLoadMore: true,
      lastIndex: ""

      // "gh_id": "gh_cdb1a2dfcd17",
      // "minApp_link": "/pages/index/index.html",
    };
  },
  mounted() {
    window.diyHomeScrollTop = 0;
    this.isInHome = 1;
    this.getTemp();

    // mounted 肯定是第一次进来
    this.isMounted = true;
  },
  activated() {
    if (this.fun.getPhoneEnv() == 3) {
      this.clientWidth = 375;
    } else {
      this.clientWidth = document.body.clientWidth;
    }

    if (window.page_id != this.fun.getKey("page_id") || window.isInHome) {
      if (!this.isMounted) {
        // mounted 请求了这里就不请求
        this.fun.setWXTitle("");
        this.isInHome = 1;
        this.getTemp();
      }
    } else {
      let title = window.localStorage.getItem("diypage_title");
      this.fun.setWXTitle(title);
      if (window.location.href.indexOf("#/newDiy?") > -1) {
        setTimeout(() => {
          window.scrollTo(0, window.diyHomeScrollTop);
        }, 200);
      }
    }

    if (this.isMounted) {
      // 防止下次进入同样的页面还请求
      this.isMounted = false;
    }
    this.page_id = this.fun.getKey("page_id");
    window.page_id = this.fun.getKey("page_id");
    window.isInDiy = 1; // 判断是否进入了装修页
    window.addEventListener("scroll", this.handleScroll);
  },
  deactivated() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  beforeRouteLeave(to, from, next) {
    window.diyHomeScrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    next();
  },
  methods: {
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
          console.log("图片加载出错");
        };
      }
    },
    initAdvertising() {
      let that = this;
      this.getImg(this.advertising.image, function(scale) {
        // 图片加载完后获取图片高度
        let script = document.createElement("script");
        script.type = "text/wxtag-template";
        script.text = `<div style="width: ${that.clientWidth * 0.65}px;height: ${(that.clientWidth * 0.65) * scale}px;"></div>`;
        that.advertising.html = `<wx-open-launch-weapp username="${that.advertising.s_id}" path="${that.advertising.s_url}">${script.outerHTML}</wx-open-launch-weapp>`;
        that.$forceUpdate();
      });
    },
    //获取装修信息
    getTemp() {
      this.showPage = false;
      $http
        .get("home-page.index", { page_id: this.fun.getKey("page_id") }, "loading")
        .then(
          response => {
            if (!response) return;

            if (response.data.item) {
              this.showPage = true;
              if (response.data.item.page) {
                this.total_page = response.data.item.page.total_page;
                this.current_page = response.data.item.page.current_page;
                this.lastIndex = response.data.item.page.count - 1;
              }
              let needLocations = ["U_location", "U_stores", "U_goodsnearby", "U_community"];
              this.components = response.data.item.datas;
              if (this.components && this.components.length > 0) {
                this.components.map((item) => {
                  if (needLocations.includes(item.component_key)) {
                    this.isLocation = true;
                  }
                });
              }

              // if (this.isLocation) {
              // 组件里面已经有定位
              //   this.getLocation();
              // }

              if (response.data.item.page_info) {

                //弹窗广告
                this.advertising = response.data.item.page_info.advertising_id;
                if (this.advertising.id && this.advertising.datas) {
                  this.advertising.datas = JSON.parse(this.advertising.datas);
                }

                // 全屏广告
                this.full_screen = response.data.item.page_info.full_screen_id;
              }

              if (response.data.item.top && response.data.item.top.id) {
                this.top_info = JSON.parse(response.data.item.top.page_info);
              }

              // 装修的底部有三种情况
              if (response.data.item.foot_type == -1) {
                // 不显示
                this.bottom_info = "";
              } else if (response.data.item.foot_type == 1) {
                // 显示默认
                if (!response.data.item.foot) {
                  // 显示系统默认
                  this.bottom_info = {
                    defaultData: true
                  };
                } else {
                  // 显示列表设置的默认
                  if(response.data.item.foot && response.data.item.foot.page_info) {
                    this.bottom_info = JSON.parse(response.data.item.foot.page_info);
                  }else {
                    this.bottom_info = {
                      defaultData: true
                    };
                  }
                }
              } else if (response.data.item.foot_type == 2) {
                // 显示自定义的底部导航
                if (response.data.item.foot instanceof Array) {
                  this.bottom_info = {};
                } else {
                  this.bottom_info = JSON.parse(response.data.item.foot.page_info);
                }
              }

              if (this.full_screen && this.full_screen.id && this.full_screen.show_rule === 1) {
                if (!window.page_idFull_screens.includes(this.page_id)) {
                  window.page_idFull_screens.push(this.page_id);
                  this.fullShow = true;
                  this.countDown(this.full_screen.show_time);
                }
              }

              if (this.advertising && this.advertising.id && this.advertising.show_rule === 1) {
                if (!window.page_idAdvertisings.includes(this.page_id)) {
                  window.page_idAdvertisings.push(this.page_id);
                  this.popShow = true;
                  this.$nextTick(() => {
                    this.initAdvertising();
                  });
                }
              }

              if (response.data.item.page_info) {
                this.getShareData(response.data.item.page_info);
              }
              window.isInHome = 0;
              this.isInHome = 0;

              this.$store.commit("setWatchDiypage", response.data.item.pageinfo.params.allowauth);

              // 设置的标题（装修）
              this.page_name = response.data.item.page_info && response.data.item.page_info.page_title ? response.data.item.page_info.page_title : this.$store.state.temp.mailInfo.name;

              this.fun.setWXTitle(this.page_name);
              // 标题存到缓存，页面切换没有请求接口时，用缓存里的标题
              window.localStorage.setItem("diypage_title", this.page_name);
              if (window.location.href.indexOf("#/newDiy?") > -1) {
                setTimeout(() => {
                  window.scrollTo(0, window.diyHomeScrollTop);
                }, 200);
              }

            } else {
              window.isInHome = 1;
              console.log(response.msg);
            }
          },
          response => {
            console.log(response);
          }
        );
    },
    getMoreDecorate() {
      this.isLoadMore = false; // 防止多次请求分页数据
      if (this.current_page < this.total_page) {
        this.current_page = this.current_page + 1;
        $http.get("plugin.decorate.frotend.decorate-api.get-page", {
          decorate_page: this.current_page,
          decorate_id: this.page_id
        }, "..").then((response) => {
          if (response.result == 1) {
            this.isLoadMore = true;
            this.components = this.components.concat(response.data.datas);
          } else {
            this.isLoadMore = false;
            this.current_page = this.current_page - 1;
          }
        });
      } else {
        console.log("加载完了");
      }
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
        clientHeight = Math.min(
          body.clientHeight,
          documentElement.clientHeight
        );
      } else {
        clientHeight = Math.max(
          body.clientHeight,
          documentElement.clientHeight
        );
      }
      return clientHeight;
    },
    //获取文档完整的高度
    getScrollHeight() {
      return Math.max(body.scrollHeight, documentElement.scrollHeight);
    },
    handleScroll() {
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      if (scrollTop > 60) {
        this.btnFlag = true;
      } else {
        this.btnFlag = false;
      }

      //滚动事件触发
      if (Number(this.getScrollTop() + this.getClientHeight() + 5) >= this.getScrollHeight()) {
        if (this.isLoadMore) {
          this.getMoreDecorate();
        }
        //此处发起请求
        this.isBottom = true;
      } else {
        this.isBottom = false;
      }
    },
    getLocation() {
      var that = this;
      var myLocation = this.$store.state.o2oLocation;

      if (!myLocation.point) {
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
          console.log("objjjjj", obj);
          // var res =
          //   "经纬度：" +
          //   obj.position +
          //   "\n精度范围：" +
          //   obj.accuracy +
          //   "米\n定位结果的来源：" +
          //   obj.location_type +
          //   "\n状态信息：" +
          //   obj.info +
          //   "\n地址：" +
          //   obj.formattedAddress +
          //   "\n地址信息：" +
          //   JSON.stringify(obj.addressComponent, null, 4);
          //alert(JSON.stringify(obj.addressComponent, null, 4));
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
        }

        function onError(obj) {
          Toast("定位失败,请手动切换位置");
        }
      }
    },
    //获取装修分享数据
    getShareData(data) {
      this.shareInfo = data;
      // this.initShare(); //初始化分享设置
      this.fun.wxShare(
        "",
        {
          page_id: this.fun.getKey("page_id")
        },
        {
          title: this.shareInfo.page_title?this.shareInfo.page_title:'',
          imgUrl: this.shareInfo.page_icon?this.shareInfo.page_icon:'',
          description: this.shareInfo.page_description?this.shareInfo.page_description:''
        }
      );
    },

    //初始化分享设置
    initShare() {
      // let page_id = this.fun.isTextEmpty(this.fun.getKey("page_id"))? this.$route.params.page_id: this.fun.getKey("page_id");
      // console.log("page_id=====", page_id);
      let that = this;
      let _url = document.location.href;
      let json = {
        url: _url,
        mid: this.fun.getKeyByMid(),
        page_id: this.fun.getKey("page_id")
      };
      $http.post("member.member.wxJsSdkConfig", json).then(
        function(response) {
          if (response.result == 1) {
            //console.log("装修分享wxJsSdkConfig",response.data);
            if (response.data.config) {
              that.share(response.data);
            }
          }
        },
        function(response) {
          console.log("报错", response);
        }
      );
    },

    //组装分享设置
    share(data) {
      let that = this;
      data.config.openTagList = ["wx-open-launch-weapp"];
      wx.config(data.config);
      wx.ready(function() {

        //that.shareInfo.page_title当前装修页面标题     data.shop.share.title全局标题
        let _title = that.shareInfo.page_title ? that.shareInfo.page_title : data.shop.share.title;
        let _imgUrl = that.shareInfo.page_icon ? that.shareInfo.page_icon : data.shop.share.icon;
        let _desc = that.shareInfo.page_description ? that.shareInfo.page_description : data.shop.share.desc;
        let _link = document.location.href + "&share_tag=2";
        _link = that.fun.isMid(_link, data.info.uid);

        wx.showOptionMenu();

        wx.onMenuShareTimeline({
          title: _title, // 分享标题
          link: _link, // 分享链接
          imgUrl: _imgUrl, // 分享图标
          success: function() {
            Toast("分享成功");
          },
          cancel: function() {
            Toast("取消分享");
          }
        });

        wx.onMenuShareAppMessage({
          title: _title, // 分享标题
          desc: _desc, // 分享描述
          link: _link, // 分享链接
          imgUrl: _imgUrl, // 分享图标
          type: "link", // 分享类型,music、video或link，不填默认为link
          dataUrl: "", // 如果type是music或video，则要提供数据链接，默认为空
          success: function() {
            Toast("分享成功");
          },
          cancel: function() {
            Toast("取消分享");
          }
        });
      });
    },

    turnFullTo() {
      if (this.full_screen.h_url) {
        if (this.full_screen.h_url !== window.location.href) {
          window.location.href = this.full_screen.h_url;
        }
      }
    },
    turnTo() {
      if (this.advertising.h_url) {
        if (this.advertising.h_url === window.location.href) {
          this.popShow = false;
        } else {
          window.location.href = this.advertising.h_url;
        }
      }
    },
    close() {
      this.fullShow = false;
    },
    closePop() {
      this.popShow = false;
    },
    countDown(num) {
      this.full_screen.show_time = num;
      --num;
      setTimeout(() => {
        if (num <= 0) {
          this.fullShow = false;
          // this.$route.meta.foot = false;
          // this.$emit("changeFoot", this.$route.meta.foot);
        } else {
          this.countDown(num);
        }
      }, 1000);
    }
  },
  components: {
    // U_memberasset,
    // U_membermarket,
    // U_membermerchant,
    // U_memberorder,
    // U_memberrights,
    // U_membertool,
    // U_membertop,
    top_navigation,
    U_article: () => import('../components/new_diy/article.vue'),
    U_backup: () => import('../components/new_diy/backup.vue'),
    U_blank: () => import('../components/new_diy/blank.vue'),
    U_button: () => import('../components/new_diy/button.vue'),
    U_community: () => import('../components/new_diy/community.vue'),
    U_coupons: () => import('../components/new_diy/coupons.vue'),
    U_cube: () => import('../components/new_diy/cube.vue'),
    U_form: () => import('../components/new_diy/form.vue'),
    U_goods: () => import('../components/new_diy/goods.vue'),
    U_goodsgroup: () => import('../components/new_diy/goodsgroup.vue'),
    U_goodsnearby: () => import('../components/new_diy/goodsnearby.vue'),
    U_goodsrush: () => import('../components/new_diy/goodsrush.vue'),
    U_headline: () => import('../components/new_diy/headline.vue'),
    U_homedata: () => import('../components/new_diy/homedata.vue'),
    U_line: () => import('../components/new_diy/line.vue'),
    U_livestreaming: () => import('../components/new_diy/livestreaming.vue'),
    U_location: () => import('../components/new_diy/location.vue'),
    U_lottery: () => import('../components/new_diy/lottery.vue'),
    U_maps: () => import('../components/new_diy/maps.vue'),
    U_notice: () => import('../components/new_diy/notice.vue'),
    U_richtext: () => import('../components/new_diy/richtext.vue'),
    U_search: () => import('../components/new_diy/search.vue'),
    U_shopfor: () => import('../components/new_diy/shopfor.vue'),
    U_shortvideo: () => import('../components/new_diy/shortvideo.vue'),
    U_signin: () => import('../components/new_diy/signin.vue'),
    U_simplegraph: () => import('../components/new_diy/simplegraph.vue'),
    U_slideshow: () => import('../components/new_diy/slideshow.vue'),
    U_stores: () => import('../components/new_diy/stores.vue'),
    U_storesranking: () => import('../components/new_diy/storesranking.vue'),
    U_suspendbutton: () => import('../components/new_diy/suspendbutton.vue'),
    U_tabcontrol: () => import('../components/new_diy/tabcontrol.vue'),
    U_title: () => import('../components/new_diy/title.vue'),
    U_video: () => import('../components/new_diy/video.vue'),
    U_stargroup: () => import('../components/new_diy/stargroup.vue'),
    U_foot: () => import('../components/new_diy/foot.vue'),
  }
};
