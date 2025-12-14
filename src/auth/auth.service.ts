import { Injectable, Logger } from '@nestjs/common';
import { HashingService } from 'src/helpers';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private readonly hashingService: HashingService) {}
}
