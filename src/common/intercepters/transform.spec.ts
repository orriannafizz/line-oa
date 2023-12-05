import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of } from 'rxjs';
import { TransformResponseInterceptor } from './transform.interceptor';

describe('TransformResponseInterceptor', () => {
  it('should transform response', (done) => {
    const interceptor = new TransformResponseInterceptor();

    const mockExecutionContext: ExecutionContext = {
      switchToHttp: () => ({
        getResponse: () => ({
          statusCode: 200,
        }),
        getRequest: () => ({}),
      }),
      // ...其他方法根据需要模拟...
    } as any;

    const mockCallHandler: CallHandler = {
      handle: () => of('test'),
    } as any;

    interceptor
      .intercept(mockExecutionContext, mockCallHandler)
      .subscribe((response) => {
        expect(response).toEqual({
          statusCode: 200,
          message: 'Success',
          data: 'test',
          timestamp: expect.any(String),
        });
        done();
      });
  });
});
