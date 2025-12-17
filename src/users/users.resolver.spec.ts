import { Test, TestingModule } from '@nestjs/testing';

import { PaginationInput } from '../common/inputs/pagination.input';
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
    it('should return paginated users with default pagination when no input provided', async () => {
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

      const mockResult = {
        items: mockUsers,
        meta: {
          totalItems: 50,
          itemsReturned: 2,
          totalPages: 2,
          currentPage: 1,
          currentPageSize: 25,
        },
      };

      usersService.fetchAll.mockResolvedValue(mockResult);

      const result = await resolver.fetchAll();

      expect(usersService.fetchAll).toHaveBeenCalledWith({
        page: undefined,
        limit: undefined,
      });
      expect(result.items).toEqual(mockUsers);
      expect(result.meta).toEqual(mockResult.meta);
    });

    it('should pass pagination parameters when provided', async () => {
      const mockResult = {
        items: [],
        meta: {
          totalItems: 100,
          itemsReturned: 0,
          totalPages: 10,
          currentPage: 3,
          currentPageSize: 10,
        },
      };

      usersService.fetchAll.mockResolvedValue(mockResult);

      const pagination = new PaginationInput();
      pagination.page = 3;
      pagination.limit = 10;

      const result = await resolver.fetchAll(pagination);

      expect(usersService.fetchAll).toHaveBeenCalledWith({
        page: 3,
        limit: 10,
      });
      expect(result.meta).toEqual(mockResult.meta);
    });

    it('should return empty items when no users exist', async () => {
      const mockResult = {
        items: [],
        meta: {
          totalItems: 0,
          itemsReturned: 0,
          totalPages: 0,
          currentPage: 1,
          currentPageSize: 25,
        },
      };

      usersService.fetchAll.mockResolvedValue(mockResult);

      const result = await resolver.fetchAll();

      expect(usersService.fetchAll).toHaveBeenCalled();
      expect(result.items).toEqual([]);
      expect(result.meta.totalItems).toBe(0);
    });

    it('should handle service errors', async () => {
      const error = new Error('Database connection failed');
      usersService.fetchAll.mockRejectedValue(error);

      await expect(resolver.fetchAll()).rejects.toThrow(
        'Database connection failed',
      );
      expect(usersService.fetchAll).toHaveBeenCalled();
    });

    it('should reject limit exceeding maximum (101)', async () => {
      const pagination = new PaginationInput();
      pagination.page = 1;
      pagination.limit = 101;

      await expect(resolver.fetchAll(pagination)).rejects.toThrow(
        'Limit must be at most 100',
      );

      expect(usersService.fetchAll).not.toHaveBeenCalled();
    });

    it('should reject limit exceeding maximum (150)', async () => {
      const pagination = new PaginationInput();
      pagination.page = 1;
      pagination.limit = 150;

      await expect(resolver.fetchAll(pagination)).rejects.toThrow(
        'Limit must be at most 100',
      );

      expect(usersService.fetchAll).not.toHaveBeenCalled();
    });

    it('should reject limit below minimum (0)', async () => {
      const pagination = new PaginationInput();
      pagination.page = 1;
      pagination.limit = 0;

      await expect(resolver.fetchAll(pagination)).rejects.toThrow(
        'Limit must be at least 1',
      );

      expect(usersService.fetchAll).not.toHaveBeenCalled();
    });

    it('should reject page below minimum (0)', async () => {
      const pagination = new PaginationInput();
      pagination.page = 0;
      pagination.limit = 25;

      await expect(resolver.fetchAll(pagination)).rejects.toThrow(
        'Page must be at least 1',
      );

      expect(usersService.fetchAll).not.toHaveBeenCalled();
    });
  });
});
