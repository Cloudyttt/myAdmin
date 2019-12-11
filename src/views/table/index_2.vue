<template>
  <div class="app-container">
    <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
        :stripe="true">
      <el-table-column align="center" label="项目编号" width="60">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="项目名称">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column label="项目负责人" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="项目状态" width="110" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="时间">
        <template slot-scope="scope">
          <span>{{ scope.row.date}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Actions" min-width="150">
        <template slot-scope="{row,$index}">
          <el-button
              type="primary"
              size="small"
              @click="handleUpdate(row)" >
            修改
          </el-button>
          <el-button
              size="mini"
              type="danger"
              @click="handleDelete($index)">删除
          </el-button>
        </template>
      </el-table-column>
      <!--<el-table-column
          align="center" label="操作">
        <template slot-scope="scope">
          <el-button
              v-if="editing"
              size="mini"
              @click="handleUpdateConfirm">修改
          </el-button>
          <el-button
              v-else
              size="mini"
              @click="handleUpdateConfirm">确认
          </el-button>
          <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除
          </el-button>
        </template>
      </el-table-column>-->
    </el-table>
  </div>
</template>

<script>
  import {getList, updateProject, deleteProject} from '@/api/table'
  import {getToken} from '@/utils/auth' // get token from cookie
  export default {
    filters: {
      statusFilter(status) {
        const statusMap = {
          published: 'success',
          draft: 'gray',
          deleted: 'danger'
        }
        return statusMap[status]
      }
    },
    data() {
      return {
        editing: false,
        list: null,
        listLoading: true,
        search: ''
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      token: function () {
        return getToken()
      }
    },
    methods: {
      cancelEdit(row) {
        row.title = row.originalTitle
        row.edit = false
        this.$message({
          message: 'The title has been restored to the original value',
          type: 'warning'
        })
      },
      confirmEdit(row) {
        console.log(row);
        row.edit = false
        row.originalTitle = row.title
        this.$message({
          message: 'The title has been edited',
          type: 'success'
        })
      },
      fetchData() {
        this.listLoading = true
        getList({token: this.token}).then(response => {
          this.list = response.data;
          console.log('this.list', this.list);
          this.listLoading = false
        })
      },
      handleEdit(index, row) {
        console.log(index, row);
        updateProject({token: this.token}).then(response => {
          console.log('response', response);
          console.log('this.list', this.list);
          this.fetchData()
          this.successMsg()
        })
      },
      handleDelete(index, row) {
        console.log(index, row);
        this.listLoading = true
        deleteProject({token: this.token, id: this.list[index].id}).then(response => {
          console.log('response', response);
          this.fetchData()
          this.successMsg()
        })
      },
      handleUpdateConfirm(){
        this.editing = !this.editing
      },
      successMsg() {
        this.$message({
          message: '成功!',
          type: 'success'
        });
      },
      failMsg(err) {
        this.$message({
          message: err,
          type: 'warning'
        })
      },
      handleUpdate(row) {
        console.log('row', row);
      },
    },

  }
</script>
