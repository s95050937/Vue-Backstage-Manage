<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首頁</el-breadcrumb-item>
      <el-breadcrumb-item>數據統計</el-breadcrumb-item>
      <el-breadcrumb-item>數據報表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <div id="main" style="width: 700px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
import echarts from 'echarts'

export default {
  name: 'reports',
  data() {
    return {
      chartData: {},
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      },
    }
  },
  methods: {
    async getChartData() {
      
      
    },
  },
  created() {
    this.getChartData()
    
  },
  async mounted() {
    let {data: res} = await this.$http.get('reports/type/1')
    if (res.meta.status !== 200) {
      return this.$message.error('獲取圖表數據失敗')
    }
    console.log(res.data);

    this.$message.success('獲取圖表數據成功')

    const result={...this.options, ...res.data}

    let myChart = echarts.init(document.getElementById('main'));
    myChart.setOption(result);
    
  }
}
</script>

<style lang="less" scoped>

</style>