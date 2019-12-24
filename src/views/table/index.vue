<template>
  <div class="app-container">
    <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="queryData"
        border
        fit
        highlight-current-row
        style="width: 100%;">
      <el-table-column label="编号" prop="id" align="center">
        <template slot-scope="scope">
          <span>{{ getCardOrder(scope.$index)+ 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="项目名称" min-width="150px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="项目负责人" align="center">
        <template>
          <span>{{ author }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Mapbox ID" class-name="status-col" align="center">
        <template slot-scope="{row}">
          {{ row.mapboxId }}
        </template>
      </el-table-column>
      <el-table-column label="数据来源" class-name="status-col" align="center">
        <template slot-scope="{row}">
          {{ row.xlsJson }}
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
    
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" center>
      <el-form ref="dataForm" :rules="rules" :model="form" label-position="left" label-width="100px"
               style="padding: 0 50px">
        <el-form-item label="名称" prop="title">
          <el-input v-model="form.title"/>
        </el-form-item>
        <el-form-item label="负责人">
          <el-input v-model="author" disabled/>
        </el-form-item>
        <el-form-item label="Mapbox ID">
          <el-input v-model="form.mapboxId"/>
        </el-form-item>
        <!--<el-form-item label="数据来源">
          <el-input v-model="form.xlsAddr"/>
        </el-form-item>-->
        <el-form-item label="Mesh JSON">
          <el-input type="textarea" v-model="form.meshJson"/>
        </el-form-item>
        <el-form-item label="Excel JSON">
          <el-button type="success" plain @click="routerToBuildingConfig">详细建筑配置修改</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="updateData()">
          确认修改
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
    buildingConfigVisibal: false,
    name: 'ComplexTable',
    components: {Pagination},
    directives: {waves},
    filters: {
      statusFilter(status) {
        const statusMap = ['warning', 'primary', 'success']
        let flag = 0;
        switch (status) {
          case '未开始':
            flag = 0
            break;
          case '进行中':
            flag = 1
            break;
          case '已完成':
            flag = 2
            break;
        }
        return statusMap[flag]
      },
      typeFilter(type) {
        return calendarTypeKeyValue[type]
      }
    },
    data() {
      return {
        author: 'Cloudy',
        tableKey: 0,
        list: [],
        total: 1,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20,
        },
        form: {
          id: 0,
          title: '',
          mapboxId: '',
          xlsAddr: '',
          xlsJson: '',
          meshJson: '',
        },
        dialogFormVisible: false,
        dialogStatus: 'update',
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
          this.author = response.author;
          console.log('this.list', this.list);
          console.log('this.list[0].date=>', this.list[0].date);
          // console.log('this.list', this.list);
          this.total = this.list.length
          this.listLoading = false
        })
      },
      routerToBuildingConfig() {
        this.$refs.dataForm.validate(valid => {
          if (valid) {
            let temp = Object.assign({}, this.form)
            this.$router.push({name: 'BuildingConfig', params: {data: temp, from: 'Table'}})
          } else {
            this.failMsg('请先正确填写表单其他部分！')
            return false
          }
        });
        
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
        this.temp = Object.assign({}, this.queryData[index]) // copy obj
        this.form.title = this.temp.title
        this.form.id = this.temp.id
        this.form.xlsAddr = this.temp.xlsAddr
        this.form.meshJson = this.temp.meshJson
        this.form.mapboxId = this.temp.mapboxId
        this.form.xlsJson = this.temp.xlsJson
        this.editIndex = index;
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
      },
      updateData() {
        this.$refs.dataForm.validate(valid => {
          if (valid) {
            this.dialogFormVisible = false
            console.log('this.form.date--->', new Date(this.form.date));
            updateProject({token: this.token, data: this.form}).then(response => {
              console.log('response', response);
              this.fetchData()
            })
          } else {
            this.failMsg('请先正确填写表单！')
            return false
          }
        });
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
      getCardOrder(index){
        return (this.listQuery.page - 1) * this.listQuery.limit + index
      },
      // 删除前弹窗警告
      openWarning(index) {
        this.$confirm('此操作将永久删除该项目, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.handleDelete(index)
          /*this.$message({
            type: 'success',
            message: '删除成功!'
          });*/
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      // 真正开始删除
      handleDelete(index) {
        let finalIndex = this.getCardOrder(index)
        console.log('finalIndex, this.list[finalIndex]', finalIndex, this.list[finalIndex]);
        this.listLoading = false
        deleteProject({token: this.token, id: this.list[finalIndex].id}).then(response => {
          console.log('response', response);
          if(response.code === 200){
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          }
          this.fetchData()
        })
      },
      /*handleDelete(index, row) {
        console.log(index, row);
        this.listLoading = true
        deleteProject({token: this.token, id: this.list[index].id}).then(response => {
          console.log('response', response);
          this.fetchData()
          this.successMsg()
        })
      },*/
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
