<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首頁</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="14">
          <el-input placeholder="请输入商品内容" class="input-with-select" v-model="queryInfo.query" @change="searchGoods" clearable @clear="searchGoods">
            <el-button slot="append" icon="el-icon-search" @click="searchGoods" ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addGoods">添加商品</el-button>
        </el-col>
      </el-row>

      <el-table :data="goodsList" border :stripe="true" >
        <el-table-column type="index" align="center"></el-table-column>
        <el-table-column prop="goods_name" label="商品名稱" header-align="center" width="200px"></el-table-column>
        <el-table-column prop="goods_price" label="商品價格" header-align="center"  align="center"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" header-align="center"  align="center"></el-table-column>
        <el-table-column prop="add_time" label="創建時間" header-align="center"  align="center"></el-table-column>
        <el-table-column prop="" label="操作" width="150px" header-align="center" align="center">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="修改用戶" placement="top">
              <el-button size="mini" type="primary" icon="el-icon-edit" @click=" showEditDialog(scope.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="刪除用戶" placement="top" >
              <el-button size="mini" type="danger" icon="el-icon-delete"
              @click="DeleteGoods(scope.row.goods_id)"
              ></el-button>
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
        :total="totalGoods">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'goods',
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      totalGoods: 0,
      goodsList: [],

    }
  },
  methods: {
    searchGoods() {
      this.getGoodsData()
    },
    async getGoodsData() {
      let {data: res} = await this.$http.get('goods',{
        params: this.queryInfo
      })
      // console.log(res);
      
      if (res.meta.status !== 200) {
        return this.$message.error('獲取商品資料失敗')
      }
      this.$message.success('獲取商品資料成功')

      this.goodsList = res.data.goods
      this.totalGoods = res.data.total

    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsData()
    },
    handleCurrentChange(newPageNum) {
      this.queryInfo.pagenum = newPageNum
      this.getGoodsData()
    },
    showEditDialog(id) {
      this.$message.error('尚未完成')
    },
    async DeleteGoods(id) {
      const deleteResult = await this.$confirm('是否要刪除該商品', '刪除商品', {
          confirmButtonText: '確定',
          cancelButtonText: '取消',
          type: 'warning'
      }).catch(err => err)
      if (deleteResult === 'cancel') {
        return this.$message.info('已取消刪除該商品')
      }
      const {data: res} = await this.$http.delete(`goods/${id}`)

      // console.log(res);
      
      if (res.meta.status !== 200) {
        return this.$message.error('刪除商品失敗')
      }
      this.$message.success('刪除商品成功')
      this.getGoodsData()
    },
    addGoods() {
      this.$router.push('/goods/add')
    },
    
  },
  created() {
    this.getGoodsData()
  }
}
</script>

<style lang="less" scoped>
.el-table {
  margin: 20px 0;
}
</style>