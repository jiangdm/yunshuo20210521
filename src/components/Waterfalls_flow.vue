<!-- 微社区 瀑布流组件 点击进入帖子详情页 -->
<template>
  <div id="Waterfalls_flow" :style="{ backgroundColor: datas ? datas.preview_color || '#ffffff' :  '#ffffff' }">
    <img
      style="width: 5rem; padding: 2rem 0; display: inherit;"
      src="../assets/images/blank.png"
      alt=""
      v-if="fun.isTextEmpty(list)"
    />
    <template v-if="!fun.isTextEmpty(list)">
      <ul ref="newArray1" :class="`zq-waterfall-left${id}`">
        <li
          v-for="(item) in newArray1"
          @click="jumpDetails(item.has_many_image[0].stick_id)"
          :key="item.has_many_image[0].stick_id"
        >
          <div class="top">
            <img :src="item.has_many_image[0].url" alt="" />
          </div>
          <div class="bottom">
            <div class="title">{{ item.title }}</div>
            <div class="content">
              <div class="headmessage" v-if="item.has_one_stick_user">
                <div class="left">
                  <img :src="item.has_one_stick_user.avatar" alt="" />
                </div>
                <div class="name">{{ item.has_one_stick_user.nickname }}</div>
              </div>
              <div class="thumbup">
                <div class="right">
                  <img src="../assets/images/micro_communities/detail_praise@2x.png" alt="" />
                </div>
                <div class="num">{{ item.praise_num }}</div>
              </div>
            </div>
          </div>
        </li>
      </ul>
      <ul ref="newArray2" :class="`zq-waterfall-right${id}`">
        <li
          v-for="item in newArray2"
          @click="jumpDetails(item.has_many_image[0].stick_id)"
          :key="item.has_many_image[0].stick_id"
        >
          <div class="top">
            <img :src="item.has_many_image[0].url" alt="" />
          </div>
          <div class="bottom">
            <div class="title">{{ item.title }}</div>
            <div class="content">
              <div class="headmessage" v-if="item.has_one_stick_user">
                <div class="left">
                  <img :src="item.has_one_stick_user.avatar" alt="" />
                </div>
                <div class="name">{{ item.has_one_stick_user.nickname }}</div>
              </div>
              <div class="thumbup">
                <div class="right">
                  <img src="../assets/images/micro_communities/detail_praise@2x.png" alt="" />
                </div>
                <div class="num">{{ item.praise_num }}</div>
              </div>
            </div>
          </div>
        </li>
      </ul>
      <div class="load" v-if="!showLoading">
        <img src="../assets/images/video-loading.gif" alt="loading" />
      </div>

      <div v-if="isDiy">
        <div
          style="width: 100%; height: 40px; line-height: 40px; text-align: center;"
          v-if="isLoadMore"
          @click="getMoreData"
        >{{ $i18n.t("加载更多") }}</div>
        <div
          style="width: 100%; height: 40px; line-height: 40px; text-align: center;"
          v-if="!isLoadMore"
        >{{ $i18n.t("没有更多了") }}~</div>
      </div>

    </template>
  </div>
</template>

