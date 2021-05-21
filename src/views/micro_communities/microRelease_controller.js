import { Toast } from "vant";
import cTitle from "components/title";
import yzAddressList from "components/ui_components/yz_addressList/index";
import yzSpecs from "components/ui_components/yz_specs";
//import BMap from 'BMap';
import AMap from "AMap";
// import {Loading, Toast} from 'element-ui';
var mapListText = [];
//  var geolocation, markers, marker
// var map, placeSearch, self, placeSearchOptions, listCount, marker;
//  var poisArrr
var num = [];
// var poisArrCopy = [];
// var numIndex = 0;
var canvas = document.createElement("canvas");
var context = canvas.getContext("2d");
export default {
  data() {
    return {
      /****/
      address_detail: null, // 详细地址
      listCount: "",
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
      releasetitle: "",
      releasecontents: "",
      catid: "",
      releaseaddress: "",
      releasecity: "",
      releaselat: "",
      releaselnt: "",
      goodsId: "",
      storeId: "",
      checked: true,
      agreementcontent: "",
      checkedImg: false,

      goods_open: 0,
      store_open: 0,
      wish_open: 0, //1开启
      checkedWish: false, //开启心愿

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
      isLoading: false,

      showAddress: false, //快递地址
      goodAddress: {},
      popupSpecs: false, //商品规格弹窗
      optionId: 0
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
  },
  deactivated() {
    // 重置data数据 !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    Object.assign(this.$data, this.$options.data());
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
        console.log("e:", e);
        AMap.plugin("AMap.Geocoder", function() {
          var geocoder = new AMap.Geocoder({
            // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
            city: that.city
          });

          //var lnglat = [116.396574, 39.992706]
          geocoder.getAddress(e.poi.location, function(status, result) {
            console.log(result);
            if (status === "complete" && result.info === "OK") {
              // result为对应的地理位置详细信息
              var point = {
                lat: e.poi.location.lat,
                lng: e.poi.location.lng
              };
              var pos = {};
              console.log("write9999999", result);
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
        console.log("test pos", pos);
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
    getClassification() {
      this.classificationshow = true;
      this.getClassificationData();
      window.history.pushState(null, null, document.URL);
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
      console.log("图片超出大小", e);
      if (e && e.length) {
        for (let i = 0; i < e.length; i++) {
          if (e[i].file.size > this.photosize) {
            console.log("图片超出大小", e[i]);
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
    getClassificationData() {
      let that = this;
      let json = {};
      if (this.commodityTitle) {
        json.cName = this.commodityTitle;
      }
      $http.get("plugin.micro-communities.api.index.getCate", json).then(
        function(response) {
          if (response.result == 1) {
            that.catelist = response.data.data;
          } else {
            Toast(response.msg);
          }
        },
        function(response) {
          // error callback
        }
      );
    },
    selectCateId(id, name) {
      this.catid = id;
      this.catname = name;
      this.classificationshow = false;
    },
    selectCateTwoId(id, name, names) {
      this.catid = id;
      this.catname = name + "/" + names;
      this.classificationshow = false;
    },
    searchBtn() {
      this.getClassificationData();
    },
    getGoodsMessageData() {
      let that = this;
      let json = {};
      json.goods_name = this.goodsdata;
      $http.get("plugin.micro-communities.api.trick.getWishGoods", json).then(
        function(response) {
          if (response.result == 1) {
            that.isLoadMore = true;
            that.allLoaded = false;
            that.total_page = response.data.last_page;
            if (!that.total_page) {
              that.total_page = 0;
            }
            that.goodslistData = response.data.data;
            that.isLoading = false;
          } else {
            that.isLoading = false;
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
          selectgoodsData.has_option = this.goodslistData[i].has_option;
          selectgoodsData.has_many_options = this.goodslistData[i].has_many_options;
          selectgoodsData.has_many_params = this.goodslistData[i].has_many_params;
          selectgoodsData.has_many_specs = this.goodslistData[i].has_many_specs;
          selectgoodsData.plugin_id = this.goodslistData[i].plugin_id; //plugin_id:32为门店商品
          selectgoodsData.store_id = this.goodslistData[i].store_id;
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
      $http.get("plugin.micro-communities.api.trick.getStore", json).then(
        function(response) {
          if (response.result == 1) {
            that.isLoadMoreStore = true;
            that.allLoadedStore = false;
            that.total_pageStore = response.data.last_page;
            if (!that.total_pageStore) {
              that.total_pageStore = 0;
            }
            that.storelistData = response.data.data;
            that.isLoading = false;
          } else {
            that.isLoading = false;
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
    getAgreement() {
      let that = this;
      $http.get("plugin.micro-communities.api.trick.getAgreement").then(
        function(response) {
          if (response.result == 1) {
            console.log(response.data);
            that.agreementcontent = response.data.res.value;
            that.goods_open = response.data.goods_open;
            that.store_open = response.data.store_open;
            that.wish_open = Number(response.data.wish_open);
            console.log(that.goods_open, that.store_open);
          }
        },
        function(response) {
          // error callback
        }
      );
    },
    submitBtn() {
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
      if (!this.catid) {
        Toast("请选择分类");
        return;
      }
      if (!this.releaseaddress) {
        Toast("请选择地点");
        return;
      }
      if (this.goods_open == 0 && this.wish_open && this.checkedWish && this.selectgoodsData.has_option == 1 && this.optionId == 0) {
        Toast("请商品规格");
        return;
      }
      if (this.wish_open && this.checkedWish && this.goodAddress.username == "") {
        Toast("请选择收货地址");
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
      if (this.wish_open && this.checkedWish) {
        //开启心愿商品
        //若心愿商品为门店商品，则需要传该商品所属的门店id,走门店创建订单接口
        let assembleGoods = [
          {
            goods_id: this.selectgoodsData.id,
            total: 1,
            option_id: this.optionId
          }
        ];
        let json = {
          //公共数据
          address: JSON.stringify(this.goodAddress),
          goods: JSON.stringify(assembleGoods),
          member_coupon_ids: JSON.stringify([]),
          orders: JSON.stringify([]),
          // 发票
          invoice_type: 0,
          rise_type: 1,
          call: "",
          email: "",
          company_number: "",
          dispatch_type_id: 1 //固定配送方式 ，1：快递
        };
        let _url = "order.create";
        if (this.selectgoodsData.plugin_id == 32) {
          if (this.selectgoodsData.store_id == 0) {
            Toast("数据获取失败，请刷新后重新选择商品！");
            return;
          }
          json.store_id = this.selectgoodsData.store_id;
          json.cart_ids = [];
          _url = "plugin.store-cashier.frontend.store.create";
        }

        $http.post(_url, json, "").then(response => {
          if (response.result == 1) {
            this.publishFun(response.data.order_ids);
          } else {
            Toast(response.msg);
          }
        });
      } else {
        this.publishFun();
      }
    },
    publishFun(order_ids) {
      let dataJson = {};
      let p = this.fun.bd_encrypt(this.releaselnt, this.releaselat);
      dataJson.cat_id = this.catid;
      dataJson.contents = this.releasecontents;
      dataJson.address = this.releaseaddress;
      dataJson.images = this.imgData;
      dataJson.title = this.releasetitle;
      dataJson.goods_id = this.goodsId;
      dataJson.store_id = this.storeId;
      dataJson.city = this.releasecity;
      dataJson.lat = p.lat;
      dataJson.lng = p.lng;
      dataJson.ylat = this.releaselat;
      dataJson.ylng = this.releaselnt;

      if (order_ids) {
        dataJson.order_id = order_ids;
        dataJson.order_address = JSON.stringify(this.goodAddress);
        dataJson.wish_goods_id = this.goodsId;
      }
      $http.post("plugin.micro-communities.api.trick.publish", dataJson, "").then(response => {
        if (response.result == 1) {
          Toast(response.msg);
          this.$router.push(this.fun.getUrl("MicroHome"));
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
      // this.$refs.loadmore.onTopLoaded();
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
          .get("plugin.micro-communities.api.trick.getWishGoods", { page: that.page, goods_name: that.goodsdata }, "加载中...")
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
      // this.$refs.loadmoreStore.onTopLoaded();
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
          .get("plugin.micro-communities.api.trick.getStore", { page: that.pageStore, store_name: that.storedata }, "加载中...")
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
    },
    confirmSelectAddress(item) {
      this.goodAddress = item;
      this.showAddress = false;
    },
    close_yz_specs_popup(_optionsId, goodsCount, clicktype, id) {
      console.log("规格弹窗关闭了=====", _optionsId, goodsCount, clicktype, id);
      this.popupSpecs = false;
      if (clicktype == 1) {
        //点击确认按钮
        this.optionId = _optionsId;
      }
    }
  },
  components: {
    cTitle,
    yzAddressList,
    yzSpecs
  }
};
