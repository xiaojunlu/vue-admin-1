<template>
  <div class="app-container">
    <el-form ref="dataForm" :model="temp" label-position="left" label-width="70px" style="width: 100%; ">
      <el-form-item label="角色" prop="groupId">
        <el-input v-model="group" :disabled="true"/>
      </el-form-item>
      <el-form-item label="账号" prop="username">
        <el-input v-model="temp.username" :disabled="true"/>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="temp.password" clearable placeholder="不修改，则留空"/>
      </el-form-item>
      <el-form-item label="头像" prop="avatar">
        <Upload v-model="temp.avatar" :config="config"/>
      </el-form-item>
      <el-form-item label="姓名" prop="truename">
        <el-input v-model="temp.truename" clearable/>
      </el-form-item>
      <el-form-item label="手机" prop="verified_mobile">
        <el-input v-model="temp.verified_mobile" clearable/>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="temp.email" clearable/>
      </el-form-item>
    </el-form>
    <el-button :loading="btnLoading" type="primary" @click="saveData()">保存</el-button>
  </div>
</template>

<script>
import Upload from '@/components/Upload/Avatar'
import { modify } from '@/api/admin'
import { mapGetters } from 'vuex'
import store from '@/store'
import myconfig from '@/config'

export default {
  username: 'MyInfo',
  components: { Upload },
  data() {
    return {
      btnLoading: false,
      temp: {
        username: store.getters.username,
        password: '',
        truename: store.getters.truename,
        verified_mobile: store.getters.verified_mobile,
        email: store.getters.email,
        avatar: store.getters.avatar
      },
      config: {
        group:'user',
        fileName: 'file',
        limit: 1,
        multiple: true,
        accept: 'image/*',
        action: myconfig.uploadUrl.img
      }

    }
  },
  computed: {
    ...mapGetters([
      'username',
      'group'
    ])
  },
  watch: {
    temp: {
      handler(newVal, oldVal) {},
      immediate: true,
      deep: true
    }
  },
  created() {

  },
  destroyed() {

  },
  methods: {
    saveData() {
      this.btnLoading = true
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const _this = this
          const d = this.temp
          if (typeof (d.img) === 'object') {
            d.img = d.img.join(',')
          }
          modify(d).then(response => {
            if (response.status === 1) {
              store.commit('SET_AVATAR', _this.temp.img)
              store.commit('SET_TRUENAME', _this.temp.realName)
              store.commit('SET_VERIFIED_MOBILE', _this.temp.verified_mobile)
              store.commit('SET_EMAIL', _this.temp.email)
              _this.$message.success(response.msg)
            } else {
              _this.$message.error(response.msg)
            }
            _this.btnLoading = false
          }).catch((error) => {
            this.btnLoading = false
          })
        } else {
          this.btnLoading = false
        }
      })
    }
  }
}
</script>
