/* eslint-disable no-console */
// Disables no-alert for the rest of the file
<template>
  <div class="developer">
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
      <el-main class="developer-main">
        <transition name="bounce-in">
          <div v-show="isGraphVisibal">
            <div v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.8)">
              <div id="echart" ref="chart" class="developer-main-echart">
              </div>
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
    name: "Developers",
    data() {
      return {
        echart: '',
        loading: false,
        graphDetail: [
          {graphName: '整体财务表现', graphNum: 0, active: false},
          {graphName: '项目收益', graphNum: 1, active: false},
          {graphName: '项目收益率', graphNum: 2, active: false},
          {graphName: '股东收益率', graphNum: 3, active: false},
          {graphName: '项目收入', graphNum: 4, active: false},
          {graphName: '地价成本', graphNum: 5, active: false},
          {graphName: '综合成本单方', graphNum: 6, active: false},
          {graphName: '项目融资', graphNum: 7, active: false},
        ],
        isGraphVisibal: false,
        activeGraph: -1,  // 当前活跃的图表
      }
    },
    props: {
      isVisibal: Boolean
    },
    components: {
      chartBtn
    },
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
      closeGraph() {
        console.log('closeGraph')
      },
      filterBrackets(val){
        let [...arr] = val;
        arr.shift();
        arr.pop();
        return arr.join('')
      },
      showEchart(val) {
        if (this.activeGraph !== -1) {
          this.graphDetail[this.activeGraph].active = this.activeGraph === val ? this.graphDetail[this.activeGraph].active : false; // 取消之前激活的图标显示
          this.activeGraph = this.activeGraph === val ? -1 : val; // 更新当前活跃的图表下标
        } else {
          this.activeGraph = val; // 更新新的激活的图标显示
        }
        this.isGraphVisibal = this.activeGraph !== -1;
        if (this.isGraphVisibal !== -1) {
          this.$emit('hideSiderbar');
        }
        let drawChart = this.drawStore(val);
        drawChart();
        // console.log('emit fun hideBar!')
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
      // 绘制图表1
      drawChart_1() {
        // 基于准备好的dom，初始化echarts实例
        // eslint-disable-next-line no-console
        console.log('整体财务表现');
        let myChart = this.$echarts.init(document.getElementById('echart'), 'light');
        myChart.clear();
        let that = this;
        if (this.isGraphVisibal === true) {
          this.loading = true;
          this.axios
            // TODO:请求echart数据
            .get('') // http://localhost:3000/read_2/opfp
            .then(function (response) {
              that.loading = false;
              console.log('response', response);
              let str = response.data.replace(/[\r\n]/g, "");
              let data = JSON.parse(str);
              console.log('data', data)
              console.log(parseInt(data[1]['整体项目财务表现（万元）'].replace(/,/g, "")));
              let option = {
                  title: {
                    text: '整 体 财 务 表 现',
                    subtext: '',
                    textStyle: {
                      color: 'rgba(255,255,255,0.9)'
                    },
                    x: 'center'
                  },
                  tooltip: {
                    formatter: "{b}<br/> {c}万元"
                  },
                  series: [{
                    name: '项目整体财务表现',
                    type: 'treemap',
                    visibleMin: 300,
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

                    data: [
                      {
                        name: "经营活动现金流入",
                        value: parseInt(data[0]['整体项目财务表现（万元）'].replace(/,/g, "")),
                        children: [
                          {
                            name: "销售现金流", value: parseInt(data[1]['整体项目财务表现（万元）'].replace(/,/g, ""))
                          },
                          {
                            name: "租赁现金流", value: parseInt(data[2]['整体项目财务表现（万元）'].replace(/,/g, ""))
                          }
                        ]
                      },
                      {
                        name: "投资活动现金流出-成本",
                        children: [
                          {
                            name: "土地成本",
                            value: parseInt(data[3]['整体项目财务表现（万元）'].replace(/,/g, "")),
                            children: [
                              {
                                name: "土地成本", value: parseInt(data[4]['整体项目财务表现（万元）'].replace(/,/g, ""))
                              },
                              {
                                name: "工程费", value: parseInt(data[5]['整体项目财务表现（万元）'].replace(/,/g, ""))
                              },
                              {
                                name: "开发间接费", value: parseInt(data[6]['整体项目财务表现（万元）'].replace(/,/g, ""))
                              },
                              {
                                name: "开发间接税费", value: parseInt(data[7]['整体项目财务表现（万元）'].replace(/,/g, ""))
                              }
                            ]
                          },

                        ]
                      },
                      {
                        name: "运营成本",
                        value: parseInt(data[8]['整体项目财务表现（万元）'].replace(/,/g, ""))
                      },
                      {
                        name: "税收",
                        value: parseInt(data[9]['整体项目财务表现（万元）'].replace(/,/g, "")),
                        children: [
                          {
                            name: "土地增值税", value: parseInt(data[10]['整体项目财务表现（万元）'].replace(/,/g, ""))
                          },
                          {
                            name: "房产税", value: parseInt(data[11]['整体项目财务表现（万元）'].replace(/,/g, ""))
                          },
                          {
                            name: "增值税及其附加", value: parseInt(data[12]['整体项目财务表现（万元）'].replace(/,/g, ""))
                          },
                          {
                            name: "其他", value: parseInt(data[13]['整体项目财务表现（万元）'].replace(/,/g, ""))
                          },
                          {
                            name: "所得税", value: parseInt(data[14]['整体项目财务表现（万元）'].replace(/,/g, ""))
                          },

                        ]
                      },
                      {
                        name: "项目整体净现金流",
                        value: parseInt(data[15]['整体项目财务表现（万元）'].replace(/,/g, ""))
                      }
                    ],

                    leafDepth: 1,
                    levels:
                      [
                        {
                          itemStyle: {
                            normal: {
                              borderColor: '#555',
                              borderWidth: 4,
                              gapWidth: 4
                            }
                          }
                        },
                        {
                          colorSaturation: [0.3, 0.6],
                          itemStyle: {
                            normal: {
                              borderColorSaturation: 0.7,
                              gapWidth: 2,
                              borderWidth: 2
                            }
                          }
                        },
                        {
                          colorSaturation: [0.3, 0.5],
                          itemStyle: {
                            normal: {
                              borderColorSaturation: 0.6,
                              gapWidth: 1
                            }
                          }
                        },
                        {
                          colorSaturation: [0.3, 0.5]
                        }
                      ]
                  }]
                }
              ;

              myChart.setOption(option);
            })
            .catch(function (error) {
              // eslint-disable-next-line no-console
              console.log(error);
            });
        }
      },
      // 绘制图表2-项目收益
      drawChart_2() {
        // 基于准备好的dom，初始化echarts实例
        // eslint-disable-next-line no-console
        console.log('项目收益');
        let myChart = this.$echarts.init(document.getElementById('echart'), 'light');
        myChart.clear();
        // eslint-disable-next-line no-unused-vars
        let that = this;
        if (this.isGraphVisibal === true) {
          this.loading = true;
          this.axios
            // TODO:请求echart数据
            .get('')// http://localhost:3000/read_2/pb
            .then(function (response) {
              that.loading = false;

              console.log(typeof response.data);
              // let str = response.data.replace(/[\r\n]/g, "");
              // let data = JSON.parse(str);
              // console.log('data',data)
              let data = response.data;
              console.log('data', data)
              let xAxisData = [];
              let seriesData = [];
              for (let i in data) {
                console.log(data[i]['Item']);
                if (i !== '4') {
                  xAxisData.push(data[i]['Item']);
                  let temp = data[i]['数值（万元）'].replace(/,/g, "");
                  if(temp[0] === '('){
                    let [...arr] = temp;
                    arr.shift();
                    arr.pop();
                    temp = arr.join('')
                  }
                  seriesData.push(parseInt(temp) / 10000);
                }
              }
              console.log(xAxisData);
              console.log(seriesData);
              let option = {
                title: {
                  text: '项 目 收 益',
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
                  formatter: "{b}<br/> {c}万元"
                },
                legend: {
                  textStyle: {
                    color: 'rgba(255,255,255,0.6)'
                  },
                },
                grid: {
                  left: '1%',
                  right: '20%',
                  bottom: '3%',
                  containLabel: true,
                },
                xAxis: {
                  name: '收益/万元',
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
                  nameTextStyle: {
                    color: 'rgba(255,255,255,0.6)'
                  }
                },
                yAxis: {
                  name: '项目',
                  axisLabel: {
                    interval: 0,
                    textStyle: {
                      color: 'rgba(255,255,255,0.6)'
                    }
                  },
                  nameTextStyle: {
                    color: 'rgba(255,255,255,0.6)'
                  },
                  axisLine: {
                    lineStyle: {
                      color: 'rgba(255,255,255,0.6)'
                    }
                  },
                  type: 'category',
                  data: xAxisData/**/
                },
                series: [
                  {
                    type: 'bar',
                    data: seriesData/**/,
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

      // 绘制图表3-项目收益率
      drawChart_3() {
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('echart'), 'light');
        myChart.clear();
        let that = this;
        if (this.isGraphVisibal === true) {
          this.loading = true;
          this.axios
            // TODO:请求echart数据
            .get('')  // http://localhost:3000/read_2/ror
            .then(function (response) {
              that.loading = false;
              // eslint-disable-next-line no-console
              console.log('项目收益率');
              console.log('response', response);
              let data = response.data;
              let seriesData = [];
              for (let i in data) {
                // seriesData.push(data[i]['内部收益率']);
                // seriesData.push(data[i]['折现现金流（万元）']);
                seriesData.push(data[i]['内部收益率'].replace(/%/g, ""));
                let str = data[i]['折现现金流（万元）'].replace(/,/g, "");
                seriesData.push((str / 10000).toFixed(2));
              }
              console.log(seriesData);

              let option = {
                title: {
                  text: '项 目 收 益 率',
                  subtext: '',
                  x: 'center',
                  textStyle: {
                    color: 'rgba(255,255,255,0.9)'
                  },
                },
                tooltip: {
                  formatter: "{a} <br/>{c} {b}"
                },
                series: [
                  {
                    name: '折现现金流（亿元）'/*response.data.xAxisData[1]*/,
                    type: 'gauge',
                    min: 0,
                    max: 100,
                    splitNumber: 10,
                    center: ['75%', '55%'],    // 默认全局居中
                    radius: '60%',
                    axisLine: {            // 坐标轴线
                      lineStyle: {       // 属性lineStyle控制线条样式
                        color: [[0.09, 'lime'], [0.82, '#00ffff'], [1, '#ff4500']],
                        width: 3,
                        shadowColor: '#fff', //默认透明
                        shadowBlur: 10
                      }
                    },
                    axisLabel: {            // 坐标轴小标记
                      textStyle: {       // 属性lineStyle控制线条样式
                        fontWeight: 'bolder',
                        color: '#fff',
                        shadowColor: '#fff', //默认透明
                        shadowBlur: 10
                      }
                    },
                    axisTick: {            // 坐标轴小标记
                      length: 15,        // 属性length控制线长
                      lineStyle: {       // 属性lineStyle控制线条样式
                        color: 'auto',
                        shadowColor: '#fff', //默认透明
                        shadowBlur: 10
                      }
                    },
                    splitLine: {           // 分隔线
                      length: 25,         // 属性length控制线长
                      lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                        width: 3,
                        color: '#fff',
                        shadowColor: '#fff', //默认透明
                        shadowBlur: 10
                      }
                    },
                    pointer: {           // 分隔线
                      shadowColor: '#fff', //默认透明
                      shadowBlur: 5
                    },
                    title: {
                      offsetCenter: [0, '-120%'],
                      textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        fontWeight: 'bolder',
                        fontSize: 12,
                        fontStyle: 'italic',
                        color: '#fff',
                        shadowColor: '#fff', //默认透明
                        shadowBlur: 10
                      }
                    },
                    detail: {
                      backgroundColor: 'rgba(30,144,255,0.8)',
                      borderWidth: 1,
                      borderColor: '#fff',
                      shadowColor: '#fff', //默认透明
                      shadowBlur: 5,
                      offsetCenter: [0, '80%'],       // x, y，单位px
                      textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        fontWeight: 'bolder',
                        color: '#fff'
                      }
                    },
                    data: [{
                      value: seriesData[1]/*response.data.seriesData[1]*/,
                      name: '亿元'/*response.data.xAxisData[1]*/
                    }]
                  },
                  {
                    name: '内部收益率'/*response.data.xAxisData[0]*/,
                    type: 'gauge',
                    center: ['25%', '55%'],    // 默认全局居中
                    radius: '60%',
                    min: 0,
                    max: 100,
                    splitNumber: 10,
                    axisLine: {            // 坐标轴线
                      lineStyle: {       // 属性lineStyle控制线条样式
                        color: [[0.29, 'lime'], [0.86, '#00ffff'], [1, '#ff4500']],
                        width: 2,
                        shadowColor: '#fff', //默认透明
                        shadowBlur: 10
                      }
                    },
                    axisLabel: {            // 坐标轴小标记
                      textStyle: {       // 属性lineStyle控制线条样式
                        fontWeight: 'bolder',
                        color: '#fff',
                        shadowColor: '#fff', //默认透明
                        shadowBlur: 10
                      }
                    },
                    axisTick: {            // 坐标轴小标记
                      length: 12,        // 属性length控制线长
                      lineStyle: {       // 属性lineStyle控制线条样式
                        color: 'auto',
                        shadowColor: '#fff', //默认透明
                        shadowBlur: 10
                      }
                    },
                    splitLine: {           // 分隔线
                      length: 20,         // 属性length控制线长
                      lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                        width: 3,
                        color: '#fff',
                        shadowColor: '#fff', //默认透明
                        shadowBlur: 10
                      }
                    },
                    pointer: {
                      width: 5,
                      shadowColor: '#fff', //默认透明
                      shadowBlur: 5
                    },
                    title: {
                      offsetCenter: [0, '-120%'],       // x, y，单位px
                      textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        fontWeight: 'bolder',
                        fontStyle: 'italic',
                        color: '#fff',
                        shadowColor: '#fff', //默认透明
                        shadowBlur: 10
                      }
                    },
                    detail: {
                      //backgroundColor: 'rgba(30,144,255,0.8)',
                      // borderWidth: 1,
                      borderColor: '#fff',
                      shadowColor: '#fff', //默认透明
                      shadowBlur: 5,
                      width: 80,
                      height: 30,
                      offsetCenter: [0, '80%'],       // x, y，单位px
                      textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        fontWeight: 'bolder',
                        color: '#fff'
                      }
                    },
                    data: [{
                      value: seriesData[0]/*response.data.seriesData[0]*/,
                      name: '%'/*response.data.xAxisData[0] + '(%)'*/
                    }]
                  },
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
      // 绘制图表4-股东收益率
      drawChart_4() {
        let that = this;
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('echart'), 'light');
        myChart.clear();
        if (this.isGraphVisibal === true) {
          this.loading = true;
          this.axios
            // TODO:请求echart数据
            .get('')// http://localhost:3000/read_2/ros
            .then(function (response) {
              that.loading = false;
              // eslint-disable-next-line no-console
              console.log('股东收益率');


              let data = response.data;
              let seriesData = [];
              for (let i in data) {
                seriesData.push(data[i]['内部收益率'].replace(/%/g, ""));
                let str = data[i]['折现现金流（万元）'].replace(/,/g, "");
                let [...arr] = str;
                arr.shift();
                arr.pop();
                let str2 = arr.join('');
                seriesData.push((str2 / 10000).toFixed(2));
              }

              console.log(response.data);
              var option = {
                title: {
                  text: '股 东 收 益 率',
                  subtext: '',
                  x: 'center',
                  textStyle: {
                    color: 'rgba(255,255,255,0.9)'
                  },
                },
                tooltip: {
                  formatter: "{a} <br/>{c} {b}"
                },
                series: [
                  {
                    name: '折现现金流（亿元）'/*response.data.xAxisData[1]*/,
                    type: 'gauge',
                    min: 0,
                    max: 100,
                    splitNumber: 10,
                    center: ['75%', '55%'],    // 默认全局居中
                    radius: '60%',
                    axisLine: {            // 坐标轴线
                      lineStyle: {       // 属性lineStyle控制线条样式
                        color: [[0.09, 'red'], [0.82, '#00ffff'], [1, '#ff4500']],
                        width: 3,
                        shadowColor: '#fff', //默认透明
                        shadowBlur: 10
                      }
                    },
                    axisLabel: {            // 坐标轴小标记
                      textStyle: {       // 属性lineStyle控制线条样式
                        fontWeight: 'bolder',
                        color: '#fff',
                        shadowColor: '#fff', //默认透明
                        shadowBlur: 10
                      }
                    },
                    axisTick: {            // 坐标轴小标记
                      length: 15,        // 属性length控制线长
                      lineStyle: {       // 属性lineStyle控制线条样式
                        color: 'auto',
                        shadowColor: '#fff', //默认透明
                        shadowBlur: 10
                      }
                    },
                    splitLine: {           // 分隔线
                      length: 25,         // 属性length控制线长
                      lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                        width: 3,
                        color: '#fff',
                        shadowColor: '#fff', //默认透明
                        shadowBlur: 10
                      }
                    },
                    pointer: {           // 分隔线
                      shadowColor: '#fff', //默认透明
                      shadowBlur: 5
                    },
                    title: {
                      offsetCenter: [0, '-120%'],       // x, y，单位px
                      textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        fontWeight: 'bolder',
                        fontSize: 12,
                        fontStyle: 'italic',
                        color: '#fff',
                        shadowColor: '#fff', //默认透明
                        shadowBlur: 10
                      }
                    },
                    detail: {
                      backgroundColor: 'rgba(30,144,255,0.8)',
                      borderWidth: 1,
                      borderColor: '#fff',
                      shadowColor: '#fff', //默认透明
                      shadowBlur: 5,
                      offsetCenter: [0, '80%'],       // x, y，单位px
                      textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        fontWeight: 'bolder',
                        color: '#fff'
                      }
                    },
                    data: [{
                      value: seriesData[1]/*response.data.seriesData[1]*/,
                      name: '亿元'/*response.data.xAxisData[1]*/
                    }]
                  },
                  {
                    name: '内部收益率(%)'/*response.data.xAxisData[0]*/,
                    type: 'gauge',
                    center: ['25%', '55%'],    // 默认全局居中
                    radius: '60%',
                    min: 0,
                    max: 100,
                    splitNumber: 10,
                    axisLine: {            // 坐标轴线
                      lineStyle: {       // 属性lineStyle控制线条样式
                        color: [[0.29, 'lime'], [0.86, '#00ffff'], [1, '#ff4500']],
                        width: 2,
                        shadowColor: '#fff', //默认透明
                        shadowBlur: 10
                      }
                    },
                    axisLabel: {            // 坐标轴小标记
                      textStyle: {       // 属性lineStyle控制线条样式
                        fontWeight: 'bolder',
                        color: '#fff',
                        shadowColor: '#fff', //默认透明
                        shadowBlur: 10
                      }
                    },
                    axisTick: {            // 坐标轴小标记
                      length: 12,        // 属性length控制线长
                      lineStyle: {       // 属性lineStyle控制线条样式
                        color: 'auto',
                        shadowColor: '#fff', //默认透明
                        shadowBlur: 10
                      }
                    },
                    splitLine: {           // 分隔线
                      length: 20,         // 属性length控制线长
                      lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                        width: 3,
                        color: '#fff',
                        shadowColor: '#fff', //默认透明
                        shadowBlur: 10
                      }
                    },
                    pointer: {
                      width: 5,
                      shadowColor: '#fff', //默认透明
                      shadowBlur: 5
                    },
                    title: {
                      offsetCenter: [0, '-120%'],       // x, y，单位px
                      textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        fontWeight: 'bolder',
                        fontStyle: 'italic',
                        color: '#fff',
                        shadowColor: '#fff', //默认透明
                        shadowBlur: 10
                      }
                    },
                    detail: {
                      //backgroundColor: 'rgba(30,144,255,0.8)',
                      // borderWidth: 1,
                      borderColor: '#fff',
                      shadowColor: '#fff', //默认透明
                      shadowBlur: 5,
                      width: 80,
                      height: 30,
                      offsetCenter: [0, '80%'],       // x, y，单位px
                      textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        fontWeight: 'bolder',
                        color: '#fff'
                      }
                    },
                    data: [{
                      value: seriesData[0]/*response.data.seriesData[0]*/,
                      name: '%'/*response.data.xAxisData[0] + '(%)'*/
                    }]
                  },
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
      // 绘制图表5-项目收入
      drawChart_5() {
        let that = this;
        // eslint-disable-next-line no-console
        console.log('项目收入');
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('echart'), 'light');
        myChart.clear();
        if (this.isGraphVisibal === true) {
          this.loading = true;
          this.axios
            // TODO:请求echart数据
            .get('')// http://localhost:3000/read_2/pr
            .then(function (response) {
              that.loading = false;
              // eslint-disable-next-line no-console
              console.log(response.data);


              let data = response.data;
              let seriesData = [[], [], [], [], [], [], [], [], [], [], [], [], []];
              let counter = 1;
              seriesData[0].push('项目收入');
              seriesData[0].push('销售收入');
              seriesData[0].push('租赁收入');
              for (let i in data) {
                seriesData[counter].push(data[i]['Item']);
                seriesData[counter].push(parseInt(data[i]['销售收入（万元）'].replace(/,/g, "")));
                seriesData[counter].push(parseInt(data[i]['租赁收入（万元）'].replace(/,/g, "")));
                counter++
              }
              console.log(seriesData);

              let option = {
                title: {
                  text: '项 目 收 入',
                  subtext: '',
                  x: 'center',
                  textStyle: {
                    color: 'rgba(255,255,255,0.9)'
                  },
                },
                legend: {
                  data: ['销售收入', '租赁收入'],
                  textStyle: {
                    color: '#ffffff'//字体颜色
                  },

                  top: 30,
                  right: 0
                },
                grid: {
                  left: 80,
                  bottom: 80,
                  top: 60,
                  right: 80
                },
                tooltip: {

                },
                dataset: {
                  source: seriesData/*response.data*/
                },
                xAxis: {
                  name: '销售业态',
                  type: 'category',
                  axisLabel: {
                    interval: 0,
                    textStyle: {
                      color: 'rgba(255,255,255,0.6)'
                    },
                    formatter: function (value) {
                      var str = value.split("");
                      return str.join("\n");
                    }
                  },
                  axisLine: {
                    lineStyle: {
                      color: 'rgba(255,255,255,0.6)'
                    }
                  },
                  nameTextStyle: {
                    color: 'rgba(255,255,255,0.6)'
                  }
                },
                yAxis: {
                  name: '收入/万元',
                  axisLabel: {
                    interval: 0,
                    textStyle: {
                      color: 'rgba(255,255,255,0.6)'
                    }
                  },
                  nameTextStyle: {
                    color: 'rgba(255,255,255,0.6)'
                  },
                  axisLine: {
                    lineStyle: {
                      color: 'rgba(255,255,255,0.6)'
                    }
                  },
                },
                // Declare several bar series, each will be mapped
                // to a column of dataset.source by default.
                series: [
                  {
                    type: 'bar',
                    itemStyle: {
                      color: '#c23531'
                    },
                  },
                  {
                    type: 'bar',
                    itemStyle: {
                      color: '#cccc15'
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
      // 绘制图表6-地价成本
      drawChart_6() {
        let that = this;
        // eslint-disable-next-line no-console
        console.log('地价成本');
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('echart'), 'light');
        myChart.clear();
        if (this.isGraphVisibal === true) {
          this.loading = true;
          this.axios
            // TODO:请求echart数据
            .get('') // http://localhost:3000/read_2/col
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
                o.value = +data[i]['土地成本（万元）'].replace(/,/g, "");
                seriesData.push(o);
              }
              console.log(xAxisData);
              console.log(seriesData);

              var option = {
                title: {
                  text: '地 价 成 本',
                  subtext: '',
                  x: 'center',
                  textStyle: {
                    color: 'rgba(255,255,255,0.9)'
                  },
                },
                tooltip: {
                  trigger: 'item',
                  formatter: "{b} :<br/> {c}万元 ({d}%)"
                },
                legend: {
                  orient: 'vertical',
                  top: 30,
                  left: 30,
                  data: xAxisData/*response.data.xAxisData*/,
                  textStyle: {
                    color: 'rgba(255,255,255,0.6)'
                  },
                },
                series: [
                  {
                    name: '地价成本',
                    type: 'pie',
                    radius: '55%',
                    center: ['60%', '60%'],
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
      // 绘制图表7-综合成本单方
      drawChart_7() {
        // 基于准备好的dom，初始化echarts实例
        // eslint-disable-next-line no-console
        console.log('综合成本');
        let myChart = this.$echarts.init(document.getElementById('echart'), 'light');
        myChart.clear();
        let that = this;
        if (this.isGraphVisibal === true) {
          this.loading = true;
          this.axios
            // TODO:请求echart数据
            .get('') // http://localhost:3000/read_2/cc
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
                o.value = +data[i]['成本金额（万元）'].replace(/,/g, '');
                seriesData.push(o);
              }
              console.log(xAxisData);
              console.log(seriesData);

              var option = {
                title: {
                  text: '综 合 成 本',
                  subtext: '',
                  x: 'center',
                  textStyle: {
                    color: 'rgba(255,255,255,0.9)'
                  },
                },
                tooltip: {
                  trigger: 'item',
                  formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                  top: 40,
                  /* orient: 'vertical',
                   left: 'left',*/
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
                    center: ['55%', '60%'],
                    data: seriesData/*response.data.seriesData*/,
                    itemStyle: {
                      // 点的颜色。
                      normal: {
                        color: function (params) {
                          var colorList = ["#fd5f00", "#a4f6f9", '#1333a6', '#fc5bb6', '#317ae1', '#1fdedb', '#ff99fe', "#fd0054", "#ffd615",
                            "#6900ff", '#9951ff', '#ffd700', '#1ee494', '#ba52ed', "#009378", "#fc8a15", '#ff0592', '#faf15d'];
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
      // 绘制图表8-项目融资
      drawChart_8() {
        let that = this;
        // eslint-disable-next-line no-console
        console.log('项目融资');
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('echart'), 'light');
        myChart.clear();
        if (this.isGraphVisibal === true) {
          this.loading = true;
          this.axios
            // TODO:请求echart数据
            .get('')// http://localhost:3000/read_2/pf
            .then(function (response) {
              that.loading = false;
              // eslint-disable-next-line no-console
              console.log(response);


              let data = response.data;
              let seriesData = [[], []];
              for (let i in data) {
                seriesData[i].push(parseInt(data[i]['一期融资金额（万元）'].replace(/,/g, '')));
                seriesData[i].push(parseInt(data[i]['二期融资金额（万元）'].replace(/,/g, '')));
              }

              console.log(seriesData);
              let option = {
                title: {
                  text: '项 目 融 资',
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
                  formatter: "{a} <br/>金额: {c}万元"
                },
                legend: {
                  data: ['股东出资', '银行贷款']/*response.data.legend*/,
                  textStyle: {
                    color: 'rgba(255,255,255,0.6)'
                  },
                },
                grid: {
                  left: '2%',
                  right: '15%',
                  bottom: '3%',
                  containLabel: true
                },
                xAxis: {
                  name: '金额/万',
                  type: 'value',
                  axisLabel: {
                    interval: 0,
                    textStyle: {
                      color: 'rgba(255,255,255,0.6)'
                    }
                  },
                  nameTextStyle: {
                    color: 'rgba(255,255,255,0.6)'
                  },
                  axisLine: {
                    lineStyle: {
                      color: 'rgba(255,255,255,0.6)'
                    }
                  },
                },
                yAxis: {
                  name: '项目',
                  type: 'category',
                  data: ['一期融资金额', '二期融资金额'],
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
                series: [
                  {
                    name: '一期融资金额',
                    type: 'bar',
                    stack: '总量',
                    label: {
                      normal: {
                        show: true,
                        position: 'insideRight'
                      }
                    },
                    data: seriesData[0]/*response.data.seriesData[0]*/,
                    itemStyle: {
                      // 点的颜色。
                      normal: {
                        color: function (params) {
                          var colorList = ["#fd5f00", "#a4f6f9", '#1333a6', '#fc5bb6', '#317ae1', '#1fdedb', '#ff99fe', "#fd0054", "#ffd615",
                            "#6900ff", '#9951ff', '#ffd700', '#1ee494', '#ba52ed', "#009378", "#fc8a15", '#ff0592', '#faf15d'];
                          return colorList[params.dataIndex]
                        }
                      }
                    },
                  },
                  {
                    name: '二期融资金额',
                    type: 'bar',
                    stack: '总量',
                    label: {
                      normal: {
                        show: true,
                        position: 'insideRight'
                      }
                    },
                    data: seriesData[1]/*response.data.seriesData[1]*/,
                  },
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
  
  .developer
    overflow hidden
    height 100%
    width 100%
    display flex
    align-items center
    justify-content center
    
    .developer-main
      height 100%
      width 100%
      overflow hidden
      display flex
      justify-content center
      align-items center
      padding 2rem;
      
      .developer-main-echart
        position: relative;
        overflow hidden
        display flex
        justify-content center
        align-items center
        padding 2rem 0 0 0
        width 50rem
        height 40rem
        background-color rgba(0, 126, 255, 0.8)
        box-shadow: 0 .5em 1em rgba(0, 0, 0, 0.6);
        text-shadow: 0 1px 1px hsla(0, 0%, 100%, .3);
        background-position: center top;
        background-size: cover;
        z-index: 1;
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
