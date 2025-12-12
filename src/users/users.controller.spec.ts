import { Test, TestingModule } from '@nestjs/testing';

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
    it('should return all users as GetUserDto instances', async () => {
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

      const result = await controller.fetchAll();

      expect(usersService.fetchAll).toHaveBeenCalled();
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: 1,
        fullName: 'John Doe',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
      });
      expect(result[1]).toEqual({
        id: 2,
        fullName: 'Jane Smith',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
      });
    });

    it('should return empty array when no users exist', async () => {
      usersService.fetchAll.mockResolvedValue([]);

      const result = await controller.fetchAll();

      expect(usersService.fetchAll).toHaveBeenCalled();
      expect(result).toEqual([]);
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

      usersService.fetchAll.mockResolvedValue(mockUsers);

      const result = await controller.fetchAll();

      expect(result[0]).toEqual({
        id: 1,
        fullName: 'John Doe',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
      });
      expect(result[0]).not.toHaveProperty('password');
      expect(result[0]).not.toHaveProperty('someOtherField');
    });
  });
});
