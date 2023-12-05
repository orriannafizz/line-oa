import { BirthDay } from '@prisma/client';

export class BirthDayEntity implements BirthDay {
  id: number;
  year: number;
  month: number;
  day: number;
}
