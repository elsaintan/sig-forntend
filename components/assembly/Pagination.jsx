import { useMemo } from "react";
import { Button } from "react-bootstrap";

export default function Pagination({
  data = [],
  activePage=1,
  pageSize=10,
  setActivePage
}) {
  const totalPages = useMemo(
    () => Math.ceil(data.length / pageSize),
    [data.length, pageSize]
  );
  const pageItem = 3;

  const pages = useMemo(() => {
    if (totalPages <= pageItem) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (activePage <= 3) {
      return [1, 2, 3, 4, 5, "...", totalPages];
    }
    if (activePage >= totalPages - 2) {
      return [
        1,
        "...",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }
    return [
      1,
      "...",
      activePage - 1,
      activePage,
      activePage + 1,
      "...",
      totalPages,
    ];
  }, [totalPages, activePage, pageItem]);

  const onPageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setActivePage(page);
    }
  };

  // 其餘的渲染邏輯保持不變
  return (
    <ul className="d-flex gap-sm-4 gap-2 align-item-center">
      {/* 上一頁按鈕 */}
      <li>
        <button
          type="button"
          className="d-block w-100 h-100 btn d-flex justify-content-center align-items-center pagination-item-prev border-0"
          onClick={() => onPageChange(activePage - 1)}
          disabled={activePage === 1}
        >
          上一頁
        </button>
      </li>

      {/* 頁碼按鈕 */}
      {pages.map((page, index) => (
        <li key={index}>
          {page === "..." ? (
            <span className="pagination-ellipsis">{page}</span>
          ) : (
            <Button
              onClick={() => onPageChange(page)}
              active={page === activePage}
              className={`pagination-item ${
                activePage === page ? "pagination-item-current text-white" : ""
              } button-size d-flex justify-content-center align-items-center`}
            >
              {page}
            </Button>
          )}
        </li>
      ))}

      {/* 下一頁按鈕 */}
      <li>
        <button
          type="button"
          className="d-block w-100 h-100 btn d-flex justify-content-center align-items-center pagination-item-next border-0"
          onClick={() => onPageChange(activePage + 1)}
          disabled={activePage === totalPages}
        >
          下一頁
        </button>
      </li>
    </ul>
  );
}
