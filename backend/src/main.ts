import * as crypto from 'crypto';
(global as any).crypto = crypto;
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TokensService } from './tokens/tokens.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials: true,
  });

  const tokenService = app.get(TokensService);
  await tokenService.seedTokens();
  await app.listen(4000);
}
bootstrap();