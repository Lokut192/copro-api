import { GoneException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { HashingService } from 'src/helpers';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  const mockHashingService = {
    hashPassword: jest.fn(),
  };

  const mockAuthService = {
    // Add mock methods when AuthService has methods
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: HashingService,
          useValue: mockHashingService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('hasPassword', () => {
    const validDto = { password: 'testPassword123' };
    const mockHash =
      '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy';

    describe('in development environment', () => {
      beforeEach(async () => {
        mockConfigService.get.mockReturnValue('development');
        // Re-instantiate controller with development environment
        const module = await Test.createTestingModule({
          controllers: [AuthController],
          providers: [
            { provide: AuthService, useValue: mockAuthService },
            { provide: HashingService, useValue: mockHashingService },
            { provide: ConfigService, useValue: mockConfigService },
          ],
        }).compile();

        controller = module.get<AuthController>(AuthController);
      });

      it('should hash password successfully', async () => {
        mockHashingService.hashPassword.mockResolvedValue(mockHash);

        const result = await controller.hasPassword(validDto);

        expect(mockHashingService.hashPassword).toHaveBeenCalledWith(
          validDto.password,
        );
        expect(mockHashingService.hashPassword).toHaveBeenCalledTimes(1);
        expect(result).toEqual({ hash: mockHash });
      });

      it('should handle hashing service errors', async () => {
        const error = new Error('Hashing failed');
        mockHashingService.hashPassword.mockRejectedValue(error);

        await expect(controller.hasPassword(validDto)).rejects.toThrow(
          'Hashing failed',
        );
        expect(mockHashingService.hashPassword).toHaveBeenCalledWith(
          validDto.password,
        );
      });
    });

    describe('in test environment', () => {
      beforeEach(async () => {
        mockConfigService.get.mockReturnValue('test');
        const module = await Test.createTestingModule({
          controllers: [AuthController],
          providers: [
            { provide: AuthService, useValue: mockAuthService },
            { provide: HashingService, useValue: mockHashingService },
            { provide: ConfigService, useValue: mockConfigService },
          ],
        }).compile();

        controller = module.get<AuthController>(AuthController);
      });

      it('should hash password successfully', async () => {
        mockHashingService.hashPassword.mockResolvedValue(mockHash);

        const result = await controller.hasPassword(validDto);

        expect(mockHashingService.hashPassword).toHaveBeenCalledWith(
          validDto.password,
        );
        expect(result).toEqual({ hash: mockHash });
      });
    });

    describe('in production environment', () => {
      beforeEach(async () => {
        mockConfigService.get.mockReturnValue('production');
        const module = await Test.createTestingModule({
          controllers: [AuthController],
          providers: [
            { provide: AuthService, useValue: mockAuthService },
            { provide: HashingService, useValue: mockHashingService },
            { provide: ConfigService, useValue: mockConfigService },
          ],
        }).compile();

        controller = module.get<AuthController>(AuthController);
      });

      it('should throw GoneException', async () => {
        await expect(controller.hasPassword(validDto)).rejects.toThrow(
          GoneException,
        );
        expect(mockHashingService.hashPassword).not.toHaveBeenCalled();
      });
    });

    describe('in staging environment', () => {
      beforeEach(async () => {
        mockConfigService.get.mockReturnValue('staging');
        const module = await Test.createTestingModule({
          controllers: [AuthController],
          providers: [
            { provide: AuthService, useValue: mockAuthService },
            { provide: HashingService, useValue: mockHashingService },
            { provide: ConfigService, useValue: mockConfigService },
          ],
        }).compile();

        controller = module.get<AuthController>(AuthController);
      });

      it('should throw GoneException', async () => {
        await expect(controller.hasPassword(validDto)).rejects.toThrow(
          GoneException,
        );
        expect(mockHashingService.hashPassword).not.toHaveBeenCalled();
      });
    });

    describe('when NODE_ENV is undefined', () => {
      beforeEach(async () => {
        mockConfigService.get.mockReturnValue(undefined);
        const module = await Test.createTestingModule({
          controllers: [AuthController],
          providers: [
            { provide: AuthService, useValue: mockAuthService },
            { provide: HashingService, useValue: mockHashingService },
            { provide: ConfigService, useValue: mockConfigService },
          ],
        }).compile();

        controller = module.get<AuthController>(AuthController);
      });

      it('should throw GoneException (defaults to production)', async () => {
        await expect(controller.hasPassword(validDto)).rejects.toThrow(
          GoneException,
        );
        expect(mockHashingService.hashPassword).not.toHaveBeenCalled();
      });
    });
  });
});
