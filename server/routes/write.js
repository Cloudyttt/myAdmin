const express = require('express');
const router = express.Router();
const xlsx = require('xlsx');
const {readFile} = require('fs').promises;
const {utils} = xlsx;


/* GET users listing. */
router.get('/', function (req, res, next) {
  (async function (params) {

    // 获取数据
    const excelBuffer = await readFile(process.cwd() + '/public/xlsx/workbook-2.xlsm');

    // 解析数据
    const result = xlsx.read(excelBuffer, {
      type: 'buffer',
      cellHTML: false,
    });


    var dataArr = [
      {'姓名': "张三", '性别': "男", '年龄': 12},
      {'姓名': "李四", '性别': "女", '年龄': 13}
    ];
    var origin = 'A2';
    let keyArr = [];
    for (let key in dataArr[0]) {
      keyArr.push(key);
      console.log(keyArr);
    }
    /* read worksheet */
    var first_sheet_name = result.SheetNames[0];
    var ws = result.Sheets[first_sheet_name];

    xlsx.utils.sheet_add_json(ws, dataArr, {skipHeader: true, origin: origin, header: keyArr});
    xlsx.writeFile(result, 'out.xlsx');
    res.json(result.Sheets.Sheet1)
  })();
});


module.exports = router;
