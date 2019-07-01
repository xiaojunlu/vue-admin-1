<template>
<el-dialog :title="isEdit?'编辑':'添加'" :visible.sync="dialogFormVisible">
  <el-form ref="postForm" :rules="rules" :model="postForm" label-width="80px" label-position="left">

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
    <el-button :loading="btnLoading" type="primary" @click="handleSave()">保存</el-button>
  </div>
</el-dialog>
</template>

<script>
import {
  getAuthRule,
  updateAuthRule
} from '@/api/rules'
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
  name: 'AuthRuleDetail',
  components: {},
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    ruleList: {
      type: Array,
      default: []
    }
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      console.log(rule)
      if (value === '') {
        this.$message({
          message: rule.field + '为必传项',
          type: 'error'
        })
        callback(new Error(rule.field + '为必传项'))
      } else {
        callback()
      }
    }
    return {
      postForm: Object.assign({}, defaultForm),
      btnLoading: false,
      dialogFormVisible: false,
      rules: {
        title: [{
          validator: validateRequire
        }],
        name: [{
          validator: validateRequire
        }],
        icon: [{
          validator: validateRequire
        }],
        path: [{
          validator: validateRequire
        }],
        component: [{
          validator: validateRequire
        }]
      },
    }
  },
  computed: {

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
    show() {
      this.dialogFormVisible = true
      if (this.isEdit) {
        const id = this.ruleList.id
        this.fetchData(id)
      } else {
        this.postForm = Object.assign({}, defaultForm)
      }
      this.$nextTick(() => {
        this.$refs['postForm'].clearValidate()
      })
    },

  }
}
</script>
