<template >
<div id="addevaluate">
	<c-title :hide="false" text='追加评价'></c-title>
	<div style="height: 42px;"></div>
	<div id="shop">
            <div class="goods">
                <div class="img"><img :src="good.thumb"></div>
                <div class="inner">
                    <div class="name">已好评<br/>
                        <van-rate v-model="value" disabled-color="#ff9900" disabled/>
                    <!--<el-rate v-model="value" disabled text-color="#ff9900" text-template="很好"></el-rate>-->
                    </div>     
                    
                </div>

            </div>
            <div class="option">{{comment}}</div>  
    </div>        
	<div id="pjall">
		<div id="pj" ><span>追加评价:</span></div>
		
		<textarea v-model="reComment" placeholder="这次买的商品满意吗？不满意可意追加评价内容。长度在5-100字之间" type="textarea" rows="4"></textarea>
		
	</div>
	<!--<el-button type="primary" @click="toReComment">发表追评</el-button>-->
    <van-button color="#f15353" type="primary" @click="toReComment">发表追评</van-button>
</div>
</template>
<script>
import order_list_addevaluatecontroller from './addevaluatecontroller';
export default order_list_addevaluatecontroller;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
#addevaluate {
  #shop {
    background: #fff;
    padding: 0.625rem;
    .option { color: #888; font-size: 12px; text-align: left; }
  }

  .goods {
    display: flex;
    align-items: stretch;
    flex-flow: row wrap;
    background: #efeded;
    padding: 0.3125rem;
    margin-bottom: 0.3125rem;

    .img { flex: 1; img { width: 100%; } }
    .inner { flex: 5; padding: 0 0.3125rem; display: flex; flex-direction: column; align-items: flex-start; }
    .name { flex: 3; text-align: left; color: #ff5757; }
    .price { flex: 2; align-items: center; color: #858585; }
  }

  #pjall {
    background: #fff;
    padding: 0.9375rem;
    textarea { width: 87%; margin-top: 0.625rem; padding: 0.625rem; }

    #pj {
      text-align: left;
      span { float: left; font-size: 14px; padding-right: 0.625rem; }
    }
  }
  button { width: 100%; }
}
</style>