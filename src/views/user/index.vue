<template>
<div class="app-container">
  <!-- 搜索 -->
  <div v-if="showSearch" class="filter-container">
    <el-form :inline="true" :model="listQuery" class="form-inline">
      <el-form-item label="">
        <el-input v-model="listQuery.username" placeholder="用户名" clearable size="small" />
      </el-form-item>
      <el-form-item label="">
        <el-input v-model="listQuery.verifiedMobile" placeholder="手机号" clearable size="small" />
      </el-form-item>
      <el-form-item label="">
        <el-select v-model="listQuery.locked" placeholder="状态" clearable size="small">
          <el-option label="全部" value="" />
          <el-option label="正常" value="0" />
          <el-option label="禁用" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="">
        <el-date-picker v-model="dateTime" :picker-options="pickerOptions" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" align="right" clearable size="small" />
      </el-form-item>
      <el-form-item>
        <el-button v-waves type="primary" icon="el-icon-search" size="small" @click="handleFilter">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-waves type="warning" icon="el-icon-refresh" size="small" @click="handleFilterClear">重置</el-button>
      </el-form-item>
    </el-form>
  </div>

  <!-- 操作 -->
  <el-row style="margin-bottom: 10px;">
    <el-col :xs="24" :sm="24" :lg="24">
      <el-tooltip content="刷新" placement="top">
        <el-button v-waves type="warning" icon="el-icon-refresh" circle @click="handleFilterClear" />
      </el-tooltip>
      <el-tooltip content="添加" placement="top">
        <el-button v-waves type="success" icon="el-icon-plus" circle @click="handleCreate" />
      </el-tooltip>
      <el-tooltip content="搜索" placement="top">
        <el-button v-waves type="primary" icon="el-icon-search" circle @click="showSearch = !showSearch" />
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
  <el-table v-loading="listLoading" :key="tableKey" :data="list" border fit highlight-current-row style="width: 100%;" @selection-change="handleSelectionChange">
    <el-table-column type="selection" width="55" />
    <el-table-column label="ID" align="center" width="65" fixed>
      <template slot-scope="scope">
        <span>{{ scope.row.id }}</span>
      </template>
    </el-table-column>
    <el-table-column label="头像" width="60" fixed>
      <template slot-scope="scope">
        <span class="link-type" @click="handleImg(scope.row.avatar)"><img :src="scope.row.avatar" width="40" height="40"></span>
      </template>
    </el-table-column>
    <el-table-column label="用户名" min-width="150" fixed>
      <template slot-scope="scope">
        <span class="link-type" @click="handleUpdate(scope.$index,scope.row.id)">{{ scope.row.username }}</span>
      </template>
    </el-table-column>
    <el-table-column label="手机" width="110" align="center">
      <template slot-scope="scope">
        <span>{{ scope.row.verified_mobile }}</span>
      </template>
    </el-table-column>
    <el-table-column label="邮箱" width="230" align="center">
      <template slot-scope="scope">
        <span>{{ scope.row.email }}</span>
      </template>
    </el-table-column>
    <el-table-column label="姓名" width="110" align="center">
      <template slot-scope="scope">
        <span>{{ scope.row.username }}</span>
      </template>
    </el-table-column>
    <el-table-column label="分组" width="80" align="center">
      <template slot-scope="scope">
        <span>{{ scope.row.group_id }}</span>
      </template>
    </el-table-column>
    <el-table-column label="状态" width="80" align="center">
      <template slot-scope="{row}">
        <el-tag :type="row.locked | lockedFilter">
          {{ row.locked | lockedTextFilter}}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column label="登录IP" width="120" align="center">
      <template slot-scope="scope">
        <span>{{ scope.row.login_ip }}</span>
      </template>
    </el-table-column>
    <el-table-column label="登录时间" width="120" align="center">
      <template slot-scope="scope">
        <span>{{ scope.row.login_time|parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
      </template>
    </el-table-column>
    <el-table-column label="注册IP" width="120px" align="center">
      <template slot-scope="scope">
        <span>{{ scope.row.created_ip }}</span>
      </template>
    </el-table-column>
    <el-table-column label="注册时间" width="160px" align="center">
      <template slot-scope="scope">
        <span>{{ scope.row.created_time|parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
      </template>
    </el-table-column>
    <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width" fixed="right">
      <template slot-scope="scope">
        <el-button type="primary" size="mini" @click="handleUpdate(scope)">
          编辑
        </el-button>
        <el-button size="mini" type="danger" @click="handleDelete(scope)">
          删除
        </el-button>
      </template>
    </el-table-column>
  </el-table>

  <!-- 分页 -->
  <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

  <user-detail-dialog ref="fromUser" @updateRow="updateRow" />
</div>
</template>

<script>
import {
  getUserList,
  deleteUser,
} from '@/api/user/index'
import {
  parseTime,
  pickerOptions,
  getArrByKey
} from '@/utils'
import waves from '@/directive/waves'
import openWindow from '@/utils/openWindow'
import Pagination from '@/components/Pagination'
import UserDetailDialog from './UserDetailDialog'

export default {
  name: 'User',
  components: {
    Pagination,
    UserDetailDialog
  },
  directives: {
    waves
  },
  filters: {
    lockedFilter(locked) {
      const lockedMap = {
        1: 'danger',
        0: 'success',
      }
      return lockedMap[locked]
    },
    lockedTextFilter(locked) {
      const lockedMap = {
        1: '禁用',
        0: '正常',
      }
      return lockedMap[locked]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: [],
      total: 0,
      listLoading: true,
      selectedRows: null,
      listQuery: {
        page: 1,
        limit: 20,
        username: '',
        verifiedMobile: '',
        locked: '',
        startTime: '',
        endTime: '',
        sort: '-id'
      },
      showSearch: false,
      buttonDisabled: true,
      deleting: false,
      dateTime: '',
      pickerOptions: pickerOptions,
      currentIndex: -1
    }
  },
  watch: {
    dateTime: function(val) {
      this.listQuery.start_time = val[0]
      this.listQuery.end_time = val[1]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getUserList(this.listQuery).then(response => {
        console.log(response.data.paging.total)
        this.list = response.data.data
        this.total = response.data.paging.total
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })

    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleFilterClear() {
      this.listQuery = {
        page: 1,
        limit: 20,
        username: '',
        verifiedMobile: '',
        locked: '',
        startTime: '',
        endTime: '',
        sort: '-id'
      }
      this.dateTime = ''
      this.getList()
    },
    handleSizeChange(val) {

    },
    handleCurrentChange(val) {

    },
    handleModifyStatus(index, id, isEnabled) {

    },
    handleSelectionChange(val) {

    },
    handleImg(img) {
      openWindow(img, '图片预览', '500', '400')
    },
    handleCreate() {
      this.$refs.fromUser.handleCreate()
    },
    handleUpdate({
      $index,
      row
    }) {
      this.$refs.fromUser.handleUpdate(row.id)
    },
    updateRow(user) {
      if (this.currentIndex >= 0 && user.id > 0) {
        this.list.splice(this.currentIndex, 1, user)
      } else {
        if (this.list.length >= 10) {
          this.list.pop()
        }
        this.list.unshift(user)
        this.total = this.total + 1
      }
      this.currentIndex = -1
    },
    handleDelete({
      $index,
      row
    }) {
      console.log(row.id)
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(async () => {
          await deleteUser(row.key)
          this.list.splice($index, 1)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(err => {
          console.error(err)
        })
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
