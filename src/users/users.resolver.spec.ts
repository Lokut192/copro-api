import { Test, TestingModule } from '@nestjs/testing';

import { User } from './entities/user.entity';
import {
  FetchAllUsersInput,
  OrderDirection,
  UserOrderByField,
} from './inputs/fetch-all-users.input';
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
        orderBy: undefined,
        order: undefined,
      });
      expect(result.items).toEqual(mockUsers);
      expect(result.meta).toEqual(mockResult.meta);
    });

    it('should pass pagination parameters when provided', async () => {
      const mockResult = {
        items: [],
        meta: {
          totalItems: 100,
          totalPages: 10,
          currentPage: 3,
          currentPageSize: 10,
        },
      };

      usersService.fetchAll.mockResolvedValue(mockResult);

      const input = new FetchAllUsersInput();
      input.page = 3;
      input.limit = 10;

      const result = await resolver.fetchAll(input);

      expect(usersService.fetchAll).toHaveBeenCalledWith({
        page: 3,
        limit: 10,
        orderBy: UserOrderByField.LAST_NAME,
        order: OrderDirection.ASC,
      });
      expect(result.meta).toEqual(mockResult.meta);
    });

    it('should return empty items when no users exist', async () => {
      const mockResult = {
        items: [],
        meta: {
          totalItems: 0,
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
      const input = new FetchAllUsersInput();
      input.page = 1;
      input.limit = 101;

      await expect(resolver.fetchAll(input)).rejects.toThrow(
        'Limit must be at most 100',
      );

      expect(usersService.fetchAll).not.toHaveBeenCalled();
    });

    it('should reject limit exceeding maximum (150)', async () => {
      const input = new FetchAllUsersInput();
      input.page = 1;
      input.limit = 150;

      await expect(resolver.fetchAll(input)).rejects.toThrow(
        'Limit must be at most 100',
      );

      expect(usersService.fetchAll).not.toHaveBeenCalled();
    });

    it('should reject limit below minimum (0)', async () => {
      const input = new FetchAllUsersInput();
      input.page = 1;
      input.limit = 0;

      await expect(resolver.fetchAll(input)).rejects.toThrow(
        'Limit must be at least 1',
      );

      expect(usersService.fetchAll).not.toHaveBeenCalled();
    });

    it('should reject page below minimum (0)', async () => {
      const input = new FetchAllUsersInput();
      input.page = 0;
      input.limit = 25;

      await expect(resolver.fetchAll(input)).rejects.toThrow(
        'Page must be at least 1',
      );

      expect(usersService.fetchAll).not.toHaveBeenCalled();
    });

    it('should pass ordering parameters with default values', async () => {
      const mockResult = {
        items: [],
        meta: {
          totalItems: 0,
          totalPages: 0,
          currentPage: 1,
          currentPageSize: 0,
        },
      };

      usersService.fetchAll.mockResolvedValue(mockResult);

      const input = new FetchAllUsersInput();

      await resolver.fetchAll(input);

      expect(usersService.fetchAll).toHaveBeenCalledWith({
        page: 1,
        limit: 25,
        orderBy: UserOrderByField.LAST_NAME,
        order: OrderDirection.ASC,
      });
    });

    it('should order by email descending', async () => {
      const mockResult = {
        items: [],
        meta: {
          totalItems: 0,
          totalPages: 0,
          currentPage: 1,
          currentPageSize: 0,
        },
      };

      usersService.fetchAll.mockResolvedValue(mockResult);

      const input = new FetchAllUsersInput();
      input.orderBy = UserOrderByField.EMAIL;
      input.order = OrderDirection.DESC;

      await resolver.fetchAll(input);

      expect(usersService.fetchAll).toHaveBeenCalledWith({
        page: 1,
        limit: 25,
        orderBy: UserOrderByField.EMAIL,
        order: OrderDirection.DESC,
      });
    });

    it('should order by firstName ascending', async () => {
      const mockResult = {
        items: [],
        meta: {
          totalItems: 0,
          totalPages: 0,
          currentPage: 1,
          currentPageSize: 0,
        },
      };

      usersService.fetchAll.mockResolvedValue(mockResult);

      const input = new FetchAllUsersInput();
      input.orderBy = UserOrderByField.FIRST_NAME;
      input.order = OrderDirection.ASC;

      await resolver.fetchAll(input);

      expect(usersService.fetchAll).toHaveBeenCalledWith({
        page: 1,
        limit: 25,
        orderBy: UserOrderByField.FIRST_NAME,
        order: OrderDirection.ASC,
      });
    });

    it('should combine pagination and ordering parameters', async () => {
      const mockResult = {
        items: [],
        meta: {
          totalItems: 50,
          totalPages: 5,
          currentPage: 2,
          currentPageSize: 10,
        },
      };

      usersService.fetchAll.mockResolvedValue(mockResult);

      const input = new FetchAllUsersInput();
      input.page = 2;
      input.limit = 10;
      input.orderBy = UserOrderByField.LAST_NAME;
      input.order = OrderDirection.DESC;

      await resolver.fetchAll(input);

      expect(usersService.fetchAll).toHaveBeenCalledWith({
        page: 2,
        limit: 10,
        orderBy: UserOrderByField.LAST_NAME,
        order: OrderDirection.DESC,
      });
    });
  });
});
