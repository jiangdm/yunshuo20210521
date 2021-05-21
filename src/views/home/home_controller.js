﻿import cTitle from "components/title";
import cMent from "components/ment";
import cGoodsList from "components/goodsList";
import { Toast } from 'vant';

//旧装修
import banner from "components/temp/banner";
import showbanner from "components/temp/banner";
import showmenu from "components/temp/menu";
import showtitle from "components/temp/title";
import showsearch from "components/temp/search";
import showline from "components/temp/line";
import showblank from "components/temp/blank";
import showrichtext from "components/temp/richtext";
import showpicture from "components/temp/picture";
import showcube from "components/temp/cube";
import showarea from "components/temp/area";
import showshop from "components/temp/shop";
import showgoods from "components/temp/goods";
import shownearbygoods from "components/temp/near_goods";
import shownotice from "components/temp/notice";
import showlocation from "components/temp/location";
import showstore from "components/temp/stores";
import showbusiness from "components/temp/business";
import showvideo from "components/temp/video";
import showdiyform from "components/temp/form";
import cMyswipe from "components/myswipe";
import { Swipe, SwipeItem } from "components/meswipe";
import showsign from "components/temp/showsign";
import showtogetherpurchase from "components/temp/group_buy";
import showflashsale from "components/time_limit";
import showcoupon from "components/cupcon";
import showarticle from "components/article";
import showheadline from "components/topline";
import showassemble from "components/time_group";
import showlivestreaming from "components/temp/livestreaming";

import newcomerAward from "components/newcomer_award";//新人奖


//新装修
import top_navigation from "components/new_diy/top_navigation";

window.firstAdvertisement = 1; //弹出周期设置为关闭网页(弹窗广告)
window.secondAdvertisement = 1; //弹出周期设置为关闭网页（全屏广告）

