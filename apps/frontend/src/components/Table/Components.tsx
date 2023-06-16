import { flexRender, Table } from '@tanstack/react-table'
import { Filter } from '@/components/Table/Filter'
import React from 'react'

const TableComponent = ({ table }: { table: Table<any> }) => (
  <table className="table-auto border-collapse w-full">
    <thead>
      {table.getHeaderGroups().map((headerGroup) => (
        <tr key={headerGroup.id} className="bg-gray-100">
          {headerGroup.headers.map((header) => {
            return (
              <th
                key={header.id}
                colSpan={header.colSpan}
                className="border px-4 py-2 text-left"
              >
                {header.isPlaceholder ? null : (
                  <>
                    <div
                      {...{
                        className: header.column.getCanSort()
                          ? 'cursor-pointer select-none'
                          : '',
                        onClick: header.column.getToggleSortingHandler(),
                      }}
                      className="flex items-center"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{
                        asc: ' 🔼',
                        desc: ' 🔽',
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
                    {header.column.getCanFilter() ? (
                      <div className="mt-2">
                        <Filter column={header.column} table={table} />
                      </div>
                    ) : null}
                  </>
                )}
              </th>
            )
          })}
        </tr>
      ))}
    </thead>
    <tbody className="text-gray-700">
      {table.getRowModel().rows.map((row) => {
        return (
          <tr key={row.id} className="hover:bg-gray-200">
            {row.getVisibleCells().map((cell) => {
              return (
                <td key={cell.id} className="border px-4 py-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              )
            })}
          </tr>
        )
      })}
    </tbody>
  </table>
)

export default TableComponent
