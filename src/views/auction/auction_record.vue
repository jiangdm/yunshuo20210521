<template>
  <div id="auction_record" ref="auction_record">
    <c-title :hide="false" text="竞拍记录"></c-title>
    <div class="content">
      <div class="record-list" >
          <div class="list" v-for="(item,index) in datas" :key="index">
              <div class="name">
                <div class="avator" v-if="item.has_one_member">
                  <img :src="item.has_one_member.avatar">
                </div>
                <div class="nick">
                   {{item.has_one_member.nickname}}
                </div>
              </div>
              <div style="font-size: 12px; color: #f22121; flex: 1;" v-if="item.status==1">当前最高</div>
              <div style="font-size: 12px; color: #999; flex: 1;" v-if="item.status==-1">出局</div>
              <div style="font-size: 12px; flex: 1;"><span>{{item.created_at}}</span></div>
              <div style="font-size: 12px; color: #f22121; flex: 0.5;">{{$i18n.t('money')}}{{item.price}}</div>
              <div style="font-size: 12px; flex: 1;" v-if="item.status==1">{{item.number}}次出价</div>
              <div style="font-size: 12px; flex: 1; color: #999;" v-if="item.status==-1">{{item.number}}次出价</div>
          </div>

      </div>
    </div>
  </div>
</template>

<script>
import auction_record_controller from "./auction_record_controller";

export default auction_record_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#auction_record {
  padding-top: 40px;
  background-color: #fff;
  height: 100vh;

  .content {
    background: #fff;
    padding: 0 0.75rem;

    .liu {
      display: flex;
      align-items: center;
      justify-content: center;
      padding-top: 1rem;
      color: #ff2c29;
    }

    .record-list {
      margin-top: 1rem;

      .list {
        margin-bottom: 0.5rem;
        display: flex;
        align-items: center;

        .name {
          flex: 1;
          align-items: center;
          overflow: hidden;
          text-overflow: ellipsis;
          display: flex;

          .avator {
            width: 1.5rem;
            height: 1.5rem;
            border-radius: 50%;
            margin-right: 0.25rem;
            display: flex;

            img {
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }

          .nick {
            font-size: 12px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            display: flex;
            flex: 1;
          }
        }
      }
    }
  }
}
</style>
