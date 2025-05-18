import { Controller, Get, Post, Body } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';

@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Post('set')
  async setAmount(
    @Body() body: { symbol: string; amount: number; comment?: string }
  ) {
    return this.portfolioService.setAmount(body.symbol, body.amount, body.comment);
  }

  @Get()
  async getPortfolio() {
    return this.portfolioService.getPortfolio();
  }

  @Get('value')
  async getTotalValue() {
    return this.portfolioService.getTotalValue();
  }
}
