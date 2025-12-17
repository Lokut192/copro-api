import { QueryOrder } from '@mikro-orm/core';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { Test, TestingModule } from '@nestjs/testing';

import { User } from './entities/user.entity';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: {
    findAndCount: jest.Mock;
  };

  beforeEach(async () => {
    const mockUserRepository = {
      findAndCount: jest.fn(),
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

      userRepository.findAndCount.mockResolvedValue([mockUsers, 100]);

      const result = await service.fetchAll();

      expect(userRepository.findAndCount).toHaveBeenCalledWith(
        {},
        { offset: 0, limit: 25, orderBy: { lastName: QueryOrder.ASC } },
      );
      expect(result.items).toEqual(mockUsers);
      expect(result.meta).toEqual({
        totalItems: 100,
        totalPages: 4,
        currentPage: 1,
        currentPageSize: 2,
      });
    });

    it('should calculate correct offset for page 2', async () => {
      const mockUsers = [
        {
          id: 3,
          fullName: 'Bob Johnson',
          firstName: 'Bob',
          lastName: 'Johnson',
          email: 'bob@example.com',
        },
      ] as User[];

      userRepository.findAndCount.mockResolvedValue([mockUsers, 100]);

      const result = await service.fetchAll({ page: 2, limit: 10 });

      expect(userRepository.findAndCount).toHaveBeenCalledWith(
        {},
        { offset: 10, limit: 10, orderBy: { lastName: QueryOrder.ASC } },
      );
      expect(result.meta).toEqual({
        totalItems: 100,
        totalPages: 10,
        currentPage: 2,
        currentPageSize: 1,
      });
    });

    it('should handle empty results', async () => {
      userRepository.findAndCount.mockResolvedValue([[], 0]);

      const result = await service.fetchAll();

      expect(result.items).toEqual([]);
      expect(result.meta).toEqual({
        totalItems: 0,
        totalPages: 0,
        currentPage: 1,
        currentPageSize: 0,
      });
    });

    it('should calculate total pages correctly', async () => {
      userRepository.findAndCount.mockResolvedValue([[], 47]);

      const result = await service.fetchAll({ limit: 10 });

      expect(result.meta.totalPages).toBe(5); // Math.ceil(47 / 10)
    });

    it('should use custom page and limit values', async () => {
      const mockUsers = [] as User[];
      userRepository.findAndCount.mockResolvedValue([mockUsers, 50]);

      await service.fetchAll({ page: 3, limit: 50 });

      expect(userRepository.findAndCount).toHaveBeenCalledWith(
        {},
        { offset: 100, limit: 50, orderBy: { lastName: QueryOrder.ASC } },
      );
    });

    it('should order by lastName ascending by default', async () => {
      const mockUsers = [] as User[];
      userRepository.findAndCount.mockResolvedValue([mockUsers, 0]);

      await service.fetchAll({});

      expect(userRepository.findAndCount).toHaveBeenCalledWith(
        {},
        expect.objectContaining({
          orderBy: { lastName: QueryOrder.ASC },
        }),
      );
    });

    it('should order by firstName descending', async () => {
      const mockUsers = [] as User[];
      userRepository.findAndCount.mockResolvedValue([mockUsers, 0]);

      await service.fetchAll({ orderBy: 'firstName', order: 'DESC' });

      expect(userRepository.findAndCount).toHaveBeenCalledWith(
        {},
        expect.objectContaining({
          orderBy: { firstName: QueryOrder.DESC },
        }),
      );
    });

    it('should order by lastName ascending', async () => {
      const mockUsers = [] as User[];
      userRepository.findAndCount.mockResolvedValue([mockUsers, 0]);

      await service.fetchAll({ orderBy: 'lastName', order: 'ASC' });

      expect(userRepository.findAndCount).toHaveBeenCalledWith(
        {},
        expect.objectContaining({
          orderBy: { lastName: QueryOrder.ASC },
        }),
      );
    });

    it('should order by email descending', async () => {
      const mockUsers = [] as User[];
      userRepository.findAndCount.mockResolvedValue([mockUsers, 0]);

      await service.fetchAll({ orderBy: 'email', order: 'DESC' });

      expect(userRepository.findAndCount).toHaveBeenCalledWith(
        {},
        expect.objectContaining({
          orderBy: { email: QueryOrder.DESC },
        }),
      );
    });

    it('should combine pagination and ordering', async () => {
      const mockUsers = [] as User[];
      userRepository.findAndCount.mockResolvedValue([mockUsers, 50]);

      await service.fetchAll({
        page: 2,
        limit: 10,
        orderBy: 'email',
        order: 'ASC',
      });

      expect(userRepository.findAndCount).toHaveBeenCalledWith(
        {},
        {
          offset: 10,
          limit: 10,
          orderBy: { email: QueryOrder.ASC },
        },
      );
    });
  });
});
