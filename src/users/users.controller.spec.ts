import { Test, TestingModule } from '@nestjs/testing';

import { paginationQuerySchema } from '../common';
import { User } from './entities/user.entity';
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
          itemsReturned: 2,
          totalPages: 2,
          currentPage: 1,
          currentPageSize: 25,
        },
      };

      usersService.fetchAll.mockResolvedValue(mockResult);

      const result = await controller.fetchAll({});

      expect(usersService.fetchAll).toHaveBeenCalledWith({
        page: undefined,
        limit: undefined,
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
          itemsReturned: 0,
          totalPages: 10,
          currentPage: 2,
          currentPageSize: 10,
        },
      };

      usersService.fetchAll.mockResolvedValue(mockResult);

      const query = { page: 2, limit: 10 };
      const result = await controller.fetchAll(query);

      expect(usersService.fetchAll).toHaveBeenCalledWith({
        page: 2,
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

      const result = await controller.fetchAll({});

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
          itemsReturned: 1,
          totalPages: 1,
          currentPage: 1,
          currentPageSize: 25,
        },
      };

      usersService.fetchAll.mockResolvedValue(mockResult);

      const result = await controller.fetchAll({});

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
      const result = paginationQuerySchema.safeParse({ page: 1, limit: 101 });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain(
          'Limit must be at most 100',
        );
      }
    });

    it('should reject requests with limit exceeding maximum (150)', () => {
      const result = paginationQuerySchema.safeParse({ page: 1, limit: 150 });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain(
          'Limit must be at most 100',
        );
      }
    });
  });
});
