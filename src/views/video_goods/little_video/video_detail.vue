<template>
  <div class="wrap">
    <template v-if="popularVideo.length > 0">
      <div class="my-video" v-show="show" :style="VideoItemHeightStyle">
        <video
          :class="minStyle ? '' : 'video-style'"
          :src="showVideo.video"
          :poster="showVideo.cover"
          webkit-playsinline="true"
          controlslist="nodownload"
          playsinline="true"
          x5-video-player-type="h5"
          x5-video-player-fullscreen="true"
          preload="metadata"
          ref="video"
          id="myVideo"
        >
          <!--@pause="onpause"-->
          <!--@play="onplay"-->
          <source :src="showVideo.video" type="video/mp4" />
        </video>
      </div>

      <swiper :options="swiperOption" v-if="popularVideo.length > 0">
        <swiper-slide v-for="(item, index) in popularVideo" :key="index">
          <div>
            <div class="works_wrap" v-show="!item.show" @click="clickSwiper(index)">
              <div class="poster">
                <img class="pic" ref="pic" :src="item.cover" />
              </div>
              <div class="playWorks"></div>
              <img class="play" src="../../../assets/images/find_play@2x.png" alt="" />
            </div>

            <div class="side-bar">
              <div class="avatar">
                <img
                  :src="item.member.avatar"
                  alt=""
                  width="40"
                  height="40"
                  @click.stop="chooseUser(item)"
                  v-if="item.member"
                />
              </div>
              <div class="like" @click.stop="toggleLike(item)">
                <img v-if="item.member_like == 0" src="../../../assets/images/find_heart_r@2x.png" alt="" />
                <img v-if="item.member_like != 0" src="../../../assets/images/find_heart_w@2x.png" alt="" />
                <span class="likenum">{{ item.like_num }}</span>
              </div>
              <div class="share" style="font-size: 30px;" @click="shareVideo">
                <img src="../../../assets/images/find_share@2x.png" alt="" />
                <span class="sharenum" v-if="item.share_num">{{ item.share_num }}</span>
              </div>
            </div>
            <div class="other_menu">
              <router-link :to="fun.getUrl('videoAgreement')">
                <div class="video_record"><i class="iconfont icon-video_recording"></i><em>录制</em></div>
              </router-link>
              <router-link :to="fun.getUrl('myVideo')">
                <div class="video_myvideorecord"><i class="iconfont icon-video_myvideorecord"></i><em>记录</em></div>
              </router-link>
            </div>
            <div class="good-box" @click.stop="toGood(item)" v-if="item.goods">
              <div class="good-img">
                <img :src="item.goods.thumb" alt="" />
              </div>
              <div class="text-wrap">
                <p class="desc">{{ item.goods.title }}</p>
                <div class="money">
                  <span class="old-price">原价：{{ $i18n.t('money') }}{{ item.goods.market_price }}</span>
                  <span class="price">{{ $i18n.t('money') }}{{ item.goods.price }}</span>
                </div>
              </div>
              <div class="cart">
                <img src="../../../assets/images/find_cart@2x.png" alt="" />
              </div>
            </div>
            <div class="play-video" v-if="item.show" @click="clickSwiper(index)"></div>
            <div class="play-video" v-if="showShare" style="z-index: 13;" @click="close">
              <img src="../../../assets/images/share_bg.png" alt="" />
            </div>
          </div>
        </swiper-slide>
      </swiper>
    </template>
    <template v-if="!loading && popularVideo.length <= 0">
      <div class="noData">
        <img src="../../../assets/images/energytank_blank@2x.png" class="noData_imgs" alt="" />
        <p class="text">暂无视频！</p>
        <router-link :to="fun.getUrl('videoAgreement')" class="btn" tag="div">分享视频</router-link>
      </div>
    </template>
    <van-popup v-model="showRedpack" round :close-on-click-overlay="false" :style="{ backgroundColor: 'transparent' }">
      <div
        class="Redpack-box"
        :style="{
          backgroundImage:
            'url(' +
            (redpack_info.redpack_pic
              ? redpack_info.redpack_pic
              : 'https://dev4.yunzmall.com/attachment/image/7ad7f27c83eac4db1f8e0473798de644.png') +
            ')'
        }"
      >
        <transition name="slide-fade">
          <div v-if="!openRedpack">
            <div class="Redpack-title">
              <img class="avator" :src="redpack_info.logo_pic" alt="" />
            </div>
            <div class="Redpack-text">{{ redpack_info.redpack_text }}</div>

            <div class="Redpack_bg_box">
              <div class="Redpack-btn rotate" @click.stop="openRedpackM"></div>
              <div class="Redpack-close" @click.stop="cloneRedpack">放弃领取</div>
              <div class="Redpack_bg"></div>
            </div>
          </div>
        </transition>
        <transition name="slide-fade">
          <div class="open-redpack-box" v-if="openRedpack">
            <div class="Redpack-title Redpack-logo">
              <img class="avator" :src="redpack_info.logo_pic" alt="" />
            </div>
            <div class="Redpack-text open-text">{{ redpack_info.redpack_text }}</div>
            <div class="open-total">{{ redpack_info.amount }}<em style="font-size: 0.75rem;">元</em></div>
            <div class="Redpack-text open-text color-text">红包已通过微信发放成功，请注意查收！</div>
            <div class="Redpack_bg_box open-redpack_bg_box">
              <div class="Redpack_bg"></div>
            </div>
            <div class="Redpack-close open-redpack-clone" @click.stop="cloneRedpack">关闭页面</div>
          </div>
        </transition>
      </div>
    </van-popup>
    <van-popup v-model="showVerification" round :close-on-click-overlay="false">
      <div class="verification">
        <!-- 验证码弹窗 -->
        <div class="text">根据要求，您需要验证手机号才可以领取微信现金红包，感谢您的支持！</div>
        <div class="inputBox">
          <em class="name">手机号</em>
          <input type="number" placeholder="请输入手机号" id="phone" v-model="form.mobile" />
        </div>
        <div class="inputBox" v-if="imgcode">
          <em class="name">验证码</em>
          <input type="text" placeholder="请输入图形验证码" id="code" v-model="form.captcha" />
          <img class="getcodeImg" style="width: 100%; height: 2.5rem; z-index: 999;" :src="imgcode" @click="getimgdata" />
        </div>
        <div class="inputBox">
          <em class="name">验证码</em>
          <input type="number" placeholder="请输入验证码" id="code" v-model="form.code" /><span
            class="getcodeClass"
            @click="VerificationCode"
            v-show="!cationCode"
            >获取验证码</span
          ><span class="getcodeClass" v-show="cationCode">{{ count }}秒后重新获取</span>
        </div>
        <div class="bottomBox">
          <div class="btn1" @click="showVerification = false">取消</div>
          <div class="btn2" @click="alterAction">确认</div>
        </div>
      </div>
    </van-popup>
    <!-- 答题 start -->
    <van-popup v-model="showVideoAnswer" :close-on-click-overlay="false" position="bottom" :style="{ height: '100%' }">
      <div class="answer-page">
        <div class="header">答题赢{{ integral_name }}</div>
        <div class="answerContainer" v-if="subject != null">
          <div class="answerTitle">{{ subject.title }}</div>
          <div class="answerList">
            <div class="answerItem" v-for="item in answerfilter" :key="item.id" @click="reward(item.id)">
              {{ item.content }}
            </div>
          </div>
        </div>
      </div>
    </van-popup>
    <van-popup v-model="successShow" style="background: transparent;" :close-on-click-overlay="false">
      <div class="successAlert">
        <div class="c1">答题成功</div>
        <div class="c2">恭喜你获得{{ integral_name }}</div>
        <div class="c3">{{ integral }}</div>
        <div class="btn" @click="cloneAnswer">
          <img src="https://www.yunzmall.com/min_img/videoAnswerSuccess@3x.png" alt="" />
        </div>
      </div>
    </van-popup>

    <van-popup v-model="errorShow" style="background: transparent;" :close-on-click-overlay="false">
      <div class="errorAlert">
        <div class="sigh"><img src="https://www.yunzmall.com/min_img/videoAnswerTan@3x.png" alt="" /></div>
        <div class="c1">答题失败</div>
        <div class="c2">
          <span>很遗憾，答错了。请重新</span>
          <span>观看，再接再厉！</span>
        </div>
        <div class="btn" @click="cloneAnswer">我知道了</div>
      </div>
    </van-popup>
    <!-- 答题 end -->
  </div>
