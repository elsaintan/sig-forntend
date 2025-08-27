import * as DOMPurify from "dompurify";
import { forwardRef } from "react";

// * 通用工具函式
const Tool = {
  // 清除html標籤
  removeHtmlTags: (input) => (
    <div
      className="editor-list"
      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(input) }}
    ></div>
  ),

  // 生成英文字母
  getAlphabetLetter: (index) => String.fromCharCode(65 + index),

  // 添加類名
  addClassName: (Component, className) => {
    return forwardRef(function styledComponent(props, ref) {
      const newClassName = props.className
        ? `${className} ${props.className}`
        : className;
      return <Component ref={ref} {...props} className={newClassName} />;
    });
  },

  // 獲取文件URL
  getFileUrl: (event) => {
    const [file] = event.target.files;
    return file && URL.createObjectURL(file);
  },

  // 檢查過期時間
  checkExpires: (time) =>
    time ? time * 1000 < Date.now() : console.log("無效的過期時間。"),

  // 轉換圖片URL
  transImageUrl: (path) =>
    path && path?.replace
      ? `${process.env.NEXT_PUBLIC_BACKENDURL}${path.replace(/\\/g, "/")}`
      : "",

  // 僅允許輸入數字
  onlyInputNumbers: (event) => {
    if (
      /^\d$/.test(event.key) ||
      [
        "Backspace",
        "Delete",
        "Escape",
        "Tab",
        "ArrowLeft",
        "ArrowRight",
        "Home",
        "End",
      ].includes(event.key) ||
      (event.ctrlKey && ["a", "x", "c", "v"].includes(event.key))
    )
      return;
    event.preventDefault();
  },

  // 檢查數組
  checkArray: (arr) => Array.isArray(arr) && arr.length > 0,

  // 轉換為數組
  toArray: (target) => (Array.isArray(target) ? target : [target]),

  // 獲取當前時間
  getCurrentTime: () => {
    const date = new Date();
    return `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  },

  getQueryString: (params) => {
    return Object.keys(params)
      .map(key => `${key}=${params[key]}`)
      .join('&');
  }
};

export default Tool;
