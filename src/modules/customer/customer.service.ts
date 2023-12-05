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

  generateCongratulationMessageV3(): Observable<string> {
    const currentYear = new Date().getFullYear();
    const imageUrl =
      'https://tonsofthanks.com/wp-content/uploads/2023/08/Hot-Dog-Funny-Birthday-Meme.jpg';

    return this.getTodayBirthdayCustomers().pipe(
      map((customers) => {
        const messages = customers.map((customer) => {
          const age = currentYear - customer.birthDay.year;
          const isSenior = age > 49;
          let message = `Subject: Happy birthday! Happy birthday, dear \`${customer.firstName}\`!\n`;
          if (isSenior) {
            message += `![Happy Birthday](${imageUrl})\n`;
          }
          return message;
        });
        return messages.join('');
      }),
    );
  }
}
