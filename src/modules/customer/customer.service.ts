import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
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

    const customersPromise = this.prisma.customer.findMany({
      where: {
        birthDay: {
          month,
          day,
        },
      },
      include: {
        birthDay: true,
      },
    });

    return from(customersPromise);
  }

  generateCongratulationMessageV5(): Observable<string> {
    const customer$ = this.getTodayBirthdayCustomers();
    const message$ = customer$.pipe(
      map((customers) => {
        const messages = customers.map((customer) => {
          return `Subject: Happy birthday!\n Happy birthday, dear ${customer.firstName}!`;
        });
        return messages.join('\n');
      }),
    );

    return message$;
  }
}
