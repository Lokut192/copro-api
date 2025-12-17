export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 25,
  MAX_LIMIT: 100,
  MIN_LIMIT: 1,
  MIN_PAGE: 1,
} as const;

export const PAGINATION_RESPONSE_HEADERS = {
  'X-Total-Items': {
    description: 'Total number of items across all pages',
    schema: { type: 'integer', example: 150 },
  },
  'X-Total-Pages': {
    description: 'Total number of pages available',
    schema: { type: 'integer', example: 6 },
  },
  'X-Current-Page': {
    description: 'Current page number being returned',
    schema: { type: 'integer', example: 1 },
  },
  'X-Current-Page-Size': {
    description: 'Number of items in the current page',
    schema: { type: 'integer', example: 25 },
  },
} as const;
