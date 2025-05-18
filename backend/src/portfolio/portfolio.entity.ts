import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Token } from '../tokens/token.entity';

@Entity()
export class Portfolio {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Token, { eager: true })
  token: Token;

  @Column('float')
  amount: number;

  @Column({ nullable: true })
  comment: string;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  lastUpdated: Date;
}