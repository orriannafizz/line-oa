import { Injectable } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { from } from 'rxjs';
import { CustomerEntity } from './entities/customer.entity';
import { PrismaService } from '@/shared/prisma.service';
import { Gender } from '@prisma/client';

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

  generateCongratulationMessageV2(): Observable<string> {
    return this.getTodayBirthdayCustomers().pipe(
      map((customers) => {
        const maleMessages =
          'We offer special discount 20% off for the following items:\nWhite Wine, iPhone X';
        const femaleMessages =
          'We offer special discount 50% off for the following items:\nCosmetic, LV Handbags';
        const titleMessages = 'Subject: Happy birthday!\nHappy birthday, dear ';
        const messages = customers.map((customer) => {
          return `${titleMessages}${customer.firstName}!\n${
            customer.gender == Gender.MALE ? maleMessages : femaleMessages
          }`;
        });
        return messages.join('\n');
      }),
    );
  }
}
