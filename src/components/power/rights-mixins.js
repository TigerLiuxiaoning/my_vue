export default {
  data() {
    return {
      rightList: []
    }
  },
  created() {
    this.getRights()
  },
  methods: {
    async getRights() {
      const {data: res} = await this.$http.get('rights/list')
      console.log(res)
      this.rightList = res.data
    }
  }
}
