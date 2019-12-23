<template>
  <div class="app-container">
    <el-button type="primary" @click="dialogFormVisible = true">新增用户</el-button>
    
    <el-dialog title="新增用户" :visible.sync="dialogFormVisible" center>
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="ruleForm.username"/>
        </el-form-item>
        <el-form-item label="密码" prop="pass">
          <el-input type="password" v-model="ruleForm.pass" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="权限" prop="root">
          <el-select v-model="ruleForm.root" placeholder="选择权限">
            <el-option label="超级管理员" value="超级管理员"/>
            <el-option label="管理员" value="管理员"/>
            <el-option label="普通用户" value="普通用户"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    
    
    <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="userList"
        border
        fit
        highlight-current-row
        style="width: 100%;margin-top: 50px">
      <el-table-column label="序号" prop="id" align="center">
        <template slot-scope="scope">
          <span>{{ scope.$index+1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户名" prop="id" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="密码" prop="id" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.password }}</span>
        </template>
      </el-table-column>
      <!--<el-table-column label="权限" min-width="150px">
        <template slot-scope="{scope}">
          <span>{{ scope.row.root }}</span>
        </template>
      </el-table-column>-->
      <el-table-column label="最近登陆" align="center">
        <template slot-scope="scope">
          <span>{{ parseTime(new Date(scope.row.lastestLogin))}}</span>
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
  
  </div>
</template>

<script>
  // eslint-disable-next-line no-unused-vars
  import {getToken} from '@/utils/auth' // get token from cookie
  import {userQuery} from '@/api/user'
  import {userRegister} from '@/api/user'

  export default {
    data() {
      let validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.ruleForm.checkPass !== '') {
            this.$refs.ruleForm.validateField('checkPass');
          }
          callback();
        }
      };
      let validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm.pass) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        total: 0,
        tableKey: 0,
        userList: [],
        listLoading: true,
        dialogFormVisible: false,
        users: {
          username: '',
          password: '',
          latestLogin: '',
          root: '',
        },
        ruleForm: {
          username: '',
          pass: '',
          checkPass: '',
          root: '管理员',
        },
        rules: {
          username: [{required: true, message: '用户名不能不能为空', trigger: 'blur'}],
          pass: [
            {validator: validatePass, trigger: 'blur'}
          ],
          checkPass: [
            {validator: validatePass2, trigger: 'blur'}
          ],
        },
      }
    },
    computed: {
      token: function () {
        return getToken();
      },
    },
    created() {
      this.fetchData()
    },
    methods: {
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
      fetchData() {
        this.listLoading = true
        userQuery({token: this.token}).then(response => {
          this.userList = response.data;
          console.log('this.userList', this.userList);
          // console.log('this.list', this.list);
          this.total = this.userList.length
          this.listLoading = false
        })
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            userRegister({token: this.token, username: this.ruleForm.username,password: this.ruleForm.pass}).then(()=>{
              this.successMsg('注册成功！')
              this.dialogFormVisible = false
            })
          } else {
            this.failMsg('请先正确填写账户信息！')
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.successMsg('已重置！')
      },
      handleDelete(index) {
        alert('删除' + index)
      },
      handleUpdate(index) {
        alert('修改' + index)
      },
      successMsg(msg) {
        this.$message({
          message: msg,
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

