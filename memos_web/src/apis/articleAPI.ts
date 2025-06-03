import { del, get, post, put } from '../utils/http'



// 文章图片上传
export const uploadArticlePhotoAPI = (data:FormData)=>{
    return post('/article/upload', data)
}


