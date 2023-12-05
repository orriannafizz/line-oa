import { Test, TestingModule } from '@nestjs/testing';
import { CustomerController } from '../customer.controller';
import { CustomerService } from '../customer.service';
import { customerStubs } from './stubs';
import { Observable, firstValueFrom, map, of } from 'rxjs';
import { CustomerEntity } from '../entities/customer.entity';
import { PrismaService } from '@/shared/prisma.service';

describe('CustomerController unit test', () => {
  let controller: CustomerController;
  let customerService: CustomerService;
  const mockMessage = 'Mock Message';

  beforeEach(async () => {
    const mockCustomerService = {
      getTodayBirthdayCustomers: jest
        .fn()
        .mockImplementation(
          (): Observable<CustomerEntity[]> => of(customerStubs),
        ),

      generateCongratulationMessageV3: jest
        .fn()
        .mockReturnValue(of(mockMessage)),
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

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return a value that matches the stub data', (done) => {
    controller.getTodayBirthdayCustomers().subscribe({
      next: (customers) => {
        expect(customers).toEqual(customerStubs);
        done();
      },
      error: done,
    });
  });

  it('should return Observable of string', (done) => {
    controller.generateCongratulationMessageV3().subscribe((message) => {
      expect(message).toEqual(mockMessage);
      done();
    });
  });
});

describe('CustomerController integration test', () => {
  let controller: CustomerController;
  let customerService: CustomerService;
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
    customerService = module.get<CustomerService>(CustomerService);
  });

  afterAll(() => {
    dateSpy.mockRestore();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('should return who born in 8/8 and it is Observable of CustomerEntity[]', (done) => {
    controller.getTodayBirthdayCustomers().subscribe((customers) => {
      // Check if customers is a non-empty array
      expect(customers).toBeInstanceOf(Array);
      expect(customers.length).toBeGreaterThan(0);

      // Get today's date
      const date = new Date();
      const month = date.getMonth() + 1;
      const day = date.getDate();

      // Check attributes of each customer
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

  it('should return Observable of string', async () => {
    const currentYear = new Date().getFullYear();
    const hasSenoirObservable = customerService
      .getTodayBirthdayCustomers()
      .pipe(
        map((customers) =>
          customers.some(
            (customer) => currentYear - customer.birthDay.year > 49,
          ),
        ),
      );

    const hasSenior = await firstValueFrom(hasSenoirObservable);
    controller.generateCongratulationMessageV3().subscribe((message) => {
      expect(message).toContain('Happy birthday, dear');
      expect(message).toContain('Subject: Happy birthday!');
      hasSenior && expect(message).toContain('![Happy Birthday]');
    });
  });
});
