<template>
  <div>
    <d-title>会话列表</d-title>
    <van-tabs v-model="pageTabActiveIndex" v-if="isEmployee">
      <van-tab title="客户聊天">
        <div class="blank" v-if="chatListPagination.finished&&employeeChatList.length==0">
          <img src="../../../assets/images/blank.png" />
          <span>还没有记录哦</span>
        </div>
        <div class="content">
          <d-list
            :finished="employeeChatPagination.finished"
            :loading="employeeChatPagination.loading"
            @load="getEmployeeChatData"
            :showStatusText="false"
          >
            <div
              v-for="item in employeeChatList"
              :key="item.id"
              @click="enterEmployeeChatPage(item)"
            >
              <ChatListItem :item="item" />
            </div>
          </d-list>
        </div>
      </van-tab>
      <van-tab title="我的聊天"></van-tab>
    </van-tabs>
    <template v-if="pageTabActiveIndex==1||isEmployee==false">
      <div>
        <div class="blank" v-if="chatListPagination.finished&&chatList.length == 0">
          <img src="../../../assets/images/blank.png" />
          <span>还没有记录哦</span>
        </div>
        <div class="content">
          <d-list
            :finished="chatListPagination.finished"
            :loading="chatListPagination.loading"
            @load="getChatData"
            :showStatusText="false"
          >
            <div @click="enterChatPage(item)" v-for="item in chatList" :key="item.id">
              <ChatListItem :item="item" />
            </div>
          </d-list>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { Toast, Notify as VanNotify } from "vant";
import { ChatListItem } from "./components";
import DTitle from "@/components/other/common/dtitle";
import DList from "@/components/dlist";

