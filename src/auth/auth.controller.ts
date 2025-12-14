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
  async hasPassword(@Body() dto: HashPasswordDto) {
    if (this.environment !== 'development' && this.environment !== 'test') {
      throw new GoneException();
    }

    this.logger.log(`Hash password body: ${JSON.stringify(dto)}`);

    const hash = await this.hashingService.hashPassword(dto.password);

    return { hash };
  }
}
