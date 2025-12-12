import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

export class GetUserDto {
  @ApiProperty({
    description: 'The unique identifier of the user',
    example: 1,
  })
  @Expose()
  id: number;

  @ApiProperty({
    description: 'The full name of the user',
    example: 'John Doe',
  })
  @Expose()
  fullName: string;

  @ApiProperty({
    description: 'The first name of the user',
    example: 'John',
  })
  @Expose()
  firstName: string;

  @ApiProperty({
    description: 'The last name of the user',
    example: 'Doe',
  })
  @Expose()
  lastName: string;

  @ApiProperty({
    description: 'The email address of the user',
    example: 'john.doe@example.com',
  })
  @Expose()
  email: string;
}
