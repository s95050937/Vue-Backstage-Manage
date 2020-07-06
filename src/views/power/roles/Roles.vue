<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首頁</el-breadcrumb-item>
      <el-breadcrumb-item>權限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-button type="primary">新增角色</el-button>
      <el-table :data="rolesList" border :stripe="true" >
        <el-table-column type="expand" align="center">
          <template slot-scope="scope">
            <el-row v-for="(item1, index) in scope.row.children" :key="item1.id" class="border-top border-bottom role-expend vcenter">
              <el-col :span="5" class="role-expand-tag-center">
                <el-tag>{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row v-for="(item2, index) in item1.children" :key="item2.id" class="border-top border-bottom role-expend vcenter">
                  <el-col :span="6">
                    <el-tag type="success">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18" >
                    <el-tag type="warning" v-for="(item3, index) in item2.children" :key="item3.id" class="role-expand-tag3" closable @close="removeRightById(scope.row, item3.id)">{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
              
          
          </template>
        </el-table-column>
        <el-table-column type="index" align="center"></el-table-column>
        <el-table-column prop="roleName" label="角色名稱" header-align="center" align="center"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" header-align="center" align="center"></el-table-column>
        <el-table-column prop="level" label="操作" header-align="center" align="center" width="300px">
          <template slot-scope="scope">
           <el-button type="primary" icon="el-icon-edit" size="mini">編輯</el-button>
           <el-button type="danger" icon="el-icon-delete" size="mini">刪除</el-button>
           <el-button type="warning"  icon="el-icon-s-cooperation" size="mini" @click="showSetDialogue(scope.row)">變更權限</el-button>
          </template>
        </el-table-column>
        
      </el-table>
    </el-card>

    <!-- 變更權限對話框 -->
    <el-dialog
      title="權限配置"
      :visible.sync="setRightsdialogVisible"
      width="50%"
      @close="resetRightsCheckedList"
      >
      <el-tree :data="rightList" :props="rightsTreeProps" show-checkbox default-expand-all node-key="id" :default-checked-keys="RightsCheckedList" ref="rightsTree"></el-tree>
      <span slot="footer" class="dialog-footer"  >
        <el-button @click="setRightsdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights" >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'roles',
  data() {
    return {
      rolesList: [],
      setRightsdialogVisible: false,
      rightList: [],
      rightsTreeProps: {
        label: 'authName',
        children: 'children',
      },
      RightsCheckedList: [
      ]
    }
  },
  methods: {
    async getRoleListData() {
      let {data: res} = await this.$http.get('roles')
      
      if (res.meta.status !== 200) return this.$message.error('獲取角色失敗')
      this.$message.success('成功獲取角色')
      this.rolesList = res.data
      
    },
    async removeRightById(role, rightId) {
      let isRemoveRightTag  = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).catch(err => {
        return err
      })
      if (isRemoveRightTag == 'cancel') return this.$message.error('您已取消刪除')     
      let {data: res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      if(res.meta.status !== 200) {
        return this.$message.error('刪除用戶失敗')
      }
      role.children = res.data
    },
    async showSetDialogue(role) {
      this.roleId = role.id
      this.setRightsdialogVisible = true
      let {data: res} = await this.$http.get('rights/tree')

      if(res.meta.status !== 200) return this.$message.error('獲取權限資料失敗')
      
      this.rightList = res.data
      this.$message.success('成功獲取權限資料')

      
      this.getThirdNodeId(role, this.RightsCheckedList)
      
    },
    getThirdNodeId(node,arr) {
      
      if(!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getThirdNodeId(item, arr)
      })
      
      
    },
    resetRightsCheckedList() {
      this.RightsCheckedList = []
    },
    async allotRights() {
      let checkedIdArr = [...this.$refs.rightsTree.getCheckedKeys(), ...this.$refs.rightsTree.getHalfCheckedKeys()]

      let idStr = checkedIdArr.join(',')
      
      let {data: res} = await this.$http.post(`roles/${this.roleId}/rights`,{rids: idStr})
      console.log(res);
      
      if(res.meta.status !== 200) return this.$message.error('更改權限失敗')
      this.$message.success('更改成功')

      this.getRoleListData()
      this.setRightsdialogVisible = false
      
    }
  },
  created() {
    this.getRoleListData()
  }
}
</script>

<style lang="less" scoped>
.el-table {
  margin-top: 20px;
} 
.border-top {
  border-top: 1px solid #eee;
}
.border-bottom:last-child {
  border-bottom: 1px solid #eee;
}
.role-expend {
  padding: 10px 0;
}
.role-expand-tag3 {
  margin: 5px;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>