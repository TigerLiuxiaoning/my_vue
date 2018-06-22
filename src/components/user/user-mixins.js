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
    },
    // 监听事件改变
    async switchChange(newState, id) {
      // 发送请求
      const {data: res} = await this.$http.put('users/' + id + '/state/' + newState)
      console.log(res)
    },
    // 添加用户列表
    async addUser() {
      const {data: res} = await this.$http.post('users', this.addForm)
      console.log(res)
      this.getUserList()
      this.addDialogVisible = false
    },
    // 关闭添加用户列表
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    }
  }
}
