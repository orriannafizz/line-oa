import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { from } from 'rxjs';
import { map, mergeMap, toArray } from 'rxjs/operators';
import { CustomerEntity } from './entities/customer.entity';
import { PrismaService } from '@/shared/prisma.service';
import { BirthdayMessageDTO } from './dto/birthday-message-v6.dto';

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

  generateCongratulationMessageV6Json(): Observable<BirthdayMessageDTO[]> {
    return this.getTodayBirthdayCustomers().pipe(
      map((customers) => {
        return customers.map((customer) => {
          return {
            title: 'Subject: Happy birthday!',
            content: `Happy birthday, dear ${customer.firstName}!`,
          };
        });
      }),
    );
  }

  generateCongratulationMessagesV6Xml(): Observable<string> {
    return this.getTodayBirthdayCustomers().pipe(
      map((customers: CustomerEntity[]) => {
        const xmlMessages = customers.map((customer) => {
          const messageXml = `
  <title>Subject: Happy birthday!</title>
  <content>Happy birthday, dear ${customer.firstName}!</content>
`;
          return messageXml.trim();
        });
        const allMessagesXml = `<root>\n${xmlMessages.join('\n')}\n</root>`;
        return allMessagesXml;
      }),
    );
  }
}