</template>

<script>
import video_detail_controller from './video_detail_controller';

export default video_detail_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.wrap {
  .noData {
    width: 100vw;
    height: 100vh;
    padding: 2rem;
    background: #f7f7f7;
    display: flex;
    flex-direction: column;
    align-items: center;

    .noData_imgs {
      width: 100%;
      margin: 0;
    }

    .text {
      padding: 1rem 0;
      color: #999;
      font-size: 1rem;
    }

    .btn {
      width: 16rem;
      height: 2.5rem;
      line-height: 2.5rem;
      border-radius: 2rem;
      font-size: 1rem;
      background-image: -webkit-linear-gradient(bottom, #ff8a66, #ff6260, #ff6260);
      color: #fff;
      text-align: center;
    }
  }
}

.my-video {
  position: absolute;
  z-index: 1;
  left: 0;
  top: 0;
  right: 0;
  height: 100%;
  visibility: visible;
  display: flex;
  justify-content: center;
  align-items: center;
  background: none;
  overflow: hidden;

  video {
    width: 100%;
    height: 100%;
  }

  .video-style {
    object-fit: fill;
  }
}

.Redpack-box {
  width: 15.281rem;
  height: 25.313rem;
  overflow: hidden;
  background-size: 100% 100%;
  background-position: top left;
  display: flex;
  flex-direction: column;
  position: relative;
  margin: 0 auto;

  .Redpack-title {
    display: flex;

    .avator {
      margin: 2.8rem auto 0;
      width: 3.75rem;
      height: 3.75rem;
      border-radius: 0.125rem;
      object-fit: contain;
    }
  }

  .Redpack-text {
    font-size: 1.125rem;
    text-align: center;
    color: #ceac74;
    padding: 0.5rem 1rem;
    font-weight: bold;
    width: 100%;
  }

  .Redpack_bg_box {
    position: absolute;
    height: 6.75rem;
    width: 100%;
    bottom: 0;
    left: 0;
    perspective: 25.313rem;

    .Redpack-btn {
      width: 4.75rem;
      height: 4.75rem;
      border-radius: 50%;
      overflow: hidden;
      background-color: #e5c185;
      position: absolute;
      z-index: 999;
      left: 50%;
      margin-left: -2.375rem;
      margin-top: -1.5rem;
      background-image: url('../../../assets/images/redEnvelope/open_btn.png');
      background-size: 100% 100%;
    }

    .rotate {
      -webkit-animation: anim 1s infinite alternate;
      -ms-animation: anim 1s infinite alternate;
      -moz-animation: anim 1s infinite alternate;
      -o-animation: anim 1s infinite alternate;
      animation: anim 1s infinite alternate;
    }

    @-webkit-keyframes anim {
      0% {
        -webkit-transform: rotateY(180deg);
      }

      100% {
        -webkit-transform: rotateY(360deg);
      }
    }

    @keyframes anim {
      0% {
        transform: rotateY(180deg);
      }

      100% {
        transform: rotateY(360deg);
      }
    }

    .Redpack_bg {
      overflow: hidden;
      position: relative;
      height: 110%;
      width: 100%;
    }

    .Redpack_bg::before {
      position: absolute;
      margin-top: calc(2.25rem * -1);
      margin-right: calc(3rem * -1);
      margin-bottom: calc(3rem * -1);
      margin-left: calc(8rem * -1);
      padding: 1.75rem 8rem;
      border-radius: 50%;
      box-shadow: 0 0 0 380px rgba(#f04333, 1);
      content: '';
    }
  }

  .Redpack-close {
    color: #fff;
    font-size: 0.75rem;
    position: absolute;
    bottom: 1.875rem;
    width: 100%;
    z-index: 99;
  }

  .open-redpack-clone {
    color: #000;
    bottom: 0.875rem;
  }
}

/* 可以设置不同的进入和离开动画 */

/* 设置持续时间和动画函数 */
.slide-fade-enter-active {
  transition: all 0.35s ease;
}

.slide-fade-leave-active {
  // transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter,
.slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateY(100px);
  opacity: 0;
}

.open-redpack-box {
  width: 100%;
  height: 100%;

  .Redpack-logo {
    margin-top: 4.5rem;
    z-index: 2;
    position: relative;
  }

  .open-text {
    z-index: 2;
    position: relative;
    font-size: 0.75rem;
    color: #aeaeae;
    padding: 0 1rem;
    font-weight: 100;
  }

  .open-total {
    font-size: 2.375rem;
    color: #ceac74;
    padding: 1rem 1rem 0;
    font-weight: bold;
    z-index: 2;
    position: relative;
  }

  .color-text {
    color: #ceac74;
    font-size: 0.625rem;
  }

  .open-redpack_bg_box {
    height: 20.156rem;
    overflow: hidden;

    .Redpack_bg.Redpack_bg::before {
      position: absolute;
      margin-top: calc(1.375rem * -1);
      margin-left: calc(8rem * -1);
      padding: 1.75rem 8rem;
      border-radius: 50%;
      box-shadow: 0 0 0 380px rgba(#fff, 1);
      border: 2px solid #efca62;
      content: '';
    }
  }
}

.up-enter-active,
.up-leave-active {
  transition: all 0.5s;
}

.up-enter,
.up-leave-to {
  opacity: 0;
  transform: translateY(100%);
}

.wrap {
  background: #000;
  width: 100%;
  height: 100%;

  .icon-search {
    position: absolute;
    right: 10px;
    top: 10px;
    padding: 10px;
    font-size: 24px;
    z-index: 222;
  }

  .scroll-wrap {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
}

.mack {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #000;
  opacity: 0.8;
  z-index: 98;
  display: none;
}

.works_wrap {
  position: absolute;
  z-index: 1;
  left: 0;
  top: 0;
  right: 0;
  height: 100%;
  visibility: visible;
  display: flex;
  justify-content: center;
  align-items: center;
  background: none;
  overflow: hidden;

  .play {
    position: absolute;
    z-index: 11;
    left: calc(55% - 2rem);
    top: calc(50% - 2rem);
    width: 2rem;
    height: 2rem;
  }
}

.swiper-slide .works_wrap .poster {
  /* background: #000000; */
  position: relative;
  z-index: 10;
  width: 100%;
  height: 100%;
  visibility: visible;
  display: flex;
  justify-content: center;
  align-items: center;
}

.swiper-slide .works_wrap .poster .pic {
  width: 100%;
  height: auto;
  vertical-align: middle;
}

.swiper-slide .works_wrap .playWorks {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  z-index: 9;
  background-size: auto 50px;
  background: #000;
}

.good-box {
  position: absolute;
  display: flex;
  z-index: 10;
  left: 0;
  bottom: 6.25rem;
  width: 60%;
  // height: 5rem;
  background: #fff;
  border-radius: 0 12px 12px 0;
  padding: 0.25rem;

  .good-img {
    margin-right: 0.35rem;
    width: 3rem;
    height: 3rem;
    flex: 0 0 3rem;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .text-wrap {
    flex: 1;
    display: flex;
    flex-direction: column;
    text-align: left;
    // line-height: 1.75rem;
    width: 60%;
    font-weight: bold;
    justify-content: space-between;
  }

  .desc {
    line-height: 1.125rem;
    height: 1.125rem;
    color: #333;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  .money {
    display: flex;
    flex-direction: column;
  }

  .price {
    font-size: 16px;
    line-height: 16px;
    color: #f15353;
    margin-right: 0.5rem;
  }

  .old-price {
    text-decoration: line-through;
    color: #999;
    font-size: 10px;
    font-weight: 400;
  }

  .cart {
    flex: 0 0 1.25rem;
    width: 1.25rem;
    height: 1.25rem;
    line-height: 3.75rem;

    img {
      width: 100%;
      height: 100%;
    }
  }
}

.side-bar {
  position: absolute;
  z-index: 10;
  right: 10px;
  bottom: 15rem;
  display: flex;
  flex-direction: column;
  height: 150px;
  justify-content: space-between;

  .avatar {
    position: relative;
    border-radius: 50%;
    background: none;
    border: 1px solid rgb(232, 232, 233);

    img {
      border-radius: 50%;
      display: block;
    }

    .follow {
      text-align: center;
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%) translateY(50%);
      width: 16px;
      height: 16px;
      font-size: 16px;
      border-radius: 50%;
      background: rgb(252, 52, 93);
    }
  }
}

.other_menu {
  position: absolute;
  z-index: 10;
  right: 10px;
  width: 40px;
  bottom: 6rem;
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .video_record,
  .video_myvideorecord {
    display: flex;
    flex-direction: column;
    margin-bottom: 0.5rem;

    i {
      font-size: 2rem;
    }

    em {
      font-size: 0.75rem;
    }
  }
}

.like {
  position: relative;

  img {
    width: 40px;
    height: 40px;
  }

  .likenum {
    font-size: 10px;
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%) translateY(100%);
    color: rgb(232, 232, 233);
  }
}

.share {
  position: relative;

  img {
    width: 40px;
    height: 40px;
  }

  .sharenum {
    font-size: 10px;
    position: absolute;
    bottom: -5px;
    left: 50%;
    transform: translateX(-50%) translateY(100%);
    color: rgb(232, 232, 233);
  }
}

.side-bar > div {
  width: 40px;
  height: 40px;
  font-size: 40px;
  color: rgb(232, 232, 233);
  transition: all 0.3s;
}

.play-video {
  position: absolute;
  z-index: 9;
  top: 0;
  width: 100%;
  height: 100%;
  left: 0;
}

.verification {
  width: 17.5rem;
  padding: 0 0.75rem;

  .text {
    padding: 1.725rem 2rem 2.125rem;
    color: #666;
    text-align: center;
    font-size: 0.75rem;
  }

  .inputBox {
    height: 2.625rem;
    line-height: 2.625rem;
    display: flex;
    border-bottom: 0.0625rem solid #ebebeb;
    text-align: left;
    align-items: center;
    margin-top: 0.625rem;

    .name {
      width: 3.875rem;
      color: #000;
    }

    input {
      border: none;
    }

    #phone {
      flex: 1;
    }

    #code {
      width: 40%;
    }

    .getcodeClass {
      display: inline-block;
      height: 1.25rem;
      line-height: 1.25rem;
      background-color: #f54242;
      color: #fff;
      border-radius: 0.625rem;
      padding: 0 0.625rem;
      font-size: 0.75rem;
    }

    .getcodeImg {
      display: inline-block;
      height: 1.25rem;
      line-height: 1.25rem;
      flex: 1;
    }
  }

  .bottomBox {
    padding-top: 2.5rem;
    padding-bottom: 1rem;
    display: flex;
    justify-content: space-around;

    .btn1,
    .btn2 {
      width: 6rem;
      height: 2rem;
      line-height: 2rem;
      text-align: center;
      color: #fff;
      font-size: 1rem;
      border-radius: 1.234rem;
    }

    .btn1 {
      background: #bcbcbc;
    }

    .btn2 {
      background: #f71515;
    }
  }
}

.answer-page {
  background: url(https://www.yunzmall.com/min_img/videoAnswerBg@3x.png);
  background-size: cover;
  min-height: 100vh;

  .header {
    margin: 0 auto;
    padding-top: 1.8rem;
    font-size: 2.2rem;
    color: #e9e8e8;
  }
}

.answerContainer {
  margin: 0 auto;
  margin-top: 2.8rem;
  width: 19.969rem;
  height: 20.625rem;
  border-radius: 5%;
  background-color: #fff;
  padding: 1.8rem 2.2rem 0;
  position: relative;

  &::before {
    content: '';
    display: block;
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    position: absolute;
    left: -0.5rem;
    top: 2rem;
    background: rgb(207, 36, 59);
  }

  &::after {
    content: '';
    display: block;
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    position: absolute;
    right: -0.5rem;
    top: 2rem;
    background: rgb(207, 36, 59);
  }

  .answerTitle {
    color: #333;
    font-size: 0.938rem;
  }

  .answerList {
    padding-top: 1.53rem;
    height: 16rem;
    overflow: scroll;

    .answerItem {
      width: 100%;
      height: 2.656rem;
      background-color: #f1f1f1;
      border-radius: 1.328rem;
      color: #333;
      font-size: 0.875rem;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1.06rem;

      &:active {
        background: rgb(207, 36, 59);
        color: #fff;
      }
    }
  }
}

.successAlert {
  width: 19.563rem;
  height: 17.631rem;
  background: url(https://www.yunzmall.com/min_img/videoAnswerAlert@3x.png);
  background-size: contain;
  background-repeat: no-repeat;

  .c1 {
    color: #f06161;
    font-size: 1rem;
    padding-top: 1.3rem;
  }

  .c2 {
    color: #333;
    font-size: 1rem;
    margin-top: 1.8rem;
  }

  .c3 {
    color: #f06161;
    font-size: 2.25rem;
    margin-top: 1.575rem;
  }

  .btn {
    width: 10.375rem;
    height: 2.35rem;
    margin: 0 auto;
    margin-top: 4rem;

    img {
      width: 100%;
      height: auto;
    }
  }
}

.errorAlert {
  width: 15.938rem;
  height: 15.938rem;
  background-color: #fff;
  border-radius: 0.125rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 2rem;

  .sigh {
    width: 5.8rem;
    padding-left: 0.8rem;
    height: 4.719rem;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .c1 {
    margin-top: 0.8rem;
    font-size: 1rem;
    color: #999;
  }

  .c2 {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-top: 1rem;
    color: #333;
    font-size: 0.875rem;
  }

  .btn {
    margin-top: 1rem;
    font-size: 0.938rem;
    color: #fff;
    width: 11.188rem;
    height: 1.906rem;
    background-color: #f35056;
    border-radius: 0.188rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
