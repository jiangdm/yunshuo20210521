<template>
  <div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  activated() {
    this.getData();
  },
  methods: {
    getData(){
      $http.post("plugin.credit-link.frontend.login.index",{
        user_mobile: this.fun.getKey('user_mobile'),
        sign: this.fun.getKey('sign'),
        app_id: this.fun.getKey('app_id'),
        timestamp: this.fun.getKey('timestamp'),
        number: this.fun.getKey('number'),
        point: this.fun.getKey('point'),
        notify_url: this.fun.getKey('notify_url'),
      },"").then(response => {
        this.$router.push(this.fun.getUrl("home"));
      })
        .catch(error => {
          this.$router.push(this.fun.getUrl("home"));
          console.log(error);
        });
    },
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

</style>