<template>
  <div>
    <c-title :hide="false" :text="'员工列表'">
    </c-title>
    <div style="height: 40px;"></div>
    <div class="content">
      <div class="member-box" v-for="person in recordsList" :key="person.id">
        <div class="left">
          <p class="head"><span class="name">{{person.name}}</span>
            <span class="tag" :class="[person.role_id == 1?'yellow':'']">{{person.role_id == 1?"法定":"员工"}}</span>
          </p>
          <p class="mobile">{{person.has_one_member.mobile}}</p>
        </div>
        <div class="right" v-if="person.role_id != 1" @click="delRow(person.id)">
          删除
        </div>
      </div>
      <div style="height: 3.5rem;"></div>
    </div>
    <div class="btn" :class="[fun.getPhoneEnv() == 3 ? 'pcStyle' : '']">
      <p class="sure" @click="toAdd">添加员工</p>
    </div>

    <div class="fixed-box" v-if="showBox">
      <router-link class="fixed-item" :to="fun.getUrl('home')">
        <i class="iconfont icon-zhuye2" style="font-size: 28px;"></i>
        <span>首页</span>
      </router-link>
      <router-link class="fixed-item" :to="fun.getUrl('signIndex')">
        <i class="iconfont icon-yq_hetongzhongxin" style="padding: 4px;"></i>
        <span>合同中心</span>
      </router-link>
      <div class="triangle"></div>
    </div>
    <div class="fixed-img" @click="showBox = !showBox">
      <img src="../../../assets/images/sign/yht_exprot@2x.png" alt="">
    </div>
  </div>
</template>

<script>
import cTitle from "components/title";
import { Toast } from 'vant';
import { scrollMixin } from "utils/mixin";

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      showBox: false,
      recordsList: [],
      //more
      isLoadMore: true,
      page: 1,
      total_page: 0
    };
  },
  activated() {
    this.showBox = false;
    this.getData();
  },
  methods: {
    delRow(id) {
      this.$dialog.confirm({ message: "确定删除吗?"})
        .then(() => {
          $http
            .get("plugin.yun-sign.frontend.h5.worker.del-worker", { id: id }, "正在")
            .then(response => {
              if (response.result === 1) {
                this.recordsList = [];
                this.getData();
                Toast('删除成功!');
              } else {
                Toast('删除失败!');
              }
            })
            .catch(err => {
              console.error(err);
            });
        }).catch(() => {});
    },
    toAdd() {
      this.$router.push(this.fun.getUrl("addStaff"));
    },
    getData() {
      this.page = 1;
      $http
        .get(
          "plugin.yun-sign.frontend.h5.worker.get-list",
          { page: 1 },
          "加载中"
        )
        .then(response => {
          if (response.result === 1) {
            this.dataInfo = response.data;
            this.isLoadMore = true;
            this.total_page = response.data.last_page;
            if (!this.total_page) {
              this.total_page = 0;
            }
            this.recordsList = response.data.data;
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //获取更多数据
    getMoreData() {
      const that = this;
      that.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        $http
          .get(
            "plugin.yun-sign.frontend.h5.worker.get-list",
            { page: that.page },
            "加载中"
          )
          .then(
            function(response) {
              that.isLoadMore = true;
              if (response.result === 1) {
                var myData = response.data.data;
                that.recordsList = that.recordsList.concat(myData); //数组拼接
              } else {
                that.page = that.page - 1;
                that.isLoadMore = false;
              }
            },
            function(response) {
              // error callback
            }
          );
      }
    }
  },
  components: { cTitle }
};

</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .content {
    background: #fff;
    height: 100vh;
  }

  .member-box {
    background: #fff;
    text-align: left;
    padding: 1rem;
    display: flex;
    border-bottom: 1px solid #eee;

    .left {
      flex: 1;
    }

    .head {
      display: flex;
    }

    .name {
      font-weight: bold;
    }

    .tag {
      font-size: 12px;
      border-radius: 15px;
      background-color: #267df3;
      color: #fff;
      padding: 0.1rem 0.4rem;
      margin-left: 0.5rem;
    }

    .mobile {
      margin-top: 0.5rem;
    }

    .right {
      flex: 0 0 3rem;
      text-align: right;
      align-self: center;
      color: #267df3;
    }

    .yellow {
      background-color: #ffb600;
    }
  }

  .btn {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background: #fff;

    .sure {
      font-size: 18px;
      line-height: 2.25rem;
      width: 80%;
      margin: 10px auto;
      height: 2.25rem;
      background-image: linear-gradient(0deg, #377aff 0%, #679aff 100%);
      border-radius: 20px;
      color: #fff;
    }
  }

  .pcStyle {
    width: 375px;
    left: 50%;
    transform: translateX(-50%);
  }

  .fixed-img {
    position: fixed;
    bottom: 8rem;
    right: 2%;

    img {
      width: 3rem;
      height: 3rem;
    }
  }

  .fixed-box {
    background: #fff;
    position: fixed;
    bottom: 12rem;
    right: 2%;
    color: #518bff;
    width: 4rem;
    border-radius: 5px;
    padding: 2px;
    box-shadow: 0 0.25rem 0.5625rem 0.0625rem rgba(0, 0, 0, 0.06);

    .triangle {
      position: fixed;
      bottom: 11.1rem;
      right: 8%;
      width: 0;
      height: 0;
      border: 8px solid transparent;
      border-top-color: #fff;
    }

    .fixed-item {
      display: flex;
      flex-direction: column;

      i {
        font-size: 21px;
      }
    }
  }
</style>
