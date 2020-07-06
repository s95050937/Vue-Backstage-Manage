<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>用戶分類</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-button type="primary" @click="showAddCateDialogue">添加分類</el-button>
      </el-row>

        <el-table
          :data="cateList"
          style="width: 100%;margin-bottom: 20px;"
          row-key="cat_id"
          border
          stripe
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
          <el-table-column
            type="index"
            width="50">
          </el-table-column>
          <el-table-column
            prop="cat_name"
            label="分類名稱"
            sortable
            width="180">
          </el-table-column>
          <el-table-column
            prop="name"
            label="是否有效"
            sortable
            width="110"
            align="center"
            
            >
            <template slot-scope="scope">
              <i class="el-icon-success " v-if="scope.row.cat_deleted == false" style="color: lightgreen"></i>              
              <i class="el-icon-error" style="color: red" v-else></i>              
            </template>
          </el-table-column>
          <el-table-column
            label="排序"
            align="center"  
          >
            <template slot-scope="scope">
              <el-tag v-if="scope.row.cat_level == 0">一級</el-tag>
              <el-tag type="warning" v-else-if="scope.row.cat_level == 1">二級</el-tag>
              <el-tag type="danger" v-else>三級</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="address"
            label="操作"
            width="170px"
            header-align="center"
            align="center"
          >
            <el-button type="primary" size="mini">編輯</el-button>
            <el-button type="danger" size="mini">刪除</el-button>
          </el-table-column>
        </el-table>

        <el-pagination
          @size-change="handleCateSizeChange"
          @current-change="handleCatePageNumChange"
          :current-page="querInfo.pagenum"
          :page-sizes="[5, 10, 20, 50]"
          :page-size="querInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="TotalCate">
        </el-pagination>
    </el-card>

    <!-- 添加分類 -->
    <el-dialog
      title="添加分類"
      :visible.sync="addCatedialogVisible"
      width="50%"
      @close="addCateDialogClosed"
    >
      <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px" class="demo-ruleForm">
        <el-form-item label="分類名稱" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父級分類" >
          <el-cascader :options="ParentCateList" :props="cateCascaderProps" clearable v-model="selectedAddCateKeys" @change="changedSelectedCate" change-on-select="true"></el-cascader>
        </el-form-item>
      </el-form>
      
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCatedialogVisible = false">取消</el-button>
        <el-button type="primary" @click="ConfirmAddCate">確定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: 'categories',
  data() {
    return {
      cateList: [],
      querInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      TotalCate: 0,
      addCatedialogVisible: false,
      addCateForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      addCateFormRules: {
        cat_name: [
          {required: true, message: '请输入分類名稱', trigger: 'blur' }
        ]
      },
      ParentCateList: [],
      cateCascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      selectedAddCateKeys: []
    }
  },
  methods: {
    async getCateData() {
      let {data: res} = await this.$http.get('categories',{
        params: this.querInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('獲取分類資料失敗')
      }
      console.log(res.data);
      
      this.$message.success('獲取分類資料成功')
      this.cateList = res.data.result
      this.TotalCate = res.data.total
    },
    handleCateSizeChange(pageSize) {
      this.querInfo.pagesize = pageSize
      this.getCateData()
    },
    handleCatePageNumChange(pageNum){
      this.querInfo.pagenum = pageNum
      this.getCateData()

    },
    showAddCateDialogue() {
      this.getParentCateListData()

      // 這裡會是undefined因為異步操作
      // console.log(this.ParentCateList);
      

      this.addCatedialogVisible = true
    },
    async getParentCateListData() {
      let {data: res} = await this.$http.get('categories',{
        params: {
          type: 2
        }
      })
      if(res.meta.status !== 200) return this.$message.error('獲取所有父分類失敗')
      this.$message.success('獲取所有父分類成功')
      
      this.ParentCateList = res.data
    },
    changedSelectedCate() {
      console.log(this.selectedAddCateKeys);
      if(this.selectedAddCateKeys.length > 0){
        this.addCateForm.cat_level = this.selectedAddCateKeys.length
        this.addCateForm.cat_pid = this.selectedAddCateKeys[this.selectedAddCateKeys.length-1]
        return 
      } else {
        this.addCateForm.cat_level = 0
        this.addCateForm.cat_pid = 0
      }
    },
    ConfirmAddCate() {
       this.$refs.addCateFormRef.validate(async valid => {
        if(!valid) return 
        let {data: res} = await this.$http.post('categories', this.addCateForm)
        console.log(res);
        
        if(res.meta.status !== 201) return this.$message.error('添加新分類失敗')
        this.$message.success('添加新分類成功')

        this.getCateData()
        this.addCatedialogVisible = false
      })     
    },
    addCateDialogClosed() {
        this.$refs.addCateFormRef.resetFields()
      this.selectedAddCateKeys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    }
  },
  created() {
    this.getCateData()
  }
}
</script>

<style lang="less" scoped>
.el-table {
  margin-top: 20px;
}
.el-cascader {
  width: 100%;
}
</style>