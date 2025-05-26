import SparkMD5 from "spark-md5"

// 计算文件 hash（生成文件指纹作为唯一 ID）
export const getFileHash = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const chunkSize = 2 * 1024 * 1024
        const chunks = Math.ceil(file.size / chunkSize)
        let current = 0
        const spark = new SparkMD5.ArrayBuffer()
        const reader = new FileReader()

        reader.onload = e => {
            if (e.target?.result) {
                spark.append(e.target.result as ArrayBuffer)
                current++
                if (current < chunks) {
                    loadNext()
                } else {
                    resolve(spark.end())
                }
            }
        }

        reader.onerror = () => reject('计算 hash 出错')
        const loadNext = () => {
            const start = current * chunkSize
            const end = Math.min(file.size, start + chunkSize)
            reader.readAsArrayBuffer(file.slice(start, end))
        }

        loadNext()
    })
}