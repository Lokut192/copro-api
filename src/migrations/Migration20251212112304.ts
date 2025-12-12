import { Migration } from '@mikro-orm/migrations';

export class Migration20251212112304 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "users" ("id" serial primary key, "first_name" varchar(255) not null, "last_name" varchar(255) not null, "email" varchar(255) not null, "password" varchar(255) not null);`);
  }

}
