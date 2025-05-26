// 并发分片上传，断点续传
import { photoChunkAPI, mergePhotoChunkAPI, checkUploadedChunksAPI } from '@/apis/photoAPI'

export const sliceFile = (file: File, chunkSize = 1 * 1024 * 1024) => {
    const chunks = [];
    let start = 0;
    while (start < file.size) {
        const end = start + chunkSize;
        chunks.push(file.slice(start, end));
        start = end;
    }
    return chunks;
};

// export const uploadChunksWithResume = async (
//     file: File,
//     userId: string,
//     albumId: string,
//     hash: string,
//     onProgress?: (percent: number) => void
// ) => {
//     const chunks = sliceFile(file);
//     const chunkCount = chunks.length;
//     console.log(`大图${file.name}分片数量：${chunkCount}片`);

//     // 用hash当成文件指纹
//     const fileName = `${hash}.${file.name.split('.').pop()}`

//     // 获取已上传分片
//     const res = await checkUploadedChunksAPI(fileName);
//     const { uploadedChunks = [] } = res.data

//     let uploaded = uploadedChunks.length;
//     const concurrency = 3;
//     let current = 0;
//     const localUploadedChunks = new Set<number>();

//     const runChunk = async (index: number) => {
//         // 先过滤已经上传的片
//         if (uploadedChunks.includes(index)) {
//             if (onProgress) {
//                 onProgress(Math.round((++uploaded / chunkCount) * 100));
//             }
//             if (current < chunks.length) await runChunk(current++);
//             return;
//         }
//         // 防止和初始并发上传冲突，导致重复上传分片
//         if (localUploadedChunks.has(index)) return;
//         localUploadedChunks.add(index);

//         console.log(`开始上传大图${file.name}的第${index + 1}片`);

//         const formData = new FormData();
//         formData.append('chunk', chunks[index]);
//         formData.append('fileName', fileName);
//         formData.append('index', index.toString());
//         formData.append('total', chunkCount.toString());
//         formData.append('userId', userId);
//         formData.append('albumId', albumId);

//         await photoChunkAPI(formData);

//         if (onProgress) {
//             onProgress(Math.round((++uploaded / chunkCount) * 100));
//         }

//         if (current < chunks.length) await runChunk(current++);
//     };

//     // 初始化并发上传任务（最多3个）
//     const workers = [];
//     while (current < concurrency && current < chunks.length) {
//         // 存储的是pending状态的promise
//         workers.push(runChunk(current++));
//     }

//     await Promise.all(workers);

//     // 合并分片
//     await mergePhotoChunkAPI({ name: file.name, fileName, total: chunkCount, userId, albumId, hash });
// };


// 将大文件分片上传、断点续传封装为一个任务队列
class TaskQueue {
    private tasks: (() => Promise<void>)[] = [];  // 存储所有任务
    private concurrency: number;                   // 最大并发数
    private activeCount: number = 0;               // 当前正在执行的任务数
    private startedChunks: Set<number> = new Set(); // 用于去重，记录已执行过的任务（分片）

    constructor(concurrency: number) {
        this.concurrency = concurrency;
    }

    getStartedChunks(){
        return this.startedChunks
    }

    getActiveCount(){
        return this.activeCount
    }

    getTasks(){
        return this.tasks
    }

    // 添加一个任务到队列
    addTask(task: () => Promise<void>) {
        this.tasks.push(task);
        this.process();
    }

    // 开始处理任务
    private async process() {
        if (this.activeCount >= this.concurrency || this.tasks.length === 0) {
            return;  // 达到最大并发数，或者任务队列为空，停止处理
        }

        // 从队列中取出一个任务
        const task = this.tasks.shift();
        if (!task) return;

        this.activeCount++;

        try {
            await task(); // 执行任务
        } catch (error) {
            console.error('任务执行失败', error);
        } finally {
            this.activeCount--;
            this.process(); // 任务完成后继续处理队列中的任务
        }
    }
}

const taskQueue = new TaskQueue(3);  // 设置最大并发数为3

// 用任务队列上传分片
export const uploadChunksWithResume = async (
    file: File,
    userId: string,
    albumId: string,
    hash: string,
    onProgress?: (percent: number) => void
) => {
    const chunks = sliceFile(file);
    const chunkCount = chunks.length;
    console.log(`大图${file.name}分片数量：${chunkCount}片`);

    const fileName = `${hash}.${file.name.split('.').pop()}`;

    // 获取已上传分片
    const res = await checkUploadedChunksAPI(fileName);
    const { uploadedChunks = [] } = res.data;

    let uploaded = uploadedChunks.length;

    const runChunk = async (index: number) => {
        if (uploadedChunks.includes(index)) {
            if (onProgress) {
                onProgress(Math.round((++uploaded / chunkCount) * 100));
            }
            return;
        }

        if (taskQueue.getStartedChunks().has(index)) {
            return;  // 防止重复上传
        }
        taskQueue.getStartedChunks().add(index);

        console.log(`开始上传大图${file.name}的第${index + 1}片`);

        const formData = new FormData();
        formData.append('chunk', chunks[index]);
        formData.append('fileName', fileName);
        formData.append('index', index.toString());
        formData.append('total', chunkCount.toString());
        formData.append('userId', userId);
        formData.append('albumId', albumId);

        await photoChunkAPI(formData);

        if (onProgress) {
            onProgress(Math.round((++uploaded / chunkCount) * 100));
        }
    };

    // 将每个分片的上传任务添加到任务队列中
    for (let i = 0; i < chunkCount; i++) {
        taskQueue.addTask(() => runChunk(i));
    }

    // 等待所有分片上传完毕
    while (taskQueue.getActiveCount() > 0 || taskQueue.getTasks().length > 0) {
        await new Promise(resolve => setTimeout(resolve, 100));  // 等待所有任务执行完毕
    }

    // 合并分片
    await mergePhotoChunkAPI({ name: file.name, fileName, total: chunkCount, userId, albumId, hash });
};
