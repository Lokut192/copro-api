import { paginationQuerySchema } from 'src/common';
import z4, { z } from 'zod/v4';

// export const fetchAllUsersQuerySchema = z4.object({
//   page: z4.coerce
//     .number()
//     .int()
//     .min(PAGINATION_DEFAULTS.MIN_PAGE, {
//       message: `Page must be at least ${PAGINATION_DEFAULTS.MIN_PAGE}`,
//     })
//     .optional()
//     .default(PAGINATION_DEFAULTS.PAGE),
//   limit: z4.coerce
//     .number()
//     .int()
//     .min(PAGINATION_DEFAULTS.MIN_LIMIT, {
//       message: `Limit must be at least ${PAGINATION_DEFAULTS.MIN_LIMIT}`,
//     })
//     .max(PAGINATION_DEFAULTS.MAX_LIMIT, {
//       message: `Limit must be at most ${PAGINATION_DEFAULTS.MAX_LIMIT}`,
//     })
//     .optional()
//     .default(PAGINATION_DEFAULTS.LIMIT),
//   orderBy: z
//     .enum(
//       ['id', 'firstName', 'lastName', 'email'],
//       'Please provide a valid orderBy field, e.g. id, firstName, lastName, email',
//     )
//     .optional()
//     .default('lastName'),
//   order: z4
//     .enum(['ASC', 'DESC', 'asc', 'desc'], 'Please provide a valid order')
//     .optional()
//     .default('ASC'),
// });
export const fetchAllUsersQuerySchema = paginationQuerySchema.extend({
  orderBy: z4
    .enum(
      ['id', 'firstName', 'lastName', 'email'],
      'Please provide a valid orderBy field, e.g. id, firstName, lastName, email',
    )
    .optional()
    .default('lastName'),
});

export type FetchAllUsersQuery = z.infer<typeof fetchAllUsersQuerySchema>;
