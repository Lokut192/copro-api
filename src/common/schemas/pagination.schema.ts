import z4 from 'zod/v4';

import { PAGINATION_DEFAULTS } from '../constants/pagination.constants';

export const paginationQuerySchema = z4.object({
  page: z4.coerce
    .number()
    .int()
    .min(PAGINATION_DEFAULTS.MIN_PAGE, {
      message: `Page must be at least ${PAGINATION_DEFAULTS.MIN_PAGE}`,
    })
    .default(PAGINATION_DEFAULTS.PAGE)
    .optional(),
  limit: z4.coerce
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
  orderBy: z4
    .enum(['id'], 'Please provide a valid orderBy field, e.g. id')
    .optional()
    .default('id'),
  order: z4
    .enum(['ASC', 'DESC', 'asc', 'desc'], 'Please provide a valid order')
    .optional()
    .default('ASC'),
});

export type PaginationQuery = z4.infer<typeof paginationQuerySchema>;
