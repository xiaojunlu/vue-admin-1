<template>
<el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
  <el-form ref="postForm" :rules="rules" :model="postForm" label-width="80px" label-position="left">
    <el-form-item label="上级" prop="pid">
      <el-cascader v-model="pid" :options="getRulesList" :props="props_pid" placeholder="请选择" change-on-select @change="handleChange" />
    </el-form-item>
    <el-form-item label="名称" prop="title">
      <el-input v-model="postForm.title" clearable />
    </el-form-item>
    <el-form-item label="标识" prop="name">
      <el-input v-model="postForm.name" clearable />
    </el-form-item>
    <el-form-item label="图标" prop="icon">
      <el-input v-model="postForm.icon" clearable />
    </el-form-item>
    <el-form-item label="路径" prop="path">
      <el-input v-model="postForm.path" clearable />
    </el-form-item>
    <el-form-item label="组件" prop="component">
      <el-input v-model="postForm.component" clearable />
    </el-form-item>
    <el-form-item label="跳转" prop="redirect">
      <el-input v-model="postForm.redirect" clearable />
    </el-form-item>
    <el-form-item label="状态">
      <el-radio-group v-model="postForm.status">
        <el-radio :label="1">正常</el-radio>
        <el-radio :label="0">禁用</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="隐藏">
      <el-radio-group v-model="postForm.hidden">
        <el-radio :label="1">是</el-radio>
        <el-radio :label="0">否</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="缓存">
      <el-radio-group v-model="postForm.noCache">
        <el-radio :label="0">是</el-radio>
        <el-radio :label="1">否</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="展示">
      <el-radio-group v-model="postForm.alwaysShow">
        <el-radio :label="1">是</el-radio>
        <el-radio :label="0">否</el-radio>
      </el-radio-group>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取消</el-button>
    <el-button :loading="loading" type="primary" @click="submitForm()">保存</el-button>
  </div>
</el-dialog>
</template>

<script>
import {
  getAuthRule,
  createAuthRule,
  updateAuthRule
} from '@/api/auth/rule'
import tree from '@/utils/tree'
const defaultForm = {
  pid: 0, // 上级id
  title: '',
  name: '',
  status: 1,
  icon: '',
  path: '',
  component: 'layout/Layout',
  hidden: 0,
  noCache: 1,
  alwaysShow: 1,
  redirect: 'noredirect'
}

export default {
  name: 'RuleDetailDialog',
  components: {},
  props: {
    ruleList: {
      type: Array,
      default: []
    },
  },
  data() {
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑权限',
        create: '添加权限'
      },
      ruleTop: [{
        'id': 0,
        'title': '顶级'
      }],
      pid: [],
      props_pid: {
        'label': 'title',
        'value': 'id'
      },
      rules: {
        title: [{
          required: true,
          message: '名称为必填项',
          trigger: 'blur'
        }],
        name: [{
          required: true,
          message: '标识为必填项',
          trigger: 'blur'
        }],
        path: [{
          required: true,
          message: '路径为必填项',
          trigger: 'blur'
        }],
        component: [{
          required: true,
          message: '组件为必填项',
          trigger: 'blur'
        }],
      },
    }
  },
  computed: {
    getRulesList() {
      return this.ruleTop.concat(tree.listToTreeMulti(this.ruleList))
    }
  },
  watch: {

  },
  created() {

  },
  destroyed() {

  },
  methods: {
    fetchData(id) {
      getAuthRule(id).then(response => {
        this.postForm = response.data
      }).catch(err => {
        console.log(err)
      })
    },
    handleAdd() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.pid = []
      this.postForm = Object.assign({}, defaultForm)
      this.$nextTick(() => {
        this.$refs.postForm.clearValidate()
      })
    },
    handleEdit(id) {
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.fetchData(id)
      this.pid = tree.getParentsId(this.ruleList, id)
      this.$nextTick(() => {
        this.$refs.postForm.clearValidate()
      })
    },
    submitForm() {
      this.loading = true
      this.$refs.postForm.validate(valid => {
        if (valid) {
          if (this.dialogStatus == 'update') {
            updateAuthRule(this.postForm.id, this.postForm).then(response => {
              this.$emit('updateRow', this.postForm)
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
            createAuthRule(this.postForm).then(response => {
              this.$emit('updateRow', this.postForm)
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
    },
    handleChange(value) {
      if (value.length) {
        this.postForm.pid = value[value.length - 1]
      }
    }
  }
}
</script>
