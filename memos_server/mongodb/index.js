const mongoose = require('mongoose');
// 连接 MongoDB 数据库
const connect_mongodb = async ()=>{
    return await mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB 连接成功'))
    .catch((err) => console.error('MongoDB 连接失败:', err));
}
module.exports = connect_mongodb