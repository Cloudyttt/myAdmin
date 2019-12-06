// 生成一个路由实例用来捕获访问主页的GET请求，导出整个路由并在app.js中通过app.use('/',routes);加载。
// 这样，当访问主页时，就会调用res.render('index',{title:'Express'});渲染views/index.ejs模板并显示到浏览器中
const express = require('express');
const router = express.Router();
const xlsx = require('xlsx');
const {readFile} = require('fs').promises;
const {utils} = xlsx;
/* GET home page. */

// 工作簿地址
const workbook = process.cwd() + '/public/xlsx/财务测算模型1.3.xlsm';


router.get('/', function (req, res, next) {
  (async function (params) {
    res.end('Read_gov Excel');
  })();
});

// 表9
// 土地出让收入 Income from land transfer
router.get('/iflt', function (req, res, next) {
  (async function (params) {
    // 获取数据
    const excelBuffer = await readFile(workbook);

    // 解析数据
    const result = xlsx.read(excelBuffer, {
      type: 'buffer',
      cellHTML: false,
    });

    // 获取表的名称
    let first_sheet_name = '土地出让收入';
    let iflt = result.Sheets[first_sheet_name];
    let data = {};
    let xAxisData = [];
    let seriesData = [];
    let counter = 0;
    let row = 0;
    let temp = '';
    for(let i in iflt){
      if(counter > 1){
        if((counter - 2) % 2 === 0){
          temp = iflt[i].v;
          if (temp === '!margins' || temp === null || temp === undefined || typeof temp === 'number') {
            continue
          }
          xAxisData.push(temp);
        } else {
          let o = {};
          o.value = iflt[i].v.toFixed(1);
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


// 表10
// 土地出让税收 Tax on land transfer
router.get('/tnlt', function (req, res, next) {
  (async function (params) {
    // 获取数据
    const excelBuffer = await readFile(workbook);

    // 解析数据
    const result = xlsx.read(excelBuffer, {
      type: 'buffer',
      cellHTML: false,
    });

    // 获取表的名称
    let first_sheet_name = '土地出让税收';
    let tnlt = result.Sheets[first_sheet_name];
    let data = {};
    let xAxisData = [];
    let seriesData = [];
    let counter = 0;
    let row = 0;
    let temp = '';
    for(let i in tnlt){
      if(counter > 1){
        if((counter - 2) % 2 === 0){
          temp = tnlt[i].v;
          if (temp === '!margins' || temp === null || temp === undefined || typeof temp === 'number') {
            continue
          }
          xAxisData.push(temp);
        } else {
          let o = {};
          o.value = tnlt[i].v.toFixed(1);
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


// 表11
// 居住人口 Resident population
router.get('/rp', function (req, res, next) {
  (async function (params) {
    // 获取数据
    const excelBuffer = await readFile(workbook);

    // 解析数据
    const result = xlsx.read(excelBuffer, {
      type: 'buffer',
      cellHTML: false,
    });

    // 获取表的名称
    let first_sheet_name = '居住人口';
    let rp = result.Sheets[first_sheet_name];
    let data = {};
    let xAxisData = [];
    let seriesData = [];
    let counter = 0;
    let row = 0;
    let temp = '';
    for (let i in rp) {
      if (counter > 1) {
        if ((counter - 2) % 2 === 0) {
          temp = rp[i].v;
          if (temp === '!margins' || temp === null || temp === undefined || temp === -1) {
            continue
          }
          xAxisData.push(temp);
        } else {
          seriesData.push(+rp[i].v.toFixed(1))
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


// 表12
// 就业人口 Employment population
router.get('/ep', function (req, res, next) {
  (async function (params) {
    // 获取数据
    const excelBuffer = await readFile(workbook);

    // 解析数据
    const result = xlsx.read(excelBuffer, {
      type: 'buffer',
      cellHTML: false,
    });

    // 获取表的名称
    let first_sheet_name = '就业人口';
    let ep = result.Sheets[first_sheet_name];
    let data = {};
    let xAxisData = [];
    let seriesData = [];
    let counter = 0;
    let row = 0;
    let temp = '';
    for(let i in ep){
      if(counter > 1){
        if((counter - 2) % 2 === 0){
          temp = ep[i].v;
          if (temp === '!margins' || temp === null || temp === undefined || temp === -1) {
            continue
          }
          xAxisData.push(temp);
        } else {
          seriesData.push( + ep[i].v.toFixed(1))
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


// 表13
// 人均绿地面积 Green area per capita
router.get('/gapc', function (req, res, next) {
  (async function (params) {
    // 获取数据
    const excelBuffer = await readFile(workbook);

    // 解析数据
    const result = xlsx.read(excelBuffer, {
      type: 'buffer',
      cellHTML: false,
    });

    // 获取表的名称
    let first_sheet_name = '人均绿地面积';
    let gapc = result.Sheets[first_sheet_name];
    let data = {};
    let xAxisData = [];
    let seriesData = [];
    let counter = 0;
    let row = 0;
    let temp = '';
    for(let i in gapc){
      if(counter > 1){
        if((counter - 2) % 2 === 0){
          temp = gapc[i].v
          if (temp === '!margins' || temp === null || temp === undefined || temp === -1) {
            continue
          }
          xAxisData.push(temp);
        } else {
          seriesData.push( + gapc[i].v.toFixed(1))
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

// 表14
// GDP
router.get('/gdp', function (req, res, next) {
  (async function (params) {
    // 获取数据
    const excelBuffer = await readFile(workbook);

    // 解析数据
    const result = xlsx.read(excelBuffer, {
      type: 'buffer',
      cellHTML: false,
    });

    // 获取表的名称
    let first_sheet_name = 'GDP';
    let gapc = result.Sheets[first_sheet_name];
    let data = {};
    let xAxisData = [];
    let seriesData = [];
    let counter = 0;
    let row = 0;
    let temp = '';
    for(let i in gapc){
      if(counter > 1){
        if((counter - 2) % 2 === 0){
          temp = gapc[i].v
          if (temp === '!margins' || temp === null || temp === undefined || temp === -1) {
            continue
          }
          xAxisData.push(temp);
        } else {
          seriesData.push( + gapc[i].v.toFixed(1))
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



// 表15
// 能耗 energy consumption
router.get('/ec', function (req, res, next) {
  (async function (params) {
    // 获取数据
    const excelBuffer = await readFile(workbook);

    // 解析数据
    const result = xlsx.read(excelBuffer, {
      type: 'buffer',
      cellHTML: false,
    });

    // 获取表的名称
    let first_sheet_name = '能耗';
    let ec = result.Sheets[first_sheet_name];
    let data = {};
    let xAxisData = [];
    let seriesData = [];
    let counter = 0;
    let row = 0;
    let temp = '';
    for(let i in ec){
      if(counter > 1 && i!=='A6'){
        if((counter - 2) % 2 === 0){
          temp = ec[i].v;
          if (temp === '!margins' || temp === null || temp === undefined || temp === -1) {
            continue
          }
          xAxisData.push(ec[i].v);
        } else {
          seriesData.push(parseInt(ec[i].v))
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


// 表16
// 产业税收 Industrial tax
router.get('/it', function (req, res, next) {
  (async function (params) {
    // 获取数据
    const excelBuffer = await readFile(workbook);

    // 解析数据
    const result = xlsx.read(excelBuffer, {
      type: 'buffer',
      cellHTML: false,
    });

    // 获取表的名称
    let first_sheet_name = '产业税收';
    let it = result.Sheets[first_sheet_name];
    let data = {};
    let xAxisData = [];
    let seriesData = [];
    let counter = 0;
    let row = 0;
    let temp = '';
    for(let i in it){
      if(counter >1 ){
        if((counter - 2) % 2 === 0){
          temp = it[i].v;
          if (temp === '!margins' || temp === null || temp === undefined || temp === -1) {
            continue
          }
          xAxisData.push(it[i].v);
        } else {
          seriesData.push(parseInt(it[i].v))
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


// 表17
// 单位面积收益-开发商 income per unit area for developers
router.get('/ipuafd', function (req, res, next) {
  (async function (params) {
    // 获取数据
    const excelBuffer = await readFile(workbook);

    // 解析数据
    const result = xlsx.read(excelBuffer, {
      type: 'buffer',
      cellHTML: false,
    });

    // 获取表的名称
    let first_sheet_name = '单位面积收益-开发商';
    let ipuafd = result.Sheets[first_sheet_name];
    console.log(ipuafd);
    res.json(ipuafd);
  })();
});

// 表18
// 单位面积指数-政府 unit area index for government
router.get('/uaifg', function (req, res, next) {
  (async function (params) {
    // 获取数据
    const excelBuffer = await readFile(workbook);

    // 解析数据
    const result = xlsx.read(excelBuffer, {
      type: 'buffer',
      cellHTML: false,
    });

    // 获取表的名称
    let first_sheet_name = '单位面积指数-政府';
    let uaifg = result.Sheets[first_sheet_name];
    console.log(uaifg);
    res.json(uaifg);
  })();
});


module.exports = router;

