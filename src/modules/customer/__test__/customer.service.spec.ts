import { Test, TestingModule } from '@nestjs/testing';
import { CustomerService } from '../customer.service';
import { PrismaService } from '@/shared/prisma.service';
import { customerStubs } from './stubs';
import { of } from 'rxjs';

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

  it('should generate congratulation messages for today birthday customers', (done) => {
    jest
      .spyOn(service, 'getTodayBirthdayCustomers')
      .mockReturnValue(of(customerStubs));

    service.generateCongratulationMessageV2().subscribe({
      next: (message) => {
        expect(message).toContain('Happy birthday, dear');
        expect(message).toContain('Subject: Happy birthday!');
        expect(message).toContain('White Wine, iPhone X');
        expect(message).toContain('Cosmetic, LV Handbags');
        done();
      },
      error: (err) => done.fail(`Test failed due to error: ${err}`),
    });
  });
});
