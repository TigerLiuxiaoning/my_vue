<template>
  <div>
  <!-- 面包屑导航条 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
  <!-- 卡片视图 -->
  <el-card>
    <el-button type="primary" @click="addDialogVisible = true">添加角色</el-button>
    <!-- 渲染列表 -->
    <el-table
      :data="roleslist"
      border
      stripe
      style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-row v-for="(itemOne,itemIndex) in scope.row.children" :key="itemOne.id" :class="['borderBottom',itemIndex == 0 ? 'borderTop' : '']">
            <el-col :span="4">
              <el-tag closable @close="removeRight(scope.row,itemOne.id)">{{itemOne.authName}}</el-tag>
              <i class="el-icon-caret-right"></i>
            </el-col>
            <el-col :span="20">
              <el-row v-for="(itemTwo,itemIndex) in itemOne.children" :key="itemTwo.id" :class="itemIndex!==0 ? 'borderTop': ''">
                <el-col :span="5">
                  <el-tag closable type="success" @close="removeRight(scope.row,itemTwo.id)">{{itemTwo.authName}}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <el-col :span="19" class="el-col-19">
                  <el-tag closable type="warning" v-for="itemThree in itemTwo.children" :key="itemThree.id" @close="removeRight(scope.row,itemThree.id)">{{itemThree.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index">
      </el-table-column>
      <el-table-column
        label="角色名称"
        prop="roleName">
      </el-table-column>
      <el-table-column
        label="描述"
        prop="roleDesc">
      </el-table-column>
      <el-table-column
        label="操作"
        width="300">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUser(scope.row.id)">删除</el-button>
          <el-button type="warning" icon="el-icon-setting" size="mini">分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
  <!-- 添加角色对话框 -->
  <el-dialog
    title="添加角色"
    :visible.sync="addDialogVisible"
    width="50%"
    @close="addFromClose">
    <el-form :model="addForm" :rules="addRules" ref="addRuleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="addForm.roleName"></el-input>
      </el-form-item>
      <el-form-item label="角色描述" prop="roleDesc">
        <el-input v-model="addForm.roleDesc"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="addDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="addRole">确 定</el-button>
    </span>
  </el-dialog>
  <!-- 编辑角色对话框 -->
  <el-dialog
    title="编辑角色信息"
    :visible.sync="editDialogVisible"
    width="50%"
    @click="editFromClose">
    <el-form :model="editFormList" :rules="editRules" ref="editRuleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="editFormList.roleName"></el-input>
      </el-form-item>
      <el-form-item label="角色描述" prop="roleDesc">
        <el-input v-model="editFormList.roleDesc"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="editDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="editForm">确 定</el-button>
    </span>
  </el-dialog>
  </div>
</template>
<script>
import mix from './roles-mixins.js'
export default {
  mixins: [mix]
}
</script>
<style>
.borderBottom {
  border-bottom: 1px solid #ccc;
}
.borderTop {
  border-top: 1px solid #ccc;
}
.el-tag {
  margin: 5px 5px;
}
.el-col {
  white-space: nowrap;
}
.el-col-19 {
  white-space: normal;
}
</style>
