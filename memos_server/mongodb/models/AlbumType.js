const mongoose = require('mongoose')

const albumTypeSchema = new mongoose.Schema({
    // 类别ID
    name:{
        type:String,
        required:true,
        unique:true
    },
    desc:{
        type:String,
        default:"记录美好回忆"
    }
}, { collection: 'albumTypes' })

module.exports = mongoose.model('AlbumType', albumTypeSchema)