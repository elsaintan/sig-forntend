import { useState, useMemo, useEffect } from 'react';

/**
 * 自定義鉤子：usePagination
 * 用於管理分頁邏輯，包括激活頁面、總頁數的計算和頁面變更功能。
 * 
 * @param {number} initialPage - 初始化頁面，預設為 1。
 * @param {number} itemsPerPage - 每頁顯示的項目數量。
 * @param {array} data - 包含所有項目的數據數組。
 * @returns {object} 包括激活頁面、總頁數和變更頁面的函數。
 */
const usePagination = (initialPage = 1, itemsPerPage, data) => {
  // 狀態：激活頁面，初始設置為 initialPage。
  const [activePage, setActivePage] = useState(initialPage);

  // 計算總頁數，使用 useMemo 以便只在 data.length 或 itemsPerPage 變更時重新計算。
  const totalPages = useMemo(() => {
    return Math.ceil(data.length / itemsPerPage);
  }, [data.length, itemsPerPage]);

  // 監聽 initialPage 的變更，若 initialPage 更新，則重新設置激活頁面。
  useEffect(() => {
    setActivePage(initialPage);
  }, [initialPage]);

  // 函數：變更頁面。只有當指定頁面在有效範圍內時，才更新激活頁面。
  const onPageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setActivePage(page);
    }
  };

  // 返回激活頁面、總頁數和頁面變更函數。
  return { activePage, totalPages, onPageChange };
};

export default usePagination;
