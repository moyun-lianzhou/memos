import { useEffect, useRef, useState } from 'react';

/**
 * 图片懒加载hook
 * @param src 
 * @returns 
 */
export const useLazyLoad = (src: string) => {
  // 设置图片是否加载完成
  const [loaded, setLoaded] = useState(false);
  // 设置图片资源路径
  const [source, setSource] = useState('');
  // 给 img 标签创建了一个引用
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // IntersectionObserver 监听 DOM 元素是否进入了视口（用户眼前）
    const observer = new IntersectionObserver(([entry]) => {
      // 一旦图片 出现在视口中，就调用 setSource(src)，把真正的图片地址填进去，图片才开始加载。
      if (entry.isIntersecting) {
        setSource(src);
        // 只想懒加载一次，所以加载完就用 observer.disconnect() 停止监听。
        observer.disconnect();
      }
    });
    if (imgRef.current) observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, [src]);

  const handleLoad = () => setLoaded(true);
  return { imgRef, source, loaded, handleLoad };
};

