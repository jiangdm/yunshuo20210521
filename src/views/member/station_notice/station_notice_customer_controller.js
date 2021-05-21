import { Toast } from "vant";
import zTitle from "./title.vue";
import { scrollMixin } from "../../../utils/mixin";
import dateParserTime from "./dateParserTime";

export default {
  mixins: [scrollMixin], //加载更多
  components: { zTitle },
  data() {
    return {
      active: 0,

      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0, //总页数

      listData: [],
      msg_body: {
        "title": "",
        "nickname": "会员昵称:",
        "pay_time": "付款时间:",
        "order_sn": "订单编号:",
        "goodsName": "商品名:",
        "pay_money": "订单金额:"
      },
      subTypeList: []
    };
  },
  activated() {
    this.active = 0;
    this.getSubType();

  },
  methods: {
    initData() {
      this.page = 1;
      this.isLoadMore = true;
      this.total_page = 0;
    },
    //获取二级菜单
    async getSubType() {
      Toast.loading({
        message: "加载中",
        forbidClick: true
      });
      let res = await $http.get("plugin.instation-message.api.message.get-sub-type", {
        type_id: 4
      });
      Toast.clear();
      if (res.result !== 1) {
        Toast(res.msg);
        return;
      }
      this.subTypeList = res.data;
      this.getListData();
      console.log(res.data);

    },
    async getListData() {
      this.initData();
      Toast.loading({
        message: "加载中",
        forbidClick: true
      });
      let res = await $http.get("plugin.instation-message.api.message.get-type-list", {
        type_id: 4,
        sub_type: this.subTypeList[this.active].sub_type
      });
      Toast.clear();

      if (res.result !== 1) {
        Toast(res.msg);
        return;
      }
      console.log(res);
      res.data.data.forEach(element => {
        element.created_at = dateParserTime(element.created_at);
      });

      this.isLoadMore = true;
      this.total_page = res.data.last_page;
      if (!this.total_page) {
        this.total_page = 0;
      }
      this.listData = res.data.data;

    },
    //加载更多数据
    getMoreData() {
      this.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        // that.loading = true;
        return;
      } else {
        this.page += 1;
        $http
          .get("plugin.instation-message.api.message.get-type-list", {
            page: this.page,
            type_id: 4,
            sub_type: this.subTypeList[this.active].sub_type
          })
          .then(res => {
            console.log(res);
            this.isLoadMore = true;
            if (res.result === 1) {
              var nextPageData = res.data.data;
              nextPageData.forEach(element => {
                element.created_at = dateParserTime(element.created_at);
              });
              this.listData = this.listData.concat(nextPageData);
              //this.status = res.data.status;
            } else {
              this.page = this.page - 1;
              this.isLoadMore = false;

            }
          });
      }
    },

    changeTags() {
      this.getListData();
    },
    goPages(url) {
      if (url == "") return;
      window.location = url;
    }


  }
};

