import cTitle from "components/title";
import { scrollMixin } from "../../../utils/mixin";
import { Toast } from 'vant';
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0, //总页数
      key:'',
      list:[]
    };
  },
  activated() {
    this.page = 1;
    this.getData();
    this.key = '';
  },
  mouted() {},
  methods: {
    goback(){
      this.$router.go(-1);
    },
    detail(id){
      console.log(id);
      this.$router.push(this.fun.getUrl("questions", { id: id ,tag : 'index'}));
    },
    onSearch(e){
      console.log(e,this.key);
      this.getData();
    },
    getData() {
      let that = this;
      $http
        .post("plugin.questionnaire.api.index.indexInfo", { page: that.page, index: "index", keyword: { title: that.key } }, "")
        .then(
          response => {
            if (response.result === 1) {
              that.list = response.data.index.list.data;
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
    }
  },
  components: {
    cTitle
  }
};
