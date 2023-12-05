import { Gender, Customer } from '@prisma/client';
import { BirthDayEntity } from './birthday.entity';

export class CustomerEntity implements Customer {
  id: bigint;
  firstName: string;
  lastName: string;
  email: string;
  gender: Gender;
  birthDayId: number;
  birthDay?: BirthDayEntity;
}
