import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ tableName: 'users' })
export class User {
  @PrimaryKey()
  id!: number;

  @Property()
  firstName!: string;

  @Property()
  lastName!: string;

  @Property()
  email!: string;

  @Property({ hidden: true })
  password!: string;

  @Property({ persist: false })
  get fullName(): string | undefined {
    return `${this.firstName} ${this.lastName}`;
  }
}
