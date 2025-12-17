import { BadRequestException } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';

import { PAGINATION_DEFAULTS } from '../common/constants/pagination.constants';
import { FetchAllUsersInput } from './inputs/fetch-all-users.input';
import { PaginatedUsers } from './models/paginated-users.model';
import { User } from './models/user.model';
import { UsersService } from './users.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => PaginatedUsers, {
    name: 'users',
    description: 'Fetch all users with pagination and ordering',
  })
  async fetchAll(
    @Args('input', { nullable: true }) input?: FetchAllUsersInput,
  ): Promise<PaginatedUsers> {
    const { page, limit, orderBy, order } = input || {};

    // Validate pagination parameters
    if (limit !== undefined) {
      if (limit < PAGINATION_DEFAULTS.MIN_LIMIT) {
        throw new BadRequestException(
          `Limit must be at least ${PAGINATION_DEFAULTS.MIN_LIMIT}`,
        );
      }
      if (limit > PAGINATION_DEFAULTS.MAX_LIMIT) {
        throw new BadRequestException(
          `Limit must be at most ${PAGINATION_DEFAULTS.MAX_LIMIT}`,
        );
      }
    }

    if (page !== undefined && page < PAGINATION_DEFAULTS.MIN_PAGE) {
      throw new BadRequestException(
        `Page must be at least ${PAGINATION_DEFAULTS.MIN_PAGE}`,
      );
    }

    return this.usersService.fetchAll({
      page,
      limit,
      orderBy,
      order,
    }) as Promise<PaginatedUsers>;
  }
}
