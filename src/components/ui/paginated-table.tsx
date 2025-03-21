import { PaginationEllipsis } from "@/components/ui/pagination"

import type React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

export type PaginatedList<T> = {
  pageSize: number
  pageNumber: number
  totalCount: number
  items: T[]
  totalPages: number
  hasNext: boolean
  hasPrevious: boolean
}

interface PaginatedTableProps<T> {
  data: PaginatedList<T>
  columns: {
    key: keyof T | string
    header: string
    cell?: (item: T) => React.ReactNode
  }[]
  onPageChange: (page: number) => void
}

export function PaginatedTable<T>({ data, columns, onPageChange }: PaginatedTableProps<T>) {
  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.key.toString()}>{column.header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          ) : (
            data.items.map((item, index) => (
              <TableRow key={index}>
                {columns.map((column) => (
                  <TableCell key={`${index}-${column.key.toString()}`}>
                    {column.cell ? column.cell(item) : (item[column.key as keyof T] as React.ReactNode)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing page {data.pageNumber} of {data.totalPages} ({data.totalCount} items)
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => onPageChange(data.pageNumber - 1)}
                className={!data.hasPrevious ? "pointer-events-none opacity-50" : ""}
                tabIndex={!data.hasPrevious ? -1 : 0}
                aria-disabled={!data.hasPrevious}
              />
            </PaginationItem>

            {Array.from({ length: Math.min(5, data.totalPages) }, (_, i) => {
              let pageToShow
              if (data.totalPages <= 5) {
                pageToShow = i + 1
              } else {
                const startPage = Math.max(1, data.pageNumber - 2)
                const endPage = Math.min(data.totalPages, startPage + 4)
                pageToShow = startPage + i
                if (pageToShow > endPage) return null
              }

              return (
                <PaginationItem key={pageToShow}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      onPageChange(pageToShow)
                    }}
                    isActive={pageToShow === data.pageNumber}
                  >
                    {pageToShow}
                  </PaginationLink>
                </PaginationItem>
              )
            })}

            {data.totalPages > 5 && data.pageNumber < data.totalPages - 2 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            <PaginationItem>
              <PaginationNext
                onClick={() => onPageChange(data.pageNumber + 1)}
                className={!data.hasNext ? "pointer-events-none opacity-50" : ""}
                tabIndex={!data.hasNext ? -1 : 0}
                aria-disabled={!data.hasNext}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}

