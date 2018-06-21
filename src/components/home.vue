<template>
    <el-container class="home-container">
        <!-- 头部区域 -->
        <el-header>
            <div class="logo_title">
                <img src="../assets/heima_logo.png" alt="">
                <h2>电商后台管理系统</h2>
            </div>
            <el-button type="info">退出</el-button>
        </el-header>   

        <!-- 下面的主体区域 -->
        <el-container>
            <el-aside width="200px">Aside</el-aside>
            <!-- 右侧的 主体区域 -->
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
   
</template>
<style lang="less" scoped>
.home-container {
    height: 100%;
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
}
.el-aside {
  background-color: #333744;
  user-select: none;
} 
.el-main {
  background-color: #eaedf1;
}
</style>
