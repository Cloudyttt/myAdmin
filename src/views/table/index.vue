<template>
  <div class="app-container">
    <el-table
        class="tabletable"
        :key="tableKey"
        v-loading="listLoading"
        :data="queryData"
        border
        fit
        highlight-current-row
        style="width: 100%;">
      <el-table-column label="编号" prop="id" align="center">
        <template slot-scope="scope">
          <span>{{ scope.$index+1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="名称" min-width="150px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="负责人" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column label="进度" class-name="status-col" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="日期" align="center">
        <template slot-scope="scope">
          <span>{{ parseTime(new Date(scope.row.date))}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" min-width="150px">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate($index)">
            修改
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete($index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                @pagination="fetchData"/>
    
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="form" label-position="left" label-width="70px"
               style="width: 400px; margin-left:50px;">
        <el-form-item label="名称" prop="title">
          <el-input v-model="form.title"/>
        </el-form-item>
        <el-form-item label="负责人">
          <el-input v-model="form.author"/>
        </el-form-item>
        <el-form-item label="进度">
          <el-select v-model="form.status" placeholder="选择项目当前状态">
            <el-option label="未完成" value="未完成"/>
            <el-option label="进行中" value="进行中"/>
            <el-option label="已完成" value="已完成"/>
          </el-select>
        </el-form-item>
        <el-form-item label="日期">
          <el-col :span="11">
            <el-date-picker v-model="form.date" type="date" placeholder="选择一个日期" style="width: 100%;"/>
          </el-col>
        </el-form-item>
        <el-form-item label="即时交付">
          <el-switch v-model="form.delivery"/>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.desc" type="textarea"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          Confirm
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  // eslint-disable-next-line no-unused-vars
  import {getList, updateProject, deleteProject} from '@/api/table'
  // eslint-disable-next-line no-unused-vars
  import {getToken} from '@/utils/auth' // get token from cookie
  import waves from '@/directive/waves' // waves directive
  // eslint-disable-next-line no-unused-vars
  import {parseTime} from '@/utils/index'
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination


  const calendarTypeOptions = [
    {key: 'CN', display_name: 'China'},
    {key: 'US', display_name: 'USA'},
    {key: 'JP', display_name: 'Japan'},
    {key: 'EU', display_name: 'Eurozone'}
  ]

  // arr to obj, such as { CN : "China", US : "USA" }
  const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
    acc[cur.key] = cur.display_name
    return acc
  }, {})

  export default {
    name: 'ComplexTable',
    components: {Pagination},
    directives: {waves},
    filters: {
      statusFilter(status) {
        const statusMap = {
          published: 'success',
          draft: 'info',
          deleted: 'danger'
        }
        return statusMap[status]
      },
      typeFilter(type) {
        return calendarTypeKeyValue[type]
      }
    },
    data() {
      return {
        tableKey: 0,
        list: [],
        total: 1,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20,
        },
        importanceOptions: [1, 2, 3],
        sortOptions: [{label: 'ID Ascending', key: '+id'}, {label: 'ID Descending', key: '-id'}],
        statusOptions: ['published', 'draft', 'deleted'],
        form: {
          id: 0,
          title: '',
          status: '未完成',
          date: '',
          delivery: false,
          desc: '',
          author: 'Cloudy'
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '修改',
          create: '创建'
        },
        dialogPvVisible: false,
        rules: {
          title: [{required: true, message: '项目名称', trigger: 'change'}],
        },
        downloadLoading: false,
        editIndex: 0,
      }
    },
    computed: {
      token: function () {
        return getToken();
      },
      queryData: function () {
        return this.list.slice((this.listQuery.page - 1) * this.listQuery.limit, this.listQuery.page * this.listQuery.limit)
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        this.listLoading = true
        getList({token: this.token}).then(response => {
          this.list = response.data;
          // console.log('this.list', this.list);
          this.total = this.list.length
          this.listLoading = false
        })
      },
      handleModifyStatus(row, status) {
        this.$message({
          message: '操作Success',
          type: 'success'
        })
        row.status = status
      },
      resetTemp() {
        this.temp = {
          id: undefined,
          importance: 1,
          remark: '',
          timestamp: new Date(),
          title: '',
          status: 'published',
          type: ''
        }
      },
      handleCreate() {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          }
        })
      },
      handleUpdate(index) {
        console.log('row', this.list[index]);
        this.temp = Object.assign({}, this.list[index]) // copy obj
        console.log('this.temp', this.temp);


        this.form.title = this.temp.title
        this.form.date = parseTime(new Date(this.temp.date))
        this.form.status = this.temp.status
        this.form.desc = this.temp.desc
        this.form.author = this.temp.author
        this.form.id = this.temp.id

        this.editIndex = index;
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
      },
      parseTime(date) {
        let year = date.getFullYear();
        let month = (date.getMonth() + 1).toString();
        let day = (date.getDate()).toString();
        if (month.length == 1) {
          month = "0" + month;
        }
        if (day.length == 1) {
          day = "0" + day;
        }
        let dateTime = year + "-" + month + "-" + day;
        return dateTime;
      },
      updateData() {
        this.dialogFormVisible = false
        this.form.date = this.parseTime(this.form.date);
        console.log('this.form.date--->', this.form.date);
        updateProject({token: this.token, data: this.form}).then(response => {
          console.log('response', response);
          this.fetchData()
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
    }
  }
</script>
<style scoped lang="scss">
  .el-form-item__label {
    width: 100px !important;
  }
</style>
