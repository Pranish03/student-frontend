import {
  LuChevronLeft,
  LuChevronRight,
  LuChevronsLeft,
  LuChevronsRight,
} from "react-icons/lu";

export const Pagination = ({ page, totalPages, onPageChange }) => {
  if (!totalPages || totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-end gap-6 mt-5">
      <p className="text-gray-800">
        Page {page} of {totalPages}
      </p>

      <div className="flex items-center gap-1.5">
        <PaginationButton onClick={() => onPageChange(1)} disabled={page === 1}>
          <LuChevronsLeft size={19} />
        </PaginationButton>

        <PaginationButton
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
        >
          <LuChevronLeft size={19} />
        </PaginationButton>

        <PaginationButton
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
        >
          <LuChevronRight size={19} />
        </PaginationButton>

        <PaginationButton
          onClick={() => onPageChange(totalPages)}
          disabled={page === totalPages}
        >
          <LuChevronsRight size={19} />
        </PaginationButton>
      </div>
    </div>
  );
};

const PaginationButton = ({ children, ...props }) => {
  return (
    <button
      className="p-1 border border-gray-200 rounded-[10px] text-gray-800 cursor-pointer hover:bg-black/5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
      {...props}
    >
      {children}
    </button>
  );
};
