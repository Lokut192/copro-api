import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

import { PaginationMetaDto } from '../../common/dto/pagination-meta.dto';
import { GetUserDto } from './get-user.dto';

export class PaginatedUsersDto {
  @ApiProperty({
    description: 'List of users',
    type: [GetUserDto],
  })
  @Expose()
  @Type(() => GetUserDto)
  items: GetUserDto[];

  @ApiProperty({
    description: 'Pagination metadata',
    type: PaginationMetaDto,
  })
  @Expose()
  @Type(() => PaginationMetaDto)
  meta: PaginationMetaDto;
}
