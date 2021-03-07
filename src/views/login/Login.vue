<template>
  <div class="login">
    <div class="login-content">
      <div class="avator_box">
          <img src="../../assets/logo.png" alt="">
      </div>
      <el-form rlabel-width="80px" class="form">
        <!-- 用户名 -->
        <el-form-item label="用户名">
            <el-input></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item label="密码">
            <el-input></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
            <el-button type="primary">登录</el-button>
            <el-button type="info">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  data() {
    return {

    }
  },
  components: {

  }
}
</script>

<style scoped lang="less">
    .login {
        background-color: #2b4b6b;
        height: 100%;
        .login-content {
          border-radius: 3px;
          background-color: white;
          height: 400px;
          width: 600px;
          position: absolute;
          left: 50%;
          top: 50%;
          margin: -200px 0 0 -300px;
          .avator_box {
            >img {
              height: 100px;
              width: 100px;
            }
          }
          .form {
            .btns {
              position: relative;
              left: 200px;
            }
          }
        }
    }
</style>
