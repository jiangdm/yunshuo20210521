<template>
	<div id="orderPay">
		<c-title :hide="false" text='订单支付'></c-title>
		<div style="height: 50px;"></div>
		<div class="my_wrapper">
			<span>账户余额</span>
			<div class="my-value">{{data.currentMoney}} {{$i18n.t('元')}}</div>
		</div>
		<div class="my_wrapper">
			<span>支付流水号</span>
			<div class="my-value">{{data.payNum}}</div>
		</div>
		<div class="my_wrapper">
			<span>支付金额</span>
			<div class="my-value"><span>{{data.chargeMoney}}</span> {{$i18n.t('元')}}</div>
		</div>
		<div style="height: 0.625rem;"></div>

		<div class="mod_btns">
			<a class="mod_btn bg_ali">支付宝支付</a>
			<a class="mod_btn bg_ali">余额支付</a>
			<a class="mod_btn bg_wechat">微信支付</a>
		</div>

	</div>
</template>

<script>
import cTitle from 'components/title';
export default {
  components: { cTitle },
  data(){
    return{
      data:{
        currentMoney:"0.00",
        chargeMoney:"50",
        payNum:"1234567890"
      }
    };
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#orderPay {
  .my_wrapper {
    background: #fff;
    overflow: hidden;
    display: flex;
    padding: 0.625rem;

    span {
      flex: 1;
      font-size: 16px;
      line-height: 1;
    }

    .my-value {
      flex: 2;
      text-align: left;

      span {
        color: red;
      }
    }
  }

  .mod_btns {
    margin: 0.625rem 0;
    height: 2.5rem;
    line-height: 2.5rem;
    font-size: 16px;
    .mod_btn { display: block; width: 96%; margin: 1.25rem 2%; border-radius: 0.3125rem; }
    .mod_btn.bg_wechat { background: #26ce29; color: #fff; }
    .mod_btn.bg_ali { background: #22aaed; color: #fff; }
  }
}

</style>
