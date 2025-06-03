import { Button, Pagination, Select, Tag } from "antd";
import Search from "antd/es/input/Search";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const App: React.FC = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [RenderArticles, setRenderArticles] = useState([]);

  useEffect(() => {
    const articleData = localStorage.getItem("article");
    if (articleData) {
      const parsedArticle = JSON.parse(articleData);
      setArticles(parsedArticle);
      setRenderArticles(parsedArticle.slice(0, 6));
      console.log(parsedArticle);
    }
  }, []);

  const handleYearChange = (value: string) => {
    console.log(`selected ${value}`);
  };

  const handleMonthChange = (value: string) => {
    console.log(`selected ${value}`);
  };

  const handleCategoryChange = (value: string) => {
    console.log(`selected ${value}`);
  };

  const onSearch = (value: string) => {
    console.log(value);
  };

  const handlePageChange = (page: number, pageSize: number) => {
    console.log(page, pageSize);
    setRenderArticles(articles.slice((page - 1) * pageSize, page * pageSize));
  }
  return (
    <div>
      <header className="">
        <div className="pb-4">
          <span className="px-4">已发布(28)</span>
          <span className="pr-4">草稿箱(10)</span>
          <span className="pr-4">回收站(12)</span>
        </div>
        <div className="flex justify-between">
          <div className="flex">
            <div className="px-4">
              <Select
                // className="ml-10"
                defaultValue="年：不限"
                style={{ width: 120 }}
                onChange={handleYearChange}
                options={[
                  { value: "2025", label: "2025年" },
                  { value: "2024", label: "2024年" },
                  { value: "2023", label: "2023年" },
                ]}
              />
            </div>
            <div className="pr-4">
              <Select
                defaultValue="月：不限"
                style={{ width: 120 }}
                onChange={handleMonthChange}
                options={[
                  { value: "1", label: "1月" },
                  { value: "2", label: "2月" },
                  { value: "3", label: "3月" },
                  { value: "4", label: "4月" },
                  { value: "5", label: "5月" },
                  { value: "6", label: "6月" },
                  { value: "7", label: "7月" },
                  { value: "8", label: "8月" },
                  { value: "9", label: "9月" },
                  { value: "10", label: "10月" },
                  { value: "11", label: "11月" },
                  { value: "12", label: "12月" },
                ]}
              />
            </div>
            <div className="mr-4">
              <Select
                defaultValue="分类：不限"
                style={{ width: 120 }}
                onChange={handleCategoryChange}
                options={[
                  { value: "0", label: "成长" },
                  { value: "1", label: "爱情" },
                  { value: "2", label: "体验" },
                  { value: "3", label: "娱乐" },
                  { value: "4", label: "感受" },
                  { value: "5", label: "经验" },
                ]}
              />
            </div>
            <Button size="middle">管理</Button>
          </div>
          <div>
            <Search
              placeholder="输入搜索内容"
              onSearch={onSearch}
              style={{ width: 200 }}
            />
            <Button
              className="ml-4"
              onClick={() => navigate(`/article/addArticle`)}
            >
              去记忆创作
            </Button>
          </div>
        </div>
      </header>

      <div className="mt-8 ml-4 mb-10">
        <span className="text-gray-300 text-base ml-4">文章</span>
        <div className="mt-4 border-t border-gray-100 shadow-2xl ">
          {RenderArticles &&
            RenderArticles.map((item: { title: ""; content: "" }, index) => {
              return (
                <div className="flex h-36 py-8 border-b border-gray-100 hover:bg-gray-300">
                  <img
                    onClick={() => {navigate(`/article/detail/${index}`)}}
                    className="ml-4 h-20 w-40 object-cover rounded-lg cursor-pointer hover:scale-110 transition duration-300 ease-in-out"
                    src={`https://picsum.photos/200/200?${index}`}
                    alt="article"
                  ></img>
                  <div className="ml-8">
                    <div
                       onClick={() => {navigate(`/article/detail/${index}`)}}
                      className="text-base text-pink-300 cursor-pointer hover:text-blue-300 my-1"
                    >
                      {item.title}
                    </div>
                    分类：<Tag color="magenta">感悟</Tag>
                    <div className="text-gray-500 mt-1">2025-04-10 00:32:15</div>
                  </div>
                  {/* <div dangerouslySetInnerHTML={{ __html: item.content }}></div> */}
                </div>
              );
            })}
        </div>
      </div>
      <Pagination 
      onChange={handlePageChange}
      pageSize={6}
      defaultPageSize={6}
      align="center" defaultCurrent={1} total={articles.length} />
    </div>
  );
};

export default App;
