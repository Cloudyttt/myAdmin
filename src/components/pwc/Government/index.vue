<template>
  <div class="government">
    <div class="chartBar">
      <chartBtn :graphInfo="graphDetail[0]" @emitGraph="showEchart"/>
      <chartBtn :graphInfo="graphDetail[1]" @emitGraph="showEchart"/>
      <chartBtn :graphInfo="graphDetail[2]" @emitGraph="showEchart"/>
      <chartBtn :graphInfo="graphDetail[3]" @emitGraph="showEchart"/>
      <chartBtn :graphInfo="graphDetail[4]" @emitGraph="showEchart"/>
      <chartBtn :graphInfo="graphDetail[5]" @emitGraph="showEchart"/>
      <chartBtn :graphInfo="graphDetail[6]" @emitGraph="showEchart"/>
      <chartBtn :graphInfo="graphDetail[7]" @emitGraph="showEchart"/>
    </div>
    <el-container>
      <el-main class="government-main">
        <transition name="bounce">
          <div v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.8)">
            <div v-show="isGraphVisibal" id="echart" ref="chart" class="government-main-echart">
            </div>
          </div>
        </transition>
      </el-main>
    </el-container>
  
  </div>
</template>

<script>
  import chartBtn from "../chartBtn/index";

  export default {
    name: "Government",
    data() {
      return {
        echart: '',
        graphDetail: [
          {graphName: '土地出让收入', graphNum: 0, active: false},
          {graphName: '土地出让税收', graphNum: 1, active: false},
          {graphName: '居住人口', graphNum: 2, active: false},
          {graphName: '就业人口', graphNum: 3, active: false},
          {graphName: '人均绿地面积', graphNum: 4, active: false},
          {graphName: 'GDP', graphNum: 5, active: false},
          {graphName: '能耗', graphNum: 6, active: false},
          {graphName: '产业税收', graphNum: 7, active: false},
        ],
        loading: false,
        isGraphVisibal: false,
        activeGraph: -1,  // 当前活跃的图表,
      }
    },
    props: {
      isVisibal: Boolean
    },
    components: {
      chartBtn
    },
    // watch: {
    //   visibility: (val) => {
    //     console.log('visibility', val)
    //   }
    // },
    mounted() {
      // eslint-disable-next-line no-unused-vars
      this.$root.$on('hideChart', val=>{
        // console.log(val)
        // console.log(this.activeGraph);
        if(this.activeGraph !== -1){
          this.graphDetail[this.activeGraph].active = false
          this.activeGraph = -1;
          this.isGraphVisibal = false
        }

      })
    },
    methods: {
      showEchart(val) {
        this.$emit('hideSiderbar');
        // if(this.isVisibal === true){
        //   console.log('123')
        // }
        // if(this.isVisibal === true && this.activeGraph !== -1){
        //   console.log('123')
        //   this.graphDetail[this.activeGraph].active = false
        //   this.activeGraph = -1
        // }
        if (this.activeGraph !== -1) {
          this.graphDetail[this.activeGraph].active = this.activeGraph === val ? this.graphDetail[this.activeGraph].active : false; // 取消之前激活的图标显示
          this.activeGraph = this.activeGraph === val ? -1 : val; // 更新当前活跃的图表下标
        } else {
          this.activeGraph = val; // 更新新的激活的图标显示
        }
        this.isGraphVisibal = this.activeGraph !== -1;
        let drawChart = this.drawStore(val);
        drawChart();
        this.$root.$emit('hideBar', this.isGraphVisibal);
      },

      // 绘图函数工厂
      drawStore(val) {
        let drawFun = null;
        switch (val) {
          case 0:
            drawFun = this.drawChart_1; // 绘图按钮_1
            break;
          case 1:
            drawFun = this.drawChart_2; // 绘图按钮_2
            break;
          case 2:
            drawFun = this.drawChart_3; // 以此类推_3
            break;
          case 3:
            drawFun = this.drawChart_4; // ...
            break;
          case 4:
            drawFun = this.drawChart_5;
            break;
          case 5:
            drawFun = this.drawChart_6;
            break;
          case 6:
            drawFun = this.drawChart_7;
            break;
          case 7:
            drawFun = this.drawChart_8;
            break;
          default:
            drawFun = (err) => {
              throw err
            };
        }
        return drawFun
      },

      // 绘制图表9-土地出让收入
      drawChart_1() {
        // eslint-disable-next-line no-console
        console.log('土地出让收入');
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('echart'), 'light');
        myChart.clear();
        let that = this;
        if (this.isGraphVisibal === true) {
          this.loading = true;
          this.axios
            // TODO:请求echart数据
            .get('')// http://localhost:3000/read_gov_2/iflt
            .then(function (response) {
              that.loading = false;
              // eslint-disable-next-line no-console
              console.log(response.data);

              let data = response.data;
              let xAxisData = [];
              let seriesData = [];
              for (let i in data) {
                xAxisData.push(data[i]['Item']);
                let o = {};
                o.name = data[i]['Item'];
                o.value = data[i]['金额（万元）'].replace(/,/g, '');
                seriesData.push(o);
              }
              console.log(xAxisData);
              console.log(seriesData);

              var option = {
                title: {
                  text: '土 地 出 让 收 入',
                  subtext: '',
                  x: 'center',
                  textStyle: {
                    color: 'rgba(255,255,255,0.9)'
                  },
                },
                tooltip: {
                  trigger: 'item',
                  formatter: "{b} :<br/> {c}万元 <br/>({d}%)"
                },
                legend: {
                  top: 30,
                  left: 30,
                  orient: 'vertical',
                  data: xAxisData/*response.data.xAxisData*/,
                  textStyle: {
                    color: 'rgba(255,255,255,0.6)'
                  },
                },
                series: [
                  {
                    name: '',
                    type: 'pie',
                    radius: '55%',
                    center: ['60%', '50%'],
                    data: seriesData/*response.data.seriesData*/,
                    itemStyle: {
                      // 点的颜色。
                      normal: {
                        color: function (params) {
                          var colorList = ['#1333a6', '#317ae1', '#1fdedb', '#ba52ed', '#ff99fe', "#a4f6f9", "#fd0054", "#ffd615", "#fd5f00",
                            "#6900ff", '#9951ff', '#ffd700', '#1ee494', "#009378", "#fc8a15", '#ff0592', '#fc5bb6', '#faf15d'];
                          return colorList[params.dataIndex]
                        }
                      }
                    },
                  }
                ]
              };

              myChart.setOption(option);
            })
            .catch(function (error) {
              // eslint-disable-next-line no-console
              console.log(error);
            });
        }
      },

      // 绘制图表10-土地出让税收
      drawChart_2() {
        // eslint-disable-next-line no-console
        console.log('土地出让税收');
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('echart'), 'light')
        myChart.clear();
        let that = this;
        if (this.isGraphVisibal === true) {
          this.loading = true;
          this.axios
            // TODO:请求echart数据
            .get('')// http://localhost:3000/read_gov_2/tnlt
            .then(function (response) {
              that.loading = false;
              // eslint-disable-next-line no-console
              console.log(response);

              let data = response.data;
              let xAxisData = [];
              let seriesData = [];
              for (let i in data) {
                xAxisData.push(data[i]['Item']);
                let o = {};
                o.name = data[i]['Item'];
                o.value = data[i]['金额（万元）'].replace(/,/g, '');
                seriesData.push(o);
              }


              var option = {
                title: {
                  text: '土 地 出 让 税 收',
                  subtext: '',
                  x: 'center',
                  textStyle: {
                    color: 'rgba(255,255,255,0.9)'
                  },
                },
                tooltip: {
                  trigger: 'item',
                  formatter: "{b} :<br/> {c}万元<br/> ({d}%)"
                },
                legend: {
                  top: 30,
                  orient: 'vertical',
                  left: 30,
                  data: xAxisData/*response.data.xAxisData*/,
                  textStyle: {
                    color: 'rgba(255,255,255,0.6)'
                  },
                },
                series: [
                  {
                    name: '土地出让税收',
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '58%'],
                    data: seriesData/*response.data.seriesData*/,
                    // itemStyle: {
                    //   emphasis: {
                    //     shadowBlur: 10,
                    //     shadowOffsetX: 0,
                    //     shadowColor: 'rgba(0, 0, 0, 0.5)'
                    //   }
                    // }
                    itemStyle: {
                      // 点的颜色。
                      normal: {
                        color: function (params) {
                          var colorList = ['#1333a6', '#317ae1', '#1fdedb', '#ba52ed', '#ff99fe', "#a4f6f9", "#fd0054", "#ffd615", "#fd5f00",
                            "#6900ff", '#9951ff', '#ffd700', '#1ee494', "#009378", "#fc8a15", '#ff0592', '#fc5bb6', '#faf15d'];
                          return colorList[params.dataIndex]
                        }
                      }
                    },
                  }
                ]
              };

              myChart.setOption(option);
            })
            .catch(function (error) {
              // eslint-disable-next-line no-console
              console.log(error);
            });
        }
      },
      // 绘制图表11 - 居住人口
      drawChart_3() {
        // eslint-disable-next-line no-console
        console.log('图表11');
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('echart'), 'light');
        myChart.clear();
        let that = this;
        if (this.isGraphVisibal === true) {
          this.loading = true;
          this.axios
            // TODO:请求echart数据
            .get('')//http://localhost:3000/read_gov_2/rp
            .then(function (response) {
              that.loading = false;
              // eslint-disable-next-line no-console
              console.log(response);


              let data = response.data;
              let xAxisData = [];
              let seriesData = [];
              for (let i in data) {
                xAxisData.push(data[i]['Item']);
                seriesData.push(data[i]['数量（人）'].replace(/,/g, ''));
              }


              let option = {
                title: {
                  text: '居 住 人 口',
                  subtext: '',
                  x: 'center',
                  textStyle: {
                    color: 'rgba(255,255,255,0.9)'
                  },
                },
                grid: {
                  left: '4%',
                  right: '10%',
                  bottom: '4%',
                  containLabel: true
                },
                tooltip: {
                  trigger: 'axis',
                  axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'     // 默认为直线，可选为：'line' | 'shadow'
                  },
                  formatter: "{b}年 <br/>{c}人"
                },
                xAxis: {
                  name: '年份',
                  nameTextStyle: {
                    color: 'rgba(255,255,255,0.6)'
                  },
                  axisLabel: {
                    interval: 0,
                    textStyle: {
                      color: 'rgba(255,255,255,0.6)'
                    }
                  },
                  axisLine: {
                    lineStyle: {
                      color: 'rgba(255,255,255,0.6)'
                    }
                  },
                  type: 'category',
                  data: xAxisData/*response.data.xAxisData*/
                },
                yAxis: {
                  type: 'value',
                  name: '人口/人',
                  nameTextStyle: {
                    color: 'rgba(255,255,255,0.6)'
                  },
                  axisLabel: {
                    interval: 0,
                    textStyle: {
                      color: 'rgba(255,255,255,0.6)'
                    }
                  },
                  axisLine: {
                    lineStyle: {
                      color: 'rgba(255,255,255,0.6)'
                    }
                  },
                },
                series: [{
                  data: seriesData/*response.data.seriesData*/,
                  type: 'bar',
                  itemStyle: {
                    // 点的颜色。
                    normal: {
                      color: function (params) {
                        var colorList = ['#1333a6', '#317ae1', '#1fdedb', '#ba52ed', '#ff99fe', "#a4f6f9", "#fd0054", "#ffd615", "#fd5f00",
                          "#6900ff", '#9951ff', '#ffd700', '#1ee494', "#009378", "#fc8a15", '#ff0592', '#fc5bb6', '#faf15d'];
                        return colorList[params.dataIndex]
                      }
                    }
                  },
                }]
              };

              myChart.setOption(option);
            })
            .catch(function (error) {
              // eslint-disable-next-line no-console
              console.log(error);
            });
        }
      },
      // 绘制图表12 - 就业人口
      drawChart_4() {
        // eslint-disable-next-line no-console
        console.log('图表12');
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('echart'), 'light')
        myChart.clear();
        let that = this;
        if (this.isGraphVisibal === true) {
          this.loading = true;
          this.axios
            // TODO:请求echart数据
            .get('')//http://localhost:3000/read_gov_2/ep
            .then(function (response) {
              that.loading = false;
              // eslint-disable-next-line no-console
              console.log(response);

              let data = response.data;
              let xAxisData = [];
              let seriesData = [];
              for (let i in data) {
                xAxisData.push(data[i]['Item']);
                seriesData.push(data[i]['数量（人）'].replace(/,/g, ''));
              }


              let option = {
                title: {
                  text: '就 业 人 口',
                  subtext: '',
                  x: 'center',
                  textStyle: {
                    color: 'rgba(255,255,255,0.9)'
                  },
                },
                grid: {
                  left: '4%',
                  right: '10%',
                  bottom: '4%',
                  containLabel: true
                },
                tooltip: {
                  trigger: 'axis',
                  axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                  },
                  formatter: "{b}年 <br/>{c}人"
                },
                xAxis: {
                  name: '年份',
                  nameTextStyle: {
                    color: 'rgba(255,255,255,0.6)'
                  },
                  axisLabel: {
                    interval: 0,
                    textStyle: {
                      color: 'rgba(255,255,255,0.6)'
                    },

                  },
                  axisLine: {
                    lineStyle: {
                      color: 'rgba(255,255,255,0.6)'
                    }
                  },
                  type: 'category',
                  data: xAxisData/*response.data.xAxisData*/
                },
                yAxis: {
                  name: '人口/人',
                  nameTextStyle: {
                    color: 'rgba(255,255,255,0.6)'
                  },
                  axisLabel: {
                    interval: 0,
                    textStyle: {
                      color: 'rgba(255,255,255,0.6)'
                    }
                  },
                  axisLine: {
                    lineStyle: {
                      color: 'rgba(255,255,255,0.6)'
                    }
                  },
                  type: 'value'
                },
                series: [{
                  data: seriesData/*response.data.seriesData*/,
                  type: 'bar',
                  itemStyle: {
                    // 点的颜色。
                    normal: {
                      color: function (params) {
                        var colorList = ['#1333a6', '#317ae1', '#1fdedb', '#ba52ed', '#ff99fe', "#a4f6f9", "#fd0054", "#ffd615", "#fd5f00",
                          "#6900ff", '#9951ff', '#ffd700', '#1ee494', "#009378", "#fc8a15", '#ff0592', '#fc5bb6', '#faf15d'];
                        return colorList[params.dataIndex]
                      }
                    }
                  },
                }]
              };

              myChart.setOption(option);
            })
            .catch(function (error) {
              // eslint-disable-next-line no-console
              console.log(error);
            });
        }
      },
      // 绘制图表13 - 人均绿地面积
      drawChart_5() {
        // eslint-disable-next-line no-console
        console.log('图表13');
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('echart'), 'light');
        myChart.clear();
        let that = this;
        if (this.isGraphVisibal === true) {
          this.loading = true;
          this.axios
            // TODO:请求echart数据
            .get('')//http://localhost:3000/read_gov_2/gapc
            .then(function (response) {
              that.loading = false;
              // eslint-disable-next-line no-console
              console.log(response);


              let data = response.data;
              let xAxisData = [];
              let seriesData = [];
              for (let i in data) {
                xAxisData.push(data[i]['Item']);
                seriesData.push(data[i]['面积（平方米）'].replace(/,/g, ''));
              }


              let option = {
                title: {
                  text: '人 均 绿 地 面 积',
                  subtext: '',
                  x: 'center',
                  textStyle: {
                    color: 'rgba(255,255,255,0.9)'
                  },
                },
                tooltip: {
                  trigger: 'axis',
                  axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                  },
                  formatter: "{b}年 <br/>{c}平方米"
                },
                xAxis: {
                  name: '年份',
                  nameTextStyle: {
                    color: 'rgba(255,255,255,0.6)'
                  },
                  axisLabel: {
                    interval: 0,
                    textStyle: {
                      color: 'rgba(255,255,255,0.6)'
                    }
                  },
                  axisLine: {
                    lineStyle: {
                      color: 'rgba(255,255,255,0.6)'
                    }
                  },
                  type: 'category',
                  data: xAxisData/*response.data.xAxisData*/
                },
                yAxis: {
                  name: '面积/平方米',
                  nameTextStyle: {
                    color: 'rgba(255,255,255,0.6)'
                  },
                  axisLabel: {
                    interval: 0,
                    textStyle: {
                      color: 'rgba(255,255,255,0.6)'
                    }
                  },
                  axisLine: {
                    lineStyle: {
                      color: 'rgba(255,255,255,0.6)'
                    }
                  },
                  type: 'value'
                },
                series: [{
                  itemStyle: {
                    // 点的颜色。
                    normal: {
                      color: function (params) {
                        var colorList = ['#1333a6', '#317ae1', '#1fdedb', '#ba52ed', '#ff99fe', "#a4f6f9", "#fd0054", "#ffd615", "#fd5f00",
                          "#6900ff", '#9951ff', '#ffd700', '#1ee494', "#009378", "#fc8a15", '#ff0592', '#fc5bb6', '#faf15d'];
                        return colorList[params.dataIndex]
                      }
                    }
                  },
                  data: seriesData/*response.data.seriesData*/,
                  type: 'bar'
                }]
              };

              myChart.setOption(option);
            })
            .catch(function (error) {
              // eslint-disable-next-line no-console
              console.log(error);
            });
        }
      },
      // 绘制图表14 - GDP
      drawChart_6() {
        // eslint-disable-next-line no-console
        console.log('图表14 - GDP');
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('echart'), 'light')
        let that = this;
        if (this.isGraphVisibal === true) {
          this.loading = true;
          this.axios
            // TODO:请求echart数据
            .get('')//http://localhost:3000/read_gov_2/gdp
            .then(function (response) {
              that.loading = false;
              // eslint-disable-next-line no-console
              console.log(response);


              let data = response.data;
              let xAxisData = [];
              let seriesData = [];
              for (let i in data) {
                xAxisData.push(data[i]['Item']);
                seriesData.push(data[i]['金额（万元）'].replace(/,/g, ''));
              }


              let option = {
                title: {
                  text: 'G D P',
                  subtext: '',
                  x: 'center',
                  textStyle: {
                    color: 'rgba(255,255,255,0.9)'
                  },
                },
                tooltip: {
                  trigger: 'axis',
                  axisPointer: {
                    type: 'shadow'
                  },
                  formatter: "{b}<br/>{c}万元"
                },
                legend: {
                  right: 'right',
                  textStyle: {
                    color: 'rgba(255,255,255,0.6)'
                  },
                },
                grid: {
                  left: '3%',
                  right: '18%',
                  bottom: '3%',
                  containLabel: true
                },
                xAxis: {
                  name: 'GDP/万元',
                  nameTextStyle: {
                    color: 'rgba(255,255,255,0.6)'
                  },
                  type: 'value',
                  boundaryGap: [0, 0.01],
                  axisLabel: {
                    interval: 0,
                    textStyle: {
                      color: 'rgba(255,255,255,0.6)'
                    }
                  },
                  axisLine: {
                    lineStyle: {
                      color: 'rgba(255,255,255,0.6)'
                    }
                  },
                },
                yAxis: {
                  name: '项目',
                  nameTextStyle: {
                    color: 'rgba(255,255,255,0.6)'
                  },
                  type: 'category',
                  data: xAxisData/*response.data.xAxisData*/,
                  axisLabel: {
                    interval: 0,
                    textStyle: {
                      color: 'rgba(255,255,255,0.6)'
                    }
                  },
                  axisLine: {
                    lineStyle: {
                      color: 'rgba(255,255,255,0.6)'
                    }
                  },
                },
                series: [
                  {
                    type: 'bar',
                    data: seriesData/*response.data.seriesData*/,
                  }
                ]
              };


              myChart.setOption(option);
            })
            .catch(function (error) {
              // eslint-disable-next-line no-console
              console.log(error);
            });
        }
      },
      // 绘制图表15 - 能耗
      drawChart_7() {
        // eslint-disable-next-line no-console
        console.log('图表15 - 能耗');
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('echart'), 'light')
        let that = this;
        if (this.isGraphVisibal === true) {
          this.loading = true;
          this.axios
            // TODO:请求echart数据
            .get('') // http://localhost:3000/read_gov_2/ec
            .then(function (response) {
              that.loading = false;
              // eslint-disable-next-line no-console
              console.log(response);

              let data = response.data;
              let xAxisData = [];
              let seriesData = [];
              for (let i in data) {
                xAxisData.push(data[i]['Item']);
                seriesData.push(data[i]['能耗（吨标准煤/年）'].replace(/,/g, ''));
              }
              console.log(xAxisData);
              console.log(seriesData);
              let dataAxis = xAxisData;
              let datadata = seriesData;


              /*var dataAxis = response.data.xAxisData;
              var data = response.data.seriesData;*/
              var yMax = 500;
              var dataShadow = [];

              for (var i = 0; i < /*data*/datadata.length; i++) {
                dataShadow.push(yMax);
              }

              let option = {
                title: {
                  text: '能 耗',
                  subtext: '',
                  x: 'center',
                  textStyle: {
                    color: 'rgba(255,255,255,0.9)'
                  },
                },
                tooltip: {
                  trigger: 'axis',
                  axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                  },
                  formatter: "{b}<br/>{c}吨标准煤/年"
                },
                legend: {
                  top: 20,
                  right: 'right',
                  textStyle: {
                    color: 'rgba(255,255,255,0.6)'
                  },
                },
                grid: {
                  left: '3%',
                  right: '10%',
                  bottom: '3%',
                  containLabel: true
                },
                xAxis: [
                  {
                    name: '项目',
                    nameTextStyle: {
                      color: 'rgba(255,255,255,0.6)'
                    },
                    type: 'category',
                    data: xAxisData/*response.data.xAxisData*/,
                    axisTick: {
                      alignWithLabel: true
                    },
                    axisLabel: {
                      interval: 0,
                      formatter: function (value) {
                        var str = value.split("");
                        return str.join("\n");
                      },
                      textStyle: {
                        color: 'rgba(255,255,255,0.6)'
                      }
                    },
                    axisLine: {
                      lineStyle: {
                        color: 'rgba(255,255,255,0.6)'
                      }
                    },

                  }
                ],
                yAxis: [
                  {
                    name: '能耗（吨标准煤/年）',
                    nameTextStyle: {
                      color: 'rgba(255,255,255,0.6)'
                    },
                    type: 'value',
                    axisLabel: {
                      interval: 0,
                      textStyle: {
                        color: 'rgba(255,255,255,0.6)'
                      }
                    },
                    axisLine: {
                      lineStyle: {
                        color: 'rgba(255,255,255,0.6)'
                      }
                    },
                  }
                ],
                series: [
                  {
                    name: '能耗',
                    type: 'bar',
                    barWidth: '60%',
                    data: seriesData,/*response.data.seriesData*/
                    itemStyle: {
                      // 点的颜色。
                      normal: {
                        color: function (params) {
                          var colorList = ['#1333a6', '#317ae1', '#1fdedb', '#ba52ed', '#ff99fe', "#a4f6f9", "#fd0054", "#ffd615", "#fd5f00",
                            "#6900ff", '#9951ff', '#ffd700', '#1ee494', "#009378", "#fc8a15", '#ff0592', '#fc5bb6', '#faf15d'];
                          return colorList[params.dataIndex]
                        }
                      }
                    },
                  }
                ]
              };


              // Enable data zoom when user click bar.
              var zoomSize = 6;
              myChart.on('click', function (params) {
                console.log(dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)]);
                myChart.dispatchAction({
                  type: 'dataZoom',
                  startValue: dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)],
                  endValue: dataAxis[Math.min(params.dataIndex + zoomSize / 2, datadata/*data*/.length - 1)]
                });
              });

              myChart.setOption(option);
            })
            .catch(function (error) {
              // eslint-disable-next-line no-console
              console.log(error);
            });
        }
      },
      // 绘制图表16 - 产业税收
      drawChart_8() {
        // eslint-disable-next-line no-console
        console.log('图表16 - 产业税收');
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('echart'), 'light')
        let that = this;
        if (this.isGraphVisibal === true) {
          this.loading = true;
          this.axios
            // TODO:请求echart数据
            .get('')// http://localhost:3000/read_gov_2/it
            .then(function (response) {
              that.loading = false;
              // eslint-disable-next-line no-console
              console.log(response.data);


              let data = response.data;
              let xAxisData = [];
              let seriesData = [];
              for (let i in data) {
                xAxisData.push(data[i]['Item']);
                seriesData.push(data[i]['税收（万元/年）'].replace(/,/g, ''));
              }


              let option = {
                title: {
                  text: '产 业 税 收',
                  textStyle: {
                    color: 'rgba(255,255,255,0.9)'
                  },
                  x: 'center'
                },
                tooltip: {
                  trigger: 'axis',
                  formatter: "{b}<br/>{c}万元/年"
                },
                legend: {
                  top: 30,
                  textStyle: {
                    color: 'rgba(255,255,255,0.6)'
                  },
                },
                calculable: true,
                xAxis: [
                  {
                    name: '项目',
                    nameTextStyle: {
                      color: 'rgba(255,255,255,0.6)'
                    },
                    type: 'category',
                    data: xAxisData/*response.data.xAxisData*/,
                    axisPointer: {
                      type: 'shadow',
                    },
                    grid: {
                      left: '2%',
                      right: '3%',
                      bottom: '20%',
                      containLabel: true
                    },
                    axisLabel: {
                      interval: 0,
                      formatter: function (value) {
                        var str = value.split("");
                        return str.join("\n");
                      },
                      textStyle: {
                        color: 'rgba(255,255,255,0.6)'
                      }
                    },
                    axisLine: {
                      lineStyle: {
                        color: 'rgba(255,255,255,0.6)'
                      }
                    },
                  }
                ],
                yAxis: [
                  {
                    name: '金额/万元',
                    type: 'value',
                    nameTextStyle: {
                      color: 'rgba(255,255,255,0.6)'
                    },
                    axisLabel: {
                      interval: 0,
                      textStyle: {
                        color: 'rgba(255,255,255,0.6)'
                      }
                    },
                    axisLine: {
                      lineStyle: {
                        color: 'rgba(255,255,255,0.6)'
                      }
                    },
                  }
                ],
                series: [

                  {
                    name: '税收',
                    type: 'bar',
                    data: seriesData/*response.data.seriesData*/,
                    // markPoint: {
                    //   data: [
                    //     {type : 'max', name: '最大值'},
                    //     {type : 'min', name: '最小值'}
                    //   ]
                    // },
                    markLine: {
                      data: [
                        {type: 'average', name: '平均值'}
                      ]
                    }
                  }
                ]
              };


              myChart.setOption(option);
            })
            .catch(function (error) {
              // eslint-disable-next-line no-console
              console.log(error);
            });
        }
      },
    }
  }
