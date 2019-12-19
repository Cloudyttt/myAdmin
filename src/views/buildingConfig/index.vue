<template>
  <div class="app-container">
    <el-table
        border
        stripe
        :data="configData"
        style="width: 100%"
        :row-style="{height:'20px'}"
        :cell-style="{padding:'5px'}">
      <el-table-column prop="grade1" label="一级分类">
      </el-table-column>
      <el-table-column prop="grade2" label="二级分类">
      </el-table-column>
      <el-table-column prop="rentUnitPrice" label="出租单价（含税，元/平方米/天）" align="right">
      </el-table-column>
      <el-table-column prop="sellUnitPrice" label="销售单价（含税，元/平方米）" align="right">
      </el-table-column>
      <el-table-column prop="landCost" label="土地成本（元/平方米）" align="right">
      </el-table-column>
      <el-table-column prop="developmentCost" label="开发成本" align="right">
      </el-table-column>
      <el-table-column prop="employmentPopulation" label="就业人口（人）" align="right">
      </el-table-column>
      <el-table-column prop="residentPopulation" label="居住人口（人）" align="right">
      </el-table-column>
      <el-table-column prop="energyConsumption" label="能耗（吨标准煤/平方米/年）" align="right">
      </el-table-column>
      <el-table-column prop="taxRevenue" label="税收强度（万元/年）" align="right">
      </el-table-column>
      <el-table-column prop="gdp" label="GDP（万元/年）" align="right">
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="{$index}">
          <el-button type="primary" size="mini" @click="editBuildingConfig($index)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="建筑配置 - 修改" :visible.sync="dialogFormVisible" center>
      <el-form ref="dataForm" :model="configForm" label-position="left" label-width="220px"
               style="padding: 0 50px" :rules="rules">
        <el-form-item label="出租单价 (含税，元/平方米/天)" prop="rentUnitPrice">
          <el-input v-model="configForm.rentUnitPrice" size="small" :disabled="configForm.rentUnitPrice==='/'"/>
        </el-form-item>
        <el-form-item label="销售单价（含税，元/平方米）" prop="sellUnitPrice">
          <el-input v-model="configForm.sellUnitPrice" size="small" :disabled="configForm.sellUnitPrice==='/'"/>
        </el-form-item>
        <el-form-item label="土地成本（元/平方米）" prop="landCost">
          <el-input v-model="configForm.landCost" size="small" :disabled="configForm.landCost==='/'"/>
        </el-form-item>
        <el-form-item label="开发成本" prop="developmentCost">
          <el-input v-model="configForm.developmentCost" size="small" :disabled="configForm.developmentCost==='/'"/>
        </el-form-item>
        <el-form-item label="就业人口（人）" prop="employmentPopulation">
          <el-input v-model="configForm.employmentPopulation" :disabled="configForm.employmentPopulation==='/'"/>
        </el-form-item>
        <el-form-item label="居住人口（人）" prop="residentPopulation">
          <el-input v-model="configForm.residentPopulation" :disabled="configForm.residentPopulation==='/'"/>
        </el-form-item>
        <el-form-item label="能耗（吨标准煤/平方米/年）" prop="energyConsumption">
          <el-input v-model="configForm.energyConsumption" size="small" :disabled="configForm.energyConsumption==='/'"/>
        </el-form-item>
        <el-form-item label="税收强度（万元/年）" prop="taxRevenue">
          <el-input v-model="configForm.taxRevenue" size="small" :disabled="configForm.taxRevenue==='/'"/>
        </el-form-item>
        <el-form-item label="GDP（万元/年）" prop="gdp">
          <el-input v-model="configForm.gdp" size="small" :disabled="configForm.gdp==='/'"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="confirmEdition">
          确认修改
        </el-button>
      </div>
    </el-dialog>
    <el-button plain style="float: right; margin: 40px 20px 0 0" @click="routerBack">返回</el-button>
    <el-button type="primary" style="float: right; margin: 40px 20px 0 0" @click="saveBuildingConfig">保存</el-button>
  </div>
</template>

