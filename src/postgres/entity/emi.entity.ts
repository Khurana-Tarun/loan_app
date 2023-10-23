import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';
import { TimedData } from './common';

@Entity()
export class Emi extends TimedData {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'integer' })
  loan_id: string;

  @Column({ type: 'integer' })
  amount: number;

  @Column({ type: 'varchar', default: null })
  payment_date: string;

  @Column({ type: 'varchar', default: 'PENDING', enum: ['PENDING', 'PAID'] })
  status: string;
}
