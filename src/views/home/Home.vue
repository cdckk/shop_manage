<template>
  <div class="page">
      <el-button type="info" @click="loginOut">退出</el-button>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  data() {
    return {

    }
  },
  components: {

  },
  methods: {
      loginOut() {
          window.sessionStorage.clear('token')
          this.$router.push('/login')
      }
  }
}
</script>

<style scoped lang="stylus">
</style>
