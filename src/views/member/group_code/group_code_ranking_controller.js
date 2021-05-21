/**
 * Created by win 10 on 2020/7/21.
 */
import { Toast } from 'vant';
import zTitle from "./title";
import cAdd from "./components_add.vue";
import cListItem from "./components_list_item.vue";
import { scrollMixin } from "../../../utils/mixin";
export default {
  mixins: [scrollMixin], //加载更多
  components: { zTitle,cAdd,cListItem },
  data(){
    return {
      rankingList:[],
      listData:[],
      shop_log:'',

      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0, //总页数
    };
  },
  activated(){
    this.initData();
    this.getIndexData();
  },
  mounted(){


  },
  methods:{
    initData(){
      this.page = 1;
      this.isLoadMore=true;
      this.total_page=0;
    },
    async getIndexData(){
      Toast.loading({
        message: '加载中',
        forbidClick: true,
      });
      let res = await $http.get("plugin.group-code.api.group-code.ranking-list");
        
      Toast.clear();
        
      if(res.result !==1){
        Toast( res.msg);
        return;
      }
        
      this.rankingList = res.data.rankingList;
      this.listData = res.data.list.data;
      this.shop_log=res.data.shop_log;
        
      this.isLoadMore = true;
      this.total_page = res.data.list.last_page;
      if (!this.total_page) {
        this.total_page = 0;
      }
        
    },
    //加载更多数据
    getMoreData(){
      this.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        // that.loading = true;
        return;
      } else {
        this.page += 1;
        $http
          .get("plugin.group-code.api.group-code.ranking-list",{
            page:this.page
          })
          .then(res => {
            console.log(res);
            this.isLoadMore = true;
            if (res.result === 1) {
              var nextPageData = res.data.list.data;

              this.listData = this.listData.concat(nextPageData);
              //this.status = res.data.status;
            } else {
              this.page = this.page - 1;
              this.isLoadMore = false;
              console.log(res.msg);
            }
          });
      }
    },
    gotoGroupCodeLabel(item){
      this.$router.push(
        this.fun.getUrl("groupCodeLabel",{},{groupCodeId:item.id})
      );
    }
  }
};
