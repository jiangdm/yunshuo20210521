<template>
  <span class="txt-content" v-html="item.content"></span>
</template>
<script>
export default {
  props: ["item"],
  mounted() {
    this.$emit("loaded");
  }
};
</script>

<style>
#chat-data .txt-content img {
  width: 100%;
}
</style>