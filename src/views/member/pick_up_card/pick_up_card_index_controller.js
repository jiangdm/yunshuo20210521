import cTitle from "components/title";
import { Toast } from "vant";

export default {
  data() {
    return {
      applyModel: {
        password: "",
        realname: "",
        mobile: "",
        provinceId: "",
        cityId: "",
        districtId: "",
        streetId: "",
        address: ""
        // is_filter: "",
      },
      addressShow: false,
      streetShow: false,
      addressName: "",
      area: district,
      province: "",
      city: "",
      street: "",
      strShow: false,
      district: "",
      goods_id: "", // 商品id
      price: "",
      introductionShow: false,
      instroductionSelect: false,

      introduction: {}
    };
  },
  activated() {
    this.init();
    this.getConfig();
  },
  watch: {},
  methods: {
    init() {
      this.goods_id = "";
      this.price = "";
      this.addressShow = false;
      this.streetShow = false;
      this.strShow = false;
      this.introductionShow = false;
      this.addressName = "";
      this.province = "";
      this.city = "";
      this.street = "";
      this.district = "";
      this.applyModel = {
        password: "",
        realname: "",
        mobile: "",
        provinceId: "",
        cityId: "",
        districtId: "",
        streetId: "",
        address: ""
        // is_filter: "",
      };
    },
    onSubmit(values) {
      console.log("submit", values);
    },

    addressCallback(obj) {
      this.addressName = obj.itemName1 + " " + obj.itemName2 + " " + obj.itemName3;
      this.province = obj.itemName1;
      this.city = obj.itemName2;
      this.district = obj.itemName3;

      console.log(obj.itemValue1, obj.itemValue2, obj.itemValue3);

      this.applyModel.provinceId = obj.itemValue1;

      this.applyModel.cityId = obj.itemValue2;

      this.applyModel.districtId = obj.itemValue3;

      this.getStreet(obj.itemValue3);
    },

    streetConfirm(item) {
      this.street = item.areaname;
      this.applyModel.streetId = item.id;
      this.streetShow = false;
    },

    getStreet(param) {
      $http
        .get("member.memberAddress.street", { district_id: param })
        .then(response => {
          if (response.result === 1) {
            if (!this.fun.isTextEmpty(response.data) && response.data.length > 0) {
              this.districtVal = response.data;
              this.strShow = true;
            } else {
              this.strShow = false;
            }
          } else {
            this.strShow = false;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    showIntroduction() {
      this.introductionShow = true;
    },

    getConfig() {
      $http.get("plugin.picking-card.frontend.pickingCard.getConfig", {}, "加载中...").then(response => {
        if (response.result === 1) {
          this.introduction = response.data;
        } else {
          console.log(response.msg);
        }
      });
    },

    getPrice() {
      if (this.applyModel.password.length < 4) {
        return;
      }
      $http.get("plugin.picking-card.frontend.pickingCard.getPrice", { password: this.applyModel.password }, "...").then(response => {
        if (response.result === 1) {
          this.goods_id = response.data.goods_id;
          this.price = response.data.margin;
        } else {
          this.goods_id = "";
          this.price = "";
          console.log(response.msg);
        }
      });
    },

    setApplyData() {
      if (this.fun.isTextEmpty(this.applyModel.password)) {
        Toast("请填写提货密码");
        return;
      }

      if (this.fun.isTextEmpty(this.applyModel.realname)) {
        Toast("请填写真实姓名");
        return;
      }

      if (this.fun.isTextEmpty(this.applyModel.mobile)) {
        Toast("请填写手机号码");
        return;
      }

      if (this.fun.isMoblie(this.applyModel.mobile)) {
        Toast("请输入正确的手机号");
        return;
      }

      if (this.fun.isTextEmpty(this.applyModel.provinceId) || this.fun.isTextEmpty(this.applyModel.cityId) || this.fun.isTextEmpty(this.applyModel.districtId)) {
        Toast("请选择省市区");
        return;
      }

      if (this.fun.isTextEmpty(this.applyModel.streetId) || this.applyModel.streetId === 0) {
        Toast("请选择街道地址");
        return;
      }

      if (this.fun.isTextEmpty(this.applyModel.address)) {
        Toast("请填写详细地址");
        return;
      }

      // if (!this.applyModel.is_filter) {
      //   Toast("请勾选是否使用安装承诺金兑换滤芯");
      //   return;
      // }

      if (!this.instroductionSelect) {
        Toast("请勾选提货说明");
        return;
      }

      if (this.fun.isTextEmpty(this.goods_id)) {
        Toast("提货密码错误");
        return;
      }

      let address = {
        username: this.applyModel.realname,
        mobile: this.applyModel.mobile,
        province: this.province,
        city: this.city,
        district: this.district,
        street: this.street,
        address: this.applyModel.address
      };

      let json = {
        dispatch_type_id: 1,
        address: JSON.stringify(address),
        goods: `[{"goods_id": ${this.goods_id},"total": 1, "option_id": 0}]`,
        price: this.price,
        // is_filter: this.applyModel.is_filter,
        password: this.applyModel.password
      };
      $http.post("plugin.picking-card.frontend.create.index", json, "提交中").then(
        response => {
          if (response.result === 1) {
            this.$router.push(this.fun.getUrl("orderpay", { status: 2, order_ids: response.data.order_ids }));
          } else {
            Toast(response.msg);
          }
        },
        function(response) {
          console.log(response);
        }
      );
    }
  },
  components: {
    cTitle
  }
};
