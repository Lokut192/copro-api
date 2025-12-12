import 'dotenv/config';

import { defineConfig, PostgreSqlDriver } from '@mikro-orm/postgresql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';

export const mikroConfig = defineConfig({
  driver: PostgreSqlDriver,
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  port: Number(process.env.PG_PORT ?? 5432),
  host: process.env.PG_HOST ?? 'localhost',
  user: process.env.PG_USER ?? 'postgres',
  password: process.env.PG_PASSWORD ?? 'postgres',
  dbName: process.env.PG_DB ?? 'copro',
  metadataProvider: TsMorphMetadataProvider,
  migrations: {
    tableName: 'migrations',
    path: 'dist/migrations',
    pathTs: 'src/migrations',
    glob: '!(*.d).{js,ts}',
    transactional: true,
    allOrNothing: true,
    emit: 'ts',
  },
  debug: process.env.DEBUG === '1',
});

export default mikroConfig;
