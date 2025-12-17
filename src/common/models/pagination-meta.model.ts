import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Pagination metadata' })
export class PaginationMeta {
  @Field(() => Int, { description: 'Total number of items' })
  totalItems: number;

  @Field(() => Int, { description: 'Number of items returned in this page' })
  itemsReturned: number;

  @Field(() => Int, { description: 'Total number of pages' })
  totalPages: number;

  @Field(() => Int, { description: 'Current page number' })
  currentPage: number;

  @Field(() => Int, { description: 'Page size (limit)' })
  currentPageSize: number;
}
