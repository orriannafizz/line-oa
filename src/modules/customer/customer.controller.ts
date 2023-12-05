import { Controller, Get, Header } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { Observable, map } from 'rxjs';
import { CustomerEntity } from './entities/customer.entity';
import { BirthdayMessageDTO } from './dto/birthday-message-v6.dto';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
  getTodayBirthdayCustomers(): Observable<CustomerEntity[]> {
    return this.customerService.getTodayBirthdayCustomers();
  }

  @Get('message/version6/json')
  generateCongratulationMessageV6(): Observable<BirthdayMessageDTO[]> {
    return this.customerService.getTodayBirthdayCustomers().pipe(
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

  @Get('message/version6/xml')
  @Header('Content-Type', 'application/xml')
  generateCongratulationMessagesXml(): Observable<string> {
    return this.customerService.getTodayBirthdayCustomers().pipe(
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
