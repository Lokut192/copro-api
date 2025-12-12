import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { User } from './entities/user.entity';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: {
    findAll: jest.Mock;
  };

  beforeEach(async () => {
    const mockUserRepository = {
      findAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('fetchAll', () => {
    it('should return all users from the repository', async () => {
      const mockUsers = [
        {
          id: 1,
          fullName: 'John Doe',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
        },
        {
          id: 2,
          fullName: 'Jane Smith',
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane@example.com',
        },
      ] as User[];

      userRepository.findAll.mockResolvedValue(mockUsers);

      const result = await service.fetchAll();

      expect(userRepository.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockUsers);
    });

    it('should return empty array when no users exist', async () => {
      userRepository.findAll.mockResolvedValue([]);

      const result = await service.fetchAll();

      expect(userRepository.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
    });
  });
});
