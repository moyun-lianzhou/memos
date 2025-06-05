import { Button, Checkbox, Pagination, Select, Tag } from "antd";
import Search from "antd/es/input/Search";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

// 定义文章类型
type Article = {
  _id: string;
  title: string;
  content: string;
  checked: boolean;
};

const App: React.FC = () => {
  const navigate = useNavigate();
  const [manageFlag, setManageFlag] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [renderArticles, setRenderArticles] = useState<Article[]>([]);
  const [checkAll, setCheckAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // 当前页码
  const [pageSize, setPageSize] = useState(6); // 每页显示的数量

  const [isHovered, setIsHovered] = useState(false);

  // 初始化时从 localStorage 中获取文章数据
  useEffect(() => {
    const articleData = localStorage.getItem("article");
    if (articleData) {
      const allArticles = JSON.parse(articleData).map(
        (item: Article, index: number) => ({
          ...item,
          _id: String(index),
          checked: false,
        })
      );
      setArticles(allArticles);
      setRenderArticles(
        allArticles.slice(0, Math.min(allArticles.length, pageSize))
      ); // 初始化时显示第一页的数据
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

  const handlePageChange = (currentPage: number, pageSize: number) => {
    console.log(currentPage, pageSize); // 输出当前页码和每页显示的数量

    setCurrentPage(currentPage); // 更新当前页码
    setPageSize(pageSize); // 更新每页显示的数量

    const start = (currentPage - 1) * pageSize; // 计算起始索引
    const end = start + pageSize; // 计算结束索引
    setRenderArticles(articles.slice(start, Math.min(end, articles.length))); // 初始化时显示第一页的数据
  };

  const handleAllChange = () => {
    setCheckAll(!checkAll); // 切换全选状态
    const newArticles = articles.map((article) => ({
      ...article,
      checked: !checkAll,
    })); // 全选或全不选
    setArticles(newArticles); // 更新文章列表
    setRenderArticles(
      newArticles.slice(
        (currentPage - 1) * pageSize,
        Math.min(articles.length, currentPage * pageSize)
      )
    ); // 初始化时显示第一页的数据
  };

  const onCheckChange = (_id: string) => {
    const index = Number(_id);
    const newArticles = articles.map((article, i) =>
      i === index ? { ...article, checked: !article.checked } : article
    );
    // 计算已选中的数量
    const checkedCount = newArticles.reduce((acc, val) => {
      return val.checked ? acc + 1 : acc;
    }, 0);
    console.log("check:", checkedCount);

    setCheckAll(checkedCount === articles.length); // 设置全选状态为 true 或 false
    setArticles(newArticles); // 更新文章列表
    setRenderArticles(
      newArticles.slice(
        (currentPage - 1) * pageSize,
        Math.min(articles.length, currentPage * pageSize)
      )
    ); // 初始化时显示第一页的数据
  };

  const handleCancelManage = () => {
    setManageFlag(false); // 取消管理状态
    setCheckAll(false); // 取消全选状态
    const newArticles = articles.map((article) => ({
      ...article,
      checked: false,
    })); // 更新为全不选
    setArticles(newArticles);
    setRenderArticles(
      newArticles.slice(
        (currentPage - 1) * pageSize,
        Math.min(articles.length, currentPage * pageSize)
      )
    );
  };

  return (
    <div className="pb-8 pr-4">
      <header>
        <div className="pb-4">
          <span className="ml-4 mr-6 cursor-pointer hover:text-sky-500">
            已发布(28)
          </span>
          <span className="mr-6 cursor-pointer hover:text-sky-500">
            草稿箱(10)
          </span>
          <span className="mr-6 cursor-pointer hover:text-sky-500">
            回收站(12)
          </span>
        </div>
        <div className="flex justify-between">
          <div className="flex items-center">

              <Select
                prefix="年："
                // className="ml-10"
                defaultValue="不限"
                style={{ width: 120,margin:'0 16px' }}
                onChange={handleYearChange}
                options={[
                  { value: 0, label: "不限" },
                  { value: 2025, label: "2025年" },
                  { value: 2024, label: "2024年" },
                  { value: 2023, label: "2023年" },
                ]}
              />
              <Select
                prefix="月："
                defaultValue="不限"
                style={{ width: 120,marginRight:'16px' }}
                onChange={handleMonthChange}
                options={[
                  { value: 0, label: "不限" },
                  { value: 1, label: "1月" },
                  { value: 2, label: "2月" },
                  { value: 3, label: "3月" },
                  { value: 4, label: "4月" },
                  { value: 5, label: "5月" },
                  { value: 6, label: "6月" },
                  { value: 7, label: "7月" },
                  { value: 8, label: "8月" },
                  { value: 9, label: "9月" },
                  { value: 10, label: "10月" },
                  { value: 11, label: "11月" },
                  { value: 12, label: "12月" },
                ]}
              />
              <Select
                prefix="分类："
                defaultValue="不限"
                style={{ width: 120,marginRight:'16px' }}
                onChange={handleCategoryChange}
                options={[
                  { value: 0, label: "不限" },
                  { value: 1, label: "成长" },
                  { value: 2, label: "爱情" },
                  { value: 3, label: "体验" },
                  { value: 4, label: "娱乐" },
                  { value: 5, label: "感受" },
                  { value: 6, label: "经验" },
                ]}
              />
               <Select
                prefix="排序："
                defaultValue="不限"
                style={{ width: 135,marginRight:'16px' }}
                onChange={handleCategoryChange}
                options={[
                  { value: 0, label: "不限" },
                  { value: 1, label: "时间" },
                  { value: 2, label: "浏览量" },
                ]}
              />
               <Select
                defaultValue="升序"
                style={{ width: 135,marginRight:'16px' }}
                onChange={handleCategoryChange}
                options={[
                  { value: 1, label: "升序" },
                  { value: 2, label: "降序" },
                ]}
              />
            {manageFlag === false ? (
              <Button type="primary" size="middle" onClick={() => setManageFlag(true)}>
                管理
              </Button>
            ) : (
              <Button type="primary" size="middle" onClick={handleCancelManage}>
                取消管理
              </Button>
            )}
            {manageFlag && (
              <div className="ml-4">
                <Checkbox onChange={handleAllChange} checked={checkAll}>
                  全选
                </Checkbox>
                {(checkAll ||
                  articles.reduce(
                    (acc, val) => (val.checked ? acc + 1 : acc),
                    0
                  ) !== 0) && (
                  <Button className="ml-4" danger>
                    批量删除
                  </Button>
                )}
              </div>
            )}
          </div>
          <div>
            <Search
              placeholder="输入搜索内容"
              onSearch={onSearch}
              style={{ width: 200 }}
            />
            {/* <Button
              className="ml-4"
              )}
            >
              去记忆创作
            </Button> */}

            <button 
            className="cursor-pointer bg-gradient-to-r from-red-400 to-blue-500 
            text-gray-100 font-semibold rounded py-[5px] px-4 ml-4 
            hover:from-red-300 hover:to-blue-400 transition duration-300 ease-in-out"
            onClick={() => navigate(`/article/addArticle`)}
            >
                创作记忆
            </button>
            
            
          </div>
        </div>
      </header>

      <div className="mt-8 ml-4 mb-10">
        <span className="text-gray-300 text-base ml-4">文章</span>
        <div className="mt-4 border-t border-gray-100 shadow-2xl ">
          {renderArticles &&
            renderArticles.map((item, index) => {
              return (
                <div
                  key={item._id}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  className="flex items-center h-36 py-8 border-b border-gray-100 hover:bg-gray-400 relative"
                >
                  {manageFlag && (
                    <div className="ml-4">
                      <Checkbox
                        onChange={() => onCheckChange(item._id)}
                        checked={item.checked}
                      />
                    </div>
                  )}
                  <img
                    onClick={() => {
                      navigate(`/article/detail/${item._id}`);
                    }}
                    className="ml-4 h-20 w-40 object-cover rounded-lg cursor-pointer hover:scale-110 transition duration-300 ease-in-out"
                    src={`https://picsum.photos/200/200?${index}`}
                    alt="article"
                  ></img>
                  <div className="ml-8">
                    <div
                      onClick={() => {
                        // navigate(`/article/detail/${index}`);
                        navigate(`/article/detail`);
                      }}
                      className="text-base text-pink-300 cursor-pointer hover:text-blue-300 my-1"
                    >
                      {item.title}
                    </div>
                    分类：<Tag color="magenta">感悟</Tag>
                    <div className="text-gray-500 mt-1">
                      2025-04-10 00:32:15
                    </div>
                  </div>

                  <div className="absolute right-12">
                    <span className="mr-12 text-black-400">
                      浏览量：{(Math.random() * 100).toFixed(0)}
                    </span>
                    <a href="#" className="mr-12">
                      <span className="text-blue-400 hover:text-blue-300">
                        编辑
                      </span>
                    </a>
                    <a href="#">
                      <span className="text-red-400 hover:text-red-300">
                        删除
                      </span>
                    </a>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
      <Pagination
        onChange={handlePageChange}
        current={currentPage}
        pageSize={pageSize}
        align="center"
        total={articles.length}
      />
    </div>
  );
};

export default App;
