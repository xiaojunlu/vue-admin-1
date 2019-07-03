<template>
<el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
  <el-form ref="userForm" :rules="rules" :model="user" label-position="left" label-width="90px" style="width: 100%; height: 50vh;overflow-y: scroll;">
    <el-form-item label="角色" prop="group_id">
      <el-select v-model="user.group_id" class="filter-item" placeholder="请选择">
        <el-option v-for="item in roles" :key="item.id" :label="item.title" :value="item.id" />
      </el-select>
    </el-form-item>
    <el-form-item label="账号" prop="username">
      <el-input v-model="user.username" :disabled="dialogStatus==='update'?true:false" />
    </el-form-item>
    <el-form-item label="头像" prop="avatar">
      <Upload v-model="user.avatar" :config="config" />
    </el-form-item>
    <el-form-item label="姓名" prop="truename">
      <el-input v-model="user.truename" clearable />
    </el-form-item>
    <el-form-item label="手机" prop="verified_mobile">
      <el-input v-model="user.verified_mobile" clearable />
    </el-form-item>
    <el-form-item label="身份证号" prop="idcard">
      <el-input v-model="user.idcard" clearable />
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input v-model="user.email" clearable />
    </el-form-item>
    <el-form-item label="状态">
      <el-radio-group v-model="user.locked">
        <el-radio :label="1">禁用</el-radio>
        <el-radio :label="0">正常</el-radio>
      </el-radio-group>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取消</el-button>
    <el-button :loading="btnLoading" type="primary" @click="submitForm()">保存</el-button>
  </div>
</el-dialog>
</template>

<script>
import Upload from '@/components/Upload/SingleImageUpload'
import {
  getAuthGroupList
} from '@/api/auth/group'
import {
  getUser,
  createUser,
  updateUser,
  checkUsername
} from '@/api/user/index'
import {
  formatImgToArr,
  getNowTime
} from '@/utils'
import {
  validMobile,
  validEmail,
  validIdcard,
} from '@/utils/validate'
import myconfig from '@/config'
const defaultUser = {
  id: 0,
  group_id: '',
  username: '',
  password: '',
  locked: 0,
  truename: '',
  verified_mobile: '',
  email: '',
  created_time: getNowTime(),
  avatar: '',
  idcard: '',
}
export default {
  name: 'UserDetailDialog',
  components: {
    Upload
  },
  data() {
    // const validateMobile = (rule, value, callback) => {
    //   if (validMobile(value)) {
    //     callback()
    //   } else {
    //     return callback(new Error())
    //   }
    // }
    const validateMobile = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('账号必填'));
      }
      checkUsername(value).then(response => {
        console.log(response)
      })

      if (validMobile(value)) {
        callback()
      } else {
        return callback(new Error())
      }
    }
    const validateEmail = (rule, value, callback) => {
      if (validEmail(value)) {
        callback()
      } else {
        return callback(new Error())
      }
    }
    const validateIdcard = (rule, value, callback) => {
      if (validIdcard(value)) {
        callback()
      } else {
        return callback(new Error())
      }
    }
    return {
      btnLoading: false,
      roles: {},
      user: Object.assign({}, defaultUser),
      config: {
        group: 'user',
        fileName: 'file',
        limit: 1,
        multiple: true,
        accept: 'image/*',
        action: myconfig.uploadUrl.img
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑用户',
        create: '添加用户'
      },
      rules: {
        group_id: [{
          required: true,
          message: '角色必选',
          trigger: 'change'
        }],
        username: [{
          required: true,
          message: '账号必填',
          trigger: 'blur'
        }],
        truename: [{
          required: true,
          message: '姓名必填',
          trigger: 'blur'
        }],
        verified_mobile: [{
          required: true,
          validator: validateMobile,
          message: '手机号格式错误',
          trigger: 'blur'
        }],
        idcard: [{
          required: true,
          validator: validateIdcard,
          message: '身份证格式错误',
          trigger: 'blur'
        }],
        email: [{
          required: true,
          validator: validateEmail,
          message: '邮箱格式错误',
          trigger: 'blur'
        }]
      }

    }
  },
  watch: {

  },
  created() {
    this.getAuthGroup()
  },
  destroyed() {

  },
  methods: {
    getAuthGroup() {
      getAuthGroupList().then(response => {
        this.roles = response.data
      })
    },
    handleCreate() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.user = Object.assign({}, defaultUser)
      this.currentIndex = -1
      this.$nextTick(() => {
        this.$refs.userForm.clearValidate()
      })
    },
    handleUpdate(id) {
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      getUser(id).then(response => {
        this.user = response.data
      })
      this.$nextTick(() => {
        this.$refs.userForm.clearValidate()
      })
    },
    submitForm() {
      this.loading = true
      this.$refs.userForm.validate(valid => {
        if (valid) {
          if (this.dialogStatus == 'update') {
            updateUser(this.user.id, this.user).then(response => {
              this.$emit('updateRow', this.user)
              this.dialogFormVisible = false
              this.$message({
                type: 'success',
                message: '修改成功!'
              })
              this.loading = false
            }).catch((error) => {
              this.loading = false
            })
          } else {
            createUser(this.user).then(response => {
              this.$emit('updateRow', this.user)
              this.dialogFormVisible = false
              this.$message({
                type: 'success',
                message: '添加成功!'
              })
              this.loading = false
            }).catch((error) => {
              this.loading = false
            })
          }
        } else {
          this.loading = false
        }
      })
    }
  }
}
</script>
