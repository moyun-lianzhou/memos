import { getAlbumDetailAPI } from "@/apis/albumAPI"
import UploadPhoto from "@/components/Upload/UploadPhoto"
import type { Album } from "@/types"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"




const AddPhoto = () => {
    const { albumId } = useParams()
    const [albumInfo, setAlbumInfo] = useState<Album | null>(null)
    const navigate = useNavigate()

    useEffect(() => {
        (async () => {
            const res = await getAlbumDetailAPI(albumId as string)
            setAlbumInfo(res.data.data)
        })();
    }, [])

    return (

        <>
            <h1>添加图片-
                <a onClick={() => { navigate(`/photo?albumId=${albumId}`); }}>
                    {albumInfo?.name}
                </a>
            </h1>
            <UploadPhoto albumId={albumId as string} />
        </>
    )
}

export default AddPhoto