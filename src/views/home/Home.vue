<template>
  <div class="home-page">
    <el-container class="home-container">
      <el-header>
        <div class="header-left">
          <img src="../../assets/img/logo.png" alt="">
          <span>電商後台管理系統</span>
        </div>
        <el-button type="info" @click="logout">退出</el-button>
      </el-header>
      <el-container>
        <el-aside :width="isCollapsedWidth">
          <div class="toggle-box" @click="toggleCollapse">
            <i class="el-icon-s-unfold" v-if="isCollapse"></i>
            <i class="el-icon-s-fold" v-else></i>
          </div>
          <el-menu
            default-active="2"
            class="el-menu-vertical-demo"
            background-color="#333744"
            text-color="#fff"
            active-text-color="#ffd04b"
            :unique-opened="true"
            :collapse="isCollapse"
            :collapse-transition="false"
            :router="true"
            >
          <!-- 一階菜單 -->
          <el-submenu :index="'/'+ item.path" v-for="(item, index) in menuList" :key="index" > 
            <template slot="title">
              <i :class="iconObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item :index="'/' + item.path" v-for="(item, index) in item.children" :key="index">
              <template slot="title">
                <i class="el-icon-star-on"></i>
                <span>{{item.authName}}</span>
              </template> 
            </el-menu-item>
          </el-submenu>
          
        </el-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>

    
  </div>
  
</template>

<script>
export default {
  name: 'home',
  created() {
    this.getMenuData()
  },
  data() {
    return {
      menuList: [],
      iconObj: {
        '125': 'el-icon-user-solid',
        '103': 'el-icon-wallet',
        '101': 'el-icon-s-goods',
        '102': 'el-icon-s-order',
        '145': 'el-icon-s-data'
      },
      isCollapse: true
    }
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuData() {
      let {data: res} = await this.$http.get('menus')
      
      if (res.meta.status !== 200) return this.$message({
            showclose: true,
            message: '失敗',
            type: 'error'
          }) 
      this.menuList = res.data  
      
    },
    toggleCollapse() {
      this.isCollapse =!this.isCollapse
    },
  },
  computed: {
    isCollapsedWidth() {
      if (!!this.isCollapse) {
        return '64px'
      }
      return '200px'
    }
  }
}
</script>

<style lang="less" scoped>
.home-page {
  height: 100vh;
}
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 10px;
  .header-left {
    display: flex;
    align-items: center;
    span {
      color: #fff;
      font-size: 20px;
      margin-left: 15px;
    }
  }
  img {
    height: 50px;
  }
}
.el-aside {
  background-color: #333744;
  .toggle-box {
    background-color: #4a5064;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    height: 25px;
    
    i {
      color: #fff;
    }
  }
  .el-menu {
    border-right-width: 0px;
  } 

}

.el-main {
  background-color: #EAEDf1;
}
</style>