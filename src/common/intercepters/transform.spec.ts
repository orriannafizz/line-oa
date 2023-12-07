import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of } from 'rxjs';
import { TransformResponseInterceptor } from './transform.interceptor';

describe('TransformResponseInterceptor', () => {
  let interceptor: TransformResponseInterceptor;

  beforeEach(() => {
    interceptor = new TransformResponseInterceptor();
  });

  it('should pass through XML responses unchanged', () => {
    const mockExecutionContext = createMockExecutionContext('application/xml');
    const mockCallHandler = {
      handle: jest.fn().mockReturnValue(of('XML data')),
    } as CallHandler;

    interceptor
      .intercept(mockExecutionContext, mockCallHandler)
      .subscribe((response) => {
        expect(response).toBe('XML data');
      });

    expect(mockCallHandler.handle).toHaveBeenCalled();
  });

  it('should transform JSON responses', () => {
    const mockExecutionContext = createMockExecutionContext('application/json');
    const mockCallHandler = {
      handle: jest.fn().mockReturnValue(of('JSON data')),
    } as CallHandler;

    interceptor
      .intercept(mockExecutionContext, mockCallHandler)
      .subscribe((response) => {
        expect(response).toHaveProperty('statusCode');
        expect(response).toHaveProperty('message', 'Success');
        expect(response).toHaveProperty('data', 'JSON data');
        expect(response).toHaveProperty('timestamp');
      });

    expect(mockCallHandler.handle).toBeCalled();
  });

  function createMockExecutionContext(contentType: string): ExecutionContext {
    const mockResponse = {
      getHeader: jest.fn().mockReturnValue(contentType),
    };
    const mockContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: jest.fn().mockReturnValue(mockResponse),
      }),
    } as unknown as ExecutionContext;

    return mockContext;
  }
});
