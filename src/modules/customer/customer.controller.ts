import { Controller, Get } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { Observable, map } from 'rxjs';
import { CustomerEntity } from './entities/customer.entity';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
  getTodayBirthdayCustomers(): Observable<CustomerEntity[]> {
    return this.customerService.getTodayBirthdayCustomers();
  }

  @Get('message/version1')
  generateCongratulationMessageV1(): Observable<string> {
    return this.customerService.getTodayBirthdayCustomers().pipe(
      map((customers) => {
        const messages = customers.map((customer) => {
          return `Subject: Happy birthday!\n Happy birthday, dear ${customer.firstName}!`;
        });
        return messages.join('\n');
      }),
    );
  }
}
