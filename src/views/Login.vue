<template>
  <div class="login">
    <section class="content">
      <div class="content-inner">
        <div class="title">
          <h1>广联储广告投放平台</h1>
          <div class="tips">Integral Management Background</div>
        </div>

        <div class="login-image"></div>

        <el-form :model="form" :rules="formRules" ref="loginForm">
          <el-form-item prop="userName">
            <el-input v-model="form.userName" placeholder="账号"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" v-model="form.password" placeholder="密码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="submit" @click="submit">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </section>
    <footer class="footer">
      Copyright © 2019 深圳玖昔科技发展股份有限公司
    </footer>
  </div>
</template>

<script>
import { loginApi, sendValidCodeApi } from '../api/services/login'
import { checkUrl } from '../utils/index'

export default {
  name: 'login',
  data() {
    return {
      form: {
        userName: '', // 账号
        password: '' // 密码
      },
      formRules: {
        userName: {
          required: true, message: '请输入账户', trigger: 'blur'
        },
        password: {
          required: true, message: '请输入密码', trigger: 'blur'
        }
      }
    }
  },
  methods: {
    submit() {
      let _this = this

      _this.$refs.loginForm.validate(valid => {
        // 登录
        loginApi(_this.form).then(res => {
          _this.$message({
            message: '短信验证码发送成功',
            type: 'success'
          })

          _this.sendValidCode()
        })
      })
    },

    // 发送短信验证码
    sendValidCode() {
      let _this = this

      _this.$prompt('请输入短信验证码', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValidator(val) {
          if (val === '' || val === undefined || val === null) {
            return '请输入短信验证码'
          }

          return true
        }
      }).then(({ value }) => {
        sendValidCodeApi({
          code: value
        }).then(res => {
          let historyRoute = sessionStorage.getItem('historyUrl')

          _this.ConfirmButtonLoading = false

          // 存储用户登录token
          sessionStorage.setItem('t', res)
          sessionStorage.setItem('userName', _this.form.userName)

          _this.$store.dispatch('setUserName', _this.form.userName)

          if (checkUrl(historyRoute)) {
            location.href = historyRoute
          } else if (historyRoute && historyRoute != '/login') {
            _this.$router.push({ path: historyRoute })
          } else {
            _this.$router.push({
              path: '/'
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        })
      })
    }
  }
}
</script>

<style lang="less">
.login {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100vw;
  height: 100vh;
  background: #2D3340;

  .content {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;

    .content-inner {
      position: relative;
      box-sizing: border-box;
      width: 480px;
      height: 408px;
      padding: 0 40px;
      border-radius: 8px;
      background: #fff;

      .title {
        padding: 32px 0 63px;

        h1 {
          font-size: 32px;
          line-height: 45px;
          color: #333;
        }

        .tips {
          font-size: 14px;
          line-height: 20px;
          color: #606166;
        }
      }

      .login-image {
        position: absolute;
        top: -58px;
        right: 11px;
        width: 186px;
        height: 179px;
        background: url('../assets/login.png') no-repeat center;
        background-size: 100%;
      }

      .el-input {
        .el-input__inner {
          font-size: 16px;
          height: 56px;
          line-height: 56px;
        }
      }

      .submit {
        width: 100%;
        height: 56px;
        font-size: 20px;
        border-radius: 4px;
      }
    }
  }

  .footer {
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: 100%;
    height: 48px;
    border-top: 8px solid #4D5AFF;
    font-size: 12px;
    color: #fff;
    background: #1D2026;
  }
}
</style>
