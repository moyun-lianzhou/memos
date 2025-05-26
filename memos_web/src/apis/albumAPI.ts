import { get, post, del, put } from '../utils/http'

export const getAlbumAPI = (userId: string) => {
    return get(`/album/?userId=${userId}`)
}

export const getAlbumTypeAPI = () => {
    return get(`/album/type`)
}

export const addAlbumAPI = (data: FormData) => {
    return post(`/album/upload`, data)
}

export const delAlbumAPI = (_id: string) => {
    return del('/album/del', {_id})
}

export const getAlbumDetailAPI = (_id: string) => {
    return get(`/album/detail/?_id=${_id}`);
};


export const editAlbumAPI = (data: FormData) => {
    return put(`/album/edit?userId=${data.get('userId')}`, data);
};


