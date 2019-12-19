<template>
  <div class="app-container">
    <div style="overflow: hidden;display: flex; flex-wrap: wrap;justify-content:space-around">
      <el-card
          v-for="(item, index) in queryData"
          :key="item.id"
          class="box-card"
          style="width: 400px; height: 240px; margin: 10px;"
          shadow="hover">
        <div slot="header" class="clearfix" style="padding: 0!important;">
          <span><strong>{{index + 1}}. {{item.title}}</strong></span>
          <el-button size="mini" type="danger" @click="openWarning(index)"
                     style="float: right; padding: 3px 5px; margin-left: 10px">
            删除
          </el-button>
          <el-button type="primary" size="mini" @click="handleUpdate(index)"
                     style="float: right; padding: 3px 5px; margin-left: 10px">
            修改
          </el-button>
        </div>
        <div class="card-main" @click="showPWC(index)">
          <el-row :gutter="20" style="padding: 8px 0">
            <el-col :span="6" style="border-right: 1px solid lightgray; vertical-align: middle">
              <el-tag size="mini">项目名称</el-tag>
            </el-col>
            <el-col :span="16" :offset="2" style="font-size: 0.9rem; color: #5a5e66">{{item.title}}</el-col>
          </el-row>
          <el-row :gutter="20" style="padding: 8px 0">
            <el-col :span="6" style="border-right: 1px solid lightgray">
              <el-tag size="mini">负责人</el-tag>
            </el-col>
            <el-col :span="16" :offset="2" style="font-size: 0.9rem; color: #5a5e66">{{author}}</el-col>
          </el-row>
          <el-row :gutter="20" style="padding: 8px 0">
            <el-col :span="6" style="border-right: 1px solid lightgray">
              <el-tag size="mini">数据来源</el-tag>
            </el-col>
            <el-col :span="16" :offset="2" style="font-size: 0.9rem; color: #5a5e66">{{item.xlsAddr}}</el-col>
          </el-row>
          <el-row :gutter="20" style="padding: 8px 0">
            <el-col :span="6" style="border-right: 1px solid lightgray">
              <el-tag size="mini">Mapbox ID</el-tag>
            </el-col>
            <el-col :span="16" :offset="2" style="font-size: 0.9rem; color: #5a5e66">{{item.mapboxId}}</el-col>
          </el-row>
        </div>
      
      </el-card>
    </div>
    
    <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        style=""
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
        <el-form-item label="Excel JSON">
          <el-button type="success" plain @click="routerToBuildingConfig">详细建筑配置修改</el-button>
        </el-form-item>
        <!--<el-form-item label="Excel JSON">
          <el-input type="textarea" v-model="form.xlsJson"/>
        </el-form-item>
        <el-form-item label="Mesh JSON">
          <el-input type="textarea" v-model="form.meshJson"/>
        </el-form-item>-->
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
  import {getList, updateProject, deleteProject} from '@/api/table'
  import {getToken} from '@/utils/auth' // get token from cookie
  import waves from '@/directive/waves' // waves directive
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  export default {
    name: "projectCard",
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
    },
    data() {
      return {
        author: '',
        tableKey: 0,
        list: [],
        total: 1,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 9,
        },
        form: {
          id: 0,
          title: '',
          xlsAddr: '',
          meshJson: '',
          ExcelJson: ''
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
      routerToBuildingConfig() {
        this.$refs.dataForm.validate(valid => {
          if (valid) {
            let temp = Object.assign({}, this.form);
            this.$router.push({name: 'BuildingConfig', params: {data: temp, from: 'ProjectCard'}})
          } else {
            this.failMsg('请先正确填写表单其他部分！')
            return false
          }
        });

      },
      showPWC(index) {
        this.$router.push({name: 'Homepage', params: this.list[index]})
      },
      openWarning(index) {
        this.$confirm('此操作将永久删除该项目, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.handleDelete(index)
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      fetchData() {
        this.listLoading = true
        getList({token: this.token}).then(response => {
          this.list = response.data
          this.author = response.author
          this.total = this.list.length
          this.listLoading = false
        })
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
      parseTime(date) {
        let year = date.getFullYear();
        let month = (date.getMonth() + 1).toString();
        let day = (date.getDate()).toString();
        if (month.length === 1) {
          month = "0" + month;
        }
        if (day.length === 1) {
          day = "0" + day;
        }
        let dateTime = year + "-" + month + "-" + day;
        return dateTime;
      },
      updateData() {

        this.$refs.dataForm.validate(valid => {
          if (valid) {
            this.dialogFormVisible = false
            this.form.date = this.parseTime(this.form.date);
            console.log('this.form.date--->', this.form.date);
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
      handleDelete(index, row) {
        console.log(index, row);
        this.listLoading = true
        deleteProject({token: this.token, id: this.list[index].id}).then(response => {
          console.log('response', response);
          this.fetchData()
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
  
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  
  .clearfix:after {
    clear: both
  }
  
  .card-main {
    cursor: pointer;
  }
</style>

