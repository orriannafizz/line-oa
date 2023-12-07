import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { PrismaService } from '@/shared/prisma.service';
import { XmlService } from '@/shared/xml.service';

@Module({
  providers: [CustomerService, PrismaService, XmlService],
  controllers: [CustomerController],
})
export class CustomerModule {}
