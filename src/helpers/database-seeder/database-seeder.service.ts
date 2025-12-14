import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as Papa from 'papaparse';
import * as path from 'path';
import { User } from 'src/users/entities/user.entity';

interface UserCsvRow {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

@Injectable()
export class DatabaseSeederService {
  private readonly logger = new Logger(DatabaseSeederService.name);

  constructor(private readonly em: EntityManager) {}

  public async run() {
    // Fork the EntityManager to create a context-specific instance
    const em = this.em.fork();

    this.logger.log('Starting database seeding...');

    // Seed users from CSV
    await this.seedUsers(em);

    this.logger.log('Database seeding completed!');
  }

  private async seedUsers(em: EntityManager): Promise<void> {
    this.logger.log('Seeding users from CSV...');

    // Path to CSV file - resolve from project root to work in both dev and prod
    const csvPath = path.join(
      process.cwd(),
      'src',
      'helpers',
      'database-seeder',
      'fixtures',
      'users.csv',
    );

    // Check if file exists
    if (!fs.existsSync(csvPath)) {
      this.logger.warn(`CSV file not found at ${csvPath}`);
      return;
    }

    // Read CSV file
    const csvContent = fs.readFileSync(csvPath, 'utf-8');

    // Parse CSV
    const parseResult = Papa.parse<UserCsvRow>(csvContent, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(),
      transform: (value) => value.trim(),
    });

    if (parseResult.errors.length > 0) {
      this.logger.error('CSV parsing errors:', parseResult.errors);
      return;
    }

    this.logger.log(`Found ${parseResult.data.length} users in CSV`);

    // Optimization: Fetch all existing emails in a single query
    const csvEmails = parseResult.data.map((row) => row.email);
    const existingUsers = await em.find(User, { email: { $in: csvEmails } });
    const existingEmailsSet = new Set(existingUsers.map((user) => user.email));

    this.logger.log(
      `Found ${existingEmailsSet.size} existing users in database`,
    );

    // Filter only non-existent users
    const newUsers = parseResult.data.filter(
      (row) => !existingEmailsSet.has(row.email),
    );

    this.logger.log(`${newUsers.length} new users to create`);

    // Process each new user
    for (const row of newUsers) {
      // Create new user
      em.create(User, {
        firstName: row.firstName,
        lastName: row.lastName,
        email: row.email,
        password: row.password,
      });

      this.logger.verbose(`Created user: ${row.email}`);
    }

    // Persist all users in a single transaction
    await em.flush();

    const skipped = parseResult.data.length - newUsers.length;
    this.logger.log(
      `Users seeding completed: ${newUsers.length} created, ${skipped} skipped`,
    );
  }
}
