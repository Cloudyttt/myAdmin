<template>
  <div class="app-container">
      <el-form ref="form" :model="form" label-width="120px" :rules="rules" name="asd">
        <el-form-item label="项目名称" prop="title">
          <el-input v-model="form.title"/>
        </el-form-item>
        <el-form-item label="项目负责人">
          <el-input v-model="author" disabled/>
        </el-form-item>
        <el-form-item label="数据来源">
          <el-input v-model="form.xlsAddr"/>
        </el-form-item>
        <el-form-item label="MapBox ID">
          <el-input v-model="form.mapboxId"/>
        </el-form-item>
        <el-form-item label="XLS JSON">
          <el-button type="success" plain @click="$router.push({name:'BuildingConfig'})">详细建筑配置</el-button>
        </el-form-item>
        <el-form-item label="Mesh JSON">
          <el-input type="textarea" v-model="form.meshJson"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">创建</el-button>
          <el-button @click="onCancel">重置</el-button>
        </el-form-item>
      </el-form>
  </div>
</template>

<script>
  import {createProject} from '@/api/table'
  import {getToken} from '@/utils/auth'
  export default {
    data() {
      return {
        buildingConfigVisible:false,
        rules: {
          title: [{required: true, message: '请输入项目名称', trigger: ['blur', 'change']}],
        },
        form: {
          id: 0,
          title: '',
          mapboxId: '',
          xlsAddr: '',
          xlsJson: '',
          meshJson: '',
        },
      }
    },
    computed: {
      author() {
        return this.$store.getters.name
      }
    },
    methods: {
      onSubmit() {
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
      },
      onCancel() {
        this.form = {
          id: 0,
          title: '',
          mapboxId: '',
          xlsAddr: '',
          xlsJson: '',
          meshJson: '',
        }
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

