<template>
  <div id="register">
    <c-title :hide="false" text="云喇叭绑定"></c-title>
    <div class="box" style="padding-top: 40px;">
      <div class="box1">
        <div id="content">
          <ul class="area_number">
            <li>
              <span>云喇叭</span>
              <!-- <input type="text" placeholder="+86" v-model.trim="form.country"> -->
              <van-field v-model.trim="cloudImei" placeholder="请输入云喇叭IMEI" :border="false" clearable center />
              <i
                slot="icon"
                style="font-size: 24px; color: #666;"
                class="iconfont icon-saoyisao"
                @click.native="getcode"
              ></i>
            </li>
          </ul>
          <div class="btn">
            <button type="button" @click="submitBtn">绑定</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import cloud_horn_controller from './cloud_horn_controller';
export default cloud_horn_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#register {
  .box {
    padding-top: 42px;
    background: #fff;
  }

  .box1 {
    padding: 0 5%;
    // 新css
    #content {
      background-color: #fff;

      .area_number {
        padding-top: 1.25rem;
        font-size: 18px;
        color: #333;

        li {
          height: 2.5rem;
          line-height: 2.5rem;
          padding: 0 0.8rem;
          display: flex;
          justify-content: space-between;

          span {
            width: 5.75rem;
            text-align: left;
          }
        }
      }

      .btn {
        margin-top: 1rem;
        width: 100%;

        button {
          // width: 20.625rem;
          width: 100%;
          height: 2.8125rem;
          font-size: 16px;
          margin-bottom: 1.25rem;
          border-radius: 1.875rem;
          border: none;
          background-color: #f15353;
          color: #fff;
        }
      }
    }
  }

  .van-cell {
    margin-left: 10px;
    padding: 0;
    height: 2.5rem;
    border-bottom: solid 0.0625rem #ccc;

    /deep/.van-field__control {
      color: #333;
      font-size: 16px;
    }

    /deep/input::placeholder {
      color: #666;
      font-size: 16px;
    }
  }
}
</style>
