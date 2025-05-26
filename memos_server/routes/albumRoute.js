const express = require('express');
const router = express.Router();
const path = require('path')
const fs = require('fs')
const uploadMiddleware = require('../middleware/album_upload')
const Album = require('../mongodb/models/Album');
const AlbumType = require('../mongodb/models/AlbumType');
const Photo = require('../mongodb/models/Photo');
const { success, requestError } = require('../utils/resStatusCode')

// 获取所有相册
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    const albums = await Album.find({ userId });
    // 对每个元素拼接图片资源路径   
    albums.forEach(album => {
      album.cover = `http://${process.env.HOST}:${process.env.PORT}/uploads/${userId}/cover/${album.cover}`;
    })
    res.json(success('获取相册成功', albums));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 获取所有相册类型
router.get('/albumType', async (req, res) => {
  try {
    const albumType = await AlbumType.find();
    res.json(success('获取相册类型成功', albumType));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 获取所有相册类型
router.get('/type', async (req, res) => {
  try {
    const albumTypes = await AlbumType.find();
    res.json(success('获取相册类型成功', albumTypes));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 根据id获取相册细节
router.get('/detail', async (req, res) => {
  try {
    const { _id } = req.query;
    const album = await Album.findById(_id);
    album.cover = `http://${process.env.HOST}:${process.env.PORT}/uploads/${album.userId}/cover/${album.cover}`;
    res.json(success('获取相册成功', album));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 处理包含文件上传的表单-编辑相册
router.put('/edit', uploadMiddleware.single('cover'), async (req, res) => {
  try {
    const { _id, name, desc, userId, raw_cover_name, type } = req.body;
    // 拼接原封面路径
    const oldCover = path.join(__dirname, '../upload/photos', userId,'cover', raw_cover_name);
    // 如果上传了新封面，multer中间件会将上传的cover用file包裹起来
    if (req.file) {
      // 更新相册信息, 更新数据库中 _id 对应的文档，并将 name、desc、userId 和 type 这些字段更新为新的值。
      await Album.updateOne({ _id }, { name, desc, type, cover: req.file.filename });
      // 删除旧封面文件（如果存在）
      await fs.unlink(oldCover, (err) => {
        if (err) return res.status(500).json(requestError('数据库记录已删除，但图片删除失败', err.message));
      });
    } else {
      await Album.updateOne({ _id }, { name, desc, type });
    }
    res.status(200).json({ success: true, message: '相册编辑成功' });
  } catch (err) {
    res.status(500).json({ success: false, message: '相册编辑失败', error: err.message });
  }
});



// 处理包含文件上传的表单-创建相册
router.post('/upload', uploadMiddleware.single('cover'), async (req, res) => {
  try {
    const { name, desc, userId, type } = req.body;
    const cover = req.file.filename;
    const albumData = {
      name,
      desc,
      userId,
      type,
      cover
    };
    const album = new Album(albumData);
    await album.save();
    res.status(201).json(success('相册创建成功', album));
  } catch (err) {
    res.status(400).json(requestError('相册创建失败', err.message));
  }
});


// 根据_id删除相册
router.delete('/del', async (req, res) => {
  const { _id } = req.query;
  try {
    // 检查相册是否存在
    const album = await Album.findById(_id);
    if (!album) return res.status(404).json(requestError('相册不存在'));

    // 检查相册中是否包含图片
    const photosInAlbum = await Photo.find({ albumId: album._id });
    if (photosInAlbum.length > 0) return res.status(400).json(requestError('相册中仍然包含图片，无法删除'));

    // 获取存储的图片路径
    const userDir = path.join(__dirname, '../upload/photos', album.userId.toString());
    const coverPath = path.join(userDir,'cover', album.cover);
    const albumDir = path.join(userDir, _id)

    await Album.findByIdAndDelete(_id); // 删除数据库数据

    // 检查文件是否存在并删除图片
    if (fs.existsSync(coverPath)) {
      await fs.unlink(coverPath, (err) => {
        if (err) return res.status(500).json(requestError('数据库记录已删除，但图片删除失败', err.message));
      });
    }

     // 删除相册目录
     if (fs.existsSync(albumDir)) {
      fs.rm(albumDir, { recursive: true }, (err) => {
        if (err) return res.status(500).json(requestError('删除相册文件夹失败', err.message));
      });
    }

    res.json(success('相册删除成功'));
  } catch (err) {
    res.status(500).json(requestError('相册删除失败', err.message));
  }
});


module.exports = router