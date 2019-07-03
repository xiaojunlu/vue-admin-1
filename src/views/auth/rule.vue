<template>
<div class="app-container">
  <!-- 操作 -->
  <el-row style="margin-bottom: 10px;">
    <el-col :xs="24" :sm="24" :lg="24">
      <el-tooltip content="刷新" placement="top">
        <el-button v-waves type="warning" icon="el-icon-refresh" circle @click="handleFilterClear" />
      </el-tooltip>
      <el-tooltip content="添加" placement="top">
        <el-button v-waves type="success" icon="el-icon-plus" circle @click="handleAdd" />
      </el-tooltip>
      <el-tooltip content="删除" placement="top">
        <el-button v-waves :loading="deleting" :disabled="buttonDisabled" type="danger" icon="el-icon-delete" circle @click="handleDeleteAll()" />
      </el-tooltip>
      <el-tooltip content="更多" placement="top">
        <el-dropdown trigger="click" placement="bottom" style="margin-left: 10px;" @command="handleCommand">
          <el-button :disabled="buttonDisabled" type="Info" circle>
            <i class="el-icon-more" />
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="1">设为正常</el-dropdown-item>
            <el-dropdown-item command="0">设为禁用</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-tooltip>
    </el-col>
  </el-row>

  <!-- 表格 -->
  <tree-table v-loading="listLoading" :key="tableKey" :data="getRulesList" :expand-all="expandAll" :columns="columns" border fit highlight-current-row style="width: 100%;" @selection-change="handleSelectionChange">
    <el-table-column label="标识" width="150px" align="center">
      <template slot-scope="scope">
        <span>{{ scope.row.name }}</span>
      </template>
    </el-table-column>
    <el-table-column label="图标" width="120px" align="center">
      <template slot-scope="scope">
        <span>{{ scope.row.icon }}</span>
      </template>
    </el-table-column>
    <el-table-column label="路径" width="150px" align="center">
      <template slot-scope="scope">
        <span>{{ scope.row.path }}</span>
      </template>
    </el-table-column>
    <el-table-column label="组件" width="150px" align="center">
      <template slot-scope="scope">
        <span>{{ scope.row.component }}</span>
      </template>
    </el-table-column>
    <el-table-column label="状态" width="80px" align="center">
      <template slot-scope="scope">
        <span :class="{'el-icon-success text-green':scope.row.status == 1,'el-icon-error text-red':scope.row.status == 0}" @click="handleModifyStatus(scope.$index,scope.row.id,scope.row.status)">{{ scope.row.status | statusFilter }}</span>
      </template>
    </el-table-column>

    <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
      <template slot-scope="scope">
        <el-button type="primary" size="mini" @click="handleEdit(scope.$index,scope.row.id)">编辑</el-button>
        <el-button type="danger" size="mini" @click="handleDelete(scope.$index,scope.row.id)">删除</el-button>
      </template>
    </el-table-column>
  </tree-table>

  <!-- 表单 -->
  <rule-detail-dialog ref="fromRules" :rule-list="list" @updateRow="updateRow" />

</div>
</template>

<script>
import {
  getList,
  del,
  change,
  delAll,
  changeAll
} from '@/api/auth-rule'
import waves from '@/directive/waves' // 水波纹指令
import {
  getArrByKey
} from '@/utils'
import tree from '@/utils/tree'
import RuleDetailDialog from './rule/RuleDetailDialog'
import treeTable from '@/components/TreeTable'

export default {
  name: 'AuthRuleList',
  components: {
    RuleDetailDialog,
    treeTable
  },
  directives: {
    waves
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: '禁用',
        1: '正常'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      selectedRows: null,
      listLoading: true,
      expandAll: true,
      columns: [{
        text: '名称',
        value: 'title'
      }],
      listQuery: {
        status: '-1',
        title: ''
      },
      buttonDisabled: true,
      deleting: false
    }
  },
  computed: {
    getRulesList() {
      return tree.listToTreeMulti(this.list, 0, 'id', 'pid', 'children', {
        'delete': false
      })
    }
  },
  watch: {},
  created() {
    this.fetchList()
  },
  methods: {
    fetchList() {
      this.listLoading = true
      getList(this.listQuery).then(response => {
        this.list = response.data
        this.listLoading = false
      })
    },
    handleFilterClear() {

    },
    handleSelectionChange(val) {

    },
    handleAdd() {
      this.$refs.fromRules.handleAdd()
    },
    handleEdit(index, id) {
      this.$refs.fromRules.handleEdit(id)
    },
    handleModifyStatus(index, id, status) {

    },
    updateRow() {
      this.fetchList()
    },
    handleDelete(index, id) {

    },
    handleDeleteAll() {

    },
    handleCommand(command) {

    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.text-red {
    color: red;
    cursor: pointer;
}
.text-green {
    color: green;
    cursor: pointer;
}
</style>
