import { Controller, Get } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { Observable } from 'rxjs';
import { CustomerEntity } from './entities/customer.entity';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
  getTodayBirthdayCustomers(): Observable<CustomerEntity[]> {
    return this.customerService.getTodayBirthdayCustomers();
  }
}