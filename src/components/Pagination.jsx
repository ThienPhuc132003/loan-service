import  { useEffect } from "react";
import PropTypes from "prop-types";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const MAX_VISIBLE_PAGES = 5;

  // Determine the range of pages to display
  const getVisiblePages = (current, total) => {
    if (total <= MAX_VISIBLE_PAGES) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const start = Math.max(1, current - Math.floor(MAX_VISIBLE_PAGES / 2));
    const end = Math.min(total, start + MAX_VISIBLE_PAGES - 1);

    // Adjust start if we're near the end of the page range
    if (end - start < MAX_VISIBLE_PAGES - 1) {
      return Array.from({ length: MAX_VISIBLE_PAGES }, (_, i) => total - MAX_VISIBLE_PAGES + i + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const visiblePages = getVisiblePages(currentPage, totalPages);

  useEffect(() => {
    console.log("currentPage:", currentPage);
    console.log("totalPages:", totalPages);
  }, [currentPage, totalPages]);

  return (
    <div className="pagination">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Previous
      </button>
      {visiblePages.map((page) => (
        <button
          key={page}
          className={page === currentPage ? "active" : ""}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </button>
    </div>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default Pagination;