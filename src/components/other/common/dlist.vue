<template>
  <div id="DList">
    <slot></slot>
    <div class="list-status-text" v-if="showStatusText">{{ localStatusText }}</div>
  </div>
</template>

<script>
let pageHeight = 0; //* 页面完整高度
let scrollPositionY = 0; //* 滚动条位置
let availHeight = 0; //* 页面可见视图高度
let scrollTimer = null; //* 防抖setTimeout handle
export default {
  props: {
    loading: Boolean,
    finished: Boolean,
    statusText: {
      type: String,
      default: "下拉加载更多"
    },
    showStatusText: {
      type: Boolean,
      default: true
    },
    reachBottomDistance: {
      type: Number,
      default: 50
    },
    height: {
      type: Number,
      default: null
    }
  },
  beforeMount() {
    window.addEventListener("scroll", () => {
      //* 简单防抖
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        this.pageScroll();
        clearTimeout(scrollTimer);
      }, 500);
    });
  },
  activated() {
    if (this.height !== null) {
      pageHeight = this.height;
    } else {
      pageHeight = Math.max(window.document.body.scrollHeight, window.document.documentElement.scrollHeight);
    }
  },
  deactivated() {
    window.removeEventListener("scroll", this.pageScroll);
  },
  data() {
    return {
      isLoading: false,
      isFinished: false,
      isLoadMore: true,
      localStatusText: "",
      pageHeight: null
    };
  },
  methods: {
    pageScroll() {
      this.refreshPageHeight();
      this.refreshAvailHeight();
      this.refreshScrollPosition();
      if (availHeight + scrollPositionY >= pageHeight - this.reachBottomDistance) {
        if (this.isLoading == true || this.isFinished) {
          return;
        }
        this.$emit("load");
      }
    },
    refreshPageHeight() {
      if (this.height === null) {
        pageHeight = Math.max(window.document.body.scrollHeight, window.document.documentElement.scrollHeight);
      }
    },
    refreshAvailHeight() {
      availHeight = window.screen.availHeight;
    },
    refreshScrollPosition() {
      scrollPositionY = Math.max(window.scrollY, window.document.documentElement.scrollTop);
    }
  },
  watch: {
    loading(newVal) {
      if (this.showStatusText === false) {
        return;
      }
      if (newVal === true) {
        this.localStatusText = "加载中";
      }
    },
    finished(newVal) {
      if (this.showStatusText === false) {
        return;
      }
      if (newVal === true) {
        this.localStatusText = "没有更多了";
        this.isFinished = false;
        this.isLoadMore = false;
      } else {
        this.isFinished = false;
        this.isLoadMore = true;
      }
    },
    statusText(newVal) {
      this.localStatusText = newVal;
    },
    height(newVal) {
      this.pageHeight = newVal;
    }
  }
};
</script>

<style scoped>
.list-status-text {
  padding: 0.625rem 0;
  text-align: center;
}
</style>