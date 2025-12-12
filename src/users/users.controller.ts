import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { plainToInstance } from 'class-transformer';
import { GetUserDto } from './dto/get-user.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Fetch all users' })
  @ApiOkResponse({
    description: 'List of all users',
    type: [GetUserDto],
  })
  async fetchAll() {
    const users = await this.usersService.fetchAll();

    return plainToInstance(GetUserDto, users, {
      excludeExtraneousValues: true,
    });
  }
}
