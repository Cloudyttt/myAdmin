const jwt = require('jsonwebtoken');

// JWT配置
let signOptions = {
  algorithm: 'HS256',
  expiresIn: '7d',
}
let verifyOptions = {
  audience: 'admin',
  issuer: 'Cloudy',
  complete: false
}

// 有效载荷
let payload = {
  iss: 'Cloudy',
  aud: 'admin',
}

// 密钥
let secretKey = 'Cloudy'

let verify = token => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, verifyOptions, (err, decode)=>{
      if(err){
        reject()
      } else {
        resolve(decode)
      }
    })
  })
}

module.exports = {signOptions, verifyOptions, secretKey, verify}
