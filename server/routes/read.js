// 生成一个路由实例用来捕获访问主页的GET请求，导出整个路由并在app.js中通过app.use('/',routes);加载。
// 这样，当访问主页时，就会调用res.render('index',{title:'Express'});渲染views/index.ejs模板并显示到浏览器中
const express = require('express');
const router = express.Router();
const xlsx = require('xlsx');
const {readFile} = require('fs').promises;
const {utils} = xlsx;
// 0.T_Inputs
/* GET home page. */

// 工作簿地址
const workbook = process.cwd() + '/public/xlsx/财务测算模型1.3.xlsm';

router.get('/', function (req, res, next) {
  (async function (params) {
    res.end('Read Excel');
  })();
});
// 表1
// 项目收益-整体财务表现
router.get('/opfp', function (req, res, next) {
  (async function (params) {
    // 获取数据
    const excelBuffer = await readFile(workbook);

    // 解析数据
    const result = xlsx.read(excelBuffer, {
      type: 'buffer',
      cellHTML: false,
    });

    // 获取表的名称
    let first_sheet_name = '项目收益-整体财务表现';
    let opfp = result.Sheets[first_sheet_name];
    let xAxisData = [];
    let seriesData = [];
    let counter = 0;
    let row = 0;
    let temp = '';
    for (let i in opfp) {
      if (counter > 1) {
        if ((counter - 2) % 2 === 0) {
          temp = opfp[i].v;
          if (temp === null || temp === undefined || typeof temp === 'number') {
            continue;
          }
          if (temp.indexOf('-') === 0) {

          }
          xAxisData.push(temp);
        } else {
          let o = {};
          o.value = parseInt(opfp[i].v);
          o.name = temp;
          seriesData.push(o)
        }
      }
      counter++
    }
    /*let data = [
      {
        name: "经营活动现金流入",
        children: [
          {
            name: "经营活动现金流入", value: seriesData[0],
          },
          {
            name: "销售现金流", value: seriesData[1],
          },
          {
            name: "租赁现金流", value: seriesData[2]
          }
        ]
      },
      {
        name: "投资活动现金流出-成本",
        children: [
          {
            name: "土地成本", value: seriesData[3],
            children: [
              {
                name: "土地成本", value: seriesData[4]
              },
              {
                name: "工程费", value: seriesData[5]
              },
              {
                name: "开发间接费", value: seriesData[6]
              },
              {
                name: "开发间接税费", value: seriesData[7]
              }
            ]
          },

        ]
      },
      {
        name: "运营成本",
        value: seriesData[8]
      },
      {
        name: "税收",
        children: [
          {
            name: "税收", value: seriesData[9],
          },
          {
            name: "土地增值税", value: seriesData[10],
          },
          {
            name: "房产税", value: seriesData[11],
          },
          {
            name: "增值税及其附加", value: seriesData[12],
          },
          {
            name: "其他", value: seriesData[13],
          },
          {
            name: "所得税", value: seriesData[14],
          },

        ]
      },
      {
        name: "项目整体净现金流",
        value: seriesData[15]
      }
    ]*/
    let data = {};
    data.xAxisData = xAxisData;
    data.seriesData = seriesData;
    // console.log(ror);
    console.log(seriesData);
    res.json(seriesData);
  })();
});

// 表2
// 项目收益 Project Benefits
router.get('/pb', function (req, res, next) {
  (async function (params) {
    // 获取数据
    const excelBuffer = await readFile(workbook);

    // 解析数据
    const result = xlsx.read(excelBuffer, {
      type: 'buffer',
      cellHTML: false,
    });

    // 获取表的名称
    let first_sheet_name = '项目收益';
    let pb = result.Sheets[first_sheet_name];
    let data = {};
    let xAxisData = [];
    let seriesData = [];
    xAxisData.push(pb.A2.v);
    xAxisData.push(pb.A3.v);
    xAxisData.push('财务净现值');
    xAxisData.push(pb.A5.v);

    seriesData.push(parseInt(pb.B2.v) / 10000);
    seriesData.push(parseInt(pb.B3.v) / 10000);
    seriesData.push(parseInt(pb.B4.v) / 10000);
    seriesData.push(parseInt(pb.B5.v) / 10000);

    data.xAxisData = xAxisData;
    data.seriesData = seriesData;
    console.log(data);
    res.json(data);
  })();
});

// 表3
// 项目收益率 Rata of Return
router.get('/ror', function (req, res, next) {
  (async function (params) {
    // 获取数据
    const excelBuffer = await readFile(workbook);

    // 解析数据
    const result = xlsx.read(excelBuffer, {
      type: 'buffer',
      cellHTML: false,
    });

    // 获取第一张表的名称
    let first_sheet_name = '项目收益率';
    let ror = result.Sheets[first_sheet_name];
    let data = {};
    let xAxisData = [];
    let seriesData = [];

    xAxisData.push(ror.B1.v);
    xAxisData.push(ror.C1.v);
    seriesData.push((100 * ror.B2.v).toFixed(2));
    seriesData.push((ror.C2.v / 10000).toFixed(2));
    data.xAxisData = xAxisData;
    data.seriesData = seriesData;
    // console.log(ror);
    console.log(data);
    res.json(data);
  })();
});

