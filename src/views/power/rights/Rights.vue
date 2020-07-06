<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首頁</el-breadcrumb-item>
      <el-breadcrumb-item>權限管理</el-breadcrumb-item>
      <el-breadcrumb-item>權限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-table :data="rightsList" border :stripe="true" >
        <el-table-column type="index" align="center"></el-table-column>
        <el-table-column prop="authName" label="權限名稱" header-align="center" align="center"></el-table-column>
        <el-table-column prop="id" label="路徑" header-align="center" align="center"></el-table-column>
        <el-table-column prop="level" label="等級" header-align="center" align="center">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.level == 0">一級</el-tag>
            <el-tag type="warning" v-else-if="scope.row.level == 1">二級</el-tag>
            <el-tag type="danger" v-else>三級</el-tag>    
          </template>
        </el-table-column>
        
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'rights',
  data() {
    return {
      rightsList: []
    }
  },
  created() {
    this.getRightsListData()
  },
  methods: {
    async getRightsListData() {
      
      let {data: res} = await this.$http.get('rights/list')
      if (res.meta.status !== 200) return this.$message.error('獲取列表資料失敗')
      this.rightsList = res.data
      console.log(res.data);
      
    }
  }
}
</script>

<style>

</style>