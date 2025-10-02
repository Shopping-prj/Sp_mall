import Pagination from "react-bootstrap/Pagination";

const PaginationComponent = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  if (totalPages <= 1) return null;

  const pages = [];

  // 첫 페이지 + 앞쪽 ... 처리
  if (currentPage > 3) {
    pages.push(
      <Pagination.Item key={1} onClick={() => onPageChange(1)}>
        1
      </Pagination.Item>
    );
    if (currentPage > 4) {
      pages.push(
        <Pagination.Item key="start-ellipsis" disabled className="ellipsis">
          …
        </Pagination.Item>
      );
    }
  }

  // 현재 페이지 주변 (±2)
  for (
    let i = Math.max(1, currentPage - 2);
    i <= Math.min(totalPages, currentPage + 2);
    i++
  ) {
    pages.push(
      <Pagination.Item
        key={i}
        active={i === currentPage}
        activeLabel="" // "current" 텍스트 제거
        onClick={() => onPageChange(i)}
      >
        {i}
      </Pagination.Item>
    );
  }

  // 마지막 페이지 + 뒷쪽 ... 처리
  if (currentPage < totalPages - 2) {
    if (currentPage < totalPages - 3) {
      pages.push(
        <Pagination.Item key="end-ellipsis" disabled className="ellipsis">
          …
        </Pagination.Item>
      );
    }
    pages.push(
      <Pagination.Item key={totalPages} onClick={() => onPageChange(totalPages)}>
        {totalPages}
      </Pagination.Item>
    );
  }

  return (
    <Pagination className="justify-content-center mt-4 custom-pagination">
      {/* 첫 페이지 */}
      <Pagination.Item
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="icon-btn"
      >
        <i className="fas fa-angle-double-left" />
      </Pagination.Item>

      {/* 이전 페이지 */}
      <Pagination.Item
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="icon-btn"
      >
        <i className="fas fa-angle-left" />
      </Pagination.Item>

      {pages}

      {/* 다음 페이지 */}
      <Pagination.Item
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="icon-btn"
      >
        <i className="fas fa-angle-right" />
      </Pagination.Item>

      {/* 마지막 페이지 */}
      <Pagination.Item
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="icon-btn"
      >
        <i className="fas fa-angle-double-right" />
      </Pagination.Item>
    </Pagination>
  );
};

export default PaginationComponent;