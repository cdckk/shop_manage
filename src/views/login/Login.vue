<template>
  <div class="login">
    <div class="login-content">
      <!-- 头像区域 -->
      <div class="avator_box">
          <img src="../../assets/logo.png" alt="">
      </div>

      <!-- 登录表单区域 -->
      <el-form rlabel-width="80px"
              class="form"
              :model="loginForm"
              :rules="rules"
              ref="refForm">
        <!-- 用户名 -->
        <el-form-item label="用户名" prop="username">
            <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item label="密码" prop="password">
            <el-input v-model="loginForm.password" prefix-icon="iconfont icon-3702mima" type="password"></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
            <el-button type="primary" @click="login">登录</el-button>
            <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { loginRequest } from '../../api/login'
export default {
  data() {
    return {
      //登录表单的数据绑定对象
      loginForm: {
        username: 'admin',
        password: '123456',
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  components: {

  },
  methods: {
    //登录校验
    login() {
      this.$refs.refForm.validate((res) => {
        console.log(res)
        if(res) {
          this.$message.success('登录成功')
          loginRequest(this.loginForm).then(res => {
            //保持token到sessionStorage中
            window.sessionStorage.setItem("token", res.data.data.token)
            this.$router.push('/home')
          })
        } else {
          this.$message.error('登录失败')
        }
      })
    },
    //对整个表单进行重置
    resetLoginForm() {
      this.$refs.refForm.resetFields()
    }
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
            padding: 0 20px;
            .btns {
              position: relative;
              left: 200px;
            }
          }
        }
    }
</style>
