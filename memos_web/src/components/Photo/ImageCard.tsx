import React from "react";
import { useNavigate } from "react-router";

interface ImageCardProps {
  id: string;
  src: string;
  alt: string;
  className?: string;
  onSelect?: (id: string, isSelected:boolean) => void; // 新增的选中事件处理函数
}

const ImageCard: React.FC<ImageCardProps> = ({ id, src, alt, className = "", onSelect}) => {
  const [isSelected, setIsSelected] = React.useState(false); // 初始化选中状态为 false
  const navigate = useNavigate();

  // 切换选中状态
  const toggleSelection = () => {
    const newSelected = !isSelected;
    setIsSelected(newSelected);
    onSelect && onSelect(id, newSelected); // 触发回调
  };

  return (
    <div
      className={`group relative overflow-hidden cursor-pointer transition-all duration-300 ${className}`}
    >
      {/* 图片 */}
      {isSelected ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-64 object-cover transition-transform duration-500 scale-90"
          onClick={() => {
            // e.stopPropagation(); // 防止点击事件冒泡到卡片
            toggleSelection();
          }}
        />
      ) : (
        <img
          src={src}
          alt={alt}
          className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-101"
          onClick={()=>navigate(`/homephoto/${id}`)} // 点击图片时触发 toggleSelection 函数
        />
      )}

      {/* 上部阴影（使用渐变实现） */}
      <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

      {/* 选中图标（位于左上角） */}
      
      <div
        onClick={(e) => {
          e.stopPropagation(); // 防止点击事件冒泡到卡片
          toggleSelection();
        }}
        // 根据选中状态显示或隐藏图标，选中后蓝紫色对钩不透明
        className={`absolute top-2 left-2 
            ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
            transition-opacity duration-300`}
      >
        {isSelected ? (
          // 选中状态：填充的蓝紫色对勾
          <div className="opacity-100"><svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            fill="#4352AD"
            stroke="#fff"
            strokeWidth="1.5"
          />
          <path
            d="M7 12L10.5 15.5L17 9"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg></div>
          
        ) : (
          // 未选中状态：白色空心对勾
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              fill="white"
              stroke="#fff"
              strokeWidth="1.5"
            />
            <path
              d="M7 12L10.5 15.5L17 9"
              stroke="#333"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
    </div>
  );
};

export default ImageCard;