</script>

<style scoped lang="stylus">
  .bounce-enter-active {
    animation: bounce-in .5s;
  }
  
  .bounce-leave-active {
    animation: bounce-in .5s reverse;
  }
  
  @keyframes bounce-in {
    0% {
      transform: scale(0);
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
    }
  }
  
  .government
    overflow hidden
    height 100%
    width 100%
    display flex
    align-items center
    justify-content center
    
    .government-main
      height 100%
      width 100%
      overflow hidden
      display flex
      justify-content center
      align-items center
      padding 2rem;
      
      .government-main-echart
        overflow hidden
        display flex
        justify-content center
        align-items center
        padding 2rem 0 0 0
        width 50rem
        height 40rem
        background-color rgba(0, 126, 255, 0.8)
        box-shadow: 0 0 0 1px hsla(0, 0%, 100%, .3) inset, 0 .5em 1em rgba(0, 0, 0, 0.6);
        text-shadow: 0 1px 1px hsla(0, 0%, 100%, .3);
  
  .chartBar
    position absolute
    right 0
    padding-top 2rem
    width 20rem;
    height 100%
    display flex
    flex-direction column
    align-items flex-end
    justify-content flex-start
  
  .mainGraph
    box-shadow: 0 0 0 1px hsla(0, 0%, 100%, .3) inset, 0 .5em 1em rgba(0, 0, 0, 0.6);
    text-shadow: 0 1px 1px hsla(0, 0%, 100%, .3);
    transform: translate3d(0, 0, 0) !important
    background-color #ffd04b
    color rgb(21, 40, 113)
    font-weight bold
</style>
