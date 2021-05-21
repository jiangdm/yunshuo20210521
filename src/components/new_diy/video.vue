<template>
  <div class="component-wrapper u000242" :style="wrapper_style">
    <iframe
      :src="video_url.video_url"
      frameborder="0"
      allowfullscreen
      height="200"
      width="100%"
      v-if="!isVideo"
    >
    </iframe>

    <video
      v-if="isVideo"
      :poster="video_url.isShowPoster == '0' ? '' : video_url.poster"
      :src="video_url.video_url"
      preload="true"
      controlslist="nodownload"
      width="100%"
      controls
      ref="video"
      webkit-playsinline="true"
      playsinline="true"
      x5-playsinline="true"
      x-webkit-airplay="true"
      x5-video-ignore-metadata="true"
    >
      <source :src="video_url.video_url" />
    </video>
  </div>
</template>

<script>
export default {
  props: ['id', 'datas'],
  data(){
    return{
      isVideo: false,
    };
  },
  computed: {
    /** 样式 */
    wrapper_style() {
      const {
        padding_top,
        padding_bottom,
        padding_left,
        padding_right,
      } = this.datas;
      return `
				        line-height: 0;
                width: 100%;
                position: relative;
                height:auto;
                padding-top: ${padding_top}px;
                padding-bottom: ${padding_bottom}px;
                padding-left: ${padding_left}px;
                padding-right: ${padding_right}px;
            `;
    },

    video_url() {
      return this.datas.video_url || {};
    },
  },
  mounted(){
    this.isVideo = false;
    this.isMp4(this.datas.video_url.video_url);
  },
  methods:{
    //判断是否MP4
    isMp4(src) {
      if(src.endsWith(".mp4") || src.endsWith(".mov")|| src.endsWith(".avi")){
        this.isVideo = true;
      }
    },
  }

};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
