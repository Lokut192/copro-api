import { EntityManager } from '@mikro-orm/postgresql';
import { Test, TestingModule } from '@nestjs/testing';

import { DatabaseSeederService } from './database-seeder.service';

describe('DatabaseSeederService', () => {
  let service: DatabaseSeederService;
  let entityManager: EntityManager;

  const mockEntityManager = {
    fork: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    flush: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DatabaseSeederService,
        {
          provide: EntityManager,
          useValue: mockEntityManager,
        },
      ],
    }).compile();

    service = module.get<DatabaseSeederService>(DatabaseSeederService);
    entityManager = module.get<EntityManager>(EntityManager);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should have entityManager injected', () => {
    expect(entityManager).toBeDefined();
    expect(entityManager).toBe(mockEntityManager);
  });

  describe('logger', () => {
    it('should have a logger instance', () => {
      expect(service['logger']).toBeDefined();
      expect(service['logger'].constructor.name).toBe('Logger');
    });
  });
});
