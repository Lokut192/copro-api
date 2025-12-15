import { Test, TestingModule } from '@nestjs/testing';

import { User } from './entities/user.entity';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

describe('UsersResolver', () => {
  let resolver: UsersResolver;
  let usersService: {
    fetchAll: jest.Mock;
  };

  beforeEach(async () => {
    const mockUsersService = {
      fetchAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersResolver,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    resolver = module.get<UsersResolver>(UsersResolver);
    usersService = module.get(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('fetchAll', () => {
    it('should return all users', async () => {
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

      usersService.fetchAll.mockResolvedValue(mockUsers);

      const result = await resolver.fetchAll();

      expect(usersService.fetchAll).toHaveBeenCalled();
      expect(result).toHaveLength(2);
      expect(result).toEqual(mockUsers);
    });

    it('should return empty array when no users exist', async () => {
      usersService.fetchAll.mockResolvedValue([]);

      const result = await resolver.fetchAll();

      expect(usersService.fetchAll).toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    it('should handle service errors', async () => {
      const error = new Error('Database connection failed');
      usersService.fetchAll.mockRejectedValue(error);

      await expect(resolver.fetchAll()).rejects.toThrow(
        'Database connection failed',
      );
      expect(usersService.fetchAll).toHaveBeenCalled();
    });
  });
});
