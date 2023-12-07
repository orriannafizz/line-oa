import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { from } from 'rxjs';
import { map, mergeMap, toArray } from 'rxjs/operators';
import { CustomerEntity } from './entities/customer.entity';
import { PrismaService } from '@/shared/prisma.service';
import { BirthdayMessageDTO } from './dto/birthday-message-v6.dto';
import { XmlService } from '@/shared/xml.service';

@Injectable()
export class CustomerService {
  constructor(
    private prisma: PrismaService,
    private xmlService: XmlService,
  ) {}

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

  generateCongratulationMessageV6Xml(): Observable<string> {
    return this.getTodayBirthdayCustomers().pipe(
      map((customers) => {
        const customerMessages = customers.map((customer) => ({
          title: 'Subject: Happy birthday!',
          content: `Happy birthday, dear ${customer.firstName}!`,
        }));

        const xmlObject = {
          root: customerMessages.map((message) => ({
            title: message.title,
            content: message.content,
          })),
        };

        const xml = this.xmlService.toXml(xmlObject);
        return xml;
      }),
    );
  }
}
