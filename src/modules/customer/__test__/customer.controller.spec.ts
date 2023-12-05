import { Test, TestingModule } from '@nestjs/testing';
import { CustomerController } from '../customer.controller';
import { CustomerService } from '../customer.service';
import { customerStubs } from './stubs';
import { Observable, of } from 'rxjs';
import { CustomerEntity } from '../entities/customer.entity';
import { PrismaService } from '@/shared/prisma.service';

describe('CustomerController unit test', () => {
  let controller: CustomerController;
  let customerService: CustomerService;

  beforeEach(async () => {
    const mockCustomerService = {
      getTodayBirthdayCustomers: jest.fn().mockReturnValue(of(customerStubs)),
      generateCongratulationMessageV1: jest
        .fn()
        .mockReturnValue(of('mocked message')),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerController],
      providers: [
        {
          provide: CustomerService,
          useValue: mockCustomerService,
        },
      ],
    }).compile();

    controller = module.get<CustomerController>(CustomerController);
    customerService = module.get<CustomerService>(CustomerService);
  });

  it("should return today's birthday customers", (done) => {
    controller.getTodayBirthdayCustomers().subscribe({
      next: (customers) => {
        expect(customers).toEqual(customerStubs);
        done();
      },
      error: done,
    });
    expect(customerService.getTodayBirthdayCustomers).toHaveBeenCalled();
  });

  it('should generate congratulation message', (done) => {
    controller.generateCongratulationMessageV1().subscribe({
      next: (message) => {
        expect(message).toEqual('mocked message');
        done();
      },
      error: done,
    });
    expect(customerService.generateCongratulationMessageV1).toHaveBeenCalled();
  });
});

describe('CustomerController integration test', () => {
  let controller: CustomerController;
  let dateSpy;

  beforeAll(async () => {
    // mock Date to 2022-08-08
    const mockDate = new Date(2022, 7, 8);

    dateSpy = jest.spyOn(global, 'Date').mockImplementation(() => mockDate);
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerController],
      providers: [CustomerService, PrismaService],
    }).compile();

    controller = module.get<CustomerController>(CustomerController);
  });

  afterAll(() => {
    dateSpy.mockRestore();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('should return who born in 8/8 and it is Observable of CustomerEntity[]', (done) => {
    controller.getTodayBirthdayCustomers().subscribe((customers) => {
      // check if customers is an array and has more than 1 item
      expect(Array.isArray(customers)).toBe(true);
      expect(customers.length).toBeGreaterThan(0);

      // check birthDay if it is today's date
      const date = new Date();
      const month = date.getMonth() + 1;
      const day = date.getDate();

      customers.forEach((customer) => {
        expect(customer).toHaveProperty('firstName');
        expect(customer).toHaveProperty('lastName');
        expect(customer).toHaveProperty('email');
        expect(customer).toHaveProperty('gender');

        // Check if birthDay is today's date
        expect(customer.birthDay.month).toBe(month);
        expect(customer.birthDay.day).toBe(day);
      });

      done();
    });
  });

  it('should generate congratulation message', (done) => {
    controller.generateCongratulationMessageV1().subscribe({
      next: (message) => {
        expect(typeof message).toBe('string');
        expect(message).toContain('Happy birthday');
        expect(message).toContain('dear');
        done();
      },
      error: done,
    });
  });
});