<script>
export default {
  props: ['list', 'showLoading','datas', 'isDiy', 'isLoadMore','id'],
  data() {
    return {
      newArray1: [],
      newArray2: [],
      propList: []
    };
  },
  components: {},
  computed: {},
  mounted() {
    this.newArray1 = [];
    this.newArray2 = [];
    this.propList = this.list;
    this.sort(0, this.propList);
  },
  activated() {
    this.newArray1 = [];
    this.newArray2 = [];
    this.propList = this.list;
    this.sort(0, this.propList);
  },
  methods: {
    getMoreData() {
      this.$emit('getMore', true);
    },
    sort(arg, list) {
      let that = this;
      let index = arg || 0;
      if (list && list.length > 0 && list.length > index) {
        that.getImg(
          list[index].has_many_image[0].url,
          function(w, h, r) {
            let boxA = 0;
            let boxB = 0;
            if (document.getElementsByClassName(`zq-waterfall-left${that.id}`)[0]) {
              boxA = document.getElementsByClassName(`zq-waterfall-left${that.id}`)[0].clientHeight;
            }
            if (document.getElementsByClassName(`zq-waterfall-right${that.id}`)[0]) {
              boxB = document.getElementsByClassName(`zq-waterfall-right${that.id}`)[0].clientHeight;
            }

            if (boxA <= boxB) {
              that.newArray1.push(list[index]);
              that.$nextTick(() => {
                that.sort(index + 1, list); //加载完再递归
              });
            } else {
              that.newArray2.push(list[index]);
              that.$nextTick(() => {
                that.sort(index + 1, list);
              });
            }
          },
          function() {
            list[index].cover = "https://www.yunzmall.com/addons/yun_shop/static/app/img/agreen_video@2x.png";
            that.$nextTick(() => {
              that.sort(index + 1, list);
            });
          });
      }
      if (list.length - 1 == index) {
        this.$emit('loadMore', true);
      }
    },
    // 图片加载完回调
    getImg(url, callback, callback2) {
      let img = new Image();
      img.src = url;
      // console.log("完全加载完毕的事件================", img);
      //如果图片被缓存，则直接返回缓存数据
      if (img.complete) {
        /* callback(img.width, img.height); */
        callback(img.width, img.height, Number(img.height) / Number(img.width));
      } else {
        //完全加载完毕的事件
        img.onload = function() {
          /* callback(img.width, img.height); */
          callback(img.width, img.height, Number(img.height) / Number(img.width));
        };
        img.onerror = function() {
          console.log('图片链接error:: 404', img);
          callback2();
        };
      }
    },
    jumpDetails(stick_id) {
      this.$router.push(
        this.fun.getUrl('microCommentDetails', {
          stickId: stick_id
        })
      );
    }
  },
  watch: {
    list: function(newVal, oldVal) {
      let oldLength = oldVal ? oldVal.length: 1;
      this.sort(oldLength, newVal);
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#Waterfalls_flow {
  background: #fff;

  /* min-height: 90vh; */
  .load {
    text-align: center;

    img {
      width: 3rem;
    }
  }

  ul {
    vertical-align: top;
    display: inline-block;
    width: 46%;
    margin: 0.625rem 1%;

    li {
      border-radius: 0.38rem;
      width: 100%;
      background-color: #fff;
      padding-bottom: 0.69rem;
      margin-bottom: 0.75rem;
      overflow: hidden;

      .top {
        img {
          width: 100%;
          overflow: hidden;
        }
      }

      .bottom {
        padding-left: 0.59rem;

        .title {
          padding-top: 0.63rem;
          font-size: 0.84rem;
          line-height: 1rem;
          display: -webkit-box;
          text-overflow: ellipsis;
          overflow: hidden;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          text-align: left;
          margin-bottom: 0.59rem;
        }

        .content {
          display: flex;
          justify-content: space-between;

          .headmessage {
            display: flex;

            .left {
              width: 1.13rem;
              height: 1.13rem;
              border-radius: 50%;

              img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
              }
            }

            .name {
              width: 4rem;
              margin-left: 0.31rem;
              height: 1.13rem;
              line-height: 1.13rem;
              text-align: left;
              color: #8c8c8c;
              font-size: 0.69rem;
              overflow: hidden; /* 超出部分隐藏 */
              text-overflow: ellipsis; /* 超出部分显示省略号 */
              white-space: nowrap; /* 规定段落中的文本不进行换行 */
            }
          }

          .thumbup {
            display: flex;
            padding-top: 0.16rem;

            .right {
              width: 0.81rem;
              height: 0.84rem;
              margin-right: 0.38rem;

              img {
                width: 100%;
                height: 100%;
              }
            }

            .num {
              min-width: 2rem;
              max-width: 8rem;
              text-align: left;
              color: #333;
              font-size: 0.75rem;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
          }
        }
      }
    }
  }
}
</style>
