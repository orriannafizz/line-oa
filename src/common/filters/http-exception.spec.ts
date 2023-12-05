import { HttpExceptionFilter } from './http-exception.filter';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('HttpExceptionFilter', () => {
  it('should catch an http exception and return the right response', () => {
    const filter = new HttpExceptionFilter();
    const mockJson = jest.fn();
    const mockStatus = jest.fn().mockImplementation(() => ({
      json: mockJson,
    }));

    const mockGetResponse = () => ({
      status: mockStatus,
    });

    const mockArgumentsHost = {
      switchToHttp: () => ({
        getResponse: mockGetResponse,
        getRequest: () => ({
          method: 'GET',
          url: '/test',
          body: {},
          query: {},
          params: {},
        }),
      }),
    };

    const exception = new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    filter.catch(exception, mockArgumentsHost as any);

    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.FORBIDDEN);
    expect(mockJson).toHaveBeenCalledWith({
      statusCode: HttpStatus.FORBIDDEN,
      message: 'Forbidden',
      timestamp: expect.any(String),
    });
  });
});
