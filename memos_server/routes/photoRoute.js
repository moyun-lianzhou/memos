const express = require('express');
const router = express.Router();
const { success, requestError } = require('../utils/resStatusCode')
const uploadPhoto = require('../middleware/photo_upload')
const Photo = require('../mongodb/models/Photo');
const path = require('path')
const fs = require('fs')
const multer = require('multer'); // 仅解析表单，不存储文件
const { imageSizeFromFile } = require('image-size/fromFile')
// const tempChunkUpload = multer({ dest: 'tmp_chunks/' });

router.get('/', async (req, res) => {
  try {
    const { userId, albumId } = req.query;
    const photos = await Photo.find({ albumId });
    // 对每个元素拼接图片资源路径   
    photos.forEach(photo => {
      photo.fileName = `http://${process.env.HOST}:${process.env.PORT}/uploads/${userId}/${albumId}/${photo.fileName}`;
    })
    res.json(success('获取图片成功', photos))
  } catch (err) {
    res.status(500).json(requestError('获取图片错误', err.message));
  }
})


// 多照片上传并存入数据库-最多一次性上传20张
router.post('/upload', uploadPhoto.array('photos', 20), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0)
      return res.status(400).json(requestError('没有照片上传'));

    let { hash, albumId, photoMeta } = req.body;

    if (!Array.isArray(photoMeta)) photoMeta = [photoMeta]
    // 如果没有 photoMeta 数据，返回错误
    if (!photoMeta.length)
      return res.status(400).json(requestError('缺少照片元数据'));
    // 解析 photoMeta 字符串数组为对象
    const parsedPhotoMeta = photoMeta.map(meta => JSON.parse(meta));

    // 生成照片数据
    const photos = req.files.map((file, index) => {
      const meta = parsedPhotoMeta[index];  // 获取对应的元数据
      return {
        name: file.originalname,
        fileName: file.filename,
        albumId,
        hash,
        width: meta.width,
        height: meta.height
      }
    });
    // 批量插入数据库
    const savedPhotos = await Photo.insertMany(photos);
    res.json(success('照片已成功上传', savedPhotos));
  } catch (error) {
    res.status(500).json(requestError('照片上传失败', error.message));
  }
});


// 接收每一片
const chunkUpload = multer({ dest: 'tmp_chunks/' });
router.post('/upload_chunk', chunkUpload.single('chunk'), (req, res) => {
  const { fileName, index, userId, albumId } = req.body;
  console.log(fileName, index, userId, albumId);

  const chunkDir = path.join(__dirname, '../upload/temp', fileName);
  if (!fs.existsSync(chunkDir)) fs.mkdirSync(chunkDir, { recursive: true });

  const chunkPath = path.join(chunkDir, index);
  fs.renameSync(req.file.path, chunkPath);

  res.json({ success: true });
});


// 合并分片
router.post('/merge_chunks', async (req, res) => {
  const { name, fileName, total, userId, albumId, hash } = req.body.data;

  if (!fileName || !total || !userId || !albumId) {
    return res.status(400).json(requestError('缺少合并参数'));
  }

  const chunkDir = path.join(__dirname, '../upload/temp', fileName);
  const finalDir = path.join(__dirname, '../upload/photos', userId, albumId);
  const finalPath = path.join(finalDir, fileName);

  try {
    if (!fs.existsSync(finalDir)) fs.mkdirSync(finalDir, { recursive: true });

    const writeStream = fs.createWriteStream(finalPath);

    for (let i = 0; i < Number(total); i++) {
      const chunkPath = path.join(chunkDir, `${i}`);
      const buffer = fs.readFileSync(chunkPath);
      writeStream.write(buffer);
      fs.unlinkSync(chunkPath);
    }

    writeStream.end();

    await new Promise((resolve, reject) => {
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
    });

    // 写入完成后处理
    const dimensions = await imageSizeFromFile(finalPath);
    fs.rmdirSync(chunkDir);

    console.log(req.file);
    const newPhoto = await Photo.create({
      name,
      fileName,
      albumId,
      width: dimensions.width,
      height: dimensions.height,
      hash
    });

    res.json(success('合并成功', newPhoto));
  } catch (err) {
    res.status(500).json(requestError('合并失败', err.message));
  }
});

// 查询已上传分片
router.get('/check_chunks', (req, res) => {
  const { fileName } = req.query;

  if (!fileName) {
    return res.status(400).json({ error: '缺少 fileName 参数' });
  }

  const chunkDir = path.join(__dirname, '../upload/temp', fileName);

  if (!fs.existsSync(chunkDir)) {
    return res.json({ uploadedChunks: [] });
  }

  // 读取目录中所有文件名，转为数字
  const files = fs.readdirSync(chunkDir);
  const uploadedChunks = files
    .map(name => parseInt(name))
    .filter(index => !isNaN(index))
    .sort((a, b) => a - b);

  res.json({ uploadedChunks });
});


// 照片hash查重
router.get('/check_hash', async (req, res) => {
  const { hash, albumId } = req.query;
  const exists = await Photo.findOne({ hash, albumId });
  if (exists) {
    return res.json({ exists: true });
  } else {
    return res.json({ exists: false });
  }
});

// 根据_id删除图片
router.delete('/del', async (req, res) => {
  const { userId, _id } = req.query;
  try {
    // 检查图片是否存在
    const photo = await Photo.findById(_id);
    if (!photo) return res.status(404).json(reqestError('照片不存在'));
    // 获取存储的图片路径
    const albumDir = path.join(__dirname, '../upload/photos', userId, photo.albumId.toString());
    const imagePath = path.join(albumDir, photo.fileName);
    await Photo.findByIdAndDelete(_id); // 执行删除
    // 检查文件是否存在并删除图片
    if (fs.existsSync(imagePath)) {
      await fs.unlink(imagePath, (err) => {
        if (err) return res.status(500).json(requestError('数据库记录已删除，但照片删除失败', err.message));
      });
    }
    res.json(success('照片删除成功'));
  } catch (err) {
    res.status(500).json(requestError('照片删除失败', err.message));
  }
});


// 清空相册
router.delete('/clear', async (req, res) => {
  const { userId, albumId } = req.query;

  if (!userId || !albumId) {
    return res.status(400).json(requestError('缺少 userId 或 albumId'));
  }

  try {
    // 查找所有属于该相册的图片
    const photos = await Photo.find({ albumId });

    if (!photos.length) {
      return res.json(success('该相册下没有照片需要删除'));
    }

    // 构建相册目录路径
    const albumDir = path.join(__dirname, '../upload/photos', userId, albumId);

    // 删除数据库记录
    await Photo.deleteMany({ albumId });

    // 遍历每个文件，尝试删除
    for (const photo of photos) {
      const imagePath = path.join(albumDir, photo.fileName);
      if (fs.existsSync(imagePath)) {
        try {
          fs.unlinkSync(imagePath);
        } catch (err) {
          console.warn(`删除图片失败: ${photo.fileName}`, err);
        }
      }
    }

    res.json(success('相册已清空'));
  } catch (err) {
    res.status(500).json(requestError('清空相册失败', err.message));
  }
});



// 处理包含文件上传的表单-编辑图片
router.put('/edit', multer().none(), async (req, res) => {
  try {
    const { _id, name, desc, shootTime } = req.body;
    console.log(_id, name, desc, shootTime);
    await Photo.updateOne({ _id }, { name, desc, shootTime });
    res.status(200).json(success('照片编辑成功'));
  } catch (err) {
    res.status(500).json(requestError('照片编辑失败', err.message));
  }
});

module.exports = router;
