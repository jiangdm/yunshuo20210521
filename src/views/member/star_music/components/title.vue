<template>
    <div>
		<div class="title" 
			:style="{background:bgColor,position:isFixed?'relative':'fixed'}" 
			:class="[this.fun.getPhoneEnv() == 3 ? 'pcStyle' : '']">
			<div class='con' style="height: 2.938rem;">
				<div class="left" @click="goto">
					<i class="iconfont icon-member-left back" :style="{color:fontColor}"></i>
				</div>

				<div class="right" :style="{color:fontColor,fontWeight:fontWeight}">{{title}}</div>
			</div>
		</div>
		<div v-if="!isFixed" style="height: 2.938rem; width: 100%; box-sizing: border-box;"></div>
    </div>
</template>

<script>
export default {
  props:{
    title:{
      type:String
    },
    isBack:{
      type:Boolean,
      default:true
    },
    bgColor:{
      type:String,
      default:'#fff'
    },
    fontColor:{
      type:String,
      default:'#000'
    },
    isFixed:{
      type:Boolean,
      default:false
    },
    fontWeight:{
      type:String,
      defalut:"bold"
    }
  },
  data() {
    return {

    };
  },
  methods:{
    goto() {
      if (window.history.length <= 1) {
        this.$router.push(this.fun.getUrl("home", {}));
      } else {
        this.$router.go(-1);
      }
    }
  }
};
</script>

<style scoped>
  .title {
    height: 2.938rem;
    width: 100%;
    box-sizing: border-box;
    position: fixed;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    z-index: 9999;
  }

  .title .con {
    width: 100%;
    display: flex;
    position: relative;
  }

  .title .con .left {
    position: absolute;
    left: 0;
    top: 0;
    width: 3rem;
    height: 100%;
    display: flex;
    padding-left: 1.313rem;
    align-items: center;
  }

  .title .con .left .icon-member-left {
    color: #000;
    font-weight: bold;
  }

  .title .con .right {
    flex: 0 0 calc(100% - 6rem);
    width: calc(100% - 6rem);
    margin: 0 auto;
    color: #000;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.125rem;
    letter-spacing: 0.056rem;
    pointer-events: none;
    text-overflow: ellipsis;
    white-space: normal;
    overflow: hidden;
  }

  .pcStyle {
    width: 375px;
    margin: 0 auto;
  }
</style>