<script>
  export default {
    name: "buildingConfig",
    data() {
      let checkInput = (rule, value, callback) => {
        // let patt = /^\d+(\.\d+)?$/
        // let patt = /(^\d+(\.\d+)?$)|(^[1-9]+\d*$)/
        let patt = /(^[1-9]+\.\d+$)|(^[1-9]+\d*$)|(^0\.\d+$)|(^0$)/
        if (value === '/') {
          callback()
        } else if (value === '') {
          callback(new Error('输入不能为空！'));
        } else if (!patt.test(value)) {
          callback(new Error('请输入正确数字！'));
        } else if (value.length > 13) {
          callback(new Error('输入数字过长！'));
        } else {
          callback();
        }
      };
      return {
        form: {},
        a: '1',
        dialogFormVisible: false,
        backTo: 'Layout',
        xlsData: {},
        rules: {
          rentUnitPrice: [{validator: checkInput, trigger: ['blur', 'change']}],
          sellUnitPrice: [{validator: checkInput, trigger: ['blur', 'change']}],
          landCost: [{validator: checkInput, trigger: ['blur', 'change']}],
          developmentCost: [{validator: checkInput, trigger: ['blur', 'change']}],
          employmentPopulation: [{validator: checkInput, trigger: ['blur', 'change']}],
          residentPopulation: [{validator: checkInput, trigger: ['blur', 'change']}],
          energyConsumption: [{validator: checkInput, trigger: ['blur', 'change']}],
          taxRevenue: [{validator: checkInput, trigger: ['blur', 'change']}],
          gdp: [{validator: checkInput, trigger: ['blur', 'change']}],
        },
        configForm: {
          grade1: '零售商业',
          grade2: '零售商业',
          rentUnitPrice: 1.9,
          sellUnitPrice: 17000,
          landCost: 2000,
          developmentCost: 4500,
          employmentPopulation: 0.0050,
          residentPopulation: 0.00,
          energyConsumption: 0.04,
          taxRevenue: 0.08,
          gdp: 0.20,
        },
        configData: [
          {
            grade1: '零售商业',
            grade2: '零售商业',
            rentUnitPrice: 1.9,
            sellUnitPrice: 17000,
            landCost: 2000,
            developmentCost: 4500,
            employmentPopulation: 0.0050,
            residentPopulation: 0.00,
            energyConsumption: 0.04,
            taxRevenue: 0.08,
            gdp: 0.20,
          },
          {
            grade1: '人才公寓',
            grade2: '人才公寓',
            rentUnitPrice: 0.68,
            sellUnitPrice: 10000,
            landCost: 2000,
            developmentCost: 4500,
            employmentPopulation: 0.0000,
            residentPopulation: 0.05,
            energyConsumption: 0.03,
            taxRevenue: 0.00,
            gdp: 0.00,
          },
          {
            grade1: '服务式公寓',
            grade2: '零售商业',
            rentUnitPrice: 0.68,
            sellUnitPrice: 10000,
            landCost: 2000,
            developmentCost: 4500,
            employmentPopulation: 0.100,
            residentPopulation: 0.10,
            energyConsumption: 0.03,
            taxRevenue: 0.00,
            gdp: 0.00,
          },
          {
            grade1: '研发办公',
            grade2: '研发办公',
            rentUnitPrice: 0.68,
            sellUnitPrice: 10000,
            landCost: 2000,
            developmentCost: 4500,
            employmentPopulation: '/',
            residentPopulation: '/',
            energyConsumption: '/',
            taxRevenue: '/',
            gdp: '/',
          },
          {
            grade1: '研发办公',
            grade2: '智能汽车',
            rentUnitPrice: '/',
            sellUnitPrice: '/',
            landCost: '/',
            developmentCost: '/',
            employmentPopulation: 0.0060,
            residentPopulation: 0.00,
            energyConsumption: 0.24,
            taxRevenue: 0.05,
            gdp: 0.61,
          },
          {
            grade1: '研发办公',
            grade2: '高端装备',
            rentUnitPrice: '/',
            sellUnitPrice: '/',
            landCost: '/',
            developmentCost: '/',
            employmentPopulation: 0.0060,
            residentPopulation: 0.00,
            energyConsumption: 0.34,
            taxRevenue: 0.05,
            gdp: 0.50,
          },
          {
            grade1: '研发办公',
            grade2: '智能硬件',
            rentUnitPrice: '/',
            sellUnitPrice: '/',
            landCost: '/',
            developmentCost: '/',
            employmentPopulation: 0.0060,
            residentPopulation: 0.00,
            energyConsumption: 0.36,
            taxRevenue: 0.05,
            gdp: 0.80,
          },
          {
            grade1: '研发办公',
            grade2: '生物医药研发',
            rentUnitPrice: '/',
            sellUnitPrice: '/',
            landCost: '/',
            developmentCost: '/',
            employmentPopulation: 0.0060,
            residentPopulation: 0.00,
            energyConsumption: 0.42,
            taxRevenue: 0.05,
            gdp: 0.72,
          },
          {
            grade1: '研发办公',
            grade2: '创新医疗器械',
            rentUnitPrice: '/',
            sellUnitPrice: '/',
            landCost: '/',
            developmentCost: '/',
            employmentPopulation: 0.0060,
            residentPopulation: 0.00,
            energyConsumption: 0.42,
            taxRevenue: 0.05,
            gdp: 0.64,
          },
          {
            grade1: '社群中心',
            grade2: '社群中心',
            rentUnitPrice: 0.68,
            sellUnitPrice: 10000,
            landCost: 2000,
            developmentCost: 4500,
            employmentPopulation: '/',
            residentPopulation: '/',
            energyConsumption: '/',
            taxRevenue: '/',
            gdp: '/',
          },
          {
            grade1: '社群中心',
            grade2: '高端健康服务',
            rentUnitPrice: '/',
            sellUnitPrice: '/',
            landCost: '/',
            developmentCost: '/',
            employmentPopulation: 0.0200,
            residentPopulation: 0.00,
            energyConsumption: 0.24,
            taxRevenue: 0.05,
            gdp: 0.34,
          },
          {
            grade1: '居住用地',
            grade2: '多层',
            rentUnitPrice: 0.00,
            sellUnitPrice: 14000,
            landCost: 4000,
            developmentCost: 4000,
            employmentPopulation: 0.0000,
            residentPopulation: 0.02,
            energyConsumption: 0.03,
            taxRevenue: 0.00,
            gdp: 0.00,
          },
          {
            grade1: '居住用地',
            grade2: '小高层',
            rentUnitPrice: 1.50,
            sellUnitPrice: 14000,
            landCost: 4000,
            developmentCost: 4000,
            employmentPopulation: 0.0000,
            residentPopulation: 0.02,
            energyConsumption: 0.03,
            taxRevenue: 0.00,
            gdp: 0.00,
          },
          {
            grade1: '居住用地',
            grade2: '高层',
            rentUnitPrice: 0.00,
            sellUnitPrice: 14000,
            landCost: 4000,
            developmentCost: 4000,
            employmentPopulation: 0.0000,
            residentPopulation: 0.02,
            energyConsumption: 0.03,
            taxRevenue: 0.00,
            gdp: 0.00,
          },
          {
            grade1: '居住用地',
            grade2: '学校医院等',
            rentUnitPrice: 0.00,
            sellUnitPrice: '/',
            landCost: 4000,
            developmentCost: 4000,
            employmentPopulation: 0.0200,
            residentPopulation: 0.00,
            energyConsumption: 0.01,
            taxRevenue: 0.00,
            gdp: 0.00,
          },
          {
            grade1: '居住用地',
            grade2: '商铺',
            rentUnitPrice: 0.00,
            sellUnitPrice: 17000,
            landCost: 4000,
            developmentCost: 4000,
            employmentPopulation: 0.0400,
            residentPopulation: 0.00,
            energyConsumption: 0.04,
            taxRevenue: 0.00,
            gdp: 0.00,
          },
        ],
        editingIndex: 0,
      }
    },
    methods: {
      routerBack() {
        this.$router.push({name: this.backTo})
      },
      saveBuildingConfig() {
        // TODO:向服务器发送创建/修改请求
        alert('保存')
      },
      editBuildingConfig(index) {
        console.log(index);
        this.dialogFormVisible = true
        Object.assign(this.configForm, this.configData[index]) // 浅拷贝
      },
      confirmEdition() {
        this.$refs.dataForm.validate(valid => {
          if (valid) {
            this.dialogFormVisible = false
          } else {
            this.failMsg('请先正确填写表单！')
            return false
          }
        });
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
    },
    created() {
      console.log('this.$route.params', this.$route.params);
      if (this.$route.params.data) {
        this.form = this.$route.params.data
      }

      if (this.$route.params.from) {
        this.backTo = this.$route.params.from;
      }

      console.log('this.backTo', this.backTo);
    },
  }
</script>

<style scoped>

</style>
