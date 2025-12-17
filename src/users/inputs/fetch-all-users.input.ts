import { Field, InputType, Int, registerEnumType } from '@nestjs/graphql';

import { PAGINATION_DEFAULTS } from '../../common/constants/pagination.constants';

// GraphQL enums for ordering
export enum OrderDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum UserOrderByField {
  ID = 'id',
  FIRST_NAME = 'firstName',
  LAST_NAME = 'lastName',
  EMAIL = 'email',
}

// Register enums for GraphQL schema
registerEnumType(OrderDirection, {
  name: 'OrderDirection',
  description: 'Sort order direction',
});

registerEnumType(UserOrderByField, {
  name: 'UserOrderByField',
  description: 'Fields available for ordering users',
});

// GraphQL InputType for fetchAll query
@InputType({
  description: 'Users query parameters with pagination and ordering',
})
export class FetchAllUsersInput {
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

  @Field(() => UserOrderByField, {
    nullable: true,
    defaultValue: UserOrderByField.LAST_NAME,
    description: 'Field to order by',
  })
  orderBy?: UserOrderByField = UserOrderByField.LAST_NAME;

  @Field(() => OrderDirection, {
    nullable: true,
    defaultValue: OrderDirection.ASC,
    description: 'Sort order direction',
  })
  order?: OrderDirection = OrderDirection.ASC;
}
