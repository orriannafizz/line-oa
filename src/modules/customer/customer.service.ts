import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { from } from 'rxjs';
import { map, mergeMap, toArray } from 'rxjs/operators';
import { CustomerEntity } from './entities/customer.entity';
import { PrismaService } from '@/shared/prisma.service';

@Injectable()
export class CustomerService {
  constructor(private prisma: PrismaService) {}

  getTodayBirthdayCustomers(): Observable<CustomerEntity[]> {
    // get today's date
    const date = new Date();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return from(
      this.prisma.customer.findMany({
        where: {
          birthDay: {
            month,
            day,
          },
        },
        include: {
          birthDay: true,
        },
      }),
    );
  }
}
