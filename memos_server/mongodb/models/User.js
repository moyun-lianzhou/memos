const mongoose = require('mongoose')

// 生成随机昵称
const generateRandomNickname = () => '用户_' + Date.now().toString().slice(-6); // 取时间戳后6位

// 定义数据模型
const userSchema = new mongoose.Schema({
  nickname: {
    type: String,
    required: true,
    default: generateRandomNickname
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('User', userSchema)