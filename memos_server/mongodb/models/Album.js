const mongoose = require('mongoose')

// 定义数据模型
const albumSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    cover:{
        type:String,
        required:true
    },
    desc: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    //类型
    type: { 
        type: String,
        default: '普通' // 0为普通类型
    },
    // 创建用户ID
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

module.exports = mongoose.model('Album', albumSchema)