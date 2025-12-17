import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

import type { PaginationQuery } from '../common';
import { paginationQuerySchema, ZodValidationPipe } from '../common';
import { GetUserDto } from './dto/get-user.dto';
import { PaginatedUsersDto } from './dto/paginated-users.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller({
  path: 'users',
  version: '1',
})
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Fetch all users with pagination' })
  @ApiOkResponse({
    description: 'Paginated list of users',
    type: PaginatedUsersDto,
  })
  async fetchAll(
    @Query(new ZodValidationPipe(paginationQuerySchema))
    query: PaginationQuery,
  ) {
    const { page, limit } = query;
    const result = await this.usersService.fetchAll({ page, limit });

    return plainToInstance(
      PaginatedUsersDto,
      {
        items: plainToInstance(GetUserDto, result.items, {
          excludeExtraneousValues: true,
        }),
        meta: result.meta,
      },
      { excludeExtraneousValues: true },
    );
  }
}
