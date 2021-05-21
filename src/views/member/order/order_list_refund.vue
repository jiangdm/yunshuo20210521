<template >
<div id="refund">
	<c-title :hide="false" :text="title"></c-title>
	<div style="height: 40px;"></div>
		<div class="info">
			<ul class="cause"  style='position: relative;'>
				<li>退款原因：<span style='position: absolute; left: 24%; z-index: 999;'>{{form.reason}}</span></li>
				<li class="select">
					<button @click="show1 = true">请选择</button>
					<i class="fa fa-angle-right"></i>
				</li>
			</ul>
			<ul class="sum">
				<li>退款金额：</li>
				<li class="right">{{money}}{{$i18n.t('元')}}</li>
			</ul>
		</div>
		<div class="prompt">提示：您的退款最大金额为{{money}}{{$i18n.t('元')}}</div>
		<div class="info">
			<ul class="mode" style='position: relative;'>
				<li>退款方式：<span style='position: absolute; left: 24%; z-index: 999;' v-if="refundTypes[form.refund_type]">{{refundTypes[form.refund_type].name}}</span></li>
				<li class="select">
					<button @click="show2 = true">请选择</button>
					<i class="fa fa-angle-right"></i>
				</li>
			</ul>
		</div>
		<div class="explain">
			<span>退款说明：</span>
			<textarea type="text" placeholder="请输入退款说明" maxlength="100" v-model='form.content'></textarea>
		</div>
    <div class="explain">
      <span>上传图片凭证：</span>
      <yz_uploader v-model="fileList1"></yz_uploader>
    </div>

	<div style="height: 1.25rem;"></div>
  <div class="submit-refund" @click="confirmRefund">提交申请</div>

	<van-popup v-model="show1" position="bottom" :style="{height:'60%'}">
		<div class="return-cause">
			<h1>退款原因</h1>
			<ul>
				<li v-for='(val,index) in reasontype' @click='changetext(val)' :key='index' >{{val}}</li>
			</ul>
		</div>
	</van-popup>

	<van-popup v-model="show2" position="bottom" :style="{height:'60%'}">
		<div class="return-cause">
			<h1>处理方式</h1>
			<ul>
				<li v-for='(val,index) in refundTypes' @click='changetype(val.value)' :key='index'>{{val.name}}</li>
			</ul>
		</div>
	</van-popup>
</div>
</template>
<script>
import order_list_refundcontroller from './order_list_refundcontroller';
export default order_list_refundcontroller;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
#refund {
  text-align: left;
  font { display: block; color: #8c8c8c; line-height: 2rem; padding: 0 0.625rem; font-size: 14px; }

  .my_wrapper {
    background: #fff;
    overflow: hidden;
    display: flex;
    padding: 0.625rem 0.875rem;
    align-items: center;
    span { width: 5.375rem; flex: none; font-size: 16px; line-height: 1; }
    .my-value { color: #f15353; flex: 2; text-align: left; font-size: 16px; span { color: red; } }
    .mint-popup { width: 100%; }
  }

  .el-select {
    width: 100%;
  }

  .info {
    background-color: #fff;

    .cause,
    .mode {
      line-height: 2.75rem;
      margin-left: 0.875rem;
      padding-right: 0.875rem;
      border-bottom: solid 0.0625rem #ebebeb;
      display: flex;
      justify-content: space-between;
      font-size: 14px;

      i {
        font-size: 1.125rem;
        color: #999;
        margin-left: 0.5rem;
      }

      li:nth-child(2) {
        color: #8c8c8c;
      }

      input {
        text-align: right;
        width: 90%;
        border: none;
      }

      .select {
        flex: 2;
        text-align: right;
      }

      button {
        width: 90%;
        color: #999;
        border: none;
        text-align: right;
        padding: 0;
        background-color: #fff;
      }
    }

    .sum,
    .explain {
      display: flex;
      padding: 0 0.875rem;
      line-height: 2.75rem;
      font-size: 14px;

      li:nth-child(2) {
        color: #f15353;
      }
    }

    .explain {
      li:nth-child(2) {
        flex: 3;
      }

      input {
        border: none;
        width: 100%;
        font-size: 14px;
        color: #8c8c8c;
      }
    }

    .sum .right,
    .explain .right {
      padding-left: 0.625rem;
    }
  }

  .explain {
    background-color: #fff;
    padding: 0 0.875rem 0.875rem 0.875rem;
    font-size: 14px;

    span {
      line-height: 2.75rem;
      text-align: left;
    }

    textarea {
      border: none;
      background-color: #fafafa;
      width: 100%;
      height: 4.5rem;
      border-radius: 0.25rem;
      padding: 0.375rem;
      line-height: 1.25rem;
      color: #8c8c8c;
      font-size: 12px;
    }
  }

  .prompt {
    line-height: 1.875rem;
    padding: 0 0.875rem;
    font-size: 12px;
    color: #8c8c8c;
  }

  .return-cause {
    h1 {
      line-height: 2.8125rem;
      text-align: center;
      font-size: 14px;
      border-bottom: solid 1px #e2e2e2;
    }

    ul {
      padding: 0.625rem 0.875rem 0 0.875rem;

      li {
        line-height: 2.25rem;
      }
    }
  }

  .submit-refund {
    height: 3rem;
    line-height: 3rem;
    font-size: 16px;
    width: 80%;
    margin: 0 auto;
    background: #f15353;
    color: #fff;
    text-align: center;
    border-radius: 30px;
  }
}
</style>
