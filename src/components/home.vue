<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div class="logo_title">
        <img src="../assets/heima_logo.png" alt="">
        <h2>电商后台管理系统</h2>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 下面的主体区域 -->
    <el-container>
      <!-- 左侧的 menu菜单 -->
      <el-aside width="iscollapse ? '65px' : '200px'">
        <!-- 折叠展开 menu的bar -->
        <div class="toggleBar" @click="iscollapse=!iscollapse">|||</div>
        <!-- menu菜单 -->
        <!-- router 和 unique-opened结合使用启用该模式会在激活导航时以 index 作为 path 进行路由跳转 -->
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          background-color="#333744"
          text-color="#fff"
          router
          unique-opened
          active-text-color="#409EFF"
          :collapse="iscollapse"
          :collapse-transition="false">
          <el-submenu
            :index="item.id + ''"
            v-for="(item, i) in menus"
            :key="item.id"
            :class="iscollapse ? 'el_submenu_small' : 'el_submenu_large'">
            <template slot="title">
              <!-- 左侧的小图标 -->
              <i :class="['iconfont',iconlist[i]]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 循环创建 二级菜单 -->
            <el-menu-item :index="'/' + subitem.path" v-for="subitem in item.children" :key="subitem.id">
              <i class="el-icon-menu"></i>
              {{subitem.authName}}
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧的 主体区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>

  </el-container>
</template>
<script>
export default {
  data() {
    return {
      // 左侧菜单列表数组
      menus: [],
      // 左侧菜单项对应的图标数组
      iconlist: ['icon-users', 'icon-tijikongjian', 'icon-shangpin', 'icon-danju', 'icon-baobiao'],
      // 是否被折叠，默认是false
      iscollapse: false
    }
  },
  created() {
    this.getmenus()
  },
  methods: {
    // 退出操作
    logout() {
      // 清空保存的 token信息
      window.sessionStorage.removeItem('token')
      // 强制跳转到登录页面
      this.$router.push('/login')
    },
    // 获取左侧菜单列表
    async getmenus() {
      const { data: res } = await this.$http.get('/menus')
      // console.log(res)
      // 获取数据失败
      if (res.meta.status !== 200) return this.$message.error('获取左侧菜单列表失败！')
      // 获取数据成功  把获取到的数据赋值给data中的 Menus
      this.menus = res.data
      console.log(res)
    }
  }
}
</script>
<style lang="less" scoped>
.home-container {
    height: 100%;
}
// 显示展开和折叠的bar
.toggleBar{
  color: #fff;
  font-size: 12px;
  line-height: 24px;
  background-color: #4a5064;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
  user-select: none;
}
.el-header{
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0;
    user-select: none;
    .logo_title {
        display: flex;
        align-items: center;
        color: #ffffff;
        h2 {
            font-weight: 200;
            margin-left: 15px;
        }
    }
    .el-button {
      margin-right: 10px;
    }
}
// 图标和文字之间的间距
.iconfont {
  margin-right: 8px;
}
.el-aside {
  background-color: #333744;
  user-select: none;
}
.el-main {
  background-color: #eaedf1;
}
.el_submenu_large {
  width: 200px;
}
.el_submenu_small {
  width: 65px;
}
</style>
