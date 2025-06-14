const multer = require('multer')
const fs = require('fs')
const path = require('path')
const { v4: uuidv4 } = require('uuid');

// 创建相册封面图片上传目录（如果不存在）
const baseDir = path.join(__dirname, '..', 'upload', 'photos');
if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir, { recursive: true });
}

// 设置文件存储路径和文件名
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const userId = req.body.userId; // 获取用户 ID
        if (!userId) return cb(new Error('缺少 userId'), null);
        const albumDir = path.join(baseDir, userId, 'cover');
        if (!fs.existsSync(albumDir)) {
            fs.mkdirSync(albumDir, { recursive: true });
        }
        cb(null, albumDir); // 文件存储路径
    },
    filename: function (req, file, cb) {
        cb(null, uuidv4() + path.extname(file.originalname)); // 文件名
    }
});

// 初始化上传中间件
const uploadMiddleware = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, true); // 接受文件
        } else {
            cb(new Error('只允许上传 JPG 或 PNG 文件'), false); // 拒绝文件
        }
    },
    limits: { fileSize: 10 * 1024 * 1024 } // 限制文件大小为 10MB
});


module.exports = uploadMiddleware
