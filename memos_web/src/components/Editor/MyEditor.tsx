import React, { useEffect, useRef, useState } from "react";
import "@wangeditor/editor/dist/css/style.css";
import {
  createEditor,
  createToolbar,
  i18nChangeLanguage,
  IDomEditor,
  IEditorConfig,
} from "@wangeditor/editor";
import { useNavigate } from "react-router";
import { Button } from "antd";
import { uploadArticlePhotoAPI } from "@/apis/articleAPI";
import { AxiosResponse } from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
type InsertFnType = (url: string, alt: string, href: string) => void;

const WangEditorPage: React.FC = () => {
  // const editorRef = useRef<HTMLTextAreaElement>(null); // 文章内容
  const editorRef = useRef<HTMLDivElement>(null); // 文章内容
  const toolbarRef = useRef<HTMLDivElement>(null); // 工具栏
  //   const editorInstance = useRef<IDomEditor | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const user = useSelector((state: RootState) => state.user);

  
  useEffect(() => {
    const LANG = window.location.href.includes("lang=en") ? "en" : "zh-CN";
    i18nChangeLanguage(LANG);
    
    const editorConfig: Partial<IEditorConfig> = {
      placeholder: "请输入内容...",
      scroll: false, // 开启滚动,
      MENU_CONF: {
        uploadImage: {
          customUpload: async (file: File, insertFn: InsertFnType) => {
            const formData = new FormData();
            formData.append("userId", user.userId as string);
            formData.append("file", file);

            console.log(file);

            const res: AxiosResponse = await uploadArticlePhotoAPI(formData);
            // const res = await response.json();
            console.log("5551", res.data.data.url);
            console.log("555", res);
            // 假设返回的图片 URL 是 res.url
            insertFn(res.data.data.url, file.name, "");
          },
          fieldName: "your-fileName",
          base64LimitSize: 1 * 1024 * 100, // 小于 100kb 使用 base64 格式上传
          // 单个文件的最大体积限制，默认为 2M
          maxFileSize: 10 * 1024 * 1024, // 1M
          // 最多可上传几个文件，默认为 100
          maxNumberOfFiles: 10,
          // 选择文件时的类型限制，默认为 ['image/*'] 。如不想限制，则设置为 []
          allowedFileTypes: ["image/*"],
          // 超时时间，默认为 10 秒
          timeout: 5 * 1000, // 5 秒
        },
      },
      onChange(editor: IDomEditor) {
        // console.log(editor.getHtml());
        setContent(editor.getHtml());
      },
    };

    if (editorRef.current) {
      const editor = createEditor({
        selector: editorRef.current,
        content: [],
        config: editorConfig,
      });

      if (toolbarRef.current) {
        createToolbar({
          editor,
          selector: toolbarRef.current,
          config: {
            // 工具栏配置
            excludeKeys: ["group-video", "fullScreen"],
          },
        });
      }

      console.log(editor.getAllMenuKeys())
      // 将焦点（focus）设置到编辑器的末尾。
      const handleClick = (e: MouseEvent) => {
        if ((e.target as HTMLElement).id === "editor-text-area") {
          editor.blur();
          editor.focus(true);
        }
      };

      editorRef.current.addEventListener("click", handleClick);

      return () => {
        editorRef.current?.removeEventListener("click", handleClick);
        editor.destroy();
      };
    }
  }, []);

  const navigate = useNavigate();
  const {theme} = useSelector((state: RootState) => state.theme)

  const handleAddArticle = () => {
    const articleObj = { title, content };
    console.log(title, content);
    if (title && content !== '<p><br></p>') {
      const curentArticle = JSON.parse(localStorage.getItem("article") || "[]");
      localStorage.setItem(
        "article",
        JSON.stringify([...curentArticle, articleObj])
      );
      navigate("/article");
    } else {
      alert("请输入标题和内容");
    }
  };

  return (

    <div className={`${theme}`}>
      <div className="relative bg-gray-200 dark:bg-gray-800 w-screen h-screen overflow-hidden">
        {/* 返回导航 */}
        <div className="flex border-b border-gray-200 pl-6 py-2">
          <span className="cursor-pointer hover:text-gray-500 dark:hover:text-gray-500" onClick={() => { navigate("/article") }}>&lt; 返回</span>
          <div className="ml-8"><Button size="small" color="default">保存草稿</Button></div>
          <Button className="ml-4" size="small" type="primary" onClick={handleAddArticle}>发布文章</Button>
        </div>
        {/* 工具栏 editor-toolbar */}
        <div ref={toolbarRef} className="border border-gray-200"></div>

        {/* 编辑器内容 */}
        <div className="bg-gray-200 dark:bg-gray-800 overflow-y-auto px-40 pt-8 pb-16 h-[calc(100vh-80px)]">
          <div className="bg-white dark:bg-gray-500 p-12 border border-gray-200 shadow-md">
            {/* 标题 */}
            <div className="py-5 border-b border-gray-200 dark:text-white">
              <input type="text" placeholder="内容标题" className="text-3xl w-full outline-none border-none" onChange={(e) => { setTitle(e.target.value); }} />
            </div>
            {/* 正文 */}
            <div id="editor-text-area" ref={editorRef} className="mt-4 min-h-[calc(100vh-80px)]"></div>
          </div>
        </div>
        {/* <div className="absolute bottom-0 w-full h-12 flex justify-center items-center">
          <div className="pr-4"><Button color="default">保存草稿</Button></div>
          <Button type="primary" onClick={handleAddArticle}>发布文章</Button>
        </div> */}
      </div>
    </div>


  );
};

export default WangEditorPage;
