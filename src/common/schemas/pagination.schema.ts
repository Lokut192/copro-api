import { z } from 'zod';

import { PAGINATION_DEFAULTS } from '../constants/pagination.constants';

export const paginationQuerySchema = z.object({
  page: z.coerce
    .number()
    .int()
    .min(PAGINATION_DEFAULTS.MIN_PAGE, {
      message: `Page must be at least ${PAGINATION_DEFAULTS.MIN_PAGE}`,
    })
    .default(PAGINATION_DEFAULTS.PAGE)
    .optional(),
  limit: z.coerce
    .number()
    .int()
    .min(PAGINATION_DEFAULTS.MIN_LIMIT, {
      message: `Limit must be at least ${PAGINATION_DEFAULTS.MIN_LIMIT}`,
    })
    .max(PAGINATION_DEFAULTS.MAX_LIMIT, {
      message: `Limit must be at most ${PAGINATION_DEFAULTS.MAX_LIMIT}`,
    })
    .default(PAGINATION_DEFAULTS.LIMIT)
    .optional(),
});

export type PaginationQuery = z.infer<typeof paginationQuerySchema>;
