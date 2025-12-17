import { Field, InputType, Int } from '@nestjs/graphql';

import { PAGINATION_DEFAULTS } from '../constants/pagination.constants';

@InputType({ description: 'Pagination parameters' })
export class PaginationInput {
  @Field(() => Int, {
    nullable: true,
    defaultValue: PAGINATION_DEFAULTS.PAGE,
    description: 'Page number (1-based)',
  })
  page?: number = PAGINATION_DEFAULTS.PAGE;

  @Field(() => Int, {
    nullable: true,
    defaultValue: PAGINATION_DEFAULTS.LIMIT,
    description: 'Number of items per page',
  })
  limit?: number = PAGINATION_DEFAULTS.LIMIT;
}
