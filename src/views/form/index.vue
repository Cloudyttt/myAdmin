<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px" :rules="rules" name="asd">
      <el-form-item label="项目名称" prop="title">
        <el-input v-model="form.title"/>
      </el-form-item>
      <el-form-item label="项目负责人">
        <el-input v-model="author" disabled/>
      </el-form-item>
      <!--<el-form-item label="数据来源">
        <el-input v-model="form.xlsAddr"/>
      </el-form-item>-->
      <el-form-item label="MapBox ID">
        <el-input v-model="form.mapboxId"/>
      </el-form-item>
      <el-form-item label="Mesh JSON">
        <el-input type="textarea" v-model="form.meshJson"/>
      </el-form-item>
      <el-form-item label="XLS Addr" prop="xlsJson">
        <!--<el-button type="success" plain @click="routerToBuildingConfig">详细建筑配置</el-button>-->
        <!--<el-upload
            :data="{id:123}"
            name="file"
            class="upload-demo"
            ref="upload"
            action=""
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-exceed="fileExceed"
            :auto-upload="false"
            :limit="1"
            :http-request="uploadFile">
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          &lt;!&ndash;<el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>&ndash;&gt;
          <div slot="tip" class="el-upload__tip"></div>
        </el-upload>-->
        <el-upload
            :data="form"
            name="file"
            class="upload-demo"
            ref="upload"
            action="http://localhost:3000/table/xls"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-success="handleSucceed"
            :on-exceed="fileExceed"
            :before-upload="handleBeforeUpload"
            :on-error="handleFail"
            :auto-upload="false"
            :file-list="fileList"
            :on-change="handleChange"
            :limit="1">
          <el-button slot="trigger" size="small">选取文件</el-button>
          <div slot="tip" class="el-upload__tip" style="margin-top: -10px;height: 30px">请上传正确的Excel表</div>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button :loading="loading" type="success" @click="submitUpload">创建项目</el-button>
        <el-button @click="onCancel">重置</el-button>
      </el-form-item>
      <!--<el-form-item>
        <el-button type="primary" @click="onSubmit">创建</el-button>
        <el-button @click="onCancel">重置</el-button>
      </el-form-item>-->
    </el-form>
  </div>
</template>

<script>
  import {createProject} from '@/api/table'
  import {getToken} from '@/utils/auth'
  // import request from '@/utils/request'
  export default {
    data() {
      // eslint-disable-next-line no-unused-vars
      let valiFile = (rule, value, callback) => {
        if (value) {
          callback(new Error('请选择建筑配置文件'));
        } else {
          callback();
        }
      };
      return {
        buildingConfigVisible: false,
        rules: {
          title: [{required: true, message: '请输入项目名称', trigger: ['blur', 'change']}],
          /*xlsAddr: [{required: true, message: '请先添加建筑配置表', trigger: ['blur', 'change']}],*/
          xlsJson: [{validate:valiFile, trigger: ['blur', 'change']}]
        },
        form: {
          id: 0,
          title: '',
          mapboxId: '',
          xlsAddr: '',
          xlsJson: '',
          meshJson: '',
          token: '',
        },
        loading: false,
        fileList: [],
        haveFile:false,
        data: {id: 123}
      }
    },
    watch:{
      fileList:function () {
        console.log('this.fileList', this.fileList);
      }
    },
    computed: {
      author() {
        return this.$store.getters.name
      },
      uploadData() {
        return {
          token: this.token,
          project: this.form
        }
      }
    },
    methods: {
      uploadFile() {
        const formData = new FormData()
        const file = this.$refs.upload.uploadFiles[0].raw
        if (!file) { // 若未选择文件
          alert('请选择文件')
          return
        }
        formData.append('file', file)
        this.axios({
          method: 'post',
          url: 'http://localhost:3000/xls',
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }).then(res => {
          console.log(res)
        })
      },
      fileExceed() {
        this.failMsg('一次只能上传一个文件！')
      },
      routerToBuildingConfig() {
        this.$refs.form.validate(valid => {
          if (valid) {
            let temp = Object.assign({}, this.form);
            this.$router.push({name: 'BuildingConfig', params: {data: temp, from: 'Form'}})
          } else {
            this.failMsg('请先正确填写表单其他部分！')
            return false
          }
        });
      },
      onSubmit() {
        this.$refs.form.validate(valid => {
          if (valid) {
            let token = getToken();
            this.form.token = token;
            this.loading = true
            createProject({token, project: this.form}).then(response => {
              this.list = response.data;
              console.log('this.list', this.list);
              this.loading = false
              this.$refs.upload.submit();
              this.successMsg()
              this.$router.push('/')
            }).catch(err => {
              this.failMsg(err)
            })
          } else {
            this.failMsg('请先正确填写表单！')
            return false
          }
        });
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
      successMsg(val = '创建成功') {
        this.$message({
          message: val,
          type: 'success'
        });
      },
      failMsg(err = '操作失败') {
        this.$message({
          message: err,
          type: 'warning'
        })
      },

      submitUpload() {
        this.$refs.form.validate(valid => {
          this.loading = true
          if (valid) {
            /*setTimeout(() => {
              if (this.loading === true) {
                this.loading = false
              }
            }, 2000)*/
            if(this.haveFile){
              this.form.token = getToken()
              /*this.successMsg()*/
              this.$refs.upload.submit();
            } else {
              this.failMsg('请先上传建筑配置表单！')
              this.loading = false
              return false
            }
          } else {
            this.failMsg('请先正确填写表单！')
            this.loading = false
            return false
          }
        });
      },
      // eslint-disable-next-line no-unused-vars
      handleSucceed(response, file, fileList) {
        console.log('response', response);
        this.list = response.data;
        this.loading = false
        this.successMsg()
        this.$router.push('/')
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      handleFail() {
        this.loading = false
        this.failMsg('上传失败')
      },
      handleBeforeUpload(file) {
        console.log('file in before upload',file);
      },
      handleChange(file, fileList){
        console.log('file in change',file);
        console.log('fileList in change', fileList);
        if(file){
          this.haveFile = true
        }
      },
    }
  }
</script>

<style scoped>
  .line {
    text-align: center;
  }
</style>