let loopGetChatDataHandle = null;
let isLoopGetChatData = false;
let loopGetChatDataCount = 0;
let loopGetingChatData = false;
let getChatDataUrl = "plugin.yun-chat.frontend.h5.chat.get-list";
let socketInstance = null;
let websocketRequestUrl = null;
let websocketConfig = {};
let websocketReconnetCount = 0;
let websocketReconnectTimer = null;
let websocketMaxReconnetCount = 10;
let websocketConntectCheckTimer = null;
let networkOffline = false;
function arrayToObject(arr, arrValueKey) {
  let obj = {};
  for (let index = 0; index < arr.length; index++) {
    const element = arr[index];
    obj[element[arrValueKey]] = element;
  }
  return obj;
}
export default {
  data() {
    return {
      pageTabActiveIndex: 0,
      chatListSets: null,
      chatList: {},
      chatListPagination: {
        pages: 1,
        finished: false,
        loading: false
      },
      isEmployee: false,
      employeeChatList: {},
      employeeChatPagination: {
        pages: 1,
        finished: false,
        loading: false
      }
    };
  },
  async activated() {
    await this.getSetData();
    this.getWebscoketConfig();
    this.getEmployeeChatData();
    await this.getChatData();
    this.loopGetChatData();
    window.onoffline = () => {
      clearInterval(loopGetChatDataHandle);
      if (socketInstance) {
        socketInstance.close();
        socketInstance = null;
      }

      loopGetChatDataHandle = null;
      networkOffline = true;
      VanNotify("网络连接异常");
    };
    window.ononline = () => {
      if (networkOffline === true) {
        VanNotify({ type: "primary", message: "网络连接恢复" });
        this.loopGetChatData();
        this.socketInit();
      }
    };
  },
  methods: {
    getWebscoketConfig() {
      if (!this.isEmployee) {
        return;
      }
      $http.get("plugin.yun-chat.frontend.chat.get-ws-setting").then(({ data, result, msg }) => {
        if (result) {
          websocketConfig = data.wss_params;
          websocketRequestUrl = `${websocketConfig.host}?appId=${websocketConfig.appId}&signature=${websocketConfig.signature}&nonceStr=${websocketConfig.nonceStr}&timestamp=${websocketConfig.timestamp}&clientid=${websocketConfig.clientid}&agent_id=${websocketConfig.agent_id}`;
          this.socketInit();
        } else {
          Toast(msg);
        }
      });
    },
    async getSetData() {
      return await new Promise((resolve, reject) => {
        $http
          .get("plugin.yun-chat.frontend.h5.chat.get-list-setting", {}, "加载中")
          .then(response => {
            if (response.result) {
              this.chatListSets = response.data;
              if (response.data.employee_id > 0) {
                this.isEmployee = true;
              }
              resolve(response.data);
            } else {
              reject(response);
            }
          })
          .catch(error => {
            return error;
          });
      });
    },
    async getChatData() {
      if (!isLoopGetChatData) {
        if (this.chatListPagination.finished || this.chatListPagination.loading) {
          return;
        }
      }

      let pages = this.chatListPagination.pages;
      if (isLoopGetChatData) {
        pages = 1;
      } else {
        this.chatListPagination.loading = true;
      }
      await $http
        .get(getChatDataUrl, { page: pages })
        .then(({ data: { data, per_page, current_page, last_page }, msg, result }) => {
          this.chatListPagination.loading = false;
          if (result === 0) {
            Toast(msg);
            return;
          }

          for (const key in data) {
            if (Object.hasOwnProperty.call(data, key)) {
              const element = data[key];
              this.$set(this.chatList, element["has_one_employee"]["uid"], element);
            }
          }
          if (isLoopGetChatData) {
            isLoopGetChatData = false;
            loopGetingChatData = false;
          } else {
            if (data.length < per_page || current_page == last_page) {
              this.chatListPagination.finished = true;
            }

            this.chatListPagination.pages++;
          }
        })
        .catch(err => {
          console.log(err);
          this.employeeChatPagination.loading = false;
        });
    },
    loopGetChatData() {
      clearInterval(loopGetChatDataHandle);
      loopGetChatDataHandle = null;
      loopGetChatDataCount = 0;
      if (loopGetChatDataHandle === null) {
        loopGetChatDataHandle = setInterval(() => {
          console.log(loopGetChatDataCount);
          if (loopGetingChatData === false) {
            isLoopGetChatData = true;
            this.getChatData();
            loopGetChatDataCount++;
            if (loopGetChatDataCount >= 100) {
              clearInterval(loopGetChatDataHandle);
              loopGetChatDataHandle = null;
            }
          }
        }, 90000);
      } else {
        loopGetChatDataCount = 0;
      }
    },
    getEmployeeChatData() {
      if (this.isEmployee === false || this.employeeChatPagination.finished || this.employeeChatPagination.loading) {
        return;
      }
      this.employeeChatPagination.loading = true;
      $http
        .get("plugin.yun-chat.frontend.chat.get-list", { page: this.employeeChatPagination.pages })
        .then(({ data: { data, per_page, current_page, last_page }, msg, result }) => {
          this.employeeChatPagination.loading = false;
          if (result === 0) {
            Toast(msg);
          }
          if (data.length < per_page || current_page == last_page) {
            this.employeeChatPagination.finished = true;
          }
          data = arrayToObject(data, "uid");
          for (const key in data) {
            if (Object.hasOwnProperty.call(data, key)) {
              const element = data[key];
              this.$set(this.employeeChatList, element["uid"], element);
            }
          }
          this.employeeChatPagination.pages++;
        })
        .catch(err => {
          console.log(err);
          this.employeeChatPagination.loading = false;
        });
    },
    enterChatPage(item) {
      this.$router.push(this.fun.getUrl("chatWindow", {}, { groupId: item.group_id, employeeId: item.employee_id, chatType: 1 }));
    },
    enterEmployeeChatPage(item) {
      this.$router.push(this.fun.getUrl("chatWindow", {}, { user_id: item.uid, chatType: 2 }));
    },
    socketInit() {
      if (socketInstance === null) {
        socketInstance = new WebSocket(websocketRequestUrl);
        socketInstance.onmessage = response => {
          let chatNewData = JSON.parse(response.data);
          if (chatNewData.uid) {
            let chat = this.employeeChatList[chatNewData["uid"]];
            if (chat) {
              switch (chatNewData["content_type"]) {
              case 0:
                chat["last_chat_content"] = chatNewData["data"];
                break;
              case 1:
                chat["last_chat_content"] = "[图片]";
                break;
              case 2:
                chat["last_chat_content"] = "[商品]";
                break;
              case 3:
                chat["last_chat_content"] = "[订单]";
                break;
              }
              chat["un_read_num"]++;
              chat["updated_at"] = chatNewData["time"];
              this.$set(this.employeeChatList, chat["uid"], chat);
            } else {
              this.$set(this.employeeChatList, chat["uid"], chatNewData);
            }
          }
        };
        socketInstance.onerror = error => {
          socketInstance.close();
          this.socketReconnet();
          socketInstance = null;
        };
        socketInstance.onopen = () => {
          this.checkSocketConnectState();
        };
        socketInstance.close = () => {
          clearInterval(websocketConntectCheckTimer);
          websocketConntectCheckTimer = null;
        };
      }
    },
    socketReconnet() {
      if (websocketReconnectTimer !== null) {
        return;
      }
      websocketReconnectTimer = setInterval(() => {
        websocketReconnetCount++;
        this.socketInit();
        if (websocketReconnetCount >= websocketMaxReconnetCount) {
          clearInterval(websocketReconnectTimer);
          websocketReconnectTimer = null;
          VanNotify("网路连接不可用");
        }
      }, 5000);
    },
    checkSocketConnectState() {
      if (websocketConntectCheckTimer !== null) {
        return;
      }
      websocketConntectCheckTimer = setInterval(() => {
        if (socketInstance) {
          if (socketInstance.readyState == 1) {
            socketInstance.send(JSON.stringify({ type: "ping" }));
            websocketReconnetCount = 0;
          } else {
            clearInterval(websocketConntectCheckTimer);
            websocketConntectCheckTimer = null;
            socketInstance.close();
            this.socketReconnet();
          }
        } else {
          clearInterval(websocketConntectCheckTimer);
          websocketConntectCheckTimer = null;
        }
      }, 5000);
    }
  },
  components: {
    DTitle,
    DList,
    ChatListItem
  }
};
</script>

<style scoped>
.content {
  background: #fff;
}
</style>
