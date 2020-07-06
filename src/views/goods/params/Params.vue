<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>參數列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert
        title="請選擇商品分類"
        type="warning"
        :closable="false"
        show-icon
      >
      </el-alert>
      <el-row class="choose-cate-type-box">
        <el-col >
          <span>選擇商品分類:</span>
          <el-cascader :options="cateList" clearable :props="ChoseCateProps" v-model="selectedCateKey" @change="selectedCateChange"></el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeParamTabName" @tab-click="handleTabClick">
        <el-tab-pane label="動態參數" name="many">
          <el-button type="primary" :disabled="isAddBtnCanClick" @click="showAddParamsDialogue">添加參數</el-button>
        </el-tab-pane>
        <el-tab-pane label="靜態屬性" name="only">
          <el-button type="primary" :disabled="isAddBtnCanClick" @click="showAddParamsDialogue">添加屬性</el-button>
        </el-tab-pane>
      </el-tabs>

      <el-table
        :data="paramList"
        stripe
        style="width: 100%"
        :border="true"
      >
        <el-table-column
          type="expand"
        >
        </el-table-column>
        <el-table-column
          type="index"
          width="180"
          align="center" 
          header-align="center"
        >
        </el-table-column>
        
        <el-table-column
          prop="attr_name"
          label="參數名稱"
          align="center" 
          header-align="center"
          v-if="activeParamTabName == 'many'"
        >
        </el-table-column>
        <el-table-column
          prop="attr_name"
          label="屬性名稱"
          align="center" 
          header-align="center"
          v-else
        >
        </el-table-column>
        <el-table-column
          prop="name"
          label="操作"
          width="230"
          align="center" 
          header-align="center"
        >
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditParamsDialogue(scope.row.attr_id)">修改</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteParams(scope.row.attr_id)">刪除</el-button>
          </template>
        </el-table-column>
      
      </el-table>
    </el-card>
    <!-- 添加參數 -->
    <el-dialog
      title="添加動態參數"
      :visible.sync="addParamsDialogVisible"
      width="50%"
      @close="addParamsDialogClose"
    >
      <el-form :model="addParamsForm" :rules="addParamsFormRules" ref="addParamsFormRef" label-width="100px" class="demo-ruleForm">
        <el-form-item label="動態參數" prop="attr_name">
          <el-input v-model="addParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addParamsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmAddParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改參數 -->
    <el-dialog
      title="修改動態參數"
      :visible.sync="editParamsDialogVisible"
      width="50%"
      @close="editParamsDialogClose"
    >
      <el-form :model="editParamsForm" :rules="editParamsFormRules" ref="editParamsFormRef" label-width="100px" class="demo-ruleForm">
        <el-form-item label="動態參數" prop="attr_name">
          <el-input v-model="editParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editParamsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmEditParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'params',
  data() {
    return {
      cateList: [],
      ChoseCateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      selectedCateKey: [],
      activeParamTabName: 'many',
      paramList: [],
      addParamsDialogVisible: false,
      addParamsForm: {
        attr_name: ''
      },
      addParamsFormRules: {
        attr_name: [
          { required: true, message: '請輸入參數名稱', trigger: 'blur' },
        ]
      },
      editParamsDialogVisible: false,
      editParamsForm: {
        attr_name: ''
      },
      editParamsFormRules: {
        attr_name: [
          { required: true, message: '請輸入參數名稱', trigger: 'blur' },
        ]
      }
    }
  },
  methods: {
    async getCateListData() {
      let {data: res} = await this.$http.get('categories')
      if(res.meta.status !== 200) return this.$message.error('獲取商品分類失敗')
      this.$message.success('獲取商品分類成功')
      this.cateList = res.data
      
    },
    selectedCateChange() {
      this.getParamsData()
    },
    handleTabClick() {
      // console.log(this.activeParamTabName);
      this.getParamsData()
    },
    async getParamsData() {
      if (this.selectedCateKey.length !== 3)  {
        return this.selectedCateKey = []
      }   
       
      let {data: res} = await this.$http.get(`categories/${this.selectedCateId}/attributes`, {
        params: {sel: this.activeParamTabName}
      })
      console.log(res.data);
      if(res.meta.status !== 200) return this.$message.error('獲取分頁資料失敗')
      this.$message.success('獲取分頁資料成功')
      
      console.log(res.data);
      
      this.paramList = res.data
    },
    showAddParamsDialogue() {
      this.addParamsDialogVisible = true
    },
    addParamsDialogClose() {
      this.$refs.addParamsFormRef.resetFields()
    },
    confirmAddParams() {
      this.$refs.addParamsFormRef.validate(async valid => {
        if (!valid) return 
        let {data: res} = await this.$http.post(`categories/${this.selectedCateId}/attributes`, {
          attr_name: this.addParamsForm.attr_name,
          attr_sel: this.activeParamTabName
        })
        if (res.meta.status !== 201) return this.$message.error('新增變數失敗')
        this.$message.success('新增變數成功')

        this.getParamsData()
        this.addParamsDialogVisible = false
        
      })
    },
    async showEditParamsDialogue(attr_id) {
      let {data: res} = await this.$http.get(`categories/${this.selectedCateId}/attributes/${attr_id}`,{
        params: {
          attr_sel: this.activeParamTabName
        }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('獲取參數信息失敗')
      }
      this.$message.success('獲取參數信息成功')

      this.editParamsForm = res.data
      this.editParamsDialogVisible = true
      
    },
    editParamsDialogClose() {
      this.$refs.editParamsFormRef.resetFields()
    },
    confirmEditParams() {
      this.$refs.editParamsFormRef.validate(async valid => {
        if(!valid) return 
        let {data: res} = await this.$http.put(`categories/${this.selectedCateId}/attributes/${this.editParamsForm.attr_id}`, {
          attr_name: this.editParamsForm.attr_name,
          attr_sel: this.activeParamTabName
        })
        console.log(res);
        
        if (res.meta.status !== 200) {
          return this.$message.error('修改參數失敗')
        }
        this.getParamsData()
        this.editParamsDialogVisible = false

        this.$message.success('修改參數成功')
      })
    },
    async deleteParams(attr_id) {
      const deleteResult = await this.$confirm('是否要刪除該參數', '刪除參數', {
          confirmButtonText: '確定',
          cancelButtonText: '取消',
          type: 'warning'
      }).catch(err => err)
      console.log(deleteResult);
      if (deleteResult === 'cancel') {
        return this.$message.info('已取消刪除參數')
      }
      const {data: res} = await this.$http.delete(`categories/${this.selectedCateId}/attributes/${attr_id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('刪除參數失敗')
      }
      this.$message.success('刪除參數成功')
      this.getParamsData()
    }
  },
  computed: {
    isAddBtnCanClick() {
      if(this.selectedCateKey.length !== 3) return true
      return false
    },
    selectedCateId() {
      return this.selectedCateKey[2]
    },

  },
  created() {
    this.getCateListData()
  },

}
</script>

<style lang="less" scoped>
.el-alert {
  margin-bottom: 20px;
}
.choose-cate-type-box {
  span {
    margin-right: 15px;
  }
}
.el-tabs {
  .el-button {
    margin-bottom: 20px;
  }
}
</style>