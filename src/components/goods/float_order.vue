<template>

	<div class="float" v-if="broadcast_data && broadcast_data.length>0">
		<van-swipe class="swiperContainer" vertical :autoplay="3000" :show-indicators="false">
			<template v-for="(item,key) in broadcast_data">
				<van-swipe-item class="swiperItem" :key="key">
					<div class="wrapper">
						<div class="image">
							<img :src="item.avatar_image">
						</div>
						<div class="text"><span>{{item.content}}</span></div>
					</div>
				</van-swipe-item>
				<van-swipe-item class="swiperItem" :key="key"></van-swipe-item>
			</template>
		</van-swipe>
	</div>

</template>


<script>
export default {
  props:{
    broadcast_data:{
      default:[]
    }
  },
  created(){
    console.log(this.broadcast_data);
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .float {
    position: absolute;
    top: 5.875rem;
    left: 50%;
    transform: translateX(-50%);
  }

  .swiperContainer {
    width: 17.031rem;
    height: 2rem;
  }

  .swiperContainer .swiperItem {
    width: 17.031rem;
    height: 2rem;
    display: flex;
    align-items: center;
  }

  .wrapper {
    max-width: 17.031rem;
    height: 1.25rem;
    display: flex;
    padding-right: 0.5rem;
    padding-left: 0.1rem;
    align-items: center;
    background-color: #000;
    border-radius: 0.609rem;
    opacity: 0.7;
    overflow: hidden;
  }

  .wrapper .image {
    width: 1.063rem;
    height: 1.063rem;
    display: flex;
    align-items: center;
    border-radius: 50%;
  }

  .wrapper .image img {
    width: 1.063rem;
    height: 1.063rem;
    border-radius: 50%;
  }

  .wrapper .text {
    font-size: 0.75rem;
    text-align: left;
    max-width: 15.5rem;
    padding-left: 0.5rem;
    color: #fff;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    word-break: break-all;
  }
</style>