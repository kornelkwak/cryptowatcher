import { Controller, Get, Patch, Param } from '@nestjs/common';
import { TokensService } from './tokens.service';

@Controller('tokens')
export class TokensController {
  constructor(private readonly tokensService: TokensService) {}

  @Get()
  async getAll() {
    return this.tokensService.getAll();
  }

  @Patch(':symbol/favorite')
  async toggleFavorite(@Param('symbol') symbol: string) {
    return this.tokensService.toggleFavorite(symbol);
  }
}