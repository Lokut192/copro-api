import 'dotenv/config';

import { NestFactory } from '@nestjs/core';

import { DatabaseSeederModule } from './database-seeder.module';
import { DatabaseSeederService } from './database-seeder.service';

async function bootstrap() {
  // Database seeder app
  const app = await NestFactory.create(DatabaseSeederModule);
  // Database seeder service
  const seederService = app.get(DatabaseSeederService);

  // Run database seeder
  await seederService.run();

  // Close database seeder app
  await app.close();
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
