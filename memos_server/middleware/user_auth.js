const jwt = require('jsonwebtoken');
const { requestError } = require('../utils/resStatusCode')

const userAuthMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json(requestError('未授权访问'));
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY); // 自动校验是否过期！
        // 当前时间
        const now = Math.floor(Date.now() / 1000);
        // 计算剩余时间
        const timeLeft = decoded.exp - now;
        // 如果剩余时间小于 2 分钟，重新生成一个新的 token
        if (timeLeft < 2 * 60) {
            const newToken = jwt.sign(
                { userId: decoded.userId, username: decoded.username },
                process.env.SECRET_KEY,
                { expiresIn: '1h' }
            );
            res.setHeader('x-refresh-token', newToken); // 返回新的 token 到客户端
        }
        req.user = decoded; // 把解析后的用户信息挂载到 req 上
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json(requestError('Token已过期，请重新登录'));
        }
        return res.status(401).json(requestError('无效的Token'));
    }
};

module.exports = userAuthMiddleware;
