import { Controller, Get, Query, Res } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { type Response } from 'express';

import {
  PAGINATION_RESPONSE_HEADERS,
  setPaginationResponseHeaders,
  ZodValidationPipe,
} from '../common';
import { GetUserDto } from './dto/get-user.dto';
import {
  type FetchAllUsersQuery,
  fetchAllUsersQuerySchema,
} from './schemas/fetch-all-users-query.schema';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller({
  path: 'users',
  version: '1',
})
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Fetch all users with pagination and ordering' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number for pagination (minimum: 1, default: 1)',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description:
      'Number of items per page (minimum: 1, maximum: 100, default: 25)',
    example: 25,
  })
  @ApiQuery({
    name: 'orderBy',
    required: false,
    enum: ['id', 'firstName', 'lastName', 'email'],
    description: 'Field to order by (default: lastName)',
    example: 'lastName',
  })
  @ApiQuery({
    name: 'order',
    required: false,
    enum: ['ASC', 'DESC', 'asc', 'desc'],
    description: 'Sort order direction (default: ASC)',
    example: 'ASC',
  })
  @ApiOkResponse({
    description: 'Paginated list of users',
    type: GetUserDto,
    isArray: true,
    headers: PAGINATION_RESPONSE_HEADERS,
  })
  async fetchAll(
    @Query(new ZodValidationPipe(fetchAllUsersQuerySchema))
    query: FetchAllUsersQuery,
    @Res()
    res: Response,
  ) {
    const { page, limit, orderBy, order } = query;
    const { items: users, meta } = await this.usersService.fetchAll({
      page,
      limit,
      orderBy,
      order,
    });

    setPaginationResponseHeaders(
      res,
      meta.totalItems,
      meta.totalPages,
      meta.currentPage,
      meta.currentPageSize,
    );

    res.send(
      plainToInstance(GetUserDto, users, {
        excludeExtraneousValues: true,
      }),
    );
  }
}
