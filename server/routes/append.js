const express = require('express');
const router = express.Router();
const xlsx = require('xlsx');
const {readFile} = require('fs').promises;
const {utils} = xlsx;
const fs = require('fs');

/* GET users listing. */
router.get('/', function (req, res, next) {
  (async function (params) {
    var wb = xlsx.utils.book_new();
    // 获取数据
    const workbook = process.cwd() + '/public/xlsx/workbook.xlsm';
    const excelBuffer = await readFile(workbook);

    // 解析数据
    const result = xlsx.read(excelBuffer, {
      type: 'buffer',
      cellHTML: false,
    });

    var ws_name = "SheetJS";

    /* make worksheet */
    var ws_data = [
      [ "S", "h", "e", "e", "t", "J", "S" ],
      [  1 ,  2 ,  3 ,  4 ,  5 ]
    ];
    var ws = xlsx.utils.aoa_to_sheet(ws_data);

    /* Add the worksheet to the workbook */
    xlsx.utils.book_append_sheet(wb, ws, ws_name);
    // fs.writeFileSync
    xlsx.writeFile(workbook, 'out.xlsb');
    console.log('succeed');
    res.json(result)
  })();
});

module.exports = router;
