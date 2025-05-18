import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Token } from './token.entity';
import axios from 'axios';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class TokensService {
  constructor(
    @InjectRepository(Token)
    private tokenRepo: Repository<Token>,
  ) { }

  async getAll(): Promise<Token[]> {
    return this.tokenRepo.find();
  }

  async toggleFavorite(symbol: string) {
    const token = await this.tokenRepo
      .createQueryBuilder('token')
      .where('LOWER(token.symbol) = LOWER(:symbol)', { symbol })
      .getOne();

    if (!token) {
      throw new NotFoundException(`Token with symbol ${symbol} not found`);
    }

    token.favorite = !token.favorite;
    return this.tokenRepo.save(token);
  }

  async updatePrices(): Promise<void> {
    try {
      const coingeckoIds = {
        'BTC': 'bitcoin',
        'ETH': 'ethereum',
        'MATIC': 'matic-network',
        'DOT': 'polkadot',
        'SOL': 'solana'
      };

      const response = await axios.get(
        'https://api.coingecko.com/api/v3/simple/price',
        {
          params: {
            ids: Object.values(coingeckoIds).join(','),
            vs_currencies: 'usd',
          },
        }
      );

      console.log('CoinGecko API Response:', response.data);

      const tokens = await this.tokenRepo.find();
      for (const token of tokens) {
        const coingeckoId = coingeckoIds[token.symbol];
        if (!coingeckoId) {
          console.warn(`No CoinGecko ID mapping for symbol: ${token.symbol}`);
          continue;
        }

        const priceData = response.data[coingeckoId];
        if (!priceData || !priceData.usd) {
          console.warn(`No price data for ${token.symbol} (${coingeckoId})`);
          continue;
        }

        token.priceUsd = priceData.usd;
        token.lastUpdated = new Date();
        await this.tokenRepo.save(token);
        console.log(`Updated price for ${token.symbol}: $${priceData.usd}`);
      }
    } catch (error) {
      console.error('Error updating prices:', error.response?.data || error.message);
      throw error;
    }
  }

  async seedTokens(): Promise<void> {
    const tokens = [
      { symbol: 'BTC', name: 'Bitcoin' },
      { symbol: 'ETH', name: 'Ethereum' },
      { symbol: 'MATIC', name: 'Polygon' },
      { symbol: 'DOT', name: 'Polkadot' },
      { symbol: 'SOL', name: 'Solana' },
    ];
    for (const t of tokens) {
      const exists = await this.tokenRepo.findOneBy({ symbol: t.symbol });
      if (!exists) {
        await this.tokenRepo.save({ ...t, priceUsd: 0, lastUpdated: new Date() });
      }
    }
  }

  @Cron('*/1 * * * *') // Update every minute for testing
  async handleCron() {
    console.log('Running price update cron job...');
    try {
      await this.updatePrices();
      console.log('Price update completed successfully');
    } catch (error) {
      console.error('Price update failed:', error);
    }
  }
}
