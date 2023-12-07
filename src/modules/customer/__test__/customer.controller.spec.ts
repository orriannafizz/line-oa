import { Test, TestingModule } from '@nestjs/testing';
import { CustomerController } from '../customer.controller';
import { CustomerService } from '../customer.service';
import { customerStubs } from './stubs';
import { Observable, of } from 'rxjs';
import { CustomerEntity } from '../entities/customer.entity';
import { PrismaService } from '@/shared/prisma.service';
import { BirthdayMessageDTO } from '../dto/birthday-message-v6.dto';
import { XmlService } from '@/shared/xml.service';

describe('CustomerController unit test', () => {
  let controller: CustomerController;
  let customerService: CustomerService;
  const mockXml = '<xml>Some Content</xml>';

  beforeEach(async () => {
    const mockCustomerService = {
      getTodayBirthdayCustomers: jest
        .fn()
        .mockImplementation(
          (): Observable<CustomerEntity[]> => of(customerStubs),
        ),
      generateCongratulationMessageV6Json: jest.fn().mockImplementation(
        (): Observable<BirthdayMessageDTO[]> =>
          of(
            customerStubs.map((customer) => ({
              title: 'Subject: Happy birthday!',
              content: `Happy birthday, dear ${customer.firstName}!`,
            })),
          ),
      ),
      generateCongratulationMessageV6Xml: jest
        .fn()
        .mockImplementation((): Observable<string> => of(mockXml)),
    };

    const mockPrismaService = {};
    const mockXmlService = {};
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerController],
      providers: [
        {
          provide: CustomerService,
          useValue: mockCustomerService,
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: XmlService,
          useValue: mockXmlService,
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

  it('should return Observable[]', (done) => {
    // Mock the getTodayBirthdayCustomers method to return a predefined array of customers
    const mockCustomers: CustomerEntity[] = customerStubs;
    jest
      .spyOn(customerService, 'getTodayBirthdayCustomers')
      .mockReturnValue(of(mockCustomers));

    controller.generateCongratulationMessageV6Json().subscribe((messages) => {
      const expectedMessages: BirthdayMessageDTO[] = mockCustomers.map(
        (customer) => ({
          title: 'Subject: Happy birthday!',
          content: `Happy birthday, dear ${customer.firstName}!`,
        }),
      );

      expectedMessages.forEach((expectedMessage) => {
        expect(messages).toContainEqual(expectedMessage);
      });

      done();
    });
  });
  it('should return XML Observable<string>', () => {
    controller.generateCongratulationMessageV6Xml().subscribe((xml) => {
      expect(xml).toBe(mockXml);
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
      providers: [CustomerService, PrismaService, XmlService],
    }).compile();

    controller = module.get<CustomerController>(CustomerController);
  });

  afterAll(() => {
    dateSpy.mockRestore();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('should return customers born on today’s date and it is Observable of CustomerEntity[]', (done) => {
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

  it('should return Observable<BirthdayMessageDTO[]>', (done) => {
    controller.generateCongratulationMessageV6Json().subscribe((messages) => {
      // Check if messages is a non-empty array
      expect(messages).toBeInstanceOf(Array);
      expect(messages.length).toBeGreaterThan(0);

      // Check attributes of each message
      messages.forEach((message) => {
        expect(message).toHaveProperty('title');
        expect(message).toHaveProperty('content');
      });

      done();
    });
  });

  it('should return Observable<string>', (done) => {
    controller.generateCongratulationMessageV6Xml().subscribe((xml) => {
      expect(xml).toContain('<root>');
      expect(xml).toContain('<title>Subject: Happy birthday!</title>');
      expect(xml).toContain('<content>Happy birthday, dear');
      expect(xml).toContain('</content>');
      expect(xml).toContain('</root>');

      done();
    });
  });
});
