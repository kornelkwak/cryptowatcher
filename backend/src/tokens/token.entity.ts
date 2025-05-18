import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class Token {
  @PrimaryColumn()
  symbol: string; // np. 'BTC', 'ETH'

  @Column()
  name: string; // np. 'Bitcoin'

  @Column('float')
  priceUsd: number;

  @Column({ type: 'timestamptz' })
  lastUpdated: Date;

  @Column({ default: false })
  favorite: boolean;
}
