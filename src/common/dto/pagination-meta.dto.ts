import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class PaginationMetaDto {
  @ApiProperty({
    description: 'Total number of items',
    example: 150,
  })
  @Expose()
  totalItems: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 6,
  })
  @Expose()
  totalPages: number;

  @ApiProperty({
    description: 'Current page number',
    example: 1,
  })
  @Expose()
  currentPage: number;

  @ApiProperty({
    description: 'Number of items returned in this page',
    example: 25,
  })
  @Expose()
  currentPageSize: number;
}
