import { Gender } from '@prisma/client';
import { CustomerEntity } from '../../entities/customer.entity';

export const customerStubs: CustomerEntity[] = [
  {
    id: 5n,
    firstName: 'Peter',
    lastName: 'Wang',
    gender: Gender.MALE,
    email: 'peter.wang@linecorp.com',
    birthDayId: 5,
    birthDay: {
      id: 5,
      year: 1950,
      month: 12,
      day: 22,
    },
  },
  {
    id: 1n,
    firstName: 'Robert',
    lastName: 'Yen',
    gender: Gender.MALE,
    email: 'robert.yen@linecorp.com',
    birthDayId: 1,
    birthDay: {
      id: 1,
      year: 1950,
      month: 12,
      day: 22,
    },
  },
];
