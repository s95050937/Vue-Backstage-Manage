<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首頁</el-breadcrumb-item>
      <el-breadcrumb-item>用戶管理</el-breadcrumb-item>
      <el-breadcrumb-item>用戶列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="14">
          <el-input placeholder="请输入用戶内容" class="input-with-select" v-model="queryInfo.query" @change="searchUser" clearable @clear="searchUser">
            <el-button slot="append" icon="el-icon-search" @click="searchUser" ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addUserDialogVisible = true">添加用戶</el-button>
        </el-col>
      </el-row>

      <el-table :data="userList" border :stripe="true" >
        <el-table-column type="index" align="center"></el-table-column>
        <el-table-column prop="username" label="姓名" header-align="center" align="center"></el-table-column>
        <el-table-column prop="email" label="郵箱" header-align="center" align="center"></el-table-column>
        <el-table-column prop="mobile" label="電話" header-align="center" align="center"></el-table-column>
        <el-table-column prop="role_name" label="角色" header-align="center" align="center"></el-table-column>
        <el-table-column prop="" label="狀態" header-align="center" align="center">
          <!-- 這裡要尋找其他方法 -->
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="changeUserState(scope.row)"
              >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="" label="操作" width="200px" header-align="center" align="center">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="修改用戶" placement="top">
              <el-button size="mini" type="primary" icon="el-icon-edit" @click=" showEditDialog(scope.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="刪除用戶" placement="top" >
              <el-button size="mini" type="danger" icon="el-icon-delete"
              @click="DeleteUser(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="分配角色" placement="top" >
              <el-button size="mini" type="warning" icon="el-icon-menu" @click="roleSetClick(scope.row)"></el-button>
            </el-tooltip>
            
      
          </template>
        </el-table-column>
      </el-table>
      
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalUser">
      </el-pagination>
    </el-card>
    

    <!-- dialogue區塊 -->
    <!-- 添加用戶 -->
    <el-dialog  
      title="添加用戶"
      :visible.sync="addUserDialogVisible"
      width="65%"
      @close="addFormReset"
      >
      <el-form :model="addUserForm" :rules="addUserRules" ref="addUserFormRef" label-width="100px" class="demo-ruleForm">
        <el-form-item label="用戶名" prop="username">
          <el-input v-model="addUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="郵箱" prop="email">
          <el-input v-model="addUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="電話" prop="mobile">
          <el-input v-model="addUserForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="密碼" prop="password">
          <el-input v-model="addUserForm.password"></el-input>
        </el-form-item>
      </el-form>


      <span slot="footer" class="dialog-footer">
        <el-button @click="addUserDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="CheckAddValidate" >確 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用戶 -->
    <el-dialog
      title="提示"
      :visible.sync="editUserDialogVisible"
      width="50%"
    >
      <el-form :model="editUserForm" :rules="editUserRules" ref="editUserFormRef" label-width="100px" class="demo-ruleForm">
        <el-form-item label="用戶名" >
          <el-input v-model="editUserForm.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="郵箱" prop="email">
          <el-input v-model="editUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="電話" prop="mobile">
          <el-input v-model="editUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editUserDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="CheckEditValidate" >確 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色 -->
    <el-dialog
      title="分配角色"
      :visible.sync="roleSetdialogVisible"
      width="50%"
      @close="closeSetRoleDialogue"
    >
      <el-card>
        <div class="role-set-box">
          <p>當前用戶:</p>
          <el-tag type="warning" size="mini">{{userInfo.username}}</el-tag>
        </div>
        <div class="role-set-box">
          <p>當前角色:</p>
          <el-tag type="success" size="mini">{{userInfo.role_name}}</el-tag>
        </div>
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option
              v-for="item in totalRolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
      </el-card>
      <span slot="footer" class="dialog-footer">
        <el-button @click="roleSetdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">確 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'users',
  data() {
    var checkMobile = (rule, value, callback) => {
      rule = /^09[0-9]{8}$/
      if(rule.test(value) == true) {
        return callback()
      }
      callback(new Error('請輸入正確手機號碼'))
    }

    return {
      userList: [],
      totalUser: 0,
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      addUserDialogVisible: false,
      addUserForm: {
        username: 'testtest',
        email: 'aaa@gmail.com',
        password: 'ccc123456',
        mobile: '0962545219' ,
      },
      addUserRules: {
        username: [
            { required: true, message: '請輸入用戶名', trigger: 'blur' },
            { min: 3, max: 10, message: '長度在三到十個字符', trigger: 'blur' }
          ],
        password: [
            { required: true, message: '請輸入密碼', trigger: 'blur' },
            { min: 3, max: 10, message: '長度在三到十個字符', trigger: 'blur' }
          ],
        email: [
          { required: true, message: '請輸入郵箱', trigger: 'blur' },
          { type: 'email', message: '請輸入正確的郵箱', trigger: ['blur', 'change'] }
        ],
        mobile: [
          { required: true, message: '請輸入電話', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      editUserDialogVisible: false,
      editUserForm: {
        
      },
      editUserRules: {
        email: [
          { required: true, message: '請輸入郵箱', trigger: 'blur' },
          { type: 'email', message: '請輸入正確的郵箱', trigger: ['blur', 'change'] }
        ],
        mobile: [
          { required: true, message: '請輸入電話', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      roleSetdialogVisible: false,
      userInfo: {},
      totalRolesList: [],
      selectedRoleId: ''
    }
  },
  created() {
    this.getUserData()
  },  
  methods: {
    async getUserData() {
      let {data: res} = await this.$http.get('users',{
        params: this.queryInfo
      })
      this.userList = res.data.users
      this.totalUser = res.data.total
      
    },
    handleSizeChange(pageSize) {
      this.queryInfo.pagesize = pageSize
      this.getUserData()
    },
    handleCurrentChange(currentPage) {
      this.queryInfo.pagenum = currentPage
      this.getUserData()
      
    },
    async changeUserState(userInfo) {
      // console.log(userInfo);
      let {data:res} = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)

      if (res.meta.status !== 200) {
        return this.$message.error('更新狀態失敗')
      }
      this.$message.success('更新狀態成功')
      
    },
    searchUser() {
      this.getUserData()
    },
    addFormReset() {
      this.$refs.addUserFormRef.resetFields()
    },
    CheckAddValidate() {
      // addUserDialogVisible = false,
      this.$refs.addUserFormRef.validate(async valid => {
        if(!valid == true) return 
        let {data : res} = await this.$http.post('users', this.addUserForm)    
            
        if(res.meta.status !== 201 ) return this.$message.error('添加失敗')
        this.$message.success('添加成功')
        this.addUserDialogVisible = false

        // 記得要刷新
        this.getUserData()
      })
    },
    async showEditDialog(id) {
      console.log(id);
      
      
      let {data: res} = await this.$http.get('users/' + id)
      console.log(res);
      
      if(res.meta.status !== 200) return this.$message.error('未獲得修改用戶的資料')
      this.$message.success('成功獲得修改用戶資料')

      this.editUserForm = res.data
      this.editUserDialogVisible = true
    },
    CheckEditValidate() {
      this.$refs.editUserFormRef.validate( async valid => {
        if (!valid) return 
        let {data: res} = await this.$http.put('users/' + this.editUserForm.id,{
          mobile: this.editUserForm.mobile,
          email: this.editUserForm.email
        })   
        console.log(res);
        
        if (res.meta.status !== 200) return this.$message.error('修改失敗')
        this.editUserDialogVisible = false
        this.getUserData()
        this.$message.success('修改成功')
      })
    },
    async DeleteUser(id) {
      const confirmRes = await this.$confirm('是否要刪除該用戶', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => {
        return err
      })  
      if(confirmRes == 'cancel') {
        this.$message.error('已取消刪除')
      }
      let {data: res} = await this.$http.delete('users/' + id)
      
      if(res.meta.status !== 200) return this.$message.error('刪除用戶失敗')
      this.$message.success('已成功刪除用戶')

      this.getUserData()
    },
    async roleSetClick(userInfo) {
      this.userInfo = userInfo
      let {data: res} = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error('獲取所有角色種類失敗')
      this.$message.success('獲取所有角色種類成功')
      this.totalRolesList = res.data
      console.log(res.data);
      
      this.roleSetdialogVisible = true
    },
    async saveRoleInfo() {
      // if(!selectedId) {
        
      // }
      let {data: res} = await this.$http.put(`users/${this.userInfo.id}/role`,{
        rid: this.selectedRoleId
      })
      if(res.meta.status !== 200) {
        return this.$message.error('變更角色失敗')
      } 
      this.$message.success('成功更換角色')
      this.getUserData()
      this.roleSetdialogVisible = false
    },
    closeSetRoleDialogue() {
      this.selectedRoleId = ''
    }
  }
}
</script>
<style lang="less" scoped>
.el-table {
  margin-top: 20px;
}

.el-pagination {
  margin-top: 20px;

  display: flex;
  justify-content: center;
  align-items: center;
}
.role-set-box {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  .el-tag {
    margin-left: 5px;
  }
}
</style>