const documentElement = document.documentElement;
const body = document.body;
export default {
  data() {
    return {
      home_default: "",
      old_decorate: "",
      posterShow: false,
      address: '',
      city: '',
      point: {},
      fullShow: false,
      popShow: false,
      amout: false,
      follow_mode: {},  //引导关注
      category: [],
      goodsListData: [],
      ads: [],
      isfollow: false,
      pageinfo: "",
      isMiniApp: false,
      sliderNav: {},
      advertisement: {},
      isInDiy: 0,
      showNewcomerAward: false,//新人奖弹窗
      newcomerAward_data: {},//新人奖活动信息

      isDecorate: false,  //是否新装修
      clientWidth: '375',
      id: "M" + new Date().getTime(),
      advertising: {},
      full_screen: {},
      top_info: {},
      bottom_info: "",
      components: [],
      page_id: '',
      page_info: {},
      isBottom: false,
      btnFlag: false,

      current_page: 1,
      total_page: 0,
      isLoadMore: true,
      lastIndex: '',

      showPage: false
    };
  },

  computed: {},

  mounted() {
    localStorage.setItem("isset", 1);
    if (window.isMiniprogram) {
      this.isMiniApp = true;
    }
    window.HomeScrollTop = 0;
    // this.guideFollow();
  },
  beforeRouteLeave(to, from, next) {
    window.HomeScrollTop =  document.documentElement.scrollTop || document.body.scrollTop;
    next();
  },
  deactivated() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  activated() {
    this.posterShow = false;
    this.fullShow = false;
    this.popShow = false;
    this.advertisement = {};
    window.addEventListener("scroll", this.handleScroll);

    if(this.fun.getPhoneEnv() == 3) {
      this.clientWidth = 375;
    }else {
      this.clientWidth = document.body.clientWidth;
    }

    if (window.__wxjs_environment === "miniprogram") {
      window.isMiniprogram = true;
    }
    if (window.isMiniprogram) {
      this.isMiniApp = true;
    }
    this.fun.setWXTitle(this.$store.state.temp.item.janst);
    wx.miniProgram.postMessage({
      data: { goods_title: this.$store.state.temp.item.janst }
    });

    this.sliderNav = this.$store.state.temp.item.topmenu;

    window.isInHome = 1; // 判断是否进入了首页
    if (!this.sliderNav && this.$store.state.temp.item.is_decorate !== 1) {
      this.sliderNav = {};
      this.tempInfo();
    } else if (window.isInDiy || window.HomeScrollTop == 0) {
      this.isInDiy = 1;
      window.isInDiy = 0;
      this.tempInfo();
    }else {
      if (window.location.href.indexOf("#/home?") > -1) {
        setTimeout(() => {
          window.scrollTo(0, window.HomeScrollTop);
        }, 200);
      }
    }

  },
  methods: {
    getParams() {
      let that=this;
      let _url = document.location.href;
      // 要用post  链接太长
      $http
        .post("home-page.get-params", { url: _url }, " ")
        .then(response => {
          if (response.result === 1) {
            if (this.showNewcomerAward) {
              if (response.data.advertisement && response.data.advertisement.advertisement) {
                this.advertisement = response.data.advertisement.advertisement;
              }
            } else {
              if (response.data.advertisement && response.data.advertisement.advertisement && !window.isDecorate) {
                this.getAdvertise(response.data.advertisement.advertisement);
              }else if(window.isDecorate) {
                if(this.advertising && this.advertising.id && window.firstAdvertisement === 1 && this.advertising.show_rule === 1) {
                  window.firstAdvertisement = 0;
                  this.popShow = true;
                  this.$nextTick(()=>{
                    this.initAdvertising();
                  });
                }
              } else {
                this.$route.meta.foot = false;
                this.$emit("changeFoot", this.$route.meta.foot);
              }
            }
            // 刷新页面时，在这刷新顶部菜单栏
            this.sliderNav = this.$store.state.temp.item.topmenu ? this.$store.state.temp.item.topmenu: {};

            this.guideFollow(response.data.guide);

          } else {
            if (response.msg == "站点已关闭") {
              that.$dialog.alert({message:response.msg});

            }
            console.log(response.msg);
          }
        })
        .catch(err => {
          console.error(err, "app");
        });
    },

    // 获取装修或者是默认的数据
    tempInfo() {
      let that = this;
      this.showPage = false;
      $http.get("home-page.index", {}, "加载中").then(
        response => {
          if (!response) return;
          if (response.result === 1) {
            this.showPage = true;
            if(this.fun.getTyep() != 5) {
              this.initShare();
            }

            this.showNewcomerAward = false;
            this.newcomerAward_data = {};
            try {
              //第一次进入首页并带参数basic_info，并符合新人奖条件
              if(response.basic_info && response.basic_info.home.plugin && response.basic_info.home.plugin.new_member_prize) {
                this.newcomerAward_data = response.basic_info.home.plugin.new_member_prize;
              }
            } catch (err) { console.log(err); }
            try {
              //第一次不是进入首页但符合新人奖条件，返回首页后显示
              let _new_member_prize = JSON.parse(window.localStorage.getItem('new_member_prize'));
              if(_new_member_prize && !this.fun.isTextEmpty(_new_member_prize.prize)){
                this.showNewcomerAward = true;
              }
            } catch (err) { console.log(err); }

            if (response.basic_info && !this.fun.isTextEmpty(this.newcomerAward_data.prize)) {
              //第一次进入首页并带参数basic_info，并符合新人奖条件
              // this.newcomerAward_data = response.basic_info.home ? response.basic_info.home.plugin.new_member_prize : {}
              this.showNewcomerAward = true;
            }
            // else if (!this.fun.isTextEmpty(response.data.plugin.new_member_prize) && !this.fun.isTextEmpty(response.data.plugin.new_member_prize.prize)) {
            //   //有多个新人奖活动，不是第一次领取新人奖
            //   this.newcomerAward_data = response.data.plugin.new_member_prize;
            //   this.showNewcomerAward = true;
            // }
            else if (this.showNewcomerAward) {
              //第一次不是进入首页但符合新人奖条件，返回首页后显示
              this.newcomerAward_data = JSON.parse(window.localStorage.getItem('new_member_prize'));
            }

            that.isInDiy = 0;
            if (!response.data.default) {

              if(response.data.item.is_decorate === 1) {
                this.page_id = response.data.item.id;
                if(response.data.item.page) {
                  this.total_page = response.data.item.page.total_page;
                  this.current_page = response.data.item.page.current_page;
                  this.lastIndex = response.data.item.page.count-1;
                }

                this.isLoadMore = true;
                let needLocations = ["U_location", "U_stores", "U_goodsnearby", "U_community", "U_homedata", "U_storesranking"];
                // this.$store.commit("setNewDiyData", response.data.item);
                this.page_info = response.data.item.page_info;
                response.data.item.janst = response.data.item.page_info && response.data.item.page_info.page_title ? response.data.item.page_info.page_title : this.$store.state.temp.mailInfo.name;

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

                if(response.data.item.page_info) {

                  //弹窗广告
                  this.advertising = response.data.item.page_info.advertising_id;
                  if(this.advertising.id && this.advertising.datas) {
                    this.advertising.datas = JSON.parse(this.advertising.datas);
                  }

                  // 全屏广告
                  this.full_screen = response.data.item.page_info.full_screen_id;

                }

                //弹窗广告
                this.getParams();

                if(this.full_screen && this.full_screen.id && window.secondAdvertisement === 1 && this.full_screen.show_rule === 1) {
                  window.secondAdvertisement = 0;
                  this.fullShow = true;
                  this.countDown(this.full_screen.show_time);
                }

                if(response.data.item.top && response.data.item.top.id) {
                  this.top_info = JSON.parse(response.data.item.top.page_info);
                }

                // 首页的底部有三种情况
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
                  if(response.data.item.foot && response.data.item.foot.id) {
                    this.bottom_info = JSON.parse(response.data.item.foot.page_info);
                  }
                }

                this.isDecorate = true;
              }else {
                for (let j of response.data.item.data) {
                  j.temp = "show" + j.temp;
                  if (
                    j.temp == "showlocation" ||
                    j.temp == "showstore" ||
                    j.temp == "showbusiness"
                  ) {
                    that.isLocation = true;
                  }
                }
                //弹窗广告
                this.getParams();
                response.data.item.janst = response.data.item.pageinfo.params.title || this.$store.state.temp.mailInfo.name;
                this.sliderNav = response.data.item.topmenu;
                this.old_decorate = response.data.item;
                this.$store.commit("tempItemIndex", this.old_decorate);
              }

            } else {
              this.home_default = response.data.default || {};
              response.data.item.janst = this.$store.state.temp.mailInfo.name;
              //弹窗广告
              this.getParams();
            }
            // this.$store.commit("tempIndex", response.data);
            // window.localStorage.setItem("tempIndex", JSON.stringify(response.data));  存vuex里不存localStorage
            this.$store.commit("setWatchDiypage", response.data.item.pageinfo.params.allowauth);
            this.fun.setWXTitle(response.data.item.janst);
          } else {
            console.log(response.msg);
          }
        },
        response => {
          that.$dialog.alert({message:response.msg});

        }
      );
    },
    getMoreDecorate() {
      this.isLoadMore = false; // 防止多次请求分页数据
      if (this.current_page < this.total_page) {
        this.current_page = this.current_page + 1;
        $http.get('plugin.decorate.frotend.decorate-api.get-page',{decorate_page: this.current_page, decorate_id: this.page_id},'..').then((response)=> {
          if (response.result == 1) {
            this.isLoadMore = true;
            this.components = this.components.concat(response.data.datas);
          }else {
            this.isLoadMore = false;
            this.current_page = this.current_page - 1;
          }
        });
      }else {
        console.log("加载完了");
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
    initAdvertising() {
      let that = this;
      this.getImg(this.advertising.image, function(scale) {
        // 图片加载完后获取图片高度
        let script = document.createElement('script');
        script.type = 'text/wxtag-template';
        script.text = `<div style="width: ${that.clientWidth*0.65}px;height: ${(that.clientWidth*0.65)*scale}px;"></div>`;
        that.advertising.html = `<wx-open-launch-weapp username="${that.advertising.s_id}" path="${that.advertising.s_url}">${script.outerHTML}</wx-open-launch-weapp>`;
        that.$forceUpdate();
      });
    },
    toatten() {
      if (this.follow_mode.type == '1') {
        window.location.href = this.follow_mode.url;
      } else {
        this.posterShow = true;
      }
    },
    cloneNewcomerAward(data) {
      // this.$store.commit("setNewcomerAward", false);
      window.localStorage.removeItem("new_member_prize");
      this.showNewcomerAward = false;
      if (this.advertisement) {
        this.getAdvertise(this.advertisement);
      }else if(this.advertising) {
        if(this.advertising && this.advertising.id && window.firstAdvertisement === 1) {
          window.firstAdvertisement = 0;
          this.popShow = true;
          this.$nextTick(()=>{
            this.initAdvertising();
          });
        }
      } else {
        this.$route.meta.foot = false;
        this.$emit("changeFoot", this.$route.meta.foot);
      }
    },
    //关注方法
    guideFollow(data) {
      // $http.get("member.member.guideFollow").then(
      //   response => {
      if (data) {
        this.isfollow = true;
        this.follow_mode = data;
      } else {
        this.follow_mode = false;
      }
      //   },
      //   response => {
      //     console.log(response.msg);
      //   }
      // );
    },
    tosearch() {
      this.$router.push(this.fun.getUrl("search", { fromHome: 1 }));
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
      var top = document.documentElement.scrollTop || document.body.scrollTop;
      top < 50 ? (this.amout = false) : (this.amout = true);

      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      if (scrollTop > 60) {
        this.btnFlag = true;
      } else {
        this.btnFlag = false;
      }

      //滚动事件触发
      if (Number(this.getScrollTop() + this.getClientHeight() + 5) >= this.getScrollHeight()) {
        if(this.isLoadMore) {
          this.getMoreDecorate();
        }
        //此处发起请求
        this.isBottom = true;
      }else {
        this.isBottom = false;
      }
    },
    //banner点击
    bannerClick(item) {
      if (!this.fun.isTextEmpty(item.link)) {
        window.location.href = item.link; //跳转
      }
    },

    //旧装修--方法--开始
    gotoBrand(item) {
      this.$router.push(
        this.fun.getUrl("brandgoods", { id: item.id, fromHome: 1 })
      );
    },
    gotoTimeGood(val) {
      this.$router.push(this.fun.getUrl("goods", { id: val }));
    },
    gotoAdvs(link) {
      if (!this.fun.isTextEmpty(link)) {
        window.location.href = link; //跳转
      }
    },
    //显示首屏广告和弹窗广告
    getAdvertise(data) {
      // $http.get("member.member.getAdvertisement").then(response => {
      if (data) {
        this.advertisement = data;

        if (this.advertisement.Midswitch) {
          if (this.advertisement.Midrule === 0 && window.firstAdvertisement === 1) {
            // this.$route.meta.foot = false;
            // this.$emit("changeFoot", this.$route.meta.foot);
            this.popShow = true;
            window.firstAdvertisement = 0;
          } else {
            // this.$route.meta.foot = false;
            // this.$emit("changeFoot", this.$route.meta.foot);
          }
        }

        if (this.advertisement.switch) {

          if (this.advertisement.rule === 0 && window.secondAdvertisement === 1) {
            this.$route.meta.foot = true;
            this.fullShow = true;
            this.$emit("changeFoot", this.$route.meta.foot);
            this.countDown(this.advertisement.time);
            window.secondAdvertisement = 0;
          } else {
            this.$route.meta.foot = false;
            this.$emit("changeFoot", this.$route.meta.foot);
          }
        } else {
          this.$route.meta.foot = false;
          this.$emit("changeFoot", this.$route.meta.foot);
        }

      } else {
        this.$route.meta.foot = false;
        this.$emit("changeFoot", this.$route.meta.foot);
      }
      // });
    },
    close() {
      this.fullShow = false;
    },
    closePop() {
      this.popShow = false;
    },
    countDown(num) {
      this.full_screen.show_time = num;
      this.advertisement.time = num;
      --num;
      setTimeout(() => {
        if (num <= 0) {
          this.fullShow = false;
          this.$route.meta.foot = false;
          this.$emit("changeFoot", this.$route.meta.foot);
        } else {
          this.countDown(num);
        }
      }, 1000);
    },
    turnTo() {
      if (this.advertisement.link) {
        if (this.advertisement.link === window.location.href) {
          this.popShow = false;
        } else {
          window.location.href = this.advertisement.link;
        }
      }
    },

    turnFullTo() {
      if (this.full_screen.h_url) {
        if (this.full_screen.h_url !== window.location.href) {
          window.location.href = this.full_screen.h_url;
        }
      }
    },
    turnTo2() {
      if (this.advertising.h_url) {
        if (this.advertising.h_url === window.location.href) {
          this.popShow = false;
        } else {
          window.location.href = this.advertising.h_url;
        }
      }
    },
    // 初始化分享设置
    initShare() {
      let json = {
        url:
          this.fun.isIosOrAndroid() === "android"
            ? window.location.href
            : window.initUrl
      };
      $http
        .post("member.member.wxJsSdkConfig", json)
        .then(response => {
          if (response.result === 1) {
            if (response.data.config) {
              this.share(response.data);
            }
          }
        })
        .catch(error => { });
    },
    share(data) {
      let that = this;
      data.config.openTagList = ["wx-open-launch-weapp"];
      console.log('打印home组件app分享',data.config);
      wx.config(data.config);
      wx.ready(function() {
        let _title = '';

        let _link = document.location.href;
        _link = that.fun.isMid(_link, data.info.uid);
        let _imgUrl = '';
        let _desc = '';

        // 分享优先级： 单页设置（例如商品，拓客活动）> 店铺装修页面设置（仅限装修页面或者设置为首页的装修页面）data.share.title > 全局设置data.shop.share.title > 商城名称data.shop.shop.name
        if (data.share && data.share.title && !window.isDecorate) {
          // 旧装修页面有设置标题
          _title = that.fun.isTextEmpty(data.share.title) ? data.shop.shop.name : data.share.title;
          _imgUrl = that.fun.isTextEmpty(data.share.icon) ? data.shop.icon : data.share.icon;
          _desc = that.fun.isTextEmpty(data.share.desc) ? data.shop.shop.name : data.share.desc;
        }else if(that.page_info.page_title && window.isDecorate) {
          //新装修
          _title = that.fun.isTextEmpty(that.page_info.page_title) ? data.shop.share.title : that.page_info.page_title;
          _imgUrl = that.fun.isTextEmpty(that.page_info.page_icon) ? data.shop.share.icon : that.page_info.page_icon;
          _desc = that.fun.isTextEmpty(that.page_info.page_description) ? data.shop.share.desc : that.page_info.page_description;
        } else {
          // 全局标题
          _title = that.fun.isTextEmpty(data.shop.share.title) ? data.shop.shop.name : data.shop.share.title;
          _imgUrl = that.fun.isTextEmpty(data.shop.share.icon) ? data.shop.icon : data.shop.share.icon;
          _desc = that.fun.isTextEmpty(data.shop.share.desc) ? data.shop.shop.name : data.shop.share.desc;
        }

        // _title = _title.trim();
        // _imgUrl = _imgUrl.trim();
        // _desc = _desc.trim();
        console.log("qiang,"+_title+","+_imgUrl+","+_desc);

        wx.showOptionMenu();
        wx.onMenuShareTimeline({
          title: _title, // 分享标题
          link: _link, // 分享链接
          imgUrl: _imgUrl, // 分享图标
          success: function() {
            Toast('分享成功');
          },
          cancel: function() {
            Toast('取消分享');
          }
        });

        wx.onMenuShareAppMessage({
          title: _title, // 分享标题
          desc: _desc, // 分享描述
          link: _link, // 分享链接
          imgUrl: _imgUrl, // 分享图标
          type: 'link', // 分享类型,music、video或link，不填默认为link
          dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
          success: function() {
            Toast('分享成功');
          },
          cancel: function() {
            Toast('取消分享');
          }
        });
      });
    },
  },

  components: {
    cTitle,
    cMent,
    cGoodsList,
    banner,
    showbanner,
    showsign,
    showmenu,
    showtitle,
    showsearch,
    showline,
    showblank,
    showrichtext,
    showpicture,
    showcube,
    showarea,
    showshop,
    showgoods,
    shownearbygoods,
    shownotice,
    showlocation,
    showstore,
    cMyswipe,
    Swipe,
    SwipeItem,
    showcoupon,
    showheadline,
    showarticle,
    showflashsale,
    showbusiness,
    showassemble,
    showvideo,
    showdiyform,
    showlivestreaming,
    newcomerAward,
    showtogetherpurchase,

    //新装修
    top_navigation,
    U_article: () => import('../../components/new_diy/article.vue'),
    U_backup: () => import('../../components/new_diy/backup.vue'),
    U_blank: () => import('../../components/new_diy/blank.vue'),
    U_button: () => import('../../components/new_diy/button.vue'),
    U_community: () => import('../../components/new_diy/community.vue'),
    U_coupons: () => import('../../components/new_diy/coupons.vue'),
    U_cube: () => import('../../components/new_diy/cube.vue'),
    U_form: () => import('../../components/new_diy/form.vue'),
    U_goods: () => import('../../components/new_diy/goods.vue'),
    U_goodsgroup: () => import('../../components/new_diy/goodsgroup.vue'),
    U_goodsnearby: () => import('../../components/new_diy/goodsnearby.vue'),
    U_goodsrush: () => import('../../components/new_diy/goodsrush.vue'),
    U_headline: () => import('../../components/new_diy/headline.vue'),
    U_homedata: () => import('../../components/new_diy/homedata.vue'),
    U_line: () => import('../../components/new_diy/line.vue'),
    U_livestreaming: () => import('../../components/new_diy/livestreaming.vue'),
    U_location: () => import('../../components/new_diy/location.vue'),
    U_lottery: () => import('../../components/new_diy/lottery.vue'),
    U_maps: () => import('../../components/new_diy/maps.vue'),
    U_notice: () => import('../../components/new_diy/notice.vue'),
    U_richtext: () => import('../../components/new_diy/richtext.vue'),
    U_search: () => import('../../components/new_diy/search.vue'),
    U_shopfor: () => import('../../components/new_diy/shopfor.vue'),
    U_shortvideo: () => import('../../components/new_diy/shortvideo.vue'),
    U_signin: () => import('../../components/new_diy/signin.vue'),
    U_simplegraph: () => import('../../components/new_diy/simplegraph.vue'),
    U_slideshow: () => import('../../components/new_diy/slideshow.vue'),
    U_stores: () => import('../../components/new_diy/stores.vue'),
    U_storesranking: () => import('../../components/new_diy/storesranking.vue'),
    U_suspendbutton: () => import('../../components/new_diy/suspendbutton.vue'),
    U_tabcontrol: () => import('../../components/new_diy/tabcontrol.vue'),
    U_title: () => import('../../components/new_diy/title.vue'),
    U_video: () => import('../../components/new_diy/video.vue'),
    U_stargroup: () => import('../../components/new_diy/stargroup.vue'),
    U_foot: () => import('../../components/new_diy/foot.vue'),
  }
};
