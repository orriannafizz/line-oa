import { Injectable, NestMiddleware, Logger } from '@nestjs/common';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoggerMiddleware.name);

  use(req: any, res: any, next: () => void) {
    const { method, originalUrl, body, query } = req;

    const logMessage = {
      message: `Request received`,
      method,
      url: originalUrl,
      body: this.safeStringify(body),
      query: this.safeStringify(query),
    };

    // Log the request
    this.logger.log(logMessage);

    next();
  }

  // Transform the object into a string to prevent circular references
  private safeStringify(obj: any): string {
    try {
      return JSON.stringify(obj);
    } catch (error) {
      this.logger.error('Error stringifying object', error.stack);
      return 'Unable to stringify object';
    }
  }
}
