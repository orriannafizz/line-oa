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

  it("version1 generator should generate congratulation messages for today's birthday customers", (done) => {
    // Mock the getTodayBirthdayCustomers method to return a predefined array of customers
    const mockCustomers: CustomerEntity[] = customerStubs;
    jest
      .spyOn(customerService, 'getTodayBirthdayCustomers')
      .mockReturnValue(of(mockCustomers));

    controller.generateCongratulationMessageV1().subscribe((message) => {
      expect(message).toContain(
        `Happy birthday! ${mockCustomers[0].firstName}!`,
      );

      done();
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
      expect(Array.isArray(customers)).toBe(true);
      expect(customers.length).toBeGreaterThan(1);

      // check attributes of customer
      expect(customers[0].firstName).toBeDefined();
      expect(customers[0].lastName).toBeDefined();
      expect(customers[0].email).toBeDefined();
      expect(customers[0].gender).toBeDefined();

      // check birthDay if it is today's date
      const date = new Date();
      const month = date.getMonth() + 1;
      const day = date.getDate();

      expect(customers[0].birthDay.month).toBe(month);
      expect(customers[0].birthDay.day).toBe(day);

      done();
    });
  });
});
