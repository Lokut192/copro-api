import { Response } from 'express';

export interface PaginationMeta {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  currentPageSize: number;
}

export interface PaginatedResult<T> {
  items: T[];
  meta: PaginationMeta;
}

export function createPaginatedResponse<T>(
  items: T[],
  totalItems: number,
  page: number,
  limit: number,
): PaginatedResult<T> {
  return {
    items,
    meta: {
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
      currentPageSize: items.length,
    },
  };
}

export function setPaginationResponseHeaders(
  res: Response,
  totalItems: number,
  totalPages: number,
  currentPage: number,
  currentPageSize: number,
) {
  res.setHeader('X-Total-Items', totalItems.toString());
  res.setHeader('X-Total-Pages', totalPages.toString());
  res.setHeader('X-Current-Page', currentPage.toString());
  res.setHeader('X-Current-Page-Size', currentPageSize.toString());
}

export function calculateOffset(page: number, limit: number): number {
  return (page - 1) * limit;
}
