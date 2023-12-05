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
  generateCongratulationMessageV6Json(): Observable<BirthdayMessageDTO[]> {
    return this.customerService.generateCongratulationMessageV6Json();
  }

  @Get('message/version6/xml')
  @Header('Content-Type', 'application/xml')
  generateCongratulationMessagesV6Xml(): Observable<string> {
    return this.customerService.generateCongratulationMessagesV6Xml();
  }
}
