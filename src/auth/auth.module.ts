import { Module } from '@nestjs/common';
import { HashingService } from 'src/helpers';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [],
  exports: [AuthService],
  providers: [AuthService, HashingService],
  controllers: [AuthController],
})
export class AuthModule {}
