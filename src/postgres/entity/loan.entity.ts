import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';
import { TimedData } from './common';

export enum LoanStatus {
  PENDING = 'PENDING',
  CANCELLED = 'CANCELLED',
  APPROVED = 'APPROVED',
  PAID = 'PAID',
}

export enum PERIODICITY {
  WEEKLY = 'WEEKLY',
  // MONTHLY = 'MONTHLY',
  // YEARLY = 'YEARLY',
}

@Entity()
export class Loan extends TimedData {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'integer' })
  amount: number;

  @Column({ type: 'integer' })
  emi_amount: number;

  @Column({ type: 'varchar' })
  user_id: string;

  @Column({ type: 'varchar', enum: ['WEEKLY', 'MONTHLY', 'YEARLY'] })
  periodicity: string;

  @Column({ type: 'integer' })
  total_emis: number;

  @Column({ type: 'integer' })
  remaining_emis: number;

  @Column({ type: 'varchar', default: '' })
  description: string;

  @Column({ type: 'varchar', default: '' })
  admin_comments: string;

  @Column({ type: 'varchar', default: '' })
  approval_date: string;

  @Column({
    type: 'varchar',
    default: 'PENDING',
    enum: ['PENDING', 'CANCELLED', 'APPROVED', 'PAID', 'REJECTED'],
  })
  status: string;
}
