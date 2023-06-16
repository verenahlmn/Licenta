// Functional page component BooksPage

import React, { FC, Fragment, useEffect, useState } from 'react'
import { InferGetServerSidePropsType } from 'next'
import { withSessionSsr } from '@/lib/withSession'
import Layout from '@/components/Layout'
import {
  ColumnDef,
  ColumnFiltersState,
  FilterFn,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'

import { RankingInfo } from '@tanstack/match-sorter-utils'
import { DebouncedInput } from '@/components/DebounceInput'
import { Book } from '@/types/Book'
import { fuzzyFilter } from '@/utils/fuzzyFilter'
import TablePagination from '@/components/Table/Pagination'
import TableComponent from '@/components/Table/Components'
import Fetcher from '@/utils/fetcher'
import useSWR, { useSWRConfig } from 'swr'
import { Dialog, Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }

  interface FilterMeta {
    itemRank: RankingInfo
  }
}

const BooksPage: FC<InferGetServerSidePropsType<typeof getServerSideProps>> = (
  props
) => {
  const rerender = React.useReducer(() => ({}), {})[1]
  Fetcher.defaults.baseUrl = process.env.NEXT_PUBLIC_API_ENDPOINT
  Fetcher.defaults.token = props.session.token
  const { mutate } = useSWRConfig()
  const { data: books } = useSWR(
    '/api/books?populate=*&sort[0]=createdAt:desc',
    (url) => {
      return Fetcher.get<any>(url).then((res) => res.data)
    }
  )

  const { data: authors } = useSWR('/api/authors', (url) => {
    return Fetcher.get<any>(url).then((res) => res.data)
  })

  console.log('authors', authors)

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [globalFilter, setGlobalFilter] = React.useState('')
  const [selected, setSelected] = useState(authors?.data[0] || null)

  useEffect(() => {
    setSelected(authors?.data[0] || null)
  }, [authors])

  const columns = React.useMemo<ColumnDef<Book, any>[]>(
    () => [
      // {
      //   accessorFn: (row) => `${row.firstName} ${row.lastName}`,
      //   id: 'fullName',
      //   header: 'Full Name',
      //   cell: (info) => info.getValue(),
      //   footer: (props) => props.column.id,
      //   filterFn: 'fuzzy',
      //   sortingFn: fuzzySort,
      // },
      {
        accessorKey: 'title',
        header: () => 'Titlu',
        footer: (props) => props.column.id,
      },
      {
        accessorKey: 'isbn',
        header: 'ISBN',
        footer: (props) => props.column.id,
      },
      {
        accessorKey: 'genre',
        header: 'Gen',
        footer: (props) => props.column.id,
      },
      {
        accessorKey: 'author',
        header: 'Autor',
        footer: (props) => props.column.id,
      },
    ],
    []
  )

  const [data, setData] = React.useState<Book[]>([])
  const refreshData = () => setData([])

  const table = useReactTable({
    data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      columnFilters,
      globalFilter,
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
  })

  React.useEffect(() => {
    if (table.getState().columnFilters[0]?.id === 'fullName') {
      if (table.getState().sorting[0]?.id !== 'fullName') {
        table.setSorting([{ id: 'fullName', desc: false }])
      }
    }
  }, [table.getState().columnFilters[0]?.id])

  React.useEffect(() => {
    console.log('effect fired')
    if (books) {
      setData(
        books.data.map((book: any) => ({
          id: book.id,
          title: book.attributes.title,
          isbn: book.attributes.isbn,
          genre: book.attributes.genres?.data
            ?.map((genre: any) => genre.attributes.name)
            .join(','),
          author: book.attributes.author?.data?.attributes?.name,
        }))
      )
    }
  }, [books])

  const [isOpen, setIsOpen] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const formElement = e.target as HTMLFormElement
    const formData = new FormData()
    const data: any = {}
    Array.from(formElement.elements).forEach(
      ({ name, type, files, value }: any) => {
        if (!['submit', 'file'].includes(type)) {
          if (value) data[name] = value
        } else if (type === 'file') {
          Array.from(files).forEach((file: any) => {
            formData.append(`files.${name}`, file, file.name)
          })
        }
      }
    )
    if (selected) data['author'] = selected.id
    // const data = Object.fromEntries(formData.entries())
    formData.append('data', JSON.stringify(data))

    setIsOpen(false)
    Fetcher.post<any, any>('/api/books', formData, {
      contentType: 'multipart/form-data',
    }).then((res) => {
      console.log('did it work?', res.data.data)
      mutate('/api/books?populate=*&sort[0]=createdAt:desc').then()
    })
  }

  return (
    <Layout props={props}>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => {
            setIsOpen(false)
          }}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-50" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Payment successful
                  </Dialog.Title>
                  <form className="mt-2" onSubmit={handleSubmit}>
                    <p className="text-sm text-gray-500">
                      Your payment has been successfully submitted. We’ve sent
                      you an email with all of the details of your order.
                    </p>
                    <input
                      className={
                        'relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none border-0 focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm'
                      }
                      type={'text'}
                      placeholder={'title'}
                      name={'title'}
                    />
                    <input
                      className={
                        'relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none border-0 focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm mt-2'
                      }
                      type={'text'}
                      placeholder={'isbn'}
                      name={'isbn'}
                    />
                    <input
                      className={
                        'relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none border-0 focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm mt-2'
                      }
                      type={'file'}
                      placeholder={'cover'}
                      name={'cover'}
                    />
                    <input
                      className={
                        'relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none border-0 focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm mt-2'
                      }
                      type={'number'}
                      placeholder={'year'}
                      name={'year'}
                    />
                    <Listbox value={selected} onChange={setSelected}>
                      <div className="relative mt-2">
                        <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                          <span className="block truncate">
                            {selected?.attributes?.name}
                          </span>
                          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronUpDownIcon
                              className="h-5 w-5 text-gray-400"
                              aria-hidden="true"
                            />
                          </span>
                        </Listbox.Button>
                        <Transition
                          as={Fragment}
                          leave="transition ease-in duration-100"
                          leaveFrom="opacity-100"
                          leaveTo="opacity-0"
                        >
                          <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                            {authors?.data.map((author: any, index: number) => (
                              <Listbox.Option
                                key={index}
                                className={({ active }) =>
                                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                    active
                                      ? 'bg-amber-100 text-amber-900'
                                      : 'text-gray-900'
                                  }`
                                }
                                value={author}
                              >
                                {({ selected }) => (
                                  <>
                                    <span
                                      className={`block truncate ${
                                        selected ? 'font-medium' : 'font-normal'
                                      }`}
                                    >
                                      {author.attributes.name}
                                    </span>
                                    {selected ? (
                                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                        <CheckIcon
                                          className="h-5 w-5"
                                          aria-hidden="true"
                                        />
                                      </span>
                                    ) : null}
                                  </>
                                )}
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                        </Transition>
                      </div>
                    </Listbox>

                    <div className="mt-4">
                      <button
                        type="submit"
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={() => {
                          // setIsOpen(false)
                        }}
                      >
                        Got it, thanks!
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <div className="p-4 bg-white shadow-lg rounded-lg">
        <div className="mb-4">
          <DebouncedInput
            value={globalFilter ?? ''}
            onChange={(value) => setGlobalFilter(String(value))}
            className="p-2 font-lg shadow border border-block w-full"
            placeholder="Search all columns..."
          />
          <button
            className={
              'bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'
            }
            onClick={() => {
              setIsOpen(true)
            }}
          >
            Adauga carte
          </button>
        </div>
        <TableComponent table={table} />
        <TablePagination table={table} />
        <div className="mb-4">
          {table.getPrePaginationRowModel().rows.length} Rows
        </div>
        <div className="mb-4">
          <button
            onClick={() => rerender()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Force Rerender
          </button>
        </div>
        <div className="mb-4">
          <button
            onClick={() => refreshData()}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Refresh Data
          </button>
        </div>
        {/*<pre className="bg-gray-800 text-white p-4 rounded-lg overflow-x-auto">*/}
        {/*  <code>{JSON.stringify(table.getState(), null, 2)}</code>*/}
        {/*  <code>{JSON.stringify(books, null, 2)}</code>*/}
        {/*</pre>*/}
      </div>
    </Layout>
  )
}

export default BooksPage

export const getServerSideProps = withSessionSsr(async ({ req }) => {
  return {
    props: {
      pageTitle: 'Carti',
      session: req.session,
    },
  }
})
