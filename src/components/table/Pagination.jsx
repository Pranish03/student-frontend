import {
  LuChevronLeft,
  LuChevronRight,
  LuChevronsLeft,
  LuChevronsRight,
} from "react-icons/lu";

export const Pagination = ({ table }) => {
  if (table.getPageCount() <= 1) return null;

  return (
    <div className="flex items-center gap-6 justify-end mt-5">
      <p className="text-zinc-800">
        Page {table.getState().pagination.pageIndex + 1} of{" "}
        {table.getPageCount()}
      </p>
      <div className="flex items-center gap-3">
        <PaginationButton
          disabled={!table.getCanPreviousPage()}
          onClick={() => table.setPageIndex(0)}
        >
          <LuChevronsLeft size={19} />
        </PaginationButton>

        <PaginationButton
          disabled={!table.getCanPreviousPage()}
          onClick={() => table.previousPage()}
        >
          <LuChevronLeft size={19} />
        </PaginationButton>

        <PaginationButton
          disabled={!table.getCanNextPage()}
          onClick={() => table.nextPage()}
        >
          <LuChevronRight size={19} />
        </PaginationButton>

        <PaginationButton
          disabled={!table.getCanNextPage()}
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
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
      className="p-1 border border-zinc-400 bg-white rounded-[10px] text-zinc-800 cursor-pointer hover:bg-black/5 disabled:opacity-45 disabled:cursor-not-allowed disabled:hover:bg-transparent"
      {...props}
    >
      {children}
    </button>
  );
};
