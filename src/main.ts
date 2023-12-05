import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionFilter, TransformResponseInterceptor } from '@/common';

// BigInt support for JSON.stringify
BigInt.prototype['toJSON'] = function () {
  return this.toString();
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const apiVersion = configService.get('API_VERSION') || 'v0';
  const apiPort = configService.get('API_PORT') || 3000;

  app.setGlobalPrefix(`api/${apiVersion}`);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformResponseInterceptor());

  await app.listen(apiPort);
}

bootstrap();
