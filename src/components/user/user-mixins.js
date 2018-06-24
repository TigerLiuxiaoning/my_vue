export default {
  data() {
    // 自定义校验规则
    // 校验邮箱
    var checkEmail = (rule, value, callback) => {
      if (/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value) === false) {
        callback(new Error('邮箱地址不正确!'))
      }
      callback()
    }
    // 校验手机号
    var checkMobile = (rule, value, callback) => {
      if (/^1\d{10}$/.test(value) === false) {
        callback(new Error('手机号不存在!'))
      }
      callback()
    }

    return {
      // 查询用户列表时候，要携带的查询参数
      queryinfo: {
        query: '', // 用户输入的搜索条件
        pagenum: 1, // 当前请求的是第几页数据
        pagesize: 2 // 每页显示几条数据
      },
      total: 0, // 总共有多少条数据
      // 用户列表
      userlist: [],
      addDialogVisible: false,
      // 添加用户列表
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加用户列表的校验规则
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 编辑用户列表
      editForm: {
        id: '',
        username: '',
        email: '',
        mobile: ''
      },
      // 编辑用户的对话框
      editDialogVisible: false,
      // 编辑用户的规则
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
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
      // console.log(res)
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
    },
    // 监听状态事件改变
    async switchChange(newState, id) {
      // 发送请求
      const {data: res} = await this.$http.put('users/' + id + '/state/' + newState)
      console.log(res)
    },
    // 添加用户列表
    addUser() {
      // 应该先校验再发请求 获取数据
      this.$refs.addFormRef.validate(async valid => {
        // console.log(valid)
        if (!valid) return
        const {data: res} = await this.$http.post('users', this.addForm)
        console.log(res)
        if (res.meta.status !== 201) return this.$message.error('添加用户列表失败!')
        this.$message.success('添加用户列表成功')
        this.getUserList()
        this.addDialogVisible = false
      })
    },
    // 关闭添加用户列表
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 关闭编辑用户对话框
    editDialogClosed() {
      this.editDialogVisible = false
    },
    // 编辑用户列表的对话框
    async showEditDialog(scope) {
      // 不能直接拿scope中的数据 有可能不是最新的数据
      console.log(scope)
      const {data: res} = await this.$http.get('users/' + scope.row.id)
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('获取用户信息失败！')
      this.editForm.id = res.data.id
      this.editForm.username = res.data.username
      this.editForm.email = res.data.email
      this.editForm.mobile = res.data.mobile
      // 显示对话框
      this.editDialogVisible = true
    },
    // 点击编辑用户列表提交
    editUser() {
      // 先校验数据是否为空
      this.$refs.editFormRef.validate(async valid => {
        // console.log(valid)
        // 校验失败
        if (!valid) return
        // 校验成功 发送请求
        const {data: res} = await this.$http.put('users/' + this.editForm.id, this.editForm)
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error('编辑失败！')
        this.$message.success('编辑成功!')
        this.getUserList()
        this.editDialogVisible = false
      })
    },
    // 删除指定的用户
    async deleteUser(id) {
      // console.log(id)
      const isConfirm = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 根据消息提示的结果 处理不同的业务逻辑
      // if (isConfirm !== 'confirm') {
      //   return this.$message('取消删除成功')
      // }
      if (isConfirm !== 'confirm') return this.$message('取消删除成功')
      // 成功的话 发请求删除该用户
      const {data: res} = await this.$http.delete('users/' + id)
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error('删除失败')
      this.$message.success('删除成功')
      this.getUserList()
    }
  }
}
