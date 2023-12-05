import { Test, TestingModule } from '@nestjs/testing';
import { CustomerService } from '../customer.service';
import { PrismaService } from '@/shared/prisma.service';
import { customerStubs } from './stubs';

describe('CustomerService', () => {
  let service: CustomerService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerService,
        {
          provide: PrismaService,
          useValue: {
            customer: {
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<CustomerService>(CustomerService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should return a value that matches the stub data', (done) => {
    jest
      .spyOn(prismaService.customer, 'findMany')
      .mockResolvedValue(customerStubs);

    service.getTodayBirthdayCustomers().subscribe({
      next: (customers) => {
        expect(customers).toEqual(customerStubs);
        done();
      },
      error: done,
    });
  });

  it('should handle no customers found', (done) => {
    jest.spyOn(prismaService.customer, 'findMany').mockResolvedValue([]);

    service.getTodayBirthdayCustomers().subscribe({
      next: (customers) => {
        expect(customers).toEqual([]);
        done();
      },
      error: done,
    });
  });
  it('should generate congratulation messages in JSON format', (done) => {
    jest
      .spyOn(prismaService.customer, 'findMany')
      .mockResolvedValue(customerStubs);

    service.generateCongratulationMessageV6Json().subscribe({
      next: (messages) => {
        expect(messages.length).toEqual(customerStubs.length);
        messages.forEach((message, index) => {
          expect(message.title).toEqual('Subject: Happy birthday!');
          expect(message.content).toEqual(
            `Happy birthday, dear ${customerStubs[index].firstName}!`,
          );
        });
        done();
      },
      error: done,
    });
  });

  it('should generate congratulation messages in XML format', (done) => {
    jest
      .spyOn(prismaService.customer, 'findMany')
      .mockResolvedValue(customerStubs);

    service.generateCongratulationMessagesV6Xml().subscribe({
      next: (xmlString) => {
        expect(xmlString).toContain('<root>');
        customerStubs.forEach((customer) => {
          expect(xmlString).toContain(
            `<title>Subject: Happy birthday!</title>`,
          );
          expect(xmlString).toContain(
            `<content>Happy birthday, dear ${customer.firstName}!</content>`,
          );
        });
        expect(xmlString).toContain('</root>');
        done();
      },
      error: done,
    });
  });
});
