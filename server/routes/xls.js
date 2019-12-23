const express = require('express');
const router = express.Router();
const {upload} = require('../pool/multer-config'); // 导入multer配置

router.post('/', upload.single('file'), function (req, res, next) {
  console.log('|--------------------------------上传--------------------------------｜')
  let file = req.file;
  let body = req.body
  console.log('body', body.id);
  console.log('file', file);
  console.log(body);
  res.send('666');
});

module.exports = router;
