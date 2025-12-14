import { Test, TestingModule } from '@nestjs/testing';

import { HashingService } from './hashing.service';

describe('HashingService', () => {
  let service: HashingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HashingService],
    }).compile();

    service = module.get<HashingService>(HashingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('hashPassword', () => {
    it('should hash a password asynchronously', async () => {
      const password = 'testPassword123';
      const hash = await service.hashPassword(password);

      expect(hash).toBeDefined();
      expect(typeof hash).toBe('string');
      expect(hash).not.toBe(password);
      expect(hash).toMatch(/^\$2[aby]\$.{56}$/); // bcrypt hash pattern
    });

    it('should generate different hashes for the same password', async () => {
      const password = 'testPassword123';
      const hash1 = await service.hashPassword(password);
      const hash2 = await service.hashPassword(password);

      expect(hash1).not.toBe(hash2);
    });

    it('should hash empty string', async () => {
      const password = '';
      const hash = await service.hashPassword(password);

      expect(hash).toBeDefined();
      expect(typeof hash).toBe('string');
      expect(hash).toMatch(/^\$2[aby]\$.{56}$/);
    });

    it('should hash long passwords', async () => {
      const password = 'a'.repeat(100);
      const hash = await service.hashPassword(password);

      expect(hash).toBeDefined();
      expect(typeof hash).toBe('string');
      expect(hash).toMatch(/^\$2[aby]\$.{56}$/);
    });
  });

  describe('comparePasswords', () => {
    it('should return true for matching password and hash', async () => {
      const password = 'testPassword123';
      const hash = await service.hashPassword(password);
      const result = await service.comparePasswords(password, hash);

      expect(result).toBe(true);
    });

    it('should return false for non-matching password and hash', async () => {
      const password = 'testPassword123';
      const wrongPassword = 'wrongPassword';
      const hash = await service.hashPassword(password);
      const result = await service.comparePasswords(wrongPassword, hash);

      expect(result).toBe(false);
    });

    it('should return false for empty password against valid hash', async () => {
      const password = 'testPassword123';
      const hash = await service.hashPassword(password);
      const result = await service.comparePasswords('', hash);

      expect(result).toBe(false);
    });

    it('should handle case-sensitive password comparison', async () => {
      const password = 'TestPassword123';
      const hash = await service.hashPassword(password);
      const result = await service.comparePasswords('testpassword123', hash);

      expect(result).toBe(false);
    });
  });

  describe('hashPasswordSync', () => {
    it('should hash a password synchronously', () => {
      const password = 'testPassword123';
      const hash = service.hashPasswordSync(password);

      expect(hash).toBeDefined();
      expect(typeof hash).toBe('string');
      expect(hash).not.toBe(password);
      expect(hash).toMatch(/^\$2[aby]\$.{56}$/); // bcrypt hash pattern
    });

    it('should generate different hashes for the same password', () => {
      const password = 'testPassword123';
      const hash1 = service.hashPasswordSync(password);
      const hash2 = service.hashPasswordSync(password);

      expect(hash1).not.toBe(hash2);
    });

    it('should hash empty string', () => {
      const password = '';
      const hash = service.hashPasswordSync(password);

      expect(hash).toBeDefined();
      expect(typeof hash).toBe('string');
      expect(hash).toMatch(/^\$2[aby]\$.{56}$/);
    });

    it('should hash special characters', () => {
      const password = '!@#$%^&*()_+-=[]{}|;:,.<>?';
      const hash = service.hashPasswordSync(password);

      expect(hash).toBeDefined();
      expect(typeof hash).toBe('string');
      expect(hash).toMatch(/^\$2[aby]\$.{56}$/);
    });
  });

  describe('comparePasswordsSync', () => {
    it('should return true for matching password and hash', () => {
      const password = 'testPassword123';
      const hash = service.hashPasswordSync(password);
      const result = service.comparePasswordsSync(password, hash);

      expect(result).toBe(true);
    });

    it('should return false for non-matching password and hash', () => {
      const password = 'testPassword123';
      const wrongPassword = 'wrongPassword';
      const hash = service.hashPasswordSync(password);
      const result = service.comparePasswordsSync(wrongPassword, hash);

      expect(result).toBe(false);
    });

    it('should return false for empty password against valid hash', () => {
      const password = 'testPassword123';
      const hash = service.hashPasswordSync(password);
      const result = service.comparePasswordsSync('', hash);

      expect(result).toBe(false);
    });

    it('should handle special characters in password', () => {
      const password = 'Test!@#$123';
      const hash = service.hashPasswordSync(password);
      const result = service.comparePasswordsSync(password, hash);

      expect(result).toBe(true);
    });
  });

  describe('async vs sync methods', () => {
    it('should produce compatible hashes between async and sync methods', async () => {
      const password = 'testPassword123';
      const asyncHash = await service.hashPassword(password);
      const syncHash = service.hashPasswordSync(password);

      // Both hashes should be valid and comparable
      const asyncResult = await service.comparePasswords(password, asyncHash);
      const syncResult = service.comparePasswordsSync(password, syncHash);

      expect(asyncResult).toBe(true);
      expect(syncResult).toBe(true);
    });

    it('should allow async compare to verify sync hash', async () => {
      const password = 'testPassword123';
      const syncHash = service.hashPasswordSync(password);
      const result = await service.comparePasswords(password, syncHash);

      expect(result).toBe(true);
    });

    it('should allow sync compare to verify async hash', async () => {
      const password = 'testPassword123';
      const asyncHash = await service.hashPassword(password);
      const result = service.comparePasswordsSync(password, asyncHash);

      expect(result).toBe(true);
    });
  });

  describe('saltRounds', () => {
    it('should use saltRounds of 10', () => {
      expect(service['saltRounds']).toBe(10);
    });
  });
});
