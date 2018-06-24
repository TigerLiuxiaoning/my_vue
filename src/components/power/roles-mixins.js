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
      }
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
    }
  }
}