// 表4
// 股东收益率 Return on shareholders
router.get('/ros', function (req, res, next) {
  (async function (params) {
    // 获取数据
    const excelBuffer = await readFile(workbook);

    // 解析数据
    const result = xlsx.read(excelBuffer, {
      type: 'buffer',
      cellHTML: false,
    });

    // 获取表的名称
    let first_sheet_name = '股东收益率';
    let ros = result.Sheets[first_sheet_name];
    let data = {};
    let xAxisData = [];
    let seriesData = [];

    xAxisData.push(ros.B1.v);
    xAxisData.push(ros.C1.v);
    seriesData.push((100 * ros.B2.v).toFixed(2));
    seriesData.push((ros.C2.v / 10000).toFixed(2));
    data.xAxisData = xAxisData;
    data.seriesData = seriesData;
    // console.log(ror);
    console.log(data);
    res.json(data);
  })();
});

// 表5
// 项目收入 Project revenue
router.get('/pr', function (req, res, next) {
  (async function (params) {
    // 获取数据
    const excelBuffer = await readFile(workbook);

    // 解析数据
    const result = xlsx.read(excelBuffer, {
      type: 'buffer',
      cellHTML: false,
    });

    // 获取第一张表的名称
    let first_sheet_name = '项目收入';
    let pr = result.Sheets[first_sheet_name];
    let data = {};
    let dataSet = [[], [], [], [], [], [], [], [], [], [], [], [], []];
    let counter = 0;
    let row = 0;
    dataSet[0].push('销售业态');
    dataSet[0].push(pr.B1.v);
    dataSet[0].push(pr.C1.v);
    for (let i in pr) {
      if (counter > 2 && i !== 'A14' && i !== '!margins') {
        if ((counter - 3) % 3 === 0) {
          row++;
          console.log('row', row, 'i', i)
        }
        console.log('pr[i].v', i, pr[i].v);
        console.log('counter', counter);
        var temp = typeof pr[i].v === 'number' ? pr[i].v.toFixed(1) : pr[i].v;
        dataSet[row].push(temp)
      }
      counter++;
    }
    // console.log(ror);
    console.log(dataSet);
    res.json(dataSet);
  })();
});


// 表6
// 地价成本 cost of land
router.get('/col', function (req, res, next) {
  (async function (params) {
    // 获取数据
    const excelBuffer = await readFile(workbook);

    // 解析数据
    const result = xlsx.read(excelBuffer, {
      type: 'buffer',
      cellHTML: false,
    });

    // 获取表的名称
    let first_sheet_name = '地价成本';
    let col = result.Sheets[first_sheet_name];
    let data = {};
    let xAxisData = [];
    let seriesData = [];
    let counter = 0;
    let row = 0;
    let temp = ''
    for (let i in col) {
      if (counter > 1) {
        if ((counter - 2) % 2 === 0) {
          temp = col[i].v;
          if (temp === '!margins' || temp === null || temp === undefined) {
            continue
          }
          xAxisData.push(temp);

        } else {
          let o = {};
          o.value = col[i].v.toFixed(1);
          o.name = temp;
          seriesData.push(o)
        }

      }
      counter++
    }
    data.xAxisData = xAxisData;
    data.seriesData = seriesData;
    // console.log(ror);
    console.log(data);
    res.json(data);
  })();
});


// 表7
// 综合成本单方 Comprehensive cost
router.get('/cc', function (req, res, next) {
  (async function (params) {
    // 获取数据
    const excelBuffer = await readFile(workbook);

    // 解析数据
    const result = xlsx.read(excelBuffer, {
      type: 'buffer',
      cellHTML: false,
    });

    // 获取表的名称
    let first_sheet_name = '综合成本单方';
    let cc = result.Sheets[first_sheet_name];
    let data = {};
    let xAxisData = [];
    let seriesData = [];
    let counter = 0;
    let row = 0;
    let temp = '';
    for (let i in cc) {
      if (counter > 1 && i !== 'A6') {
        if ((counter - 2) % 2 === 0) {
          temp = cc[i].v;
          console.log(temp)
          if (temp === '!margins' || temp === null || temp === undefined) {
            continue
          }
          xAxisData.push(temp);
        } else if (i !== '!margins') {
          let o = {};
          console.log(cc[i].v, i);
          o.value = parseInt(cc[i].v);
          o.name = temp;
          seriesData.push(o)
        }

      }
      counter++
    }
    data.xAxisData = xAxisData;
    data.seriesData = seriesData;
    res.json(data);
  })();
});


// 表8
// 项目融资 Project financing
router.get('/pf', function (req, res, next) {
  (async function (params) {
    // 获取数据
    const excelBuffer = await readFile(workbook);

    // 解析数据
    const result = xlsx.read(excelBuffer, {
      type: 'buffer',
      cellHTML: false,
    });

    // 获取表的名称
    let first_sheet_name = '项目融资';
    let pf = result.Sheets[first_sheet_name];
    let data = {};
    let yAxisData = [];
    let seriesData = [[], []];
    let legend = [];
    legend.push(pf['B1'].v);
    legend.push(pf['C1'].v);
    yAxisData.push(pf['A2'].v);
    yAxisData.push(pf['A3'].v);
    seriesData[0].push((pf['B2'].v / 10000).toFixed(1));
    seriesData[0].push((pf['C2'].v / 10000).toFixed(1));
    seriesData[1].push((pf['B3'].v / 10000).toFixed(1));
    seriesData[1].push((pf['C2'].v / 10000).toFixed(1));
    data.yAxisData = yAxisData;
    data.seriesData = seriesData;
    data.legend = legend;
    // console.log(ror);
    console.log(data);
    res.json(data);
  })();


});


module.exports = router;

