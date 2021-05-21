<template>
  <div id="invoice">
    <c-title :hide="false" text="发票详情"></c-title>
    <div id="content">
      <div class="state">发票状态：{{ rise_type }}</div>
      <div class="order">订单编号：{{ order_number }}</div>
      <div class="order" v-if="email">邮箱：{{ email }}</div>
      <div class="info">
        <ul class="info_a">
          <li class="type">
            <span>发票类型：{{ invoice_type }}</span>
            <!-- <button type="button" @click="checkInvoice">查看发票</button> -->
            <van-button type="default" size="mini" v-if="dowm" @click.native="checkInvoice">查看发票</van-button>
            <a :href="dowm+'?response-content-type=application/octet-stream'" v-if="dowm&&is_pdf==2" download>
              <van-button type="default" size="mini">下载发票</van-button>
            </a>
            <a :href="dowm" v-if="dowm&&is_pdf==3" download target="_blank">
              <van-button type="default" size="mini">下载发票</van-button>
            </a>
            <!-- <a :href="dowm"
               download
               v-if="dowm"
               @click="exportData">下载</a> -->
          </li>
          <li>发票抬头：{{ invoice_title }}</li>
        </ul>
      </div>
    </div>
    <van-image-preview v-model="show1" :images="list" ></van-image-preview>
  </div>
</template>
<script>
import invoice_Controller from './invoice_Controller';
export default invoice_Controller;
</script>
<style lang="scss" rel="stylesheet/scss">
#invoice {
  padding-top: 40px;

  #content {
    background: #fff;
    color: #666;
    font-size: 14px;

    .state {
      height: 2.5rem;
      line-height: 2.5rem;
      text-align: left;
      border-bottom: solid 0.0625rem #ebebeb;
      padding: 0 0.875rem;
    }

    .order {
      height: 2.5rem;
      line-height: 2.5rem;
      text-align: left;
      border-bottom: solid 0.0625rem #ebebeb;
      padding: 0 0.875rem;
    }

    .info {
      padding: 0.625rem 0.875rem;
      border-bottom: solid 0.0625rem #ebebeb;

      .info_a {
        li {
          line-height: 1.875rem;
          text-align: left;
        }

        .type {
          button {
            font-size: 12px;
            border: solid 0.0625rem #ebebeb;
            margin: 0 0.3125rem;
            padding: 0 0.625rem;
            border-radius: 0.125rem;
            color: #333;
          }
        }
      }
    }
  }
}
</style>
