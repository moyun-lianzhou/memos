import { del, get, post, put } from '../utils/http'

export const getPhotoAPI = (userId: string, albumId: string) => {
    return get(`/photo/`,{ userId, albumId })
}

// 普通上传
export const uploadPhotoAPI = (data:FormData)=>{
    return post('/photo/upload', data)
}

// 照片分片上传
export const photoChunkAPI = (data:FormData)=>{
    return post('/photo/upload_chunk', data)
}

// 合并分片
export const mergePhotoChunkAPI = (data:any)=>{
    return post(`/photo/merge_chunks`, {data})
}

// 检查已上传分片，用于断点续传
export const checkUploadedChunksAPI = (fileName:string)=>{
    return get(`/photo/check_chunks`, {fileName})
}

export const checkIfHashExistsAPI = (hash:string, albumId:string)=>{
    return get(`/photo/check_hash`, {hash, albumId})
}

export const addPhotoAPI = (data: FormData) => {
    return post(`/album/upload?userId=${data.get('userId')}`, data)
}

export const delPhotoAPI = (userId: string, _id: string) => {
    return del('/photo/del', { userId, _id })
}

export const clearAllPhotoAPI = (userId: string, albumId: string) => {
    return del('/photo/clear', { userId, albumId })
}

export const getPhotoDetailAPI = (_id: string) => {
    return get(`/album/detail/?_id=${_id}`);
};


export const editPhotoAPI = (data: FormData) => {
    return put('/photo/edit', data);
};


