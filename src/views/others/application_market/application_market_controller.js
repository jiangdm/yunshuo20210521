import cTitle from "components/title";
import { scrollMixin } from "../../../utils/mixin"; //引入加载更多
// import { Toast } from 'vant';

export default {
  mixins: [scrollMixin],
  data() {
    return {
      PopupShow: false,
      url: 'plugin.product-market.api.order.index',

      domain: "",
      projectList: [],

      showList: [],

      // more
      allLoad: false,
      isLoadMore: true,
      page: 1,
      total_page: 0
    };
  },
  activated() {
    if(this.$route.name == 'marketSub') {
      this.url = 'plugin.market-sub.api.order.index';
    }
    this.getData();
  },
  methods: {
    toShow(good, item) {
      for(let i = 0;i<item.has_market_product.widget.length;i++) {
        if(good.goods_id === item.has_market_product.widget[i].goods_id) {
          this.showList = item.has_market_product.widget[i].widget.plugin;
        }
      }
      this.PopupShow = true;
    },
    init() {
      this.allLoad = false;
      this.page = 1;
      this.isLoadMore = true;
      this.total_page = 0;
      this.projectList = [];
    },
    getData() {
      this.init();
      $http
        .get(
          this.url,
          {
            page: this.page
          },
          "获取中"
        )
        .then(response => {
          if (response.result === 1) {
            this.domain = response.data.domain;
            this.isLoadMore = true;
            this.total_page = response.data.order.last_page;
            if (!this.total_page) {
              this.total_page = 0;
            }
            this.projectList = response.data.order.data;
          } else {
            this.$dialog.alert({message:response.msg});
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getMoreData() {
      const that = this;
      that.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        this.allLoad = true;
      } else {
        this.page = this.page + 1;
        $http
          .get(
            this.url,
            {
              page: this.page
            },
            "加载中"
          )
          .then((response) => {
            that.isLoadMore = true;
            if (response.result === 1) {
              var myData = response.data.order.data;
              that.projectList = that.projectList.concat(myData); //数组拼接
            } else {
              that.page = that.page - 1;
              that.isLoadMore = false;
            }
          },
          (response)=> {
            // error callback
          }
          );
      }
    }
  },
  components: { cTitle }
};
