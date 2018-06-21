<template>
  <div>

    <!-- 面包屑导航条 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card class="box-card">
      <!-- 头部的搜索和添加区域 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="queryinfo.query">
            <el-button slot="append" icon="el-icon-search" @click="getUserList()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 表格区域 -->
      <el-table
        :data="userlist"
        border
        stripe
        style="width: 100%">
        <el-table-column
          type="index">
        </el-table-column>
        <el-table-column
          prop="username"
          label="姓名"
          width="120">
        </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱">
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="电话">
        </el-table-column>
        <el-table-column
          prop="role_name"
          label="角色">
        </el-table-column>
        <el-table-column
          label="状态">
          <!-- 让这一行的开关，把状态绑定到 这一行数据的 mg_state 上 -->
          <el-switch
            v-model="scope.row.mg_state"
            slot-scope="scope">
          </el-switch>
        </el-table-column>
        <el-table-column
        width="185"
          label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryinfo.pagenum"
        :page-sizes="[2, 5, 10, 15]"
        :page-size="queryinfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>

  </div>
</template>

<script>
export default {
  data() {
    return {
      // 查询用户列表时候，要携带的查询参数
      queryinfo: {
        query: '', // 用户输入的搜索条件
        pagenum: 1, // 当前请求的是第几页数据
        pagesize: 2 // 每页显示几条数据
      },
      total: 0, // 总共有多少条数据
      // 用户列表
      userlist: []
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    // 根据查询参数，获取用户列表
    async getUserList() {
      //  this.$http.post('login', {username: 'zs', password: '123456'})
      // 发起 get 请求，并携带 查询参数
      const { data: res } = await this.$http.get('users', { params: this.queryinfo })
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('请求用户列表失败！')
      // 为用户列表赋值
      this.userlist = res.data.users
      // 为总页数赋值
      this.total = res.data.total
    },
    // 监听 pagesize 的变化
    handleSizeChange(newSize) {
      // 把最新的 pagesize 赋值给 this.queryinfo
      this.queryinfo.pagesize = newSize
      this.getUserList()
    },
    // 监听 页码值 的变化
    handleCurrentChange(newPageNum) {
      this.queryinfo.pagenum = newPageNum
      this.getUserList()
    }
  }
}
</script>
