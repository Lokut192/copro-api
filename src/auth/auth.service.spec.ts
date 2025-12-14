import { Test, TestingModule } from '@nestjs/testing';
import { HashingService } from 'src/helpers';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let hashingService: HashingService;

  const mockHashingService = {
    hashPassword: jest.fn(),
    comparePasswords: jest.fn(),
    hashPasswordSync: jest.fn(),
    comparePasswordsSync: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: HashingService,
          useValue: mockHashingService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    hashingService = module.get<HashingService>(HashingService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should have hashingService injected', () => {
    expect(hashingService).toBeDefined();
    expect(hashingService).toBe(mockHashingService);
  });

  describe('logger', () => {
    it('should have a logger instance', () => {
      expect(service['logger']).toBeDefined();
      expect(service['logger'].constructor.name).toBe('Logger');
    });
  });
});
