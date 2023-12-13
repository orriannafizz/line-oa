import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { from } from 'rxjs';
import { map, mergeMap, toArray } from 'rxjs/operators';
import { CustomerEntity } from './entities/customer.entity';
import { PrismaService } from '@/shared/prisma.service';
import e from 'express';

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

  generateCongratulationMessageV3(): Observable<string> {
    const currentYear = new Date().getFullYear();
    const imageUrl =
      'https://tonsofthanks.com/wp-content/uploads/2023/08/Hot-Dog-Funny-Birthday-Meme.jpg';
    const customers$ = this.getTodayBirthdayCustomers();
    const messages$ = customers$.pipe(
      map((customers) => {
        const messages = customers.map((customer) => {
          const age = currentYear - customer.birthDay.year;
          const isSenior = age > 49;
          if (isSenior)
            return `Subject: Happy birthday! Happy birthday, dear \`${customer.firstName}\`!\n![Happy Birthday](${imageUrl})\n`;
          else
            return `Subject: Happy birthday! Happy birthday, dear \`${customer.firstName}\`!\n`;
        });
        return messages.join('');
      }),
    );

    return messages$;
  }
}
