<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="项目名称">
        <el-input v-model="form.title"/>
      </el-form-item>
      <el-form-item label="项目负责人">
        <el-input v-model="form.author"/>
      </el-form-item>
      <el-form-item label="项目状态">
        <el-select v-model="form.status" placeholder="选择项目当前状态">
          <el-option label="未完成" value="未完成"/>
          <el-option label="进行中" value="进行中"/>
          <el-option label="已完成" value="已完成"/>
        </el-select>
      </el-form-item>
      <el-form-item label="项目时间">
        <el-col :span="11">
          <el-date-picker v-model="form.date" type="date" placeholder="选择一个日期" style="width: 100%;"/>
        </el-col>
        <!--<el-col :span="2" class="line">-</el-col>
        <el-col :span="11">
          <el-time-picker v-model="form.date2" type="fixed-time" placeholder="Pick a time" style="width: 100%;" />
        </el-col>-->
      </el-form-item>
      <el-form-item label="即时交付">
        <el-switch v-model="form.delivery"/>
      </el-form-item>
      <!--<el-form-item label="项目类型">
        <el-checkbox-group v-model="form.type">
          <el-checkbox label="Online activities" name="type" />
          <el-checkbox label="Promotion activities" name="type" />
          <el-checkbox label="Offline activities" name="type" />
          <el-checkbox label="Simple brand exposure" name="type" />
        </el-checkbox-group>
      </el-form-item>-->
      <!--<el-form-item label="资金">
        <el-radio-group v-model="form.resource">
          <el-radio label="Sponsor" />
          <el-radio label="Venue" />
        </el-radio-group>
      </el-form-item>-->
      <el-form-item label="备注">
        <el-input v-model="form.desc" type="textarea"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">Create</el-button>
        <el-button @click="onCancel">Cancel</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {createProject} from '@/api/table'
  import {getToken} from '@/utils/auth' // get token from cookie
  export default {
    data() {
      return {
        form: {
          title: '',
          status: '未完成',
          date: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: '',
          author: 'Cloudy'
        }
      }
    },
    methods: {
      onSubmit() {
        if(this.form.title.trim()){
          let token = getToken();
          this.listLoading = true
          createProject({token, project: this.form}).then(response => {
            this.list = response.data;
            console.log('this.list', this.list);
            this.listLoading = false
            this.successMsg()
          }).catch(err => {
            this.failMsg(err)
          })
        } else {
          this.failMsg('项目名称不能为空')
        }
        

      },
      onCancel() {
        this.$message({
          message: 'cancel!',
          type: 'warning'
        })
      },
      successMsg() {
        this.$message({
          message: '创建成功',
          type: 'success'
        });
      },
      failMsg(err) {
        this.$message({
          message: err,
          type: 'warning'
        })
      }
    }
  }
</script>

<style scoped>
  .line {
    text-align: center;
  }
</style>

