import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokensModule } from './tokens/tokens.module';
import { PortfolioModule } from './portfolio/portfolio.module';
import { Token } from './tokens/token.entity';
import { Portfolio } from './portfolio/portfolio.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Token, Portfolio],
      synchronize: true,
    }),
    ScheduleModule.forRoot(),
    TokensModule,
    PortfolioModule,
  ],
})
export class AppModule {}
