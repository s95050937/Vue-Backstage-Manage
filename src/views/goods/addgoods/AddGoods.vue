<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-alert
        title="添加商品訊息"
        type="info"
        show-icon
      >
      </el-alert>
      <el-steps :space="200" :active="addedActiveIndex - 0" finish-status="success" align-center>
        <el-step  l-step title="基本訊息"></el-step>
        <el-step title="商品參數"></el-step>
        <el-step title="商品屬性"></el-step>
        <el-step title="商品圖片"></el-step>
        <el-step title="商品內容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form :model="addedGoodsForm" :rules="AddedGoodsRules" ref="AddedGoodsFormRef" label-width="100px" class="demo-ruleForm" label-position="top">
        <el-tabs tab-position="left" v-model="addedActiveIndex" :before-leave="beforeLeaveTab" @tab-click="addedGoodsTabClick">
          <el-tab-pane label="基本訊息" name="0">
            <el-form-item label="商品名稱" prop="goods_name">
              <el-input v-model="addedGoodsForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品價格" prop="goods_price">
              <el-input v-model="addedGoodsForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品數量" prop="goods_number">
              <el-input v-model="addedGoodsForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addedGoodsForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分類" prop="goods_cat">
              <el-cascader :options="cateList" :show-all-levels="false" :props="cateProps" v-model="addedGoodsForm.goods_cat" @change="cateChangeByChoose"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品參數" name="1">
            <el-form-item :label="item.attr_name" v-for="(item, index) in choosedManyAttrList" :key="index">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="cb" v-for="(cb, i) in item.attr_vals" :key="i"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品屬性" name="2">
            <el-form-item :label="item.attr_name" v-for="(item, index) in choosedOnlyAttrList" :key="item.attr_id">
              <el-input v-model="item.attr_vals" placeholder="請輸入內容"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品圖片" name="3">
            <el-upload
              :action="uploadURL"
              :on-preview="handleUploadPreview"
              list-type="picture"
              :headers="uploadHeaderObj"
              :on-success="handleUploadSuccess"
              :on-remove="handleUploadRemove"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品內容" name="4">
            <quill-editor
              ref="myQuillEditor"
              v-model="addedGoodsForm.goods_introduce"
              class="goods-describe"
            />
            <el-button type="primary" @click="addGoodsClick">確定添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 圖片預覽 -->
    <el-dialog
      title="預覽圖片"
      :visible.sync="previewPicDialogVisible"
      width="50%"
      @close="previewPicDialogueClose"
    >
      <img :src="previewedPicPath" alt="" class="preview-img">
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'addgoods',
  data() {
    return {
      addedActiveIndex: '0',
      addedGoodsForm: {
        goods_name: '',
        goods_cat: '',
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_introduce: '',
        pics: [],
        attrs: [],
      },
      AddedGoodsRules: {
        goods_name:[
          { required: true, message: '請輸入商品名稱', trigger: 'blur' },
        ],
        goods_cat:[
          { required: true, message: '請選擇商品分類', trigger: 'blur' },
        ],
        goods_price:[
          { required: true, message: '請輸入商品價格', trigger: 'blur' },
          // { type: 'number', message: '價格必須為數字'}
        ],
        goods_number:[
          { required: true, message: '請輸入商品數量', trigger: 'blur' },
          // { type: 'number', message: '數量必須為數字'}
        ],
        goods_weight:[
          { required: true, message: '請輸入商品重量', trigger: 'blur' },
          // { type: 'number', message: '重量必須為數字'}
        ],
        goods_introduce:[
          {},
          {}
        ],
        pics:[
          {},
          {}
        ],
        attrs:[
          {},
          {}
        ],
      },
      cateList: [],
      cateProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      choosedManyAttrList: [],
      choosedOnlyAttrList: [],
      uploadURL: "http://timemeetyou.com:8889/api/private/v1/upload",
      uploadHeaderObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      previewedPicPath: '',
      previewPicDialogVisible: false,
    }
  },
  methods: {
    async getCateList() {
      let {data: res} = await this.$http.get('categories')
      
      if (res.meta.status !== 200) {
        return this.$message.error('獲取商品分類失敗')
      }
      this.$message.success('更新商品分類成功')

      console.log(res.data);
      
      this.cateList = res.data
    },
    cateChangeByChoose() {
      // this.addedGoodsForm.goods_cat = this.addedGoodsForm.goods_cat[ this.addedGoodsForm.goods_cat.length - 1 ]
    },
    beforeLeaveTab(activeName, oldActiveName) {
      if(oldActiveName == 0) {
        if( this.addedGoodsForm.goods_cat.length !== 3 ) {
          this.$message.error('請先選擇商品分類')
          return false
        }
        return true
      }
      
    },
    async addedGoodsTabClick() {
      if (this.addedActiveIndex === '1') {
        let {data: res} = await this.$http.get(`categories/${this.choosedCateId}/attributes`,{
          params: {sel: 'many'}
        })
        if (res.meta.status !== 200) {
          return this.$message.error('獲取商品參數失敗')
        }
        this.$message.success('獲取商品參數成功')

        console.log(res.data);

        res.data.forEach(item => {
          item.attr_vals = 
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        this.choosedManyAttrList = res.data
      }
      else if (this.addedActiveIndex === '2'){
        let {data: res} = await this.$http.get(`categories/${this.choosedCateId}/attributes`,{
          params: {sel: 'only'}
        })
        if (res.meta.status !== 200) {
          return this.$message.error('獲取商品參數失敗')
        }
        this.$message.success('獲取商品參數成功')

        console.log(res.data);

        // res.data.forEach(item => {
        //   item.attr_vals = 
        //     item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        // })
        this.choosedOnlyAttrList = res.data
      }
    },
    handleUploadSuccess(response, file, fileList) {
      this.addedGoodsForm.pics.push(response.data.tmp_path)
    },
    handleUploadRemove(file) {
      console.log(file);
      
      let filePath = file.response.data.tmp_path
      this.addedGoodsForm.pics = this.addedGoodsForm.pics.filter(path => {
        return path !== filePath
      })
      console.log(this.addedGoodsForm);
      
    },
    handleUploadPreview(file) {
      this.previewedPicPath = file.response.data.url
      this.previewPicDialogVisible = true
    },
    previewPicDialogueClose() {
      this.previewedPicPath = ''
    },
    async addGoodsClick() {
      this.$refs.AddedGoodsFormRef.validate(valid => {
        if (!valid) return this.$message.error('請填寫必填項') 
      })
      this.addedGoodsForm.goods_cat = this.addedGoodsForm.goods_cat.join(',')
      console.log(this.choosedManyAttrList);
      console.log(this.choosedOnlyAttrList);

      // attrs的處理
      // 不能一起處理，因為only的attr_vals是字符串
      
      this.choosedManyAttrList.forEach(item => {
        let newInfo = {
          attr_id: item.attr_id,
          attr_value: item.attr_vals.join,
        }       
        this.addedGoodsForm.attrs.push(newInfo)
      })
      this.choosedOnlyAttrList.forEach(item => {
        let newInfo = {
          attr_id: item.attr_id,
          attr_value: item.attr_vals,
        }       
        this.addedGoodsForm.attrs.push(newInfo)
      })

      console.log(this.addedGoodsForm);

      let {data: res} = await this.$http.post('goods',this.addedGoodsForm)
      if (res.meta.status !== 201) {
        return this.$message.error('更新狀態失敗')
      }
      this.$message.success('更新狀態成功')
      this.$router.push('/goods')
    }

  },
  created() {
    this.getCateList()
  },
  computed: {
    choosedCateId() {
      return this.addedGoodsForm.goods_cat[2]
    },
    
  }
}
</script>

<style lang="less" scoped>
.el-steps {
  margin: 15px 0;
}
.preview-img {
  width: 100%;
}
.goods-describe {
  margin-bottom: 20px;
}
</style>