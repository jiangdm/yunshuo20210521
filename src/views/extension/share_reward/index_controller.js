import { scrollMixin } from "../../../utils/mixin"; //引入加载更多
import { Toast } from "vant";

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      active: "award", //一级导航
      memberInfo: {}, //用户信息
      incomeCount: null, //累计金额
      awardList: [], //奖励记录列表

      //more
      isLoadMore: true,
      page: 1,
      total_page: 0
    };
  },

  activated() {
    this.initData(); // 初始化数据
    this.getData(); // 获取记录数据
  },

  methods: {
    // 初始化数据
    initData() {
      this.awardList = [];

      //more
      this.isLoadMore = true;
      this.page = 1;
      this.total_page = 0;
    },

    // 获取记录数据
    getData() {
      $http
        .get("plugin.member-share-reward.Frontend.controllers.records.index", {}, "")
        .then(
          response => {
            if (response.result === 1) {
              this.memberInfo = response.data.info;
              this.incomeCount = response.data.amount;
              this.awardList = response.data.list.data;
              this.total_page = response.data.list.last_page;
              if (!this.total_page) {
                this.total_page = 0;
              }
            } else {
              Toast(response.msg);
            }
          },
          response => {
            Toast(response);
          }
        )
        .catch(err => {
          console.error(err);
        });
    },

    //获取更多数据
    getMoreData() {
      const that = this;
      that.isLoadMore = false; // 防止多次请求分页数据
      if (that.page >= that.total_page) {
        return;
      } else {
        that.page += 1;
        $http
          .get("plugin.member-share-reward.Frontend.controllers.records.search", { page: that.page }, "加载中...")
          .then(res => {
            that.isLoadMore = true;
            if (res.result == 1) {
              var nextPageData = res.data.data;
              that.awardList = that.awardList.concat(nextPageData); //进行数组拼接
            } else {
              that.page = that.page - 1;
              that.isLoadMore = false;
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    }
  },
  components: {
  }
};
