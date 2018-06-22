<template>
  <div>
    <!-- 面包屑导航条 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <el-table
      :data="rightList"
      border
      stripe
      style="width: 100%">
      <el-table-column type="index"></el-table-column>
      <el-table-column label="权限名称" prop="authName"></el-table-column>
      <el-table-column label="路径" prop="path"></el-table-column>
      <el-table-column label="权限等级" prop="level">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.level == '0'">一等级</el-tag>
          <el-tag type="warning" v-else-if="scope.row.level == '1'">二等级</el-tag>
          <el-tag type="danger" v-else>三等级</el-tag>
        </template>
      </el-table-column>
    </el-table>
    </el-card>
  </div>
</template>
<script>
// 导入right-mixins
import mix from './rights-mixins.js'
export default {
  mixins: [mix]
}
</script>
