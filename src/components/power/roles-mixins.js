export default {
  data() {
    return {
      // 定义角色列表数组，默认为空
      roleslist: [],
      // 添加角色开始
      addDialogVisible: false,
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      addRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      },
      // 添加角色结束
      // 编辑角色
      editDialogVisible: false,
      editFormList: {
        roleId: '',
        roleName: '',
        roleDesc: ''
      },
      editRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      },
      // 分配权限
      rightsDialogVisible: false,
      // 所有权限数据
      rightsTree: [],
      // 属性结构权限 props
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 定义所有的三级权限id
      rightIds: '',
      // 角色id
      roleId: ''
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    // 获取角色列表数据
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error('获取角色列表失败!')
      this.roleslist = res.data
      console.log(res)
    },
    // 关闭添加角色对话框
    addFromClose() {
      this.$refs.addRuleForm.resetFields()
    },
    // 添加角色
    addRole() {
      this.$refs.addRuleForm.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('roles', this.addForm)
        console.log(res)
        if (res.meta.status !== 201) return this.$message.error('添加角色失败！')
        this.$message.success('添加角色成功')
        this.getRolesList()
        this.addDialogVisible = false
      })
    },
    // 关闭角色对话框
    editFromClose() {
      this.$refs.editRuleForm.resetFields()
    },
    // 展现编辑的对话框
    async showEditDialog(id) {
      this.editDialogVisible = true
      // 发送请求展示数据
      const { data: res } = await this.$http.get(`roles/${id}`)
      // console.log(res)
      this.editFormList = res.data
      // console.log(id)
    },
    // 提交编辑表单
    editForm() {
      this.$refs.editRuleForm.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(`roles/${this.editFormList.roleId}`, this.editFormList)
        this.editFormList = res.data
        console.log(res)
        this.getRolesList()
        this.editDialogVisible = false
      })
    },
    // 删除操作
    async removeUser(id) {
      // console.log(id)
      const isConfirm = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (isConfirm !== 'confirm') return this.$message('取消删除成功')
      // 成功的话 发请求删除该用户
      const {data: res} = await this.$http.delete('roles/' + id)
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error('删除失败')
      this.$message.success('删除成功')
      this.getRolesList()
    },
    // 删除角色中对应的权限
    async removeRight(row, rightID) {
      // console.log(row.id)
      // console.log(rightID)
      const isConfirm = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (isConfirm !== 'confirm') return this.$message('取消删除成功')
      // 成功的话 发请求删除该用户
      const {data: res} = await this.$http.delete(`roles/${row.id}/rights/${rightID}`)
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('删除失败')
      this.$message.success('删除成功')
      // this.getRolesList()
      // 为了让删除之后 不关闭当前的正在处于的状态  重新赋值
      row.children = res.data
    },
    // 分配权限的显示 和 隐藏
    async showRightDialog(row) {
      // 获取数据 供页面使用 并且在展开的时候 勾选对应角色的权限id
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) return this.$message.error('获取权限数据失败！')
      this.rightsTree = res.data
      console.log(res)
      const keys = [] // 存放所有的三级权限的id
      this.getLeafIds(row, keys)
      // console.log(keys)
      this.rightIds = keys
      // 把当前的角色id存储起来
      this.roleId = row.id
      this.rightsDialogVisible = true
    },
    // 获取所有权限的id 使用递归的方式 传递数据 和 存放id的数组
    getLeafIds(node, keyArr) {
      // 递归 必须有结束条件 和 自己调用自己
      if (!node.children) {
        keyArr.push(node.id)
      } else {
        node.children.forEach(item => {
          // 自己调用自己 校验数据
          this.getLeafIds(item, keyArr)
        })
      }
    },
    // 更新呢分配权限
    async updateRight() {
      // console.log('aa')
      // 调用方法获取当前所有选中的半选的id和id
      const key1 = this.$refs.treeRef.getHalfCheckedKeys()
      const key2 = this.$refs.treeRef.getCheckedKeys()
      // console.log(key1)
      // console.log(key2)
      const checkedKey = [...key1, ...key2]
      // console.log(checkedKey)
      // 发送请求 提交更新的权限管理
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, {rids: checkedKey.join(',')})
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error('更新权限失败！')
      this.$message.success('更新权限成功！')
      this.getRolesList()
      this.rightsDialogVisible = false
    }
  }
}
