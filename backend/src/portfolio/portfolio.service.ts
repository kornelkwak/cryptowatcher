import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Portfolio } from './portfolio.entity';
import { Token } from '../tokens/token.entity';

@Injectable()
export class PortfolioService {
  constructor(
    @InjectRepository(Portfolio)
    private portfolioRepo: Repository<Portfolio>,
    @InjectRepository(Token)
    private tokenRepo: Repository<Token>,
  ) {}

  async setAmount(tokenSymbol: string, amount: number, comment?: string) {
    // Find token case-insensitively
    const token = await this.tokenRepo
      .createQueryBuilder('token')
      .where('LOWER(token.symbol) = LOWER(:symbol)', { symbol: tokenSymbol })
      .andWhere('token.favorite = :favorite', { favorite: true })
      .getOne();
    
    if (!token) {
      throw new NotFoundException('Token not found or is not marked as favorite');
    }

    // Find existing portfolio entry
    let entry = await this.portfolioRepo.findOne({
      where: { token: token },
      relations: ['token'],
    });

    if (!entry) {
      entry = this.portfolioRepo.create({
        token,
        amount,
        comment: comment || '',
        lastUpdated: new Date()
      });
    } else {
      entry.amount = amount;
      entry.comment = comment || '';
      entry.lastUpdated = new Date();
    }

    const savedEntry = await this.portfolioRepo.save(entry);
    console.log('Saved portfolio entry:', savedEntry); // Debug log
    return savedEntry;
  }

  async getPortfolio() {
    const portfolio = await this.portfolioRepo
      .createQueryBuilder('portfolio')
      .leftJoinAndSelect('portfolio.token', 'token')
      .where('token.favorite = :favorite', { favorite: true })
      .getMany();

    console.log('Retrieved portfolio:', portfolio); // Debug log
    return portfolio;
  }

  async getTotalValue() {
    const entries = await this.getPortfolio();
    return entries.reduce((sum, entry) => {
      return sum + (entry.amount * (entry.token?.priceUsd || 0));
    }, 0);
  }
}
