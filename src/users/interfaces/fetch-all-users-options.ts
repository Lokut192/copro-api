import { PaginationOptions } from 'src/common/interfaces/pagination-options.interface';

export interface FetchAllUsersOptions extends Omit<
  PaginationOptions,
  'orderBy'
> {
  orderBy?: 'id' | 'firstName' | 'lastName' | 'email';
}
