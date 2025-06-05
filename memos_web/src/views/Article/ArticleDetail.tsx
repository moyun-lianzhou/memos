import React, { useEffect } from 'react'

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
      <div className='mx-auto my-0 w-[80%] rounded text-black shadow-lg' style={{background:'var(--color-gray-50)'}}>
        <h1 className='pl-12 text-4xl pt-6 font-[500] font-mono'>{article.title}</h1>
        <hr></hr>
        <div className='bg-gray-100'>
          <span className='text-gray-400'>2025-05-24</span>
        </div>
        <div className='px-12 py-6 mb-12 leading-10 transition focus:scale-1010 hover:scale-101' dangerouslySetInnerHTML={{ __html: article.content }}></div>
      </div>


      <div className='text-sky-400 flex justify-between px-12'>
        <span className='cursor-pointer hover:text-amber-500'>上一篇： {'深空彼岸'} {'>'}</span>
        <span className='cursor-pointer hover:text-amber-500'>下一篇： {'吞噬星空'} {'>'}</span>
      </div>
      
    </>
  )
}
