import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import mikroConfig from 'src/mikro-orm.config';

import { DatabaseSeederService } from './database-seeder.service';

@Module({
  imports: [
    MikroOrmModule.forRoot({
      ...mikroConfig,
    }),
  ],
  providers: [DatabaseSeederService],
})
export class DatabaseSeederModule {}
