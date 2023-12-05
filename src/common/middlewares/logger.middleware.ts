import { Injectable, NestMiddleware, Logger } from '@nestjs/common';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoggerMiddleware.name);

  use(req: any, res: any, next: () => void) {
    const { method, originalUrl, body, query } = req;

    // 构建一个结构化的日志消息
    const logMessage = {
      message: `Request received`,
      method,
      url: originalUrl,
      body: this.safeStringify(body),
      query: this.safeStringify(query),
    };

    // 记录一条日志
    this.logger.log(logMessage);

    next();
  }

  // 安全地将对象转换为 JSON 字符串
  private safeStringify(obj: any): string {
    try {
      return JSON.stringify(obj);
    } catch (error) {
      this.logger.error('Error stringifying object', error.stack);
      return 'Unable to stringify object';
    }
  }
}
