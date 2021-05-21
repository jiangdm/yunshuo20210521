import cTitle from "components/title";
import loading from "components/loading";
import cLive from "components/goods/children/liveList";
import { Toast } from "vant";
import { scrollMixin } from "utils/mixin";
import cFlow from "components/Waterfalls_flow";
import cComment from "components/comment";
import deliveryMap from "components/delivery_map";
import cGrouplist from "./o2oGroup/grouplist";

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      tabIndex: "门店详情",
      tabList: ["门店详情", "门店员工"],
      micro_communities: [],
      get_recommend_goods: [],
      store_member: [],
      store_room: [],//直播间列表
      nearbyClassification: [],
      isShow: false,
      category: [],
      mainInfo: {},
      telephone: "",
      info: {},
      infoShow: false,

      delivery_note: "",//门店配送说明
      delivery_area: [[116.403322, 39.920255]],// 配送范围经纬度
      locations: [116.403322, 39.920255],//门店经纬度
      is_open_store_delivery: false,//是否开启门店配送

      //more
      isLoadMore: true,

      cisLoadMore: true,
      cPage: 1,
      cTotal_page: 0,

      roomisLoadMore: true,
      roomPage: 1,
      roomTotal_page: 0,

      commentList: [],

      // 装修
      store_id: "",
      page_id: "",
      clientWidth: "375",
      page_name: "",
      id: "M" + new Date().getTime(),
      store_components: [],
      store_pageInfo: {},
      isBottom: false,
      btnFlag: false,
      current_page: 1,
      total_page: 0,
      lastIndex: "",

      // 门店拼团
      groupisLoadMore: true,
      groupPage: 1,
      groupTotal_page: 0,
      grouplist: [],
    };
  },
  beforeRouteLeave(to, from, next) {
    window.homesellerScrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    next();
  },
  mounted() {
    window.homesellerScrollTop = 0;
  },
  created() {
    if(this.$route.params.fromHome !== 1) {
      this.store_id = this.$route.params.store_id;
      this.init();
      this.getStoreInfo();
    }
  },
  activated() {
    if(this.$route.params.fromHome === 1) {
      this.store_id = this.$route.params.store_id;
      this.init();
      this.getStoreInfo();
    } else {
      if(this.store_pageInfo.page_title) {
        this.fun.setWXTitle(this.store_pageInfo.page_title || '商家');
      }
      this.lastScrollHeight();
    }
  },
  methods: {
    lastScrollHeight() {
      if (window.location.href.indexOf("#/o2o/home/homeseller/") > -1) {
        setTimeout(() => {
          window.scrollTo(0, window.homesellerScrollTop);
        }, 200);
      }
    },
    toCard(id) {
      if (id) {
        this.$router.push(this.fun.getUrl("BusinessCard", {}, { mark_id: id, mark: "card" }));
      }
    },
    onCopy: function(e) {
      Toast({
        message: "复制成功",
        duration: 1000
      });
    },
    onError: function(e) {
      Toast({
        message: "复制失败",
        duration: 1000
      });
    },
    chooseTab(tab) {
      this.tabIndex = tab.name;
      if (this.tabIndex == "门店微贴" && this.micro_communities.length <= 0) {
        this.getStoreCommunities();
      } else if (this.tabIndex == "门店直播") {
        if (this.store_room.length <= 0) {
          this.getStoreRooms();
        }
      } else if (this.tabIndex == "门店员工") {
        if (this.store_member.length <= 0) {
          this.getStoreMember();
        }
      } else if (this.tabIndex == '门店活动') {
        this.$router.push(this.fun.getUrl("ActivityDetail", {}, { activity_id: tab.id, store_id: this.$route.params.store_id }));
      } else if (this.tabIndex == '门店拼团') {
        this.getStoreGroup();
      }
      this.isLoadMore = true;
    },
    loadMore() {
      this.cisLoadMore = true;
    },
    toGood(id) {
      this.$router.push(this.fun.getUrl("goods", { id: id }));
    },
    getStoreMember() {
      $http
        .get(
          "plugin.store-cashier.frontend.store.get-store-info.get-store-staff",
          { store_id: this.$route.params.store_id }
        )
        .then(response => {
          if (response.result == 1) {
            this.store_member = response.data;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getStoreRooms() {
      this.roomisLoadMore = false;
      $http
        .get(
          "plugin.store-cashier.frontend.store.get-store-info.get-room",
          { store_id: this.$route.params.store_id, page: 1 }
        )
        .then(response => {
          if (response.result == 1) {
            this.roomTotal_page = response.data.last_page;
            if (this.roomTotal_page === 0) {
              this.roomisLoadMore = true;
            }
            this.store_room = response.data.data;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getStoreCommunities() {
      this.cisLoadMore = false;
      $http
        .get(
          "plugin.store-cashier.frontend.store.get-store-info.get-micro-communities",
          { store_id: this.$route.params.store_id, page: 1 }
        )
        .then(response => {
          if (response.result == 1) {
            this.cTotal_page = response.data.last_page;
            if (this.cTotal_page === 0) {
              this.cisLoadMore = true;
            }
            this.micro_communities = response.data.data;
            this.setCommunities();
          }
        })
        .catch(error => {
          this.cisLoadMore = true;
          console.log(error);
        });
    },
    getStoreGroup() {
      this.groupisLoadMore = false;
      $http
        .get(
          "plugin.fight-groups.frontend.store.frontend-fight-groups.index",
          { store_id: this.$route.params.store_id, page: 1 }
        )
        .then(response => {
          if (response.result == 1) {
            this.groupTotal_page = response.data.last_page;
            if (this.groupTotal_page === 0) {
              this.groupisLoadMore = true;
            }
            this.grouplist = response.data.data;
          }
        })
        .catch(error => {
          this.groupisLoadMore = true;
          console.log(error);
        });
    },
    setCommunities() {
      let arr = [];
      this.micro_communities.map(item => {
        arr.push(
          {
            id: item.id,
            title: item.title,
            praise_num: item.praise_num,
            has_one_stick_user: {
              avatar: item.user_avatar,
              nickname: item.user_nickname
            },
            has_many_image: [{
              url: item.image,
              stick_id: item.id
            }]
          }
        );
      });
      this.nearbyClassification = arr;
    },
    getStoreInfo() {
      $http
        .post(
          "plugin.store-cashier.frontend.store.get-store-info.get-the-provider",
          {
            store_id: this.$route.params.store_id,
            url:
              this.fun.isIosOrAndroid() === "android"
                ? window.location.href
                : window.initUrl
          }, "loading"
        )
        .then(response => {
          this.isShow = true;
          if (response.result === 1) {
            this.tabList = response.data.menu_list;
            this.getStore(response.data.store_info);

            if(response.data.store_decorate && response.data.store_decorate.datas) {
              this.store_components = response.data.store_decorate.datas;
              this.store_pageInfo = response.data.store_decorate.page_info;
              this.fun.setWXTitle(this.store_pageInfo.page_title || '商家');
            }else {
              this.get_recommend_goods = response.data.get_recommend_goods;

              if (!this.fun.isTextEmpty(response.data.store_information)) {
                this.info = response.data.store_information;
                this.infoShow = true;
              }
            }

            // this.initShare();
            this.fun.wxShare(
              "",
              {},
              {
                title: this.store_pageInfo.page_title ? this.store_pageInfo.page_title : this.mainInfo.store_name,
                imgUrl: this.store_pageInfo.page_icon ? this.store_pageInfo.page_icon : this.mainInfo.store_thumb,
                description: this.store_pageInfo.page_description ? this.store_pageInfo.page_description : this.mainInfo.store_introduce
              },
            );

          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //获取页面主要信息
    getStore(data) {
      // $http
      //   .get(
      //     "plugin.store-cashier.frontend.store.get-store-info.get-info-by-store-id",
      //     { store_id: this.$route.params.store_id }
      //   )
      //   .then(response => {
      // console.log(response.data);
      // if (response.result === 1 && !this.fun.isTextEmpty(response.data)) {
      this.mainInfo = data;
      this.telephone = "tel:" + data.store_mobile;
      this.commentList = data.comment;
      // 门店配送数据
      //开启门店配送
      if (data.dispatch_type.indexOf(3) != -1) {
        if (data.store_delivery && data.store_delivery.delivery_status == 1) {
          this.is_open_store_delivery = true;
          this.delivery_note = data.store_delivery ? data.store_delivery.delivery_note : '';
          this.delivery_note = this.delivery_note.replace(/\n|\r/g, "<br/>");//文本域换行处理
          let delivery_area = data.store_delivery ? data.store_delivery.delivery_area : [];
          let locations = data.store_delivery ? data.store_delivery.locations : [];
          let arr_delivery_area = [];
          delivery_area.forEach((item, index) => {
            arr_delivery_area.push([Number(item.R), Number(item.Q)]);
          });
          this.delivery_area = arr_delivery_area;
          this.locations = [Number(locations.longitude).toFixed(6), Number(locations.latitude).toFixed(6)];
        }

      }

      //   }
      // })
      // .catch(error => {
      //   console.log(error);
      // });
    },

    getMoreData() {
      this.cisLoadMore = false;
      this.isLoadMore = false;
      this.roomisLoadMore = false;
      this.groupisLoadMore = false;
      let flag = false;
      let url = "";
      let json = {
        store_id: this.$route.params.store_id
      };

      if (this.tabIndex == "门店微贴") {
        url = "plugin.store-cashier.frontend.store.get-store-info.get-micro-communities";
        if (this.cPage >= this.cTotal_page) {
          this.cisLoadMore = true;
          this.isLoadMore = true;
        } else {
          this.cPage = this.cPage + 1;
          json.page = this.cPage;
          flag = true;
        }
      } else if (this.tabIndex == '门店拼团') {
        url = 'plugin.fight-groups.frontend.store.frontend-fight-groups.index';
        if (this.groupPage >= this.groupTotal_page) {
          this.isLoadMore = true;
          this.groupisLoadMore = true;
        } else {
          this.groupPage = this.groupPage + 1;
          json.page = this.groupPage;
          json.store_id = this.$route.params.store_id;
          flag = true;
        }
      } else {
        url = "plugin.store-cashier.frontend.store.get-store-info.get-room";
        if (this.roomPage >= this.roomTotal_page) {
          this.isLoadMore = true;
          this.roomisLoadMore = true;
        } else {
          this.roomPage = this.roomPage + 1;
          json.page = this.roomPage;
          flag = true;
        }
      }

      if (flag) {
        $http.post(url, json, "加载中")
          .then((response) => {
            if (response.result === 1) {
              let myData = response.data.data;
              this.isLoadMore = true;
              if (this.tabIndex == "门店微贴") {
                this.micro_communities = this.micro_communities.concat(myData);
                this.setCommunities();
              } else {
                this.store_room = this.store_room.concat(myData);
              }
            } else {
              this.cPage = this.cPage - 1;
              this.isLoadMore = false;
              this.cisLoadMore = true;
              this.roomisLoadMore = false;
            }
          },
          response => {
            // error callback
          }).catch(err => {
            console.log(err);
          });
      }
    },
    goToShop() {
      this.$router.push(
        this.fun.getUrl("o2oStore_v2", {
          store_id: this.$route.params.store_id,
          fromHome: 1
        })
      );
    },

    goToAdress() {
      let point = this.fun.bd_decrypt(this.mainInfo.lng, this.mainInfo.lat);
      //window.location.href="http://api.map.baidu.com/marker?location="+this.mainInfo.lat+","+this.mainInfo.lng+"&title=商家位置&content="+this.mainInfo.store_name+"&output=html";
      // https://m.amap.com/navi/?dest=${point.lng},${point.lat}&destName=${items.store_name}&key=43de56d8e65fe042493541213d9ad7b0 高德另一种
      this.fun.goToWXAdress(point, this.mainInfo.store_name, "门店地址");
      // if (this.fun.isWeiXin()) {
      //   this.goToWXAdress(point, this.mainInfo);
      // } else {
      //   window.location.href = `https://uri.amap.com/navigation?to=${point.lng},${point.lat},${this.mainInfo.store_name}&mode=car&policy=1&src=mypage&coordinate=gaode&callnative=0`;
      // }
    },
    goToWXAdress(point, store) {
      $http
        .post(
          "member.member.wxJsSdkConfig",
          {
            url:
              this.fun.isIosOrAndroid() === "android"
                ? window.location.href
                : window.initUrl
          },
          " "
        )
        .then(
          response => {
            if (response.result === 1) {
              if (response.data.config) {
                wx.config({
                  debug: false,
                  appId: response.data.config.appId,
                  nonceStr: response.data.config.nonceStr,
                  timestamp: response.data.config.timestamp,
                  url: response.data.config.url,
                  signature: response.data.config.signature,
                  jsApiList: ["checkJsApi", "openLocation", "getLocation"]
                });

                wx.checkJsApi({
                  jsApiList: ["getLocation"],
                  success: function (res) {
                    if (res.checkResult.getLocation == false) {
                      alert(
                        "你的微信版本太低，不支持微信JS接口，请升级到最新的微信版本！"
                      );
                    }
                  }
                });
                wx.ready(function () {
                  wx.getLocation({
                    type: "gcj02", // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                    success: function (res) {
                      wx.openLocation({
                        latitude: point.lat, // 纬度，浮点数，范围为90 ~ -90
                        longitude: point.lng, // 经度，浮点数，范围为180 ~ -180。
                        name: store.store_name, // 位置名
                        address: "门店地址", // 地址详情说明
                        scale: 20 // 地图缩放级别,整形值,范围从1~28。默认为最大
                      });
                    },
                    cancel: function (res) {
                      alert("用户拒绝授权获取地理位置");
                    }
                  });
                });

                wx.error(function (response) {
                  console.log(response);
                  window.location.href = `https://uri.amap.com/navigation?to=${point.lng},${point.lat},${store.store_name}&mode=car&policy=1&src=mypage&coordinate=gaode&callnative=0`;
                });
              } else {
                window.location.href = `https://uri.amap.com/navigation?to=${point.lng},${point.lat},${store.store_name}&mode=car&policy=1&src=mypage&coordinate=gaode&callnative=0`;
              }
            } else {
              window.location.href = `https://uri.amap.com/navigation?to=${point.lng},${point.lat},${store.store_name}&mode=car&policy=1&src=mypage&coordinate=gaode&callnative=0`;
            }
          },
          function (response) {
            console.log(response);
            window.location.href = `https://uri.amap.com/navigation?to=${point.lng},${point.lat},${store.store_name}&mode=car&policy=1&src=mypage&coordinate=gaode&callnative=0`;
          }
        );
    },

    goToCrash() {
      this.$router.push(
        this.fun.getUrl("cashier_pay", {
          store_id: this.$route.params.store_id
        })
      );
    },

    getMoreDecorate() {
      this.isLoadMore = false; // 防止多次请求分页数据
      // if (this.current_page < this.total_page) {
      //   this.current_page = this.current_page + 1;
      //   $http.get('plugin.decorate.frotend.decorate-api.get-page',{decorate_page: this.current_page, decorate_id: this.page_id},'..').then((response)=> {
      //     if (response.result == 1) {
      //       this.isLoadMore = true;
      //       this.components = this.components.concat(response.data.datas);
      //     }else {
      //       this.isLoadMore = false;
      //       this.current_page = this.current_page - 1;
      //     }
      //   });
      // }else {
      //   console.log("加载完了");
      // }
    },

    init() {
      this.isShow = false;
      this.category = [];
      this.mainInfo = {};
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    },

    //分享

    initShare() {
      let that = this;
      let _url = document.location.href;
      let json = { url: _url };
      $http
        .post("member.member.wxJsSdkConfig", json)
        .then(response => {
          if (response.result == 1) {
            if (response.data.config) {
              that.share(response.data);
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    share(data) {
      let that = this;

      wx.config(data.config);
      wx.ready(function() {
        let _title = that.fun.isTextEmpty(that.mainInfo.store_name)
          ? data.share.title
          : that.mainInfo.store_name;

        let _link = document.location.href + "&share_tag=2";
        _link = that.fun.isMid(_link, data.info.uid);

        let _imgUrl = that.fun.isTextEmpty(that.mainInfo.store_thumb)
          ? data.share.icon
          : that.mainInfo.store_thumb;
        let _desc = that.fun.isTextEmpty(that.mainInfo.store_introduce)
          ? data.share.desc
          : that.mainInfo.store_introduce;

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
  },
  components: {
    cTitle,
    cFlow,
    loading,
    cLive,
    cComment,
    deliveryMap,
    cGrouplist,
    U_backup: () => import('../../components/new_diy/backup.vue'),
    U_blank: () => import('../../components/new_diy/blank.vue'),
    U_button: () => import('../../components/new_diy/button.vue'),
    U_community: () => import('../../components/new_diy/community.vue'),
    U_cube: () => import('../../components/new_diy/cube.vue'),
    U_goods: () => import('../../components/new_diy/goods.vue'),
    U_line: () => import('../../components/new_diy/line.vue'),
    U_location: () => import('../../components/new_diy/location.vue'),
    U_maps: () => import('../../components/new_diy/maps.vue'),
    U_notice: () => import('../../components/new_diy/notice.vue'),
    U_richtext: () => import('../../components/new_diy/richtext.vue'),
    U_simplegraph: () => import('../../components/new_diy/simplegraph.vue'),
    U_slideshow: () => import('../../components/new_diy/slideshow.vue'),
    U_suspendbutton: () => import('../../components/new_diy/suspendbutton.vue'),
    U_title: () => import('../../components/new_diy/title.vue'),
    U_video: () => import('../../components/new_diy/video.vue')
  }
};
