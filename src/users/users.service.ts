import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable, Logger } from '@nestjs/common';

import {
  calculateOffset,
  createPaginatedResponse,
  PaginatedResult,
  PAGINATION_DEFAULTS,
} from '../common';
import { User } from './entities/user.entity';

export interface FetchAllUsersOptions {
  page?: number;
  limit?: number;
}

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
  ) {}

  async fetchAll(
    options: FetchAllUsersOptions = {},
  ): Promise<PaginatedResult<User>> {
    const {
      page = PAGINATION_DEFAULTS.PAGE,
      limit = PAGINATION_DEFAULTS.LIMIT,
    } = options;
    const offset = calculateOffset(page, limit);

    const [items, totalItems] = await this.userRepository.findAndCount(
      {},
      { offset, limit },
    );

    return createPaginatedResponse(items, totalItems, page, limit);
  }
}
