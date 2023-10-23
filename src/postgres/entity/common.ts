import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class TimedData {
  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
