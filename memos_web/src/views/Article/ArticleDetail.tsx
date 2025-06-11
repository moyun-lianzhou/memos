import React, { useEffect } from 'react'
import { EyeOutlined } from '@ant-design/icons';
export default function ArticleDetail() {
  const [article, setArticle] = React.useState<any>({});

  useEffect(() => {
    const _id = window.location.pathname.split('/').pop();
    if (_id) {
      // fetch(`/api/article/${_id}`)
      //   .then((res) => res.json())
      //   .then((data) => {
      //     setArticle(data);
      //   });
      const articleData = JSON.parse(localStorage.getItem('article') || '{}')[_id];
      console.log(articleData)
      setArticle(articleData);
    }
    console.log(_id);
  }, [])

  return (
    <>
    {/* 怎么传递token */}
      <div className='mx-auto py-1 mb-12 w-[80%] rounde shadow-lg'>
        <h1 className='pl-12 text-4xl pt-6 font-[500] font-mono'>{article.title}</h1>
        <hr className='text-gray-200'></hr>
        <div className='px-12 py-2 text-gray-400'>
          <span>2025-05-24</span>
          <span className='ml-4'><EyeOutlined /> 浏览量：{(Math.random()*100).toFixed(0)}</span>
        </div>
        <div className='px-12 mb-12 leading-10 transition focus:scale-1010 hover:scale-101' dangerouslySetInnerHTML={{ __html: article.content }}></div>
      </div>

      {/* 上一篇/下一篇 */}
      <div className='text-sky-400 flex justify-between px-12 mb-12'>
        <span className='cursor-pointer hover:text-amber-500'>上一篇： {'深空彼岸'} {'>'}</span>
        <span className='cursor-pointer hover:text-amber-500'>下一篇： {'吞噬星空'} {'>'}</span>
      </div>
      
    </>
  )
}
