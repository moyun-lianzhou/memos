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
      scroll: false,
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
          base64LimitSize: 1 * 1024,
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

      console.log("666", editor);

      //   editorInstance.current = editor;

      if (toolbarRef.current) {
        createToolbar({
          editor,
          selector: toolbarRef.current,
          config: {
            // 工具栏配置
            excludeKeys: ["group-video"],
          },
        });
      }

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
    <div className="flex justify-center">
      <div className="h-full w-[1200px] bg-white text-gray-800 rounded-lg relative">
        {/* 返回导航 */}
        <div className="border-b border-gray-200 pl-8 py-2">
          <a
            onClick={() => {
              navigate("/article");
            }}
            className="text-blue-600 hover:underline"
          >
            &lt;&lt; 返回
          </a>
        </div>

        {/* 工具栏 editor-toolbar */}
        <div
          ref={toolbarRef}
          className="border-b border-gray-200 mx-auto w-full bg-[#FCFCFC]"
        ></div>

        {/* 编辑器内容 */}
        <div className="h-full bg-gray-100 overflow-y-auto px-40">
          {/* editor-container */}
          <div className="w-full h-full mx-auto mt-8 mb-36 bg-white p-12 border border-gray-200 shadow-md">
            {/* title-container */}
            <div className="py-5 border-b border-gray-200">
              <input
                type="text"
                placeholder="内容标题"
                className="text-3xl w-full outline-none border-none"
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
              />
            </div>

            {/* content-container */}
            <div
              id="editor-text-area"
              ref={editorRef}
              className="h-min-[100vh] h-min-60 mt-5 w-full overflow-hidden"
            ></div>
          </div>
        </div>
        <div className="absolute bottom-0 bg-gray-300 w-full h-12 flex justify-center items-center">
          <div className="pr-4">
            <Button color="default">保存草稿</Button>
          </div>
          <Button type="primary" onClick={handleAddArticle}>
            发布文章
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WangEditorPage;
