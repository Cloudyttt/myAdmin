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

module.exports = {signOptions, verifyOptions, secretKey}
