const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../mongodb/models/User');
const bcrypt = require('bcryptjs')
const { success, requestError } = require('../utils/resStatusCode')
const path = require('path')
const fs = require('fs')
const userAuthMiddleware = require('../middleware/user_auth')

// 用户登录
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json(requestError('用户不存在'));
    
    const isMatch = await bcrypt.compare(password, user.password); // 校验密码是否正确
    if (!isMatch) return res.status(400).json(requestError('密码错误'));

    // 生成 JWT Token
    const token = jwt.sign({ userId: user._id, username: user.username }, process.env.SECRET_KEY, { expiresIn: '1h' });
    // 返回用户信息和 Token
    res.json(success('登录成功', {
      token,
      user: {
        userId: user._id,
        username: user.username,
      },
    }));
  } catch (err) {
    res.status(500).json(requestError(err.message));
  }
});


// 用户注册
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (user) return res.status(400).json(requestError('用户已存在'));
  try {
    // 生成加密密码
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // 存入数据库
    const user = new User({ username, password: hashedPassword });
    await user.save();
    // 创建用户专属的图片文件夹
    const userFolderPath = path.join(__dirname, '..', 'upload', 'photos', user._id.toString());
    console.log(userFolderPath);
    // 确保目录存在（使用 fs.promises.mkdir()）
    await fs.promises.mkdir(userFolderPath, { recursive: true });
    res.status(201).json(success('用户注册成功'));
  } catch (error) {
    res.status(500).json(requestError(error.message));
  }
});

// // 获取单个用户信息
router.get('/userInfo',userAuthMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.query.userId);
    if (!user) {
      return res.status(404).json(requestError('用户未找到'));
    }
    res.status(201).json(success('获取用户信息成功', user));
  } catch (err) {
    res.status(500).json(requestError(err.message));
  }
});

// // 获取所有用户
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json(requestError(error.message));
  }
});



// // 更新用户
// router.put('/:id', async (req, res) => {
//   try {
//     const user = await User.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//     });
//     if (!user) {
//       return res.status(404).json({ error: '用户未找到' });
//     }
//     res.json(user);
//   } catch (err) {
//     res.status(400).json(requestError(error.message));
//   }
// });

// // 删除用户
// router.delete('/:id', async (req, res) => {
//   try {
//     const user = await User.findByIdAndDelete(req.params.id);
//     if (!user) {
//       return res.status(404).json({ error: '用户未找到' });
//     }
//     res.json({ message: '用户已删除' });
//   } catch (err) {
//     res.status(500).json(requestError(error.message));
//   }
// });


module.exports = router;
