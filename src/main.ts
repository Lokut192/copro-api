import 'dotenv/config';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpStatus, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['debug', 'log', 'warn', 'error', 'verbose', 'fatal'],
  });

  // Logger
  const logger = new Logger('App');

  // Application port
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;

  // CORS rules
  app.enableCors({
    origin: '*',
    methods: '*',
    allowedHeaders: '*',
    exposedHeaders: '*',
    credentials: true,
  });

  // Swagger
  const documentConfig = new DocumentBuilder()
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
  const documentFactory = () =>
    SwaggerModule.createDocument(app, documentConfig);
  SwaggerModule.setup('swagger', app, documentFactory, {
    swaggerOptions: { persistAuthorization: true },
    jsonDocumentUrl: '/swagger.json',
    yamlDocumentUrl: '/swagger.yaml',
  });

  await app.listen(port ?? 3000);

  logger.log(`Node env: ${process.env.NODE_ENV}`);
  logger.log(`🚀 Server running on port ${port}`);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
