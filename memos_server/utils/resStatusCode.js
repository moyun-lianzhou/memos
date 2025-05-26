// 操作成功
const success = (msg = '操作成功', data = {}) => {
    return {
        code: 1000,   // 响应码
        msg: msg,  // 提示信息
        data       // 返回的相册数据
    }
}

// 请求失败
const requestError = (msg = '请求失败', data = {}) => {
    return {
        code: 1004,   // 响应码
        msg: msg,  // 提示信息
        data       // 返回的相册数据
    }
}

// // 参数错误
// const paramError = (msg = '参数错误', data = {}) => {
//     return {
//         code: 1001,   // 响应码
//         msg: msg,  // 提示信息
//         data       // 返回的相册数据
//     }
// }

// // 权限不足
// const permissionError = (msg = '权限不足', data = {}) => {
//     return {
//         code: 1002,   // 响应码
//         msg: msg,  // 提示信息
//         data       // 返回的相册数据
//     }
// }

// // 资源不存在
// const sourceError = (msg = '资源不存在', data = {}) => {
//     return {
//         code: 1003,   // 响应码
//         msg: msg,  // 提示信息
//         data       // 返回的相册数据
//     }
// }

// // 文件上传失败
// const fileUploadError = (msg = '文件上传失败', data = {}) => {
//     return {
//         code: 1005,   // 响应码
//         msg: msg,  // 提示信息
//         data       // 返回的相册数据
//     }
// }


// // 用户已存在
// const userExist = (msg = '用户已存在', data = {}) => {
//     return {
//         code: 1006,   // 响应码
//         msg: msg,  // 提示信息
//         data       // 返回的相册数据
//     }
// }

// // 请求失败
// const databaseError = (msg = '数据库操作失败', data = {}) => {
//     return {
//         code: 1007,   // 响应码
//         msg: msg,  // 提示信息
//         data       // 返回的相册数据
//     }
// }

// module.exports = { success, paramError, permissionError, sourceError, reqestError, fileUploadError, userExist, databaseError }
module.exports = { success, requestError}