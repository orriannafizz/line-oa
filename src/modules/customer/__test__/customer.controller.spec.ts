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
      getTodayBirthdayCustomers: jest
        .fn()
        .mockImplementation(
          (): Observable<CustomerEntity[]> => of(customerStubs),
        ),

      generateCongratulationMessageV2: jest.fn(),
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

  it("version2 generator should generate congratulation messages for today's birthday customers", (done) => {
    const mockMessage = 'Mocked message';
    const mockCustomers: CustomerEntity[] = customerStubs;
    jest
      .spyOn(customerService, 'generateCongratulationMessageV2')
      .mockReturnValue(of(mockMessage));

    controller.generateCongratulationMessageV2().subscribe({
      next: (message) => {
        expect(message).toEqual(mockMessage);
        done();
      },

      error: (err) => done(err),
    });
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

  it('should return congratulation message for today birthday customers', (done) => {
    controller.generateCongratulationMessageV2().subscribe((message) => {
      expect(message).toContain('Subject: Happy birthday!');
      expect(message).toContain('Happy birthday, dear');
      done();
    });
  });
});
