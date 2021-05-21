<template>
  <div>
    <van-nav-bar fixed :title="text" v-if="!hide" :class="[this.fun.getPhoneEnv() == 3 ? 'pcStyle' : '']" :border="false">
      <van-button type="default" icon="arrow-left" @click="goto" slot="left" v-if="!goback"></van-button>
      <template v-if="tolink">
        <router-link :to="fun.getUrl(tolink, setParams, setQuery)" slot="right" style="font-size: 0.9rem;">{{
          totext
        }}</router-link>
      </template>
      <slot name="edit" slot="right"></slot>
    </van-nav-bar>
  </div>
</template>

<script>
// import { mapState, mapMutations } from 'vuex';

export default {
  props: ['text', 'hide', 'totext', 'tolink', 'goback', 'url', 'setParams', 'setQuery'],
  data() {
    return {
      toi: this.fun.getKeyByI()
    };
  },
  activated() {},
  mounted: function () {
    //this.tempInfo();
  },
  methods: {
    goto() {
      if (window.history.length <= 1) {
        this.$router.push(this.fun.getUrl('home', {}));
      } else if (this.url) {
        this.$router.push(this.fun.getUrl(this.url));
      } else {
        this.$router.go(-1);
      }
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.mint-header {
  background: none;
  color: #666;
}

.is-fixed .mint-header-title {
  font-weight: bold;
}

.mint-header.is-fixed {
  // border-bottom: 0.0625rem solid #e8e8e8;
  background: #fff;
  z-index: 99;
}

.mint-header.is-fixed::after {
  height: 1px;
  position: absolute;
  z-index: 0;
  bottom: 0;
  left: 0;
  content: '';
  width: 100%;
  background-image: linear-gradient(0deg, #ececec 50%, transparent 0);
}

.is-right a {
  font-size: 10px;
}

.pcStyle {
  width: 375px;
  margin: 0 auto;
  left: 50%;
  margin-left: -187.5px;
}

/deep/.van-nav-bar {
  border-bottom: 1px solid #ececec;
}

.van-nav-bar,
/deep/.van-nav-bar__content {
  height: 40px;
}

.van-hairline--bottom::after {
  border-bottom-width: 0;
}

.van-button {
  display: inline-block;
  border: none;
  padding: 0;
  font-size: 16px;
  height: 38px;
}

/deep/.van-button::before {
  background-color: #fff !important;
}

.van-nav-bar .van-icon {
  color: #656b79;
  font-size: 16px;
}

/deep/.van-nav-bar__left,
/deep/.van-nav-bar__right {
  padding: 0;
  height: 40px;
  color: #666;
  font-size: 14px;
}

/deep/.van-nav-bar__left {
  padding-left: 10px;
}

/deep/.van-nav-bar__right {
  padding-right: 10px;
}

/deep/.van-nav-bar__title {
  color: #666;
  font-weight: bold;
  font-size: 14px;
}
</style>

