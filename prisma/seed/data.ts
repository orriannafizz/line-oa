import { BirthDay, Customer, Gender } from '@prisma/client';

export const fakeBirthDays: BirthDay[] = [
  {
    id: 1,
    year: 1985,
    month: 8,
    day: 8,
  },
  {
    id: 2,
    year: 1990,
    month: 10,
    day: 10,
  },
  {
    id: 3,
    year: 1993,
    month: 4,
    day: 5,
  },
  {
    id: 4,
    year: 1993,
    month: 8,
    day: 8,
  },
  {
    id: 5,
    year: 1950,
    month: 12,
    day: 22,
  },
];

export const fakeCustomers: Customer[] = [
  {
    id: 1n,
    firstName: 'Robert',
    lastName: 'Yen',
    gender: Gender.MALE,
    email: 'robert.yen@linecorp.com',
    birthDayId: 1,
  },
  {
    id: 2n,
    firstName: 'Cid',
    lastName: 'Change',
    gender: Gender.MALE,
    email: 'john.doe@example.com',
    birthDayId: 2,
  },
  {
    id: 3n,
    firstName: 'Miki',
    lastName: 'Lai',
    gender: Gender.FEMALE,
    email: 'cid.change@linecorp.com',
    birthDayId: 3,
  },
  {
    id: 4n,
    firstName: 'Sherry',
    lastName: 'Chang',
    gender: Gender.FEMALE,
    email: 'sherry.lai@linecorp.com',
    birthDayId: 4,
  },
  {
    id: 5n,
    firstName: 'Peter',
    lastName: 'Wang',
    gender: Gender.MALE,
    email: 'peter.wang@linecorp.com',
    birthDayId: 5,
  },
];
