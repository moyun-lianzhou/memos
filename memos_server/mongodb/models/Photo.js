const mongoose = require('mongoose')
const dayjs =  require('dayjs')
// 定义数据模型
const photoSchema = new mongoose.Schema({
  name:{
    type: String,
    default:''
  },
  fileName: {
    type: String,
    required: true
  },
  // 描述
  desc:{
    type:String,
    default: () => `图片于${dayjs().format('YYYY-MM-DD')}上传`
  },
  // 拍摄时间
  shootTime:{
    type:Date,
    default:Date.now
  },
  // 照片长宽
  width:{
    type: Number
  },
  height:{
    type:Number
  },
  albumId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Album',
    required: true
  },
  hash:{
    type:String,
    required:true
  },
  // 上传时间
  uploadedAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Photo', photoSchema)