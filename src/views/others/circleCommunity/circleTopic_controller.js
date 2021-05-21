import { Toast } from "vant";
import AMap from "AMap";
import { getSet } from "./libs/_request";
var mapListText = [];
// var self, listCount;
var listCount;
var num = [];
var canvas = document.createElement("canvas");
var context = canvas.getContext("2d");
export default {
  data() {
    return {
      /****/
      address_detail: null, // 详细地址
      listCount: listCount,
      listText: mapListText,
      center: { lng: 0, lat: 0 },
      num: num,
      address: "",
      city: "",
      point: "",
      /****/
      classificationshow: false,
      Locationshow: false,
      commodityTitle: "",
      addgoodslistshow: false,
      goodsdata: "",
      storeshow: false,
      storedata: "",
      protocolshow: false,
      photosize: 1024 * 1024 * 5, // 图片大小限制
      uploadUrl: this.fun.getRealUrl("upload.uploadPic", {}),
      catelist: [],
      catname: "",
      goodslistData: [],
      selectgoodsData: {},
      storelistData: [],
      selectstoreData: {},
      imgData: [],
      releasetitle: "", //标题
      releasecontents: "", //正文内容
      catid: "",
      releaseaddress: "", //选取地址
      releasecity: "",
      releaselat: "",
      releaselnt: "",
      goodsId: "", // 商品id
      storeId: "", // 商店
      checked: false,
      agreementcontent: "",
      checkedImg: false,

      goods_open: 0,
      store_open: 0,

      //more
      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0, //总页数
      allLoaded: true,
      //more
      pageStore: 1, //分页数，当前页数
      isLoadMoreStore: true, //判断是否要加载更多的标志
      total_pageStore: 0, //总页数Store
      allLoadedStore: true,

      postId: null,
      post: null,
      circleId: null,
      postReviewStatus: null,
      isSelectedGoods: false,
      isSelectedStore: false
    };
  },
  activated() {
    this.initData();
    let myLocation = this.$store.state.o2oLocation;
    if (myLocation.point) {
      this.address = myLocation.title;
      this.city = myLocation.city;
      this.point = myLocation.point;
      this.catname = "";
      this.releaseaddress = myLocation.title;
      this.releasecity = myLocation.city;
      this.releaselat = myLocation.point.lat;
      this.releaselnt = myLocation.point.lng;
      //初始化数据
    } else {
      this.getLocation();
    }
    this.getAgreement();
    if (this.fun.isWeiXin() && this.fun.getPhoneEnv() == "2" && localStorage.getItem("isWxLogin") == 1) {
      this.checkedImg = true;
    }
    if (this.$route.query.pid) {
      this.postId = Number(this.$route.query.pid);
      if (this.$route.query.hasOwnProperty("isReview")) {
        this.postReviewStatus = Number(this.$route.query.isReview);
      }
      this.getPost();
    }
    if (this.$route.query.id || this.$route.query.cid) {
      this.circleId = this.$route.query.id || this.$route.query.cid;
    }
  },
  computed: {
    catidshow: function() {
      return this.catid ? true : false;
    },
    releaseaddressshow() {
      return this.releaseaddress ? true : false;
    },
    goodsIdshow() {
      return this.goodsId ? true : false;
    },
    storeIdshow() {
      return this.storeId ? true : false;
    }
  },
  mounted() {
    this.ready();
    window.addEventListener("popstate", this.backChange, false);
  },
  beforeDestroy() {
    window.removeEventListener("popstate", this.backChange, false);
  },
  methods: {
    getPost() {
      $http
        .post("plugin.circle.frontend.circle-invitation.details", {
          invitation_id: this.postId,
          is_review: this.postReviewStatus
        })
        .then(({ data: post, result, msg }) => {
          if (result === 0) {
            Toast(msg);
            this.$router.go(-1);
            return;
          }
          this.post = post;
          if (post.goods && post.goods.length > 0) {
            this.selectgoodsData = post.goods[0];
            this.goodsId = post.goods[0]["id"];
          }
          if (post.store && post.store.length > 0) {
            this.storeId = post.store[0]["id"];
          }
          this.releasetitle = post.title;
          this.releasecontents = post.content;
          this.imgData = post.img || [];
          this.releaseaddress = post.address;
          this.releaselat = post.ylat;
          this.releaselnt = post.ylng;
          this.releasecity = post.city;
          this.circleId = post.circle_id;
          if (post.store && post.store.length > 0) {
            this.selectstoreData = post.store[0];
            this.storeIdshow = post.store[0]["id"];
          }
        });
    },
    goodsScroll() {
      let el = document.getElementById("scrollGoods");
      if (this.addgoodslistshow) {
        if (el.offsetHeight + el.scrollTop >= el.scrollHeight) {
          if (this.isLoadMore) {
            this.getMore();
          }
        }
      }
    },
    storeScroll() {
      let el = document.getElementById("scrollstore");
      if (this.storeshow) {
        if (el.offsetHeight + el.scrollTop >= el.scrollHeight) {
          if (this.isLoadMoreStore) {
            this.getMoreStore();
          }
        }
      }
    },
    backChange(e) {
      if (this.classificationshow || this.Locationshow || this.addgoodslistshow || this.storeshow || this.protocolshow) {
        this.classificationshow = false;
        this.Locationshow = false;
        this.addgoodslistshow = false;
        this.storeshow = false;
        this.protocolshow = false;
      } else {
        // this.$router.push(this.fun.getUrl("MicroHome"));
      }
    },
    initData() {
      this.catid = null;
      this.releasecontents = null;
      this.releaseaddress = null;
      this.imgData = [];
      this.releasetitle = null;
      this.goodsId = null;
      this.storeId = null;
      this.releasecity = null;
      this.releaselat = null;
      this.releaselnt = null;
      this.catname = "";
      this.classificationshow = false;
      this.Locationshow = false;
      this.addgoodslistshow = false;
      this.storeshow = false;
      this.protocolshow = false;
    },
    ready: function() {
      var th = this;
      var that = this;
      //输入提示
      var auto = new AMap.Autocomplete({
        input: "suggestId",
        city: that.city
      });
      AMap.event.addListener(auto, "select", select); //注册监听，当选中某条记录时会触发
      function select(e) {
        AMap.plugin("AMap.Geocoder", function() {
          var geocoder = new AMap.Geocoder({
            // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
            city: that.city
          });

          //var lnglat = [116.396574, 39.992706]
          geocoder.getAddress(e.poi.location, function(status, result) {
            let pos;
            if (status === "complete" && result.info === "OK") {
              // result为对应的地理位置详细信息
              var point = {
                lat: e.poi.location.lat,
                lng: e.poi.location.lng
              };
              if (result.regeocode.addressComponent.city == "") {
                pos = {
                  address: e.poi.address,
                  // city:result.regeocode.addressComponent.district,
                  city: result.regeocode.addressComponent.province,
                  title: e.poi.name,
                  point: point
                };
                if (Array.isArray(e.poi.address)) {
                  that.releaseaddress = result.regeocode.formattedAddress;
                } else {
                  that.releaseaddress = e.poi.address;
                }
                that.releasecity = result.regeocode.addressComponent.province;
                that.releaselat = e.poi.location.lat;
                that.releaselnt = e.poi.location.lng;
                that.Locationshow = false;
              } else {
                pos = {
                  address: e.poi.address,
                  city: result.regeocode.addressComponent.city,
                  title: e.poi.name,
                  point: point
                };
                if (Array.isArray(e.poi.address)) {
                  that.releaseaddress = result.regeocode.formattedAddress;
                } else {
                  that.releaseaddress = e.poi.address;
                }
                that.releasecity = result.regeocode.addressComponent.city;
                that.releaselat = e.poi.location.lat;
                that.releaselnt = e.poi.location.lng;
                that.Locationshow = false;
              }
              th.$store.commit("updateLocation", pos);
              th.$store.commit("setLocation", pos);
            } else {
              Toast("请输入更详细的地址");
            }
          });
        });
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
        // var res =
        "经纬度：" +
          obj.position +
          "\n精度范围：" +
          obj.accuracy +
          "米\n定位结果的来源：" +
          obj.location_type +
          "\n状态信息：" +
          obj.info +
          "\n地址：" +
          obj.formattedAddress +
          "\n地址信息：" +
          JSON.stringify(obj.addressComponent, null, 4);
        //alert(JSON.stringify(obj.addressComponent, null, 4));
        var position = obj.position.toString().split(",");
        that.point = {
          lat: position[1],
          lng: position[0]
        };
        that.address = obj.formattedAddress;
        that.title = obj.formattedAddress;
        that.city = !that.fun.isTextEmpty(obj.addressComponent.city) ? obj.addressComponent.city : obj.addressComponent.province;

        var pos = {
          address: obj.formattedAddress,
          city: that.city,
          title: obj.formattedAddress,
          point: that.point
        };
        that.releaseaddress = pos.title;
        that.releasecity = pos.city;
        that.releaselat = pos.point.lat;
        that.releaselnt = pos.point.lng;
        that.$store.commit("updateLocation", pos);
        that.$store.commit("setLocation", pos);
        window.localStorage.setItem("myLocation", JSON.stringify(pos));
      }

      function onError(obj) {
        console.log(obj);
      }
    },
    onClickLeft() {
      this.classificationshow = false;
    },
    onClickRight() {
      this.classificationshow = false;
    },
    onAddressLeft() {
      this.Locationshow = false;
    },
    onAddressRight() {
      this.Locationshow = false;
    },
    getReleaseAddress() {
      this.address_detail = "";
      this.Locationshow = true;
      window.history.pushState(null, null, document.URL);
    },
    onAddGoodsLeft() {
      this.addgoodslistshow = false;
      document.getElementById("scrollGoods").removeEventListener("scroll", this.goodsScroll);
    },
    onAddGoodsRight() {
      this.addgoodslistshow = false;
      document.getElementById("scrollGoods").removeEventListener("scroll", this.goodsScroll);
    },
    getGoodsMessage() {
      this.getGoodsMessageData();
      this.addgoodslistshow = true;
      this.page = 1;
      this.goodslistData = [];
      this.isLoadMore = false;
      setTimeout(() => {
        document.getElementById("scrollGoods").addEventListener("scroll", this.goodsScroll);
      }, 1000);
      window.history.pushState(null, null, document.URL);
    },
    onStoreLeft() {
      this.storeshow = false;
      document.getElementById("scrollGoods").removeEventListener("scroll", this.storeScroll);
    },
    onStoreRight() {
      this.storeshow = false;
      document.getElementById("scrollGoods").removeEventListener("scroll", this.storeScroll);
    },
    getStoreMessage() {
      this.getStoreMessageData();
      this.storeshow = true;
      this.pageStore = 1;
      this.storelistData = [];
      this.isLoadMoreStore = false;
      setTimeout(() => {
        document.getElementById("scrollstore").addEventListener("scroll", this.storeScroll);
      }, 1000);
      window.history.pushState(null, null, document.URL);
    },
    openProtocol() {
      this.protocolshow = true;
      window.history.pushState(null, null, document.URL);
    },
    protocolLeft() {
      this.protocolshow = false;
    },
    /*vant图片上传*/
    onRead(e) {
      let fd = new FormData();
      fd.append("file", e.file); // 第一个参数字符串可以填任意命名，第二个根据对象属性来找到file
      // var That = this;
      axios
        .post(this.uploadUrl, fd, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then(response => {
          var responseData = response.data;
          if (responseData.result === 1) {
            // let imageUrl = URL.createObjectURL(e.file);
            let imageUrl1 = responseData.data.img_url;
            this.imgData.push(imageUrl1);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    onPhotoSize(e) {
      if (e && e.length) {
        for (let i = 0; i < e.length; i++) {
          if (e[i].file.size > this.photosize) {
            this.imgPreview(e[i].file, 2);
          } else {
            this.onRead_1(e[i].file, true);
          }
        }
      } else {
        console.log("图片超出大小", e);
        this.imgPreview(e.file, 2);
      }
    },
    imgPreview(file, callback) {
      let self = this;
      // 判断支不支持FileReader
      if (!file || !window.FileReader) return;
      if (/^image/.test(file.type)) {
        // 创建一个reader
        let reader = new FileReader();
        // 将图片转成base64格式
        reader.readAsDataURL(file);
        // 读取成功后的回调
        reader.onloadend = function() {
          let result = this.result;
          let img = new Image();
          img.src = result;
          img.onload = function() {
            // 图片原始尺寸
            var originWidth = this.width;
            var originHeight = this.height;
            // 最大尺寸限制
            var maxWidth = 400,
              maxHeight = 400;
            // 目标尺寸
            var targetWidth = originWidth,
              targetHeight = originHeight;
            // 图片尺寸超过400x400的限制
            if (originWidth > maxWidth || originHeight > maxHeight) {
              if (originWidth / originHeight > maxWidth / maxHeight) {
                // 更宽，按照宽度限定尺寸
                targetWidth = maxWidth;
                targetHeight = Math.round(maxWidth * (originHeight / originWidth));
              } else {
                targetHeight = maxHeight;
                targetWidth = Math.round(maxHeight * (originWidth / originHeight));
              }
            }

            // canvas对图片进行缩放
            canvas.width = targetWidth;
            canvas.height = targetHeight;
            // 清除画布
            context.clearRect(0, 0, targetWidth, targetHeight);
            // 图片压缩
            context.drawImage(img, 0, 0, targetWidth, targetHeight);
            // canvas转为blob并上传
            canvas.toBlob(function(blob) {
              // 图片ajax上传
              if (callback === 1) {
                self.onRead(blob, true);
              } else {
                // self.onRead_1(blob, true)
                self.multipleMethod_1(blob, true);
              }
            }, file.type || "image/png");
          };
        };
      }
    },
    // 判断多图上传，循环onRead_1方法
    multipleMethod_1(e, flag) {
      let _data = e;
      if (_data && _data.length) {
        for (let i = 0; i < _data.length; i++) {
          this.onRead_1(_data[i], flag);
        }
      } else {
        this.onRead_1(_data, flag);
      }
    },
    // vant 多图片上传
    onRead_1(e, flag) {
      var That = this;
      Toast.loading({
        message: "上传中",
        forbidClick: true
      });
      let fd = new FormData();
      if (this.checkedImg) {
        fd.append("file", That.dataURItoBlob(e));
      } else {
        if (flag === true) {
          fd.append("file", e);
        } else {
          fd.append("file", e.file); // 第一个参数字符串可以填任意命名，第二个根据对象属性来找到file
        }
      }
      axios
        .post(this.uploadUrl, fd, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then(response => {
          var responseData = response.data;
          if (responseData.result === 1) {
            Toast.clear();
            That.imgData.push(responseData.data.img_url);
          } else {
            Toast.clear();
            Toast(responseData.msg);
          }
        })
        .catch(error => {
          Toast.clear();
          console.log(error);
        });
    },
    chooseImage() {
      let that = this;
      wx.chooseImage({
        count: 9, // 默认9
        sizeType: ["original", "compressed"], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有
        success: function(req) {
          var localIds = req.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
          for (let j = 0; j < localIds.length; j++) {
            wx.getLocalImgData({
              localId: req.localIds[j].toString(),
              success: function(res) {
                const localData = res.localData;
                let imageBase64 = "";
                if (localData.indexOf("data:image") == 0) {
                  //苹果的直接赋值，默认生成'data:image/jpeg;base64,'的头部拼接
                  imageBase64 = localData;
                } else {
                  //此处是安卓中的唯一得坑！在拼接前需要对localData进行换行符的全局替换,M~M~P~~~
                  //此时一个正常的base64图片路径就完美生成赋值到img的src中了
                  imageBase64 = "data:image/jpeg;base64," + localData.replace(/\n/g, "");
                }
                that.onRead_1(imageBase64);
              },
              fail(res) {
                console.log("getLocalImgData::error");
                alert("getLocalImgData::error", res);
              }
            });
          }
        },
        fail() {
          console.log("chooseImage::error");
          alert("chooseImage::error", res);
        }
      });
    },
    dataURItoBlob(dataURI) {
      // 图片转成Buffer---------------------------------
      let byteString = atob(dataURI.split(",")[1]);
      let mimeString = dataURI
        .split(",")[0]
        .split(":")[1]
        .split(";")[0];
      let ab = new ArrayBuffer(byteString.length);
      let ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      return new Blob([ab], { type: mimeString });
    },
    selectCateId(id, name) {
      this.catid = id;
      this.catname = name;
      this.classificationshow = false;
    },
    getGoodsMessageData() {
      let that = this;
      let json = {};
      json.goods_name = this.goodsdata;
      $http.get("plugin.circle.frontend.circle-invitation.search-goods", json).then(
        function(response) {
          if (response.result == 1) {
            that.isLoadMore = true;
            that.allLoaded = false;
            that.total_page = response.data.last_page;
            if (!that.total_page) {
              that.total_page = 0;
            }
            that.goodslistData = response.data.data;
          } else {
            Toast(response.msg);
          }
        },
        function(response) {
          // error callback
        }
      );
    },
    searchGoodBtn() {
      this.getGoodsMessageData();
    },
    setGoodsId(id) {
      this.goodsId = id;
      let selectgoodsData = {};
      for (let i = 0; i < this.goodslistData.length; i++) {
        if (this.goodsId == this.goodslistData[i].id) {
          selectgoodsData.id = this.goodslistData[i].id;
          selectgoodsData.title = this.goodslistData[i].title;
          selectgoodsData.thumb = this.goodslistData[i].thumb;
          selectgoodsData.price = this.goodslistData[i].price;
          selectgoodsData.market_price = this.goodslistData[i].market_price;
          selectgoodsData.show_sales = this.goodslistData[i].show_sales;
          break;
        }
      }
      this.selectgoodsData = selectgoodsData;
      this.addgoodslistshow = false;
    },
    getStoreMessageData() {
      let that = this;
      let json = {};
      json.store_name = this.storedata;
      $http.get("plugin.circle.frontend.circle-invitation.search-store", json).then(
        function(response) {
          if (response.result == 1) {
            that.isLoadMoreStore = true;
            that.allLoadedStore = false;
            that.total_pageStore = response.data.last_page;
            if (!that.total_pageStore) {
              that.total_pageStore = 0;
            }
            that.storelistData = response.data.data;
          } else {
            Toast(response.msg);
          }
        },
        function(response) {
          // error callback
        }
      );
    },
    searchStoreBtn() {
      this.getStoreMessageData();
    },
    setStoreId(id) {
      this.storeId = id;
      let selectstoreData = {};
      for (let i = 0; i < this.storelistData.length; i++) {
        if (this.storeId == this.storelistData[i].id) {
          selectstoreData.id = this.storelistData[i].id;
          selectstoreData.thumb = this.storelistData[i].thumb;
          selectstoreData.store_name = this.storelistData[i].store_name;
          selectstoreData.address = this.storelistData[i].address;
          break;
        }
      }
      this.selectstoreData = selectstoreData;
      this.storeshow = false;
    },
    async getAgreement() {
      let sets = await getSet();
      this.isSelectedGoods = sets["good_show"];
      this.isSelectedStore = sets["store_show"];
      this.agreementcontent = sets["user_control"];
    },
    submitBtn() {
      // let that = this;
      if (this.imgData.length == 0) {
        Toast("请上传图片");
        return;
      }
      if (!this.releasetitle) {
        Toast("请填写标题");
        return;
      }
      if (!this.releasecontents) {
        Toast("请添加正文");
        return;
      }
      if (!this.releaseaddress) {
        Toast("请选择地点");
        return;
      }
      // if (!this.goodsId) {
      //   Toast("请添加商品");
      //   return;
      // }
      // if (!this.storeId) {
      //   Toast("请添加门店");
      //   return;
      // }
      if (!this.checked) {
        Toast("请勾选用户协议");
        return;
      }
      let dataJson = {};
      let p = this.fun.bd_encrypt(this.releaselnt, this.releaselat);
      if (this.$route.query.id || this.$route.query.pid) {
        dataJson.invitation_id = this.postId;
      }
      dataJson.circle_id = this.circleId;
      dataJson.invitation_status = 1; //帖子或视频
      dataJson.content = this.releasecontents; //内容
      dataJson.address = this.releaseaddress; //地址
      dataJson.img = this.imgData; //图片
      dataJson.title = this.releasetitle; //帖子标题
      dataJson.goods_id = this.goodsId; //关联商品id
      dataJson.store = this.storeId; // 关联商店id
      dataJson.city = this.releasecity; // 城市
      dataJson.latitude = p.lat; // 转换后的维度
      dataJson.longitude = p.lng; // 转换后的经度
      dataJson.ylat = this.releaselat; // 未转换的维度
      dataJson.ylng = this.releaselnt; // 为转换的经度
      $http.post("plugin.circle.frontend.circle-invitation.release", dataJson, "").then(response => {
        if (response.result == 1) {
          Toast(response.msg);
          this.$router.push(
            this.fun.getUrl(
              "circleDetails",
              {},
              {
                id: this.circleId
              }
            )
          );
        } else {
          Toast(response.msg);
        }
      });
    },
    //下拉刷新
    loadTop() {
      this.page = 1;
      this.goodslistData = [];
      this.isLoadMore = true;
      this.total_page = 0;
      this.getGoodsMessageData();
      this.$refs.loadmore.onTopLoaded();
    },
    //获取更多数据，加载更多
    loadBottom() {
      this.getMore();
      this.$refs.loadmore.onBottomLoaded();
    },
    getMore() {
      this.isLoadMore = false; // 防止多次请求分页数据
      this.allLoaded = true;
      const that = this;
      if (that.page >= that.total_page) {
        that.allLoaded = true; // 若数据已全部获取完毕
        return;
      } else {
        that.page += 1;
        $http
          .get("plugin.circle.frontend.circle-invitation.search-goods", { page: that.page, goods_name: that.goodsdata }, "加载中...")
          .then(res => {
            that.isLoadMore = true;
            that.allLoaded = false;
            if (res.result == 1) {
              var nextPageData = res.data.data;
              that.goodslistData = that.goodslistData.concat(nextPageData); //进行数组拼接
            } else {
              that.page = that.page - 1;
              that.isLoadMore = false;
              return;
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    },

    //下拉刷新
    loadTopStore() {
      this.storelistData = [];
      this.isLoadMoreStore = true;
      this.total_pageStore = 0;
      this.pageStore = 1;
      this.getStoreMessageData();
      this.$refs.loadmoreStore.onTopLoaded();
    },
    //获取更多数据，加载更多
    loadBottomStore() {
      this.getMoreStore();
      this.$refs.loadmoreStore.onBottomLoaded();
    },
    getMoreStore() {
      this.isLoadMoreStore = false; // 防止多次请求分页数据
      this.allLoadedStore = true;
      const that = this;
      if (that.pageStore >= that.total_pageStore) {
        that.allLoadedStore = true; // 若数据已全部获取完毕
        return;
      } else {
        that.pageStore += 1;
        $http
          .get("plugin.circle.frontend.circle-invitation.search-store", { page: that.pageStore, store_name: that.storedata }, "加载中...")
          .then(res => {
            that.isLoadMoreStore = true;
            that.allLoadedStore = false;
            if (res.result == 1) {
              var nextPageData = res.data.data;
              that.storelistData = that.storelistData.concat(nextPageData); //进行数组拼接
            } else {
              that.pageStore = that.pageStore - 1;
              that.isLoadMoreStore = false;
              return;
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    removeImg: function(delIndex) {
      this.imgData.splice(delIndex, 1);
    }
  },
  components: {}
};
