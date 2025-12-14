import { Test, TestingModule } from '@nestjs/testing';

import { DatabaseSeederService } from './database-seeder.service';

describe('DatabaseSeederService', () => {
  let service: DatabaseSeederService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DatabaseSeederService],
    }).compile();

    service = module.get<DatabaseSeederService>(DatabaseSeederService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
