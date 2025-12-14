import {
  Body,
  Controller,
  GoneException,
  Inject,
  Logger,
  Post,
  UsePipes,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiGoneResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ZodValidationPipe } from 'src/common';
import { HashingService } from 'src/helpers';

import { AuthService } from './auth.service';
import {
  type HashPasswordDto,
  HashPasswordSchema,
} from './dto/hash-password.dto';

@Controller({
  path: 'auth',
  version: '1',
})
@ApiTags('Auth')
export class AuthController {
  private readonly environment: string = 'production';

  private readonly logger = new Logger(AuthController.name);

  constructor(
    @Inject()
    private readonly authService: AuthService,
    @Inject()
    private readonly hashingService: HashingService,
    @Inject()
    private readonly configService: ConfigService,
  ) {
    this.environment =
      this.configService.get<string>('NODE_ENV') ?? 'production';
  }

  @Post('hash/password')
  @UsePipes(new ZodValidationPipe(HashPasswordSchema))
  @ApiOperation({
    summary: 'Hash a password',
    description:
      'Development/test only endpoint to hash a password using bcrypt. Returns a 410 Gone error in production.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        password: {
          type: 'string',
          example: 'mySecurePassword123',
          description: 'The password to hash',
        },
      },
      required: ['password'],
    },
  })
  @ApiOkResponse({
    description: 'Password successfully hashed',
    schema: {
      type: 'object',
      properties: {
        hash: {
          type: 'string',
          example:
            '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
          description: 'The bcrypt hash of the password',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Validation failed - invalid request body',
  })
  @ApiGoneResponse({
    description: 'Endpoint not available in production environment',
  })
  async hasPassword(@Body() dto: HashPasswordDto) {
    if (this.environment !== 'development' && this.environment !== 'test') {
      throw new GoneException();
    }

    const hash = await this.hashingService.hashPassword(dto.password);

    return { hash };
  }
}
