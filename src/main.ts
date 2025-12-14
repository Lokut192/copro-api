import 'dotenv/config';

import { HttpStatus, Logger, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { DatabaseSeederService } from './helpers/database-seeder/database-seeder.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['debug', 'log', 'warn', 'error', 'verbose', 'fatal'],
  });

  // Logger
  const logger = new Logger('App');

  // Application port
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;

  // Seeding
  const seed = configService.get<string>('DB_SEED', '0') === '1';

  if (seed) {
    logger.log('Seeding database...');
    const seederService = app.get(DatabaseSeederService);
    await seederService.run();
    logger.log('Database seeded!');
  }

  // CORS rules
  app.enableCors({
    origin: '*',
    methods: '*',
    allowedHeaders: '*',
    exposedHeaders: '*',
    credentials: true,
  });

  // Versioning
  app.enableVersioning({ type: VersioningType.URI });

  // Swagger
  const v1DocumentConfig = new DocumentBuilder()
    .setTitle('Copro API')
    .setDescription('The Copro API endpoints')
    .setVersion('1.0')
    .addServer(`http://localhost:${port}`)
    // .addBearerAuth()
    .addGlobalResponse(
      {
        status: HttpStatus.UNAUTHORIZED,
        description: 'User is not authenticated or token is invalid / expired',
      },
      {
        status: HttpStatus.FORBIDDEN,
        description: 'Logged user is not allowed to access this resource',
      },
      {
        status: HttpStatus.NOT_FOUND,
        description: 'Resource not found',
      },
    )
    .build();
  const v1DocumentFactory = () =>
    SwaggerModule.createDocument(app, v1DocumentConfig);
  SwaggerModule.setup('swagger-v1', app, v1DocumentFactory, {
    swaggerOptions: { persistAuthorization: true },
    jsonDocumentUrl: '/swagger-v1.json',
    yamlDocumentUrl: '/swagger-v1.yaml',
  });

  await app.listen(port ?? 3000);

  logger.log(`Node env: ${process.env.NODE_ENV}`);
  logger.log(`🚀 Server running on port ${port}`);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
