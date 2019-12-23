const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const router = express.Router();
const {upload} = require('../pool/multer-config'); // 导入multer配置
// 单图上传
router.post('/', upload.single('logo'), function (req, res, next) {
  res.send({ret_code: '0'});
});

module.exports = router;
