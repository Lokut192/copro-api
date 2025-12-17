import { Field, ObjectType } from '@nestjs/graphql';

import { PaginationMeta } from '../../common/models/pagination-meta.model';
import { User } from './user.model';

@ObjectType({ description: 'Paginated list of users' })
export class PaginatedUsers {
  @Field(() => [User], { description: 'List of users' })
  items: User[];

  @Field(() => PaginationMeta, { description: 'Pagination metadata' })
  meta: PaginationMeta;
}
