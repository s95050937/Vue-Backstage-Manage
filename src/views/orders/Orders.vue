<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>訂單管理</el-breadcrumb-item>
      <el-breadcrumb-item>訂單列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="14">
          <el-input placeholder="請輸入訂單內容" class="input-with-select" v-model="queryInfo.query" @change="searchOrder" clearable @clear="searchOrder">
            <el-button slot="append" icon="el-icon-search" @click="searchOrder" ></el-button>
          </el-input>
        </el-col> 
      </el-row>

      <el-table :data="orderList" border :stripe="true" >
        <el-table-column type="index" align="center"></el-table-column>
        <el-table-column prop="order_number" label="訂單編號" header-align="center" align="center"></el-table-column>
        <el-table-column prop="order_price" label="價格" header-align="center" align="center"></el-table-column>
        <el-table-column prop="pay_status" label="是否付款" header-align="center" align="center">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.order_pay == '1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否出貨" header-align="center" align="center"></el-table-column>
        <el-table-column prop="create_time" label="下單時間" header-align="center" align="center">
          
        </el-table-column>
        <el-table-column prop="" label="操作" width="130px" header-align="center" align="center">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="修改訂單地址" placement="top-start">
              <el-button size="mini" type="primary" icon="el-icon-edit" @click=" showEditDialog(scope.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="物流消息" placement="top" >
              <el-button size="mini" type="warning" icon="el-icon-s-promotion"
              @click="orderProgressClick"
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
        :total="totalOrders">
      </el-pagination>
    </el-card>

    <!-- 修改訂單地址 -->
    <el-dialog
      title="修改訂單地址"
      :visible.sync="editOrderDialogVisible"
      width="50%"
    >
      <el-form :model="editOrderForm" :rules="editOrderRules" ref="editOrderFormRef" label-width="100px" class="demo-ruleForm">
        <el-form-item label="省市區/縣" prop="address1">
          <el-input v-model="editOrderForm.address1"></el-input>
        </el-form-item>
        <el-form-item label="詳細地址" prop="address2">
          <el-input v-model="editOrderForm.address2"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editOrderDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmEditOrder" >確 定</el-button>
      </span>
    </el-dialog>

    <!-- 物流消息 -->
    <el-dialog
      title="物流進度"
      :visible.sync="orderProgressDialogVisible"
      width="50%"
    >
      <el-timeline :reverse="reverse">
        <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.time">
          {{activity.context}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'orders',
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      orderList: [],
      totalOrders: 0,
      editOrderDialogVisible: false,
      editOrderForm: {
        address1: [],
        address2: ''
      },
      editOrderRules: {
        address1: [
          { required: true, message: '請選擇省市區/縣', trigger: 'blur' },
        ],
        address2: [
          { required: true, message: '請輸入電話', trigger: 'blur' },
        ]
      },
      orderProgressDialogVisible: false,
      progressInfo: []
    }
  },
  methods: {
    async getUserOrder() {
      let {data: res} = await this.$http.get('orders',{
        params: this.queryInfo
      })
      console.log(res.data);
      
      this.orderList = res.data.goods
      this.totalOrders = res.data.total
      
      if (res.meta.status !== 200) {
        return this.$message.error('獲取訂單資料失敗')
      }      
      this.$message.success('獲取訂單資料成功')
    },
    searchOrder() {
      this.getUserOrder()
    },
    handleSizeChange(pageSize) {
      this.queryInfo.pagesize = pageSize
      this.getUserOrder()
    },
    handleCurrentChange(currentPage) {
      this.queryInfo.pagenum = currentPage
      this.getUserOrder()
      
    },
    showEditDialog() {
      this.editOrderDialogVisible = true
      // this.$message.error('尚未完成')
    },
    confirmEditOrder() {
      this.$message.error('尚未完成')
      this.editOrderDialogVisible = false 
    },
    async orderProgressClick() {

      let {data:res} = await this.$http.get(`/kuaidi/804909574412544580`)

      if (res.meta.status !== 200) {
        return this.$message.error('獲得物流進度失敗')
      }
      this.$message.success('獲得物流進度成功')
      
      console.log(res.data);
      
      this.progressInfo = res.data
      this.orderProgressDialogVisible = true
    }
  },
  created() {
    this.getUserOrder()
  }
}
</script>

<style lang="less" scoped>
.el-table {
  margin: 15px 0;
}
.el-pagination {
  display: flex;
  justify-content: center;
}
</style>