import {
  ChevronDoubleLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/20/solid'
import React from 'react'
import { Table } from '@tanstack/react-table'

const TablePagination = ({ table }: { table: Table<any> }) => {
  const pageSizes = [10, 20, 30, 40, 50]
  const navButtonStyle =
    'bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-full p-1.5 w-7 h-7'
  return (
    <div className={'my-4 flex justify-end'}>
      <div className="flex items-center gap-4">
        <button
          className={navButtonStyle}
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronDoubleLeftIcon />
        </button>
        <button
          className={navButtonStyle}
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeftIcon />
        </button>
        <button
          className={navButtonStyle}
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <ChevronRightIcon />
        </button>
        <button
          className={navButtonStyle}
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          <ChevronRightIcon />
        </button>
        <span className="flex items-center gap-1 text-gray-700">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </strong>
        </span>
        <span className="flex items-center gap-1 text-gray-700">
          | Go to page:
          <input
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              table.setPageIndex(page)
            }}
            className="border p-1 rounded w-16 ml-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
        </span>
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value))
          }}
          className="ml-4 bg-white border p-1 rounded focus:outline-none focus:ring-2 focus:ring-gray-300"
        >
          {pageSizes.map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default TablePagination
