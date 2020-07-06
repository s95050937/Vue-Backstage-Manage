<template>
  <div class="login-container">
    <div class="login-box">
      <div class="avatar-box">
        <img src="../../assets/img/logo.png" alt="">
      </div>
      <el-form ref="loginForm" label-width="0px" class="login-form" :rules="loginRule" :model="loginInfo">
        <el-form-item prop="username">
          <el-input prefix-icon="el-icon-user-solid" v-model="loginInfo.username" placeholder="帳號" ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input prefix-icon="el-icon-lock" v-model="loginInfo.password" type="password" placeholder="密碼"></el-input>
        </el-form-item>
        <el-form-item class="btn-box">
          <el-button type="success" plain @click="Checklogin">登入</el-button>
          <el-button type="danger" plain @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-dialog
      title="警告"
      :visible.sync="loginDialogVisible"
      width="50%"
    >
      <h1>
        刪除數據前請先添加數據，但若要添增數據則沒關係
      </h1>
      <span slot="footer" class="dialog-footer">
        <el-button @click="loginDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="loginDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      loginInfo: {
        // el-form裡面的:model一定要有
        // 初始值
        username: 'admin',
        password: '123456'
      },
      loginRule: {
        username: [
            { required: true, message: '請輸入用戶名稱', trigger: 'blur' },
            { min: 3, max: 10, message: '長度為3到10個字符', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '請輸入密碼', trigger: 'blur' },
            { min: 3, max: 10, message: '長度為3到10個字符', trigger: 'blur' }
          ]
      },
      loginDialogVisible: true
    }
  },
  methods: {
    resetLoginForm () {
      // 把該表單的數值權變回初始值
      this.$refs.loginForm.resetFields()
    },
    Checklogin () {
      this.$refs.loginForm.validate(async valid => { // 變數名稱可以設置valid
        if(!valid) return ;
        const {data: res} = await this.$http.post('login',this.loginInfo)
        console.log(res);
        
        if (res.meta.status !== 200) {
          return this.$message({
            showclose: true,
            message: '登入失敗',
            type: 'error'
          })
        } 
        this.$message({
          showclose: true,
          message: '登入成功',
          type: 'success'
        })  
        window.sessionStorage.token = res.data.token

        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  background-color: #2b4b6b;
  height: 100vh;
}
.login-box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;

  position: relative;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  
}
.avatar-box {
  width: 130px;
  height: 130px;
  border: 3px solid #eee;
  border-radius: 50%;
  padding: 3px;
  box-shadow: 0 0 10px #ddd;
  background-color: #fff;

  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  img {
    width: 100%;
    height: 100%;
    border-radius: 100%;
    background-color: #eee;

    // transform: translate();
  }
}
.login-form {
  position: absolute;
  bottom: 0;
  // 不要這麼做
  // width: 80%;
  
  width: 100%;
  padding: 20px;
}
.btn-box {
  display: flex;
  justify-content: flex-end;
}
</style>
