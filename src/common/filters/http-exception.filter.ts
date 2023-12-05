import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter<HttpException> {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus();
    const message = exception.getResponse();

    const responseObject = {
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
    };

    this.logger.error({
      message: 'HTTP Exception',
      exception: {
        status,
        message: message,
        stack: exception.stack,
      },
      request: {
        method: request.method,
        url: request.url,
        body: request.body,
        query: request.query,
        params: request.params,
      },
    });

    return response.status(status).json(responseObject);
  }
}
