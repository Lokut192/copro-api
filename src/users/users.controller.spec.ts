import { Test, TestingModule } from '@nestjs/testing';

import { User } from './entities/user.entity';
import {
  FetchAllUsersQuery,
  fetchAllUsersQuerySchema,
} from './schemas/fetch-all-users-query.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: {
    fetchAll: jest.Mock;
  };

  beforeEach(async () => {
    const mockUsersService = {
      fetchAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('fetchAll', () => {
    it('should return paginated users with default pagination', async () => {
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

      const result = await controller.fetchAll({} as FetchAllUsersQuery);

      expect(usersService.fetchAll).toHaveBeenCalledWith({
        page: undefined,
        limit: undefined,
        orderBy: undefined,
        order: undefined,
      });
      expect(result.items).toHaveLength(2);
      expect(result.meta).toEqual(mockResult.meta);
      expect(result.items[0]).toEqual({
        id: 1,
        fullName: 'John Doe',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
      });
    });

    it('should pass custom pagination parameters', async () => {
      const mockResult = {
        items: [],
        meta: {
          totalItems: 100,
          totalPages: 10,
          currentPage: 2,
          currentPageSize: 10,
        },
      };

      usersService.fetchAll.mockResolvedValue(mockResult);

      const query = { page: 2, limit: 10 } as FetchAllUsersQuery;
      const result = await controller.fetchAll(query);

      expect(usersService.fetchAll).toHaveBeenCalledWith({
        page: 2,
        limit: 10,
        orderBy: undefined,
        order: undefined,
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

      const result = await controller.fetchAll({} as FetchAllUsersQuery);

      expect(usersService.fetchAll).toHaveBeenCalled();
      expect(result.items).toEqual([]);
      expect(result.meta.totalItems).toBe(0);
    });

    it('should exclude extraneous values from response', async () => {
      const mockUsers = [
        {
          id: 1,
          fullName: 'John Doe',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          password: 'secret123',
          someOtherField: 'value',
        } as unknown as User,
      ];

      const mockResult = {
        items: mockUsers,
        meta: {
          totalItems: 1,
          totalPages: 1,
          currentPage: 1,
          currentPageSize: 25,
        },
      };

      usersService.fetchAll.mockResolvedValue(mockResult);

      const result = await controller.fetchAll({} as FetchAllUsersQuery);

      expect(result.items[0]).toEqual({
        id: 1,
        fullName: 'John Doe',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
      });
      expect(result.items[0]).not.toHaveProperty('password');
      expect(result.items[0]).not.toHaveProperty('someOtherField');
    });

    it('should reject requests with limit exceeding maximum (101)', () => {
      const result = fetchAllUsersQuerySchema.safeParse({
        page: 1,
        limit: 101,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain(
          'Limit must be at most 100',
        );
      }
    });

    it('should reject requests with limit exceeding maximum (150)', () => {
      const result = fetchAllUsersQuerySchema.safeParse({
        page: 1,
        limit: 150,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain(
          'Limit must be at most 100',
        );
      }
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

      const query = {} as FetchAllUsersQuery;
      await controller.fetchAll(query);

      expect(usersService.fetchAll).toHaveBeenCalledWith({
        page: undefined,
        limit: undefined,
        orderBy: undefined,
        order: undefined,
      });
    });

    it('should order by lastName descending', async () => {
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

      const query = {
        orderBy: 'lastName',
        order: 'DESC',
      } as FetchAllUsersQuery;
      await controller.fetchAll(query);

      expect(usersService.fetchAll).toHaveBeenCalledWith({
        page: undefined,
        limit: undefined,
        orderBy: 'lastName',
        order: 'DESC',
      });
    });

    it('should order by email ascending', async () => {
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

      const query = { orderBy: 'email', order: 'ASC' } as FetchAllUsersQuery;
      await controller.fetchAll(query);

      expect(usersService.fetchAll).toHaveBeenCalledWith({
        page: undefined,
        limit: undefined,
        orderBy: 'email',
        order: 'ASC',
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

      const query = {
        page: 2,
        limit: 10,
        orderBy: 'firstName',
        order: 'DESC',
      } as FetchAllUsersQuery;
      await controller.fetchAll(query);

      expect(usersService.fetchAll).toHaveBeenCalledWith({
        page: 2,
        limit: 10,
        orderBy: 'firstName',
        order: 'DESC',
      });
    });

    it('should reject invalid orderBy field', () => {
      const result = fetchAllUsersQuerySchema.safeParse({
        orderBy: 'fullName',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain(
          'Please provide a valid orderBy field',
        );
      }
    });

    it('should use default orderBy value (lastName)', () => {
      const result = fetchAllUsersQuerySchema.safeParse({});

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.orderBy).toBe('lastName');
      }
    });

    it('should use default order value (ASC)', () => {
      const result = fetchAllUsersQuerySchema.safeParse({});

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.order).toBe('ASC');
      }
    });
  });
});